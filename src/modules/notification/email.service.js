/**
 * email.service — Gửi email.
 *
 * Ưu tiên:
 *   1. RESEND_API_KEY → dùng Resend HTTP API (hoạt động trên mọi hosting kể cả Render)
 *   2. SMTP_HOST → dùng nodemailer SMTP
 *   3. Không có gì → Ethereal (dev preview)
 *
 * Mọi hàm send* đều try/catch — fail email không ảnh hưởng business flow.
 */
const createLogger = require('../../common/helpers/logger');
const log = createLogger('email.service');

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.SMTP_FROM || 'BookingVN <onboarding@resend.dev>';

// Log cảnh báo khi khởi động
if (RESEND_API_KEY) {
  log.info('Email provider: Resend (HTTP API)');
  log.warn('⚠️  Resend free tier: chỉ gửi được tới email chủ tài khoản. Verify domain tại resend.com/domains để gửi cho mọi người.');
} else if (process.env.SMTP_HOST) {
  log.info('Email provider: SMTP', { host: process.env.SMTP_HOST });
} else {
  log.warn('⚠️  Không có RESEND_API_KEY hoặc SMTP_HOST — email sẽ dùng Ethereal (chỉ preview, không gửi thật)');
}

// ─── Resend (HTTP API) ─────────────────────────────────────────────────────
async function sendViaResend({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: EMAIL_FROM, to: [to], subject, html }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error ${res.status}: ${err}`);
  }

  const data = await res.json();
  log.info('Email sent via Resend', { id: data.id, to });
}

// ─── Nodemailer (SMTP fallback) ────────────────────────────────────────────
let transporter = null;

async function sendViaSMTP({ to, subject, html }) {
  const nodemailer = require('nodemailer');

  if (!transporter) {
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        family: 4,
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      log.info('Ethereal test account', { user: testAccount.user });
    }
  }

  const info = await transporter.sendMail({ from: EMAIL_FROM, to, subject, html });
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) log.info('Email preview', { previewUrl });
}

// ─── Send (chọn provider tự động) ──────────────────────────────────────────
async function sendEmail({ to, subject, html }) {
  if (RESEND_API_KEY) {
    return sendViaResend({ to, subject, html });
  }
  return sendViaSMTP({ to, subject, html });
}

// ─── Public API ─────────────────────────────────────────────────────────────
const sendBookingConfirmation = async ({ to, bookingId, hotelName, roomName, checkIn, checkOut }) => {
  try {
    await sendEmail({
      to,
      subject: `Xác nhận đặt phòng #${bookingId}`,
      html: `
        <h2>Xác nhận đặt phòng</h2>
        <p>Cảm ơn bạn đã đặt phòng tại <strong>${hotelName}</strong>.</p>
        <table>
          <tr><td><strong>Mã đặt phòng:</strong></td><td>${bookingId}</td></tr>
          <tr><td><strong>Khách sạn:</strong></td><td>${hotelName}</td></tr>
          <tr><td><strong>Loại phòng:</strong></td><td>${roomName}</td></tr>
          <tr><td><strong>Ngày nhận phòng:</strong></td><td>${checkIn}</td></tr>
          <tr><td><strong>Ngày trả phòng:</strong></td><td>${checkOut}</td></tr>
        </table>
        <p>Chúc bạn có kỳ nghỉ vui vẻ!</p>
      `,
    });
  } catch (error) {
    log.error(`Failed to send booking confirmation email for booking #${bookingId}`, error);
  }
};

const sendCheckInReminder = async ({ to, bookingId, hotelName, roomName, checkIn }) => {
  try {
    await sendEmail({
      to,
      subject: `Nhắc nhở check-in đặt phòng #${bookingId}`,
      html: `
        <h2>Nhắc nhở check-in</h2>
        <p>Ngày mai là ngày nhận phòng của bạn tại <strong>${hotelName}</strong>.</p>
        <table>
          <tr><td><strong>Mã đặt phòng:</strong></td><td>${bookingId}</td></tr>
          <tr><td><strong>Khách sạn:</strong></td><td>${hotelName}</td></tr>
          <tr><td><strong>Loại phòng:</strong></td><td>${roomName}</td></tr>
          <tr><td><strong>Ngày nhận phòng:</strong></td><td>${checkIn}</td></tr>
        </table>
        <p>Chúc bạn có kỳ nghỉ vui vẻ!</p>
      `,
    });
  } catch (error) {
    log.error(`Failed to send check-in reminder email for booking #${bookingId}`, error);
  }
};

module.exports = { sendBookingConfirmation, sendCheckInReminder };
