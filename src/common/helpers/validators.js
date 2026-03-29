/**
 * Common validator factory functions.
 * Each function takes a fieldName (and optional params) and returns a
 * Validation_Rule: (value) => string | null
 *
 * Rules other than isRequired return null for undefined/null values
 * so that optional fields are not rejected when absent.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isRequired(fieldName) {
  return (value) => {
    if (value === undefined || value === null || value === '') {
      return `${fieldName} là bắt buộc`;
    }
    return null;
  };
}

function isString(fieldName) {
  return (value) => {
    if (value === undefined || value === null) return null;
    if (typeof value !== 'string') {
      return `${fieldName} phải là chuỗi ký tự`;
    }
    return null;
  };
}

function isEmail(fieldName) {
  return (value) => {
    if (value === undefined || value === null) return null;
    if (!EMAIL_RE.test(value)) {
      return `${fieldName} không đúng định dạng email`;
    }
    return null;
  };
}

function isPositiveInt(fieldName) {
  return (value) => {
    if (value === undefined || value === null) return null;
    const num = Number(value);
    if (!Number.isInteger(num) || num <= 0) {
      return `${fieldName} phải là số nguyên dương`;
    }
    return null;
  };
}

function isNumber(fieldName) {
  return (value) => {
    if (value === undefined || value === null) return null;
    const num = Number(value);
    if (typeof num !== 'number' || isNaN(num)) {
      return `${fieldName} phải là số`;
    }
    return null;
  };
}

function minLength(fieldName, min) {
  return (value) => {
    if (value === undefined || value === null) return null;
    if (typeof value !== 'string' || value.length < min) {
      return `${fieldName} phải có ít nhất ${min} ký tự`;
    }
    return null;
  };
}

function maxLength(fieldName, max) {
  return (value) => {
    if (value === undefined || value === null) return null;
    if (typeof value !== 'string' || value.length > max) {
      return `${fieldName} không được vượt quá ${max} ký tự`;
    }
    return null;
  };
}

function isIn(fieldName, allowed) {
  return (value) => {
    if (value === undefined || value === null) return null;
    if (!allowed.includes(value)) {
      return `${fieldName} phải là một trong: ${allowed.join(', ')}`;
    }
    return null;
  };
}

function isISODate(fieldName) {
  return (value) => {
    if (value === undefined || value === null) return null;
    if (!ISO_DATE_RE.test(value) || isNaN(Date.parse(value))) {
      return `${fieldName} phải đúng định dạng ngày ISO 8601`;
    }
    return null;
  };
}

function isArray(fieldName) {
  return (value) => {
    if (value === undefined || value === null) return null;
    if (!Array.isArray(value)) {
      return `${fieldName} phải là mảng`;
    }
    return null;
  };
}

function isUUID(fieldName) {
  return (value) => {
    if (value === undefined || value === null) return null;
    if (!UUID_RE.test(value)) {
      return `${fieldName} phải đúng định dạng UUID`;
    }
    return null;
  };
}

function isURL(fieldName) {
  return (value) => {
    if (value === undefined || value === null) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return `${fieldName} phải đúng định dạng URL`;
    }
  };
}

function minValue(fieldName, min) {
  return (value) => {
    if (value === undefined || value === null) return null;
    const num = Number(value);
    if (isNaN(num) || num < min) {
      return `${fieldName} phải lớn hơn hoặc bằng ${min}`;
    }
    return null;
  };
}

function maxValue(fieldName, max) {
  return (value) => {
    if (value === undefined || value === null) return null;
    const num = Number(value);
    if (isNaN(num) || num > max) {
      return `${fieldName} không được vượt quá ${max}`;
    }
    return null;
  };
}

module.exports = {
  isRequired,
  isString,
  isEmail,
  isPositiveInt,
  isNumber,
  minLength,
  maxLength,
  isIn,
  isISODate,
  isArray,
  isUUID,
  isURL,
  minValue,
  maxValue,
};
