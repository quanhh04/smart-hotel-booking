const { isRequired, isString, isEmail, minLength, maxLength } = require('../../common/helpers/validators');

const register = {
  body: {
    email: [isRequired('Email'), isString('Email'), isEmail('Email')],
    password: [isRequired('Mật khẩu'), isString('Mật khẩu'), minLength('Mật khẩu', 6)],
  },
};

const login = {
  body: {
    email: [isRequired('Email'), isString('Email'), isEmail('Email')],
    password: [isRequired('Mật khẩu'), isString('Mật khẩu')],
  },
};

const updateProfile = {
  body: {
    display_name: [isString('Tên hiển thị'), maxLength('Tên hiển thị', 100)],
    phone: [isString('Số điện thoại'), maxLength('Số điện thoại', 20)],
  },
};

const changePassword = {
  body: {
    old_password: [isRequired('Mật khẩu cũ'), isString('Mật khẩu cũ')],
    new_password: [isRequired('Mật khẩu mới'), isString('Mật khẩu mới'), minLength('Mật khẩu mới', 6)],
  },
};

const forgotPassword = {
  body: {
    email: [isRequired('Email'), isString('Email'), isEmail('Email')],
  },
};

module.exports = {
  register,
  login,
  updateProfile,
  changePassword,
  forgotPassword,
};
