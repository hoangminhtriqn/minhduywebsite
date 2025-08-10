import type { Rule, RuleObject } from 'antd/es/form';

// Common regex patterns (kept relaxed to avoid breaking current behavior)
export const USERNAME_ALLOWED_CHARS_REGEX = /^[a-zA-Z0-9._-]+$/;
export const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
// Allow digits only, 6-15 characters to support regional hotlines and international formats
export const PHONE_VN_REGEX = /^\d{6,15}$/;

// Return reusable AntD rules for username
export const getUsernameRules = (options?: {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
}): Rule[] => {
  const {
    required = true,
    min = 3,
    max = 32,
    pattern = USERNAME_ALLOWED_CHARS_REGEX,
  } = options || {};

  return [
    required && { required: true, message: 'Vui lòng nhập tên đăng nhập' },
    { min, message: `Tên đăng nhập phải có ít nhất ${min} ký tự` },
    { max, message: `Tên đăng nhập tối đa ${max} ký tự` },
    {
      pattern,
      message: 'Chỉ cho phép chữ, số, dấu chấm (.), gạch dưới (_) và gạch nối (-)',
    },
  ].filter(Boolean) as Rule[];
};

// Return reusable AntD rules for password
export const getPasswordRules = (options?: {
  required?: boolean;
  min?: number;
  max?: number;
  requireComplexity?: boolean; // letters and numbers
}): Rule[] => {
  const { required = true, min = 6, max = 128, requireComplexity = false } =
    options || {};

  const rules: Rule[] = [];
  if (required) rules.push({ required: true, message: 'Vui lòng nhập mật khẩu' });
  rules.push({ min, message: `Mật khẩu phải có ít nhất ${min} ký tự` });
  rules.push({ max, message: `Mật khẩu tối đa ${max} ký tự` });

  if (requireComplexity) {
    rules.push({
      pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
      message: 'Mật khẩu cần chứa ít nhất 1 chữ và 1 số',
    });
  }

  return rules;
};

// Return reusable AntD rules for email
export const getEmailRules = (options?: {
  required?: boolean;
  pattern?: RegExp;
}): Rule[] => {
  const { required = true, pattern = EMAIL_REGEX } = options || {};
  return [
    required && { required: true, message: 'Vui lòng nhập email' },
    { pattern, message: 'Email không hợp lệ' },
  ].filter(Boolean) as Rule[];
};

// Return reusable AntD rules for phone (Vietnam format)
export const getPhoneRules = (options?: {
  required?: boolean;
  pattern?: RegExp;
}): Rule[] => {
  const { required = true, pattern = PHONE_VN_REGEX } = options || {};
  return [
    required && { required: true, message: 'Vui lòng nhập số điện thoại' },
    { pattern, message: 'Số điện thoại không hợp lệ' },
  ].filter(Boolean) as Rule[];
};

// Confirm password validator rule
export const makeConfirmPasswordRule = (
  getFieldValue: (name: string) => unknown,
  targetField: string = 'newPassword',
  message: string = 'Xác nhận mật khẩu không khớp'
): RuleObject => ({
  validator: (_, value) => {
    if (!value || getFieldValue(targetField) === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(message));
  },
});

// Lightweight anti-spam validators
export const NO_HTML_REGEX = /<[^>]+>/;
export const REPEATED_CHAR_REGEX = /(.)\1{3,}/; // any char repeated 4+ times

// Basic URL/email-like detection (kept simple)
export const URL_LIKE_REGEX = /https?:\/\/|www\.|@[\w.-]+|\.(com|net|org|vn|io|co|info|biz)(\b|\s)/i;

export const makeNoUrlRule = (message = 'Không cho phép chèn liên kết/địa chỉ email'):
  RuleObject => ({
    validator: (_, value) => {
      if (!value) return Promise.resolve();
      return URL_LIKE_REGEX.test(String(value))
        ? Promise.reject(new Error(message))
        : Promise.resolve();
    },
  });

export const makeNoHtmlRule = (message = 'Không cho phép chèn thẻ HTML'):
  RuleObject => ({
    validator: (_, value) => {
      if (!value) return Promise.resolve();
      return NO_HTML_REGEX.test(String(value))
        ? Promise.reject(new Error(message))
        : Promise.resolve();
    },
  });

export const makeNoRepeatedCharsRule = (
  options?: { limit?: number },
  message: string = 'Không cho phép lặp một ký tự quá nhiều lần'
): RuleObject => {
  const { limit = 3 } = options || {};
  const regex = new RegExp(`(.)\\1{${limit},}`);
  return {
    validator: (_, value) => {
      if (!value) return Promise.resolve();
      return regex.test(String(value))
        ? Promise.reject(new Error(message))
        : Promise.resolve();
    },
  };
};

// Full name rules: allow unicode letters, spaces, apostrophes, dashes
export const getFullNameRules = (options?: { required?: boolean; min?: number; max?: number; }): Rule[] => {
  const { required = true, min = 2, max = 64 } = options || {};
  // Allow basic Latin + Vietnamese range, spaces, apostrophes and dashes (hyphen placed first to avoid range)
  const NAME_REGEX = /^[-' A-Za-zÀ-ỹ]+$/;
  return [
    required && { required: true, message: 'Vui lòng nhập họ và tên' },
    { min, message: `Họ và tên phải có ít nhất ${min} ký tự` },
    { max, message: `Họ và tên tối đa ${max} ký tự` },
    { pattern: NAME_REGEX, message: 'Chỉ cho phép chữ, khoảng trắng, dấu nháy và gạch nối' },
    makeNoRepeatedCharsRule({ limit: 3 }),
  ].filter(Boolean) as Rule[];
};

// Address rules: allow letters (with accents), digits, spaces and , . - / #
export const getAddressRules = (options?: { required?: boolean; min?: number; max?: number; }): Rule[] => {
  const { required = true, min = 6, max = 255 } = options || {};
  // Allow letters (incl. Vietnamese range), digits, spaces and common punctuation , . - / # ( )
  const ADDRESS_REGEX = /^[A-Za-zÀ-ỹ0-9\s,./#()-]+$/;
  return [
    required && { required: true, message: 'Vui lòng nhập địa chỉ' },
    { min, message: `Địa chỉ phải có ít nhất ${min} ký tự` },
    { max, message: `Địa chỉ tối đa ${max} ký tự` },
    { pattern: ADDRESS_REGEX, message: 'Địa chỉ chỉ cho phép chữ, số và ký tự , . - / # ( )' },
    makeNoUrlRule('Không cho phép chèn liên kết/email trong địa chỉ'),
    makeNoRepeatedCharsRule({ limit: 3 }),
  ].filter(Boolean) as Rule[];
};

// Notes rules: optional, max length, block urls/html/repeats
export const getNotesRules = (options?: { required?: boolean; max?: number; }): Rule[] => {
  const { required = false, max = 500 } = options || {};
  return [
    required && { required: true, message: 'Vui lòng nhập ghi chú' },
    { max, message: `Ghi chú tối đa ${max} ký tự` },
    makeNoUrlRule('Không cho phép liên kết/email trong ghi chú'),
    makeNoHtmlRule(),
    makeNoRepeatedCharsRule({ limit: 3 }),
  ].filter(Boolean) as Rule[];
};

