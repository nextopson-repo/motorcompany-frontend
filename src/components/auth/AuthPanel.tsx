import { useState, useEffect, useRef } from "react";

type AuthPanelProps = {
  userId?: string;
  step: "mobile" | "otp";
  onStepChange: (step: "mobile" | "otp") => void;
  onSendOtp: (mobileNumber: string) => Promise<boolean>;
  onVerifyOtp: (otp: string) => Promise<void>;
  mobileNumber: string;
  setMobileNumber: React.Dispatch<React.SetStateAction<string>>;
};

const AuthPanel: React.FC<AuthPanelProps> = ({
  userId,
  step,
  onStepChange,
  onSendOtp,
  onVerifyOtp,
  mobileNumber,
  setMobileNumber,
}) => {
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, resendCooldown]);

  // Auto-focus OTP input
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Send OTP handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!mobileNumber || mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const success = await onSendOtp(mobileNumber);
      if (success) {
        onStepChange("otp");
        setResendCooldown(30);
        setMessage("OTP sent successfully!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!otp || otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await onVerifyOtp(otp);
      // setMessage("OTP verified successfully!");
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const success = await onSendOtp(mobileNumber);
      if (success) {
        setResendCooldown(30);
        setMessage("OTP resent successfully!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile input form */}
      {step === "mobile" && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="flex items-center rounded-lg overflow-hidden bg-gray-100 mb-6">
            <span className="px-3 text-gray-500 select-none">+91</span>
            <span className="text-gray-400">|</span>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="9876543210"
              className="flex-1 px-3 py-2 bg-gray-100 focus:outline-none text-black font-semibold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white text-sm bg-red-500 hover:bg-red-600 py-2 rounded transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Sending..." : "Verify Number"}
          </button>
          <div>
            <p className="text-[10px] leading-3.5">By proceeding, I confirm that I have received, read, and agree to our <a href="#" className="text-semibold underline">Privacy Policy</a> and <a href="#" className="text-semibold underline">Terms & Conditions</a></p>
          </div>
        </form>
      )}

      {/* OTP form */}
      {step === "otp" && userId && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            ref={otpInputRef}
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-red-500 hover:bg-red-600 py-2 rounded transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || loading}
            className="w-full text-gray-700 hover:text-red-500 py-1 text-sm transition disabled:opacity-50"
          >
            {resendCooldown > 0
              ? `Resend OTP in ${resendCooldown}s`
              : "Resend OTP"}
          </button>
        </form>
      )}

      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default AuthPanel;
