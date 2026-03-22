const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const key of ["body", "params", "query"]) {
    if (!schema[key]) continue;

    const { error, value } = schema[key].validate(req[key], {
      abortEarly: false,
    });

    if (error) {
      errors.push(...error.details);
    } else {
      req[key] = value;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      // message: "Dữ liệu không hợp lệ",
      // details: errors.map((e) => ({
      //   field: e.path[0],
      //   message: e.message,
      // })),
      message: errors[0].message
    });
  }

  return next();
};

module.exports = validate;
