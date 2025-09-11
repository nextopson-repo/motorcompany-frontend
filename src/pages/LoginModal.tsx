import { useState, useEffect } from "react";
import AuthPanel from "../components/auth/AuthPanel";
import { useAuth } from "../context/AuthContext";
import SignupModal from "../components/auth/SignupModal";
import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  // setUserData: React.Dispatch<React.SetStateAction<object>>;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { login } = useAuth();

  const [userId, setUserId] = useState("")
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  // Reset state when modal closes or opens newly
  useEffect(() => {
    if (!isOpen) {
      setUserId("");
      setStep("mobile");
      setShowSignup(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendOtp = async (mobileNumber: string) => {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobileNumber }),
    });
    const data = await res.json();
    if (data.statusCode === 404 || data.message === "User not found") {
      // Open signup modal on user not found
      setShowSignup(true);
      return false; // Prevent further OTP flow in login modal
    }
    const userIdFromResponse =
      data.responseObject?.user?.id || data.responseObject?.userId;

    if (data.statusCode === 200 && userIdFromResponse) {
      setUserId(userIdFromResponse);
      return true;
    } else {
      throw new Error(data.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!userId) throw new Error("User ID not found. Please resend OTP");

    const res = await fetch(`${BACKEND_URL}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, otpType: "mobile", otp }),
    });

    const data = await res.json();

    // setUserData(data.responseObject.user);

    if (data.success === true && data.responseObject.isFullyVerified) {
      login(data.responseObject.user, data.responseObject.token);
      console.log(
        "user : ",
        data.responseObject.user,
        "token : ",
        data.responseObject.token
      );
      onClose();
    } else {
      throw new Error(data.message || "OTP verification failed");
    }
  };

  const handleSignupRegistered = () => {
    setShowSignup(false);
  };

  return (
    <>
      {showSignup ? (
        <SignupModal
          isOpen={showSignup}
          onClose={() => setShowSignup(false)}
          onRegistered={handleSignupRegistered}
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
        />
      ) : (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl grid grid-cols-2 relative gap-8">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 text-gray-500 cursor-pointer hover:text-red-500"
            >
              <X className="h-7 w-7" />
            </button>

            {/* left side */}
            <div><img src="/loginImg.png" alt="Login Image" className="w-full" /></div>

            {/* right side */}
            <div className="p-6 flex flex-col justify-center">
              <h2 className="text-lg font-semibold mb-2">Log In / Register</h2>
              <p className="text-[10px] mb-4 leading-3.5">
                For an enhanced experience, track your orders and receive
                regular updates.
              </p>

              <AuthPanel
                userId={userId}
                step={step}
                onStepChange={setStep}
                onSendOtp={handleSendOtp}
                onVerifyOtp={handleVerifyOtp}
                mobileNumber={mobileNumber}
                setMobileNumber={setMobileNumber}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
