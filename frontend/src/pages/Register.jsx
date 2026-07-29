import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { resendSignUpCode } from "aws-amplify/auth";
import { getAuthErrorMessage, getPasswordError, PASSWORD_HINT } from "../utils/authHelpers";

export default function Register() {
  const { register, confirmRegister } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(location.state?.step || "register");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(location.state?.message || null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const passwordError = getPasswordError(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setSubmitting(true);
    try {
      const cleanEmail = email.trim();
      await register({ fullName: fullName.trim(), email: cleanEmail, password });
      setEmail(cleanEmail);
      setSuccess("Mã xác thực đã được gửi đến email của bạn.");
      setStep("confirm");
    } catch (err) {
      setError(getAuthErrorMessage(err, "Đăng ký thất bại"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!code.trim()) {
      setError("Vui lòng nhập mã xác thực");
      return;
    }

    setSubmitting(true);
    try {
      await confirmRegister({ email, code: code.trim() });
      setSuccess("Xác thực thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setError(getAuthErrorMessage(err, "Mã xác thực không đúng"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendCode() {
    setError(null);
    setSuccess(null);
    setResending(true);
    try {
      await resendSignUpCode({ username: email });
      setSuccess("Đã gửi lại mã xác thực mới đến email của bạn.");
    } catch (err) {
      setError(getAuthErrorMessage(err, "Không thể gửi lại mã, vui lòng thử lại"));
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md animate-fade-up rounded-3xl border border-white bg-white/80 p-8 shadow-[var(--shadow-card)] backdrop-blur-xl transition-all duration-500 hover:shadow-[var(--shadow-premium)]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-display font-bold text-slate-800">
            {step === "register" ? "Đăng ký" : "Xác thực Email"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {step === "register" ? "Tạo tài khoản sinh viên" : `Nhập mã gồm 6 số đã gửi đến ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {step === "register" ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-fullname" className="mb-1 block text-sm font-medium text-slate-700">
                Họ và tên
              </label>
              <input
                id="register-fullname"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label htmlFor="register-email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label htmlFor="register-password" className="mb-1 block text-sm font-medium text-slate-700">
                Mật khẩu
              </label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <p className="mt-1 text-xs text-slate-400">{PASSWORD_HINT}</p>
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="mb-1 block text-sm font-medium text-slate-700">
                Xác nhận mật khẩu
              </label>
              <input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 font-semibold text-white transition-all hover:from-indigo-600 hover:to-violet-700 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)] focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-otp" className="mb-1 block text-sm font-medium text-slate-700">
                Mã xác thực (OTP)
              </label>
              <input
                id="register-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center tracking-widest text-lg font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 font-semibold text-white transition-all hover:from-indigo-600 hover:to-violet-700 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)] focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? "Đang xử lý..." : "Xác nhận mã"}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending}
              className="w-full text-center text-sm font-semibold text-indigo-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resending ? "Đang gửi lại..." : "Gửi lại mã xác thực"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("register");
                setCode("");
                setError(null);
                setSuccess(null);
              }}
              className="w-full rounded-lg bg-slate-100 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              Quay lại (Đăng ký lại)
            </button>
          </form>
        )}

        {step === "register" && (
          <p className="mt-6 text-center text-sm text-slate-500">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
