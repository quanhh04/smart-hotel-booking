const createError = (message, status = 400) => {
  const error = new Error(message);//tạo object error với message truyền vào
  error.status = status;
  return error;
};

module.exports = { createError };
