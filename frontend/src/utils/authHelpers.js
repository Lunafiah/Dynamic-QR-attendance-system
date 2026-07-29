// Các hàm dùng chung cho luồng đăng ký / đăng nhập / quên mật khẩu.

// Phải khớp với Cognito PasswordPolicy khai báo trong backend/template.yaml
// (MinimumLength: 8, RequireLowercase, RequireNumbers, RequireUppercase, RequireSymbols: false)
export const PASSWORD_HINT = "Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số";

export function getPasswordError(password) {
  if (!password || password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
  if (!/[a-z]/.test(password)) return "Mật khẩu phải có ít nhất 1 chữ thường";
  if (!/[A-Z]/.test(password)) return "Mật khẩu phải có ít nhất 1 chữ hoa";
  if (!/[0-9]/.test(password)) return "Mật khẩu phải có ít nhất 1 chữ số";
  return null;
}

const ERROR_MESSAGES = {
  NotAuthorizedException: "Sai email hoặc mật khẩu.",
  UsernameExistsException: "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.",
  InvalidPasswordException: `Mật khẩu chưa đáp ứng yêu cầu (${PASSWORD_HINT}).`,
  InvalidParameterException: "Thông tin nhập chưa hợp lệ. Vui lòng kiểm tra lại.",
  CodeMismatchException: "Mã xác thực không đúng. Vui lòng kiểm tra lại.",
  ExpiredCodeException: 'Mã xác thực đã hết hạn. Vui lòng bấm "Gửi lại mã" để nhận mã mới.',
  LimitExceededException: "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau ít phút.",
  TooManyRequestsException: "Hệ thống đang bận, vui lòng thử lại sau ít phút.",
  UserNotFoundException: "Không tìm thấy tài khoản với email này.",
  UserNotConfirmedException: "Tài khoản chưa xác thực email.",
  UserAlreadyAuthenticatedException: "Đã có phiên đăng nhập khác, vui lòng thử lại.",
};

// Amplify/Cognito trả lỗi bằng tiếng Anh (err.name + err.message).
// Hàm này dịch các lỗi thường gặp sang tiếng Việt, fallback về message gốc nếu chưa map tới.
export function getAuthErrorMessage(err, fallback = "Đã có lỗi xảy ra, vui lòng thử lại") {
  if (!err) return fallback;
  const name = err.name;
  const message = err.message || "";

  if (name === "NotAuthorizedException" && /attempts exceeded/i.test(message)) {
    return "Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút.";
  }
  if (name && ERROR_MESSAGES[name]) return ERROR_MESSAGES[name];
  return message || fallback;
}