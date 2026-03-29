/**
 * Validate middleware for manual validation rules.
 *
 * Schema format:
 * {
 *   params: { fieldName: [rule1, rule2, ...] },
 *   query:  { fieldName: [rule1, rule2, ...] },
 *   body:   { fieldName: [rule1, rule2, ...] },
 * }
 *
 * Validates in order: params → query → body.
 * Stops at the first error encountered.
 */
const validate = (schema) => (req, res, next) => {
  for (const key of ['params', 'query', 'body']) {
    const fields = schema[key];
    if (!fields) continue;

    for (const [field, rules] of Object.entries(fields)) {
      const value = req[key][field];
      for (const rule of rules) {
        const error = rule(value);
        if (error) {
          return res.status(400).json({ message: error });
        }
      }
    }
  }

  return next();
};

module.exports = validate;
