import type { Rule, RuleObject } from 'antd/es/form';

// Common regex patterns (kept relaxed to avoid breaking current behavior)
export const USERNAME_ALLOWED_CHARS_REGEX = /^[a-zA-Z0-9._-]+$/;

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


