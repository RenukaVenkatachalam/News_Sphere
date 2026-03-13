import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, User, X, Loader2, CheckCircle2 } from "lucide-react";

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register, user } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  /* ---------- Auto-close if logged in ---------- */
  useEffect(() => {
    if (user && isOpen && status !== "success") {
      onClose();
    }
  }, [user, isOpen, status, onClose]);

  if (!isOpen) return null;

  /* ---------- Form Change ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    setStatus("loading");
    setErrorMsg("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name) throw new Error("Name is required");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");

        await register(name, email, password);
      }

      setStatus("success");

      setTimeout(() => {
        onClose();
        setStatus("idle");
        setFormData({ name: "", email: "", password: "" });
      }, 1200);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Authentication failed";

      setStatus("error");
      setErrorMsg(message);
    }
  };

  /* ---------- Mode Toggle ---------- */
  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setStatus("idle");
    setErrorMsg("");
    setFormData({ name: "", email: "", password: "" });
  };

  const closeIfAllowed = () => {
    if (status !== "loading") onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={closeIfAllowed}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[var(--surface)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)] animate-modal-scale">
        
        {/* Close Button */}
        <button
          onClick={closeIfAllowed}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div className="p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl font-bold text-[var(--text)] mb-2">
              {status === "success"
                ? "Welcome!"
                : isLogin
                ? "Welcome Back"
                : "Create Account"}
            </h2>

            <p className="text-[var(--text-muted)] text-sm">
              {status === "success"
                ? "Authentication successful. Redirecting..."
                : isLogin
                ? "Enter your details to access your personalized feed."
                : "Sign up to unlock saving and tracking features."}
            </p>
          </div>

          {/* Success Screen */}
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-8 text-[var(--green)]">
              <CheckCircle2 size={64} className="mb-4 animate-bounce" />
              <p className="font-medium text-lg">Success!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <User size={18} />
                  </div>

                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent2)] outline-none transition-all"
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Mail size={18} />
                </div>

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent2)] outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Lock size={18} />
                </div>

                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent2)] outline-none transition-all"
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <div className="p-3 bg-[var(--red)]/10 border border-[var(--red)]/20 rounded-lg text-[var(--red)] text-sm text-center">
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[var(--text)] text-[var(--bg)] font-bold py-3.5 rounded-xl hover:bg-[var(--accent)] hover:shadow-[0_0_15px_rgba(232,197,71,0.3)] transition-all flex items-center justify-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          {/* Toggle */}
          {status !== "success" && (
            <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
              {isLogin ? "Don't have an account? " : "Already have an account? "}

              <button
                type="button"
                onClick={toggleMode}
                className="text-[var(--text)] font-bold hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;