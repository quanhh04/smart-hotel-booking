const buildReply = (message) => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('wifi')) {
    return 'Bạn có thể lọc khách sạn/phòng có WiFi để tìm lựa chọn phù hợp hơn.';
  }

  if (
    normalizedMessage.includes('giá rẻ') ||
    normalizedMessage.includes('cheap')
  ) {
    return 'Bạn có thể ưu tiên các phòng giá thấp hoặc dùng bộ lọc theo mức giá để tìm phòng tiết kiệm.';
  }

  if (normalizedMessage.includes('bao nhiêu tiền')) {
    return 'Bạn có thể dùng bộ lọc giá để xem phòng theo ngân sách, ví dụ đặt khoảng giá tối thiểu và tối đa.';
  }

  return 'Mình có thể hỗ trợ bạn tìm phòng theo WiFi, mức giá rẻ, hoặc khoảng giá cụ thể. Bạn muốn ưu tiên tiêu chí nào?';
};

const getChatbotReply = (message) => ({
  reply: buildReply(message),
});

module.exports = {
  getChatbotReply,
};
