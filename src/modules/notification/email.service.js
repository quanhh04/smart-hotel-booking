const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Ethereal test account created:', testAccount.user);
  }

  return transporter;
};

const sendBookingConfirmation = async ({ to, bookingId, hotelName, roomName, checkIn, checkOut }) => {
  try {
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from: process.env.SMTP_FROM || 'noreply@smarthotel.com',
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

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview email:', previewUrl);
    }
  } catch (error) {
    console.error(`Failed to send booking confirmation email for booking #${bookingId}:`, error.message);
  }
};

const sendCheckInReminder = async ({ to, bookingId, hotelName, roomName, checkIn }) => {
  try {
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from: process.env.SMTP_FROM || 'noreply@smarthotel.com',
      to,
      subject: `Nhắc nhở check-in đặt phòng #${bookingId}`,
      html: `
        <h2>Nhắc nhở check-in</h2>
        <p>Xin chào, ngày mai là ngày nhận phòng của bạn tại <strong>${hotelName}</strong>.</p>
        <table>
          <tr><td><strong>Mã đặt phòng:</strong></td><td>${bookingId}</td></tr>
          <tr><td><strong>Khách sạn:</strong></td><td>${hotelName}</td></tr>
          <tr><td><strong>Loại phòng:</strong></td><td>${roomName}</td></tr>
          <tr><td><strong>Ngày nhận phòng:</strong></td><td>${checkIn}</td></tr>
        </table>
        <p>Vui lòng chuẩn bị và đến đúng giờ. Chúc bạn có kỳ nghỉ vui vẻ!</p>
      `,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview email:', previewUrl);
    }
  } catch (error) {
    console.error(`Failed to send check-in reminder email for booking #${bookingId}:`, error.message);
  }
};

module.exports = { sendBookingConfirmation, sendCheckInReminder, getTransporter };
