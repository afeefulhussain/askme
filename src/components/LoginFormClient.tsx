"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { canAccessAdmin } from "@/lib/rbac";
import type { PortalRole } from "@/lib/types";

const QUICK_ACCOUNTS: Array<{
  label: string;
  roleTag: string;
  email: string;
}> = [
  {
    label: "Super Admin / President (Afeef Ul Hussain)",
    roleTag: "SUPER_ADMIN",
    email: "afeef@askme.pk",
  },
  {
    label: "Technical Director (Arham)",
    roleTag: "DIRECTOR",
    email: "arham@askme.pk",
  },
  {
    label: "Core Lead (Wajiha — VP)",
    roleTag: "CORE_LEAD",
    email: "wajiha@askme.pk",
  },
  {
    label: "Finance Auditor (Abeer Zafar)",
    roleTag: "CORE_AUDITOR",
    email: "abeer@askme.pk",
  },
  {
    label: "Faculty Advisor (Miss Manahal)",
    roleTag: "ADVISOR",
    email: "manahal@askme.pk",
  },
  {
    label: "Pending Applicant (Daniyal)",
    roleTag: "PENDING_APPLICANT",
    email: "daniyal@uet.edu.pk",
  },
];

export default function LoginFormClient() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("afeef@askme.pk");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [devPreviewCode, setDevPreviewCode] = useState<string | null>(null);
  const [sentNotice, setSentNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitLockRef = useRef(false);

  const navigateByRole = (role: PortalRole) => {
    window.dispatchEvent(new Event("axon-auth-changed"));
    if (canAccessAdmin(role)) {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        user?: { rbacRole: PortalRole };
      };

      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }

      navigateByRole(data.user?.rbacRole || "APPROVED_MEMBER");
    } catch {
      setError("Network error while verifying credentials.");
    } finally {
      submitLockRef.current = false;
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setLoading(true);
    setError(null);
    setDevPreviewCode(null);

    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = (await res.json()) as {
        error?: string;
        recipientName?: string;
        sentVia?: string;
        devOtpPreview?: string;
      };

      if (!res.ok) {
        setError(data.error || "Unable to send OTP verification code.");
        return;
      }

      setRecipientName(data.recipientName || email);
      setStep("otp");
      setSentNotice(
        data.sentVia === "resend"
          ? `6-digit verification code sent via Resend to ${email.trim()}.`
          : `6-digit verification code generated for ${email.trim()} (expires in 10 minutes).`
      );
      if (data.devOtpPreview) {
        setDevPreviewCode(data.devOtpPreview);
      }
    } catch {
      setError("Network error while requesting verification code.");
    } finally {
      submitLockRef.current = false;
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: otpCode.trim(),
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        user?: { rbacRole: PortalRole };
      };

      if (!res.ok) {
        setError(data.error || "OTP verification failed.");
        return;
      }

      navigateByRole(data.user?.rbacRole || "APPROVED_MEMBER");
    } catch {
      setError("Network error while verifying OTP.");
    } finally {
      submitLockRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl bg-void-card border border-void-border shadow-2xl font-mono text-xs">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded bg-void-500 border border-void-border flex items-center justify-center p-2 mx-auto mb-3">
          <Image
            src="/assets/axon-mark.svg"
            alt="AXON Brand Mark"
            width={36}
            height={36}
            priority
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="font-serif text-2xl font-bold text-white font-sans">
          AXON Portal Sign-In
        </h1>
        <p className="text-slate-400 text-[11px] mt-1">
          @askme.pk Institutional Password & 6-Digit OTP Gateway
        </p>
      </div>

      {/* Mode Switcher */}
      <div
        role="tablist"
        aria-label="Authentication method"
        className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-void-400 border border-void-border mb-6"
      >
        <button
          type="button"
          role="tab"
          aria-selected={authMode === "password"}
          onClick={() => {
            setAuthMode("password");
            setError(null);
          }}
          className={`py-2 rounded text-[11px] uppercase tracking-wider font-semibold transition-colors ${
            authMode === "password"
              ? "bg-cyan-axon text-void-500"
              : "text-slate-300 hover:text-white"
          }`}
        >
          @askme.pk Password
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={authMode === "otp"}
          onClick={() => {
            setAuthMode("otp");
            setError(null);
          }}
          className={`py-2 rounded text-[11px] uppercase tracking-wider font-semibold transition-colors ${
            authMode === "otp"
              ? "bg-cyan-axon text-void-500"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Email + 6-Digit OTP
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/40 text-red-400 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {authMode === "password" ? (
        <form onSubmit={handlePasswordLogin} className="space-y-5">
          <div>
            <span className="block text-slate-300 mb-2 uppercase text-[11px]">
              Quick Select Role Account (@askme.pk)
            </span>
            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {QUICK_ACCOUNTS.filter((a) => a.roleTag !== "PENDING_APPLICANT").map(
                (acct) => (
                  <button
                    key={acct.email}
                    type="button"
                    onClick={() => {
                      setEmail(acct.email);
                      setError(null);
                    }}
                    className={`px-3 py-2 rounded border text-left text-[11px] flex items-center justify-between transition-colors ${
                      email.toLowerCase() === acct.email
                        ? "bg-cyan-axon/15 border-cyan-axon text-white font-semibold"
                        : "bg-void-400 border-void-border text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <span className="truncate mr-2">{acct.label}</span>
                    <span className="text-[10px] text-cyan-axon shrink-0">
                      {acct.roleTag}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="login-email-input"
              className="block text-slate-300 mb-1.5 uppercase text-[11px]"
            >
              AXON @askme.pk Login ID *
            </label>
            <div className="relative">
              <input
                id="login-email-input"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@askme.pk"
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 pl-9 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password-input"
              className="block text-slate-300 mb-1.5 uppercase text-[11px]"
            >
              Portal Password *
            </label>
            <div className="relative">
              <input
                id="login-password-input"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your assigned password"
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 pl-9 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-2 p-1 text-slate-400 hover:text-white rounded"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-slate-500 leading-relaxed">
              Password governance: Self-service password resets are disabled.
              Only the AXON President (SUPER_ADMIN) can reset credentials.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all flex items-center justify-center gap-2 shadow disabled:opacity-60"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : step === "email" ? (
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div>
            <span className="block text-slate-300 mb-2 uppercase text-[11px]">
              Quick Select Institutional Identity
            </span>
            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {QUICK_ACCOUNTS.map((acct) => (
                <button
                  key={acct.email}
                  type="button"
                  onClick={() => {
                    setEmail(acct.email);
                    setError(null);
                  }}
                  className={`px-3 py-2 rounded border text-left text-[11px] flex items-center justify-between transition-colors ${
                    email.toLowerCase() === acct.email
                      ? "bg-cyan-axon/15 border-cyan-axon text-white font-semibold"
                      : "bg-void-400 border-void-border text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <span className="truncate mr-2">{acct.label}</span>
                  <span className="text-[10px] text-cyan-axon shrink-0">
                    {acct.roleTag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="otp-email-input"
              className="block text-slate-300 mb-1.5 uppercase text-[11px]"
            >
              Registered AXON or Applicant Email *
            </label>
            <div className="relative">
              <input
                id="otp-email-input"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@askme.pk"
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 pl-9 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all flex items-center justify-center gap-2 shadow disabled:opacity-60"
          >
            <span>
              {loading ? "Dispatching Code..." : "Send 6-Digit Login Code"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {sentNotice && (
            <div className="p-3 rounded bg-circuit-green/10 border border-circuit-green/40 text-circuit-green flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">{recipientName}</div>
                <div className="text-[11px]">{sentNotice}</div>
              </div>
            </div>
          )}

          {devPreviewCode && (
            <div className="p-3 rounded bg-cyan-axon/10 border border-cyan-axon/40 text-slate-200 flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] text-cyan-axon uppercase">
                  LOCAL / DEV OTP PREVIEW (RESEND_API_KEY UNSET)
                </div>
                <div className="text-lg font-bold tracking-widest text-white">
                  {devPreviewCode}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOtpCode(devPreviewCode)}
                className="px-3 py-1.5 bg-cyan-axon text-void-500 font-bold uppercase rounded text-[10px]"
              >
                Use Code
              </button>
            </div>
          )}

          <div>
            <label
              htmlFor="otp-code-input"
              className="block text-slate-300 mb-1.5 uppercase text-[11px]"
            >
              Enter 6-Digit Verification Code *
            </label>
            <div className="relative">
              <input
                id="otp-code-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="w-full bg-void-400 border border-void-border rounded px-4 py-3 pl-10 text-white tracking-[0.4em] text-base font-bold placeholder-slate-600 focus:outline-none focus:border-cyan-axon"
              />
              <KeyRound className="w-4 h-4 text-cyan-axon absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length !== 6}
            className="w-full py-3 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all flex items-center justify-center gap-2 shadow disabled:opacity-60"
          >
            <span>
              {loading ? "Verifying Code..." : "Verify & Enter Portal"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("email");
              setOtpCode("");
              setError(null);
            }}
            className="w-full py-2 text-slate-400 hover:text-white flex items-center justify-center gap-1.5 text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Use Different Email</span>
          </button>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-void-border/40 text-center text-slate-500 text-[10px] flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-circuit-green" />
        <span>
          Scrypt + HMAC-SHA256 Auth • Signed HttpOnly Session • Together We Transmit
        </span>
      </div>
    </div>
  );
}
