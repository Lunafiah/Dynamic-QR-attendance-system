import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getAuthErrorMessage, getPasswordError, PASSWORD_HINT } from "../utils/authHelpers";

export default function ForgotPassword() {
  const { forgotPassword, confirmForgotPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRequestSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    setSubmitting(true);
    try {
      const cleanEmail = email.trim();
      await forgotPassword(cleanEmail);
      setEmail(cleanEmail);
      setSuccess("Mã xác thực đã được gửi đến email của bạn.");
      setStep("confirm");
    } catch (err) {
      setError(getAuthErrorMessage(err, "Có lỗi xảy ra"));
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

    const passwordError = getPasswordError(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setSubmitting(true);
    try {
      await confirmForgotPassword({ email, code: code.trim(), newPassword });
      setSuccess("Đổi mật khẩu thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setError(getAuthErrorMessage(err, "Mã xác thực không đúng hoặc đã hết hạn"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md animate-fade-up rounded-3xl border border-white bg-white/80 p-8 shadow-[var(--shadow-card)] backdrop-blur-xl transition-all duration-500 hover:shadow-[var(--shadow-premium)]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-display font-bold text-slate-800">
            {step === "request" ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {step === "request"
              ? "Nhập email của bạn để nhận mã xác nhận"
              : `Nhập mã xác thực đã gửi đến ${email} và mật khẩu mới`}
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

        {step === "request" ? (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label htmlFor="forgot-email" className="mb-1 block text-sm font-medium text-slate-700">
                Email đã đăng ký
              </label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 font-semibold text-white transition-all hover:from-indigo-600 hover:to-violet-700 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)] focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? "Đang gửi..." : "Nhận mã xác thực"}
            </button>
            <Link
              to="/login"
              className="mt-4 block w-full text-center text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Quay lại đăng nhập
            </Link>
          </form>
        ) : (
          <form onSubmit={handleConfirmSubmit} className="space-y-4">
            <div>
              <label htmlFor="forgot-otp" className="mb-1 block text-sm font-medium text-slate-700">
                Mã xác thực (OTP)
              </label>
              <input
                id="forgot-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-lg font-semibold tracking-widest text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label htmlFor="forgot-new-password" className="mb-1 block text-sm font-medium text-slate-700">
                Mật khẩu mới
              </label>
              <input
                id="forgot-new-password"
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <p className="mt-1 text-xs text-slate-400">{PASSWORD_HINT}</p>
            </div>

            <div>
              <label htmlFor="forgot-confirm-password" className="mb-1 block text-sm font-medium text-slate-700">
                Xác nhận mật khẩu mới
              </label>
              <input
                id="forgot-confirm-password"
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
              {submitting ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("request");
                setCode("");
                setNewPassword("");
                setConfirmPassword("");
                setError(null);
                setSuccess(null);
              }}
              className="w-full rounded-lg bg-slate-100 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              Quay lại
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
