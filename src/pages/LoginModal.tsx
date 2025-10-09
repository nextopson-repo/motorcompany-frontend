// LoginModal.tsx
import { useState, useEffect } from "react";
import AuthPanel from "../components/auth/AuthPanel";
import SignupModal from "../components/auth/SignupModal";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { useAuth } from "../context/useAuth";
import { verifyOtp, loginUser } from "../store/slices/authSlices/authSlice";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  mobileNumber: number;
  checkbox: boolean;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { login } = useAuth();

  const [userId, setUserId] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [checkbox, setCheckbox] = useState(false)
  const [showSignup, setShowSignup] = useState(false);

  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isOpen) {
      setUserId("");
      setOtpToken("");
      setStep("mobile");
      setShowSignup(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 🔹 Send OTP
  const handleSendOtp = async () => {
    try {
      const action = await dispatch(loginUser({mobileNumber, checkbox}));
      const data: any = action.payload;
      console.log("login data", data)

      if (data?.statusCode === 200 && data?.responseObject?.user?.id) {
        setUserId(data.responseObject.user.id);
        setOtpToken(data.responseObject.token || "");
        return true;
      } else {
        throw new Error(data?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      return false;
    }
  };

  // 🔹 Verify OTP
  const handleVerifyOtp = async (otp: string) => {
    if (!userId) throw new Error("User ID not found. Please resend OTP");

    try {
      const action = await dispatch(verifyOtp({ userId, mobileNumber, otp }));
      const data: any = action.payload;

      const user = data?.responseObject?.user;
      const token = data?.responseObject?.token;

      if (!user || !token) throw new Error("OTP verification failed");

      if (!user.fullName || !user.email) {
        setShowSignup(true);
        setOtpToken(token); 
      } else {

        login(user, token);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSignupRegistered = () => setShowSignup(false);

  return (
    <>
      {showSignup ? (
        <SignupModal
          isOpen={showSignup}
          onClose={() => setShowSignup(false)}
          onRegistered={handleSignupRegistered}
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
          otpToken={otpToken} // pass token for signup API
        />
      ) : (
        <div className="fixed inset-0 bg-black/50 sm:flex items-center justify-center z-50">
          <div className="w-screen h-full sm:h-auto bg-white md:rounded-2xl shadow-lg sm:w-full sm:max-w-2xl grid sm:grid-cols-2 relative sm:gap-8">
            <button
              onClick={onClose}
              className="absolute top-3 right-4 lg:right-3 p-2 text-gray-500 cursor-pointer hover:text-red-500"
            >
              <X className="w-5 lg:h-7 h-5 lg:w-7" />
            </button>

            <div className="hidden sm:block">
              <img src="/loginImg.png" alt="Login Image" className="w-full" />
            </div>

            <div className="px-2 md:p-6 mt-4 md:mt-0 flex flex-col justify-center">
              <h2 className="text-lg font-semibold mb-2">Log In / Register</h2>
              <p className="text-[10px] mb-4 leading-3.5">
                For an enhanced experience, track your orders and receive regular updates.
              </p>

              <AuthPanel
                userId={userId}
                step={step}
                onStepChange={setStep}
                onSendOtp={handleSendOtp}
                onVerifyOtp={handleVerifyOtp}
                mobileNumber={mobileNumber}
                setCheckbox={setCheckbox}
                checkbox = {checkbox}
                setMobileNumber={setMobileNumber}
              />

              {loading && <p className="text-sm text-gray-500 mt-2">Processing...</p>}
              {error && <p className="text-sm text-red-600 mt-2">{String(error)}</p>}
            </div>

            <div className="block sm:hidden h-fit p-2 py-4">
              <img src="/loginImg.png" alt="Login Image" className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}




// import { useState, useEffect } from "react";
// import AuthPanel from "../components/auth/AuthPanel";
// import SignupModal from "../components/auth/SignupModal";
// import { X } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../store/store";
// import { useAuth } from "../context/useAuth";
// import { sendOtp, verifyOtp } from "../store/slices/authSlices/authSlice";

// interface LoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
//   const dispatch = useDispatch<AppDispatch>();
//   const { login } = useAuth();

//   const [userId, setUserId] = useState("");
//   const [step, setStep] = useState<"mobile" | "otp">("mobile");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [showSignup, setShowSignup] = useState(false);

//   const { loading, error } = useSelector((state: RootState) => state.auth);

//   // Reset state when modal closes or opens newly
//   useEffect(() => {
//     if (!isOpen) {
//       setUserId("");
//       setStep("mobile");
//       setShowSignup(false);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   // 🔹 Send OTP via Redux
//   const handleSendOtp = async (mobileNumber: string) => {
//     try {
//       const action = await dispatch(sendOtp({ mobileNumber }));
//       const data: any = action.payload;

//       if (data?.statusCode === 404 || data?.message === "User not found") {
//         setShowSignup(true);
//         return false;
//       }

//       const userIdFromResponse =
//         data?.responseObject?.user?.id || data?.responseObject?.userId;

//       if (data?.statusCode === 200 && userIdFromResponse) {
//         setUserId(userIdFromResponse);
//         return true;
//       } else {
//         throw new Error(data?.message || "Failed to send OTP");
//       }
//     } catch (err) {
//       console.error("Send OTP error:", err);
//       return false;
//     }
//   };

//   // 🔹 Verify OTP via Redux
//   const handleVerifyOtp = async (otp: string) => {
//     if (!userId) throw new Error("User ID not found. Please resend OTP");

//     const action = await dispatch(verifyOtp({ userId, otp }));
//     const data: any = action.payload;

//     if (data?.success === true && data?.responseObject?.isFullyVerified) {
//       login(data.responseObject.user, data.responseObject.token);
//       console.log(
//         "user : ",
//         data.responseObject.user,
//         "token : ",
//         data.responseObject.token
//       );
//       onClose();
//     } else {
//       throw new Error(data?.message || "OTP verification failed");
//     }
//   };

//   const handleSignupRegistered = () => {
//     setShowSignup(false);
//   };

//   return (
//     <>
//       {showSignup ? (
//         <SignupModal
//           isOpen={showSignup}
//           onClose={() => setShowSignup(false)}
//           onRegistered={handleSignupRegistered}
//           mobileNumber={mobileNumber}
//           setMobileNumber={setMobileNumber}
//         />
//       ) : (
//         <div className="fixed inset-0 bg-black/50 sm:flex items-center justify-center z-50">
//           <div className="w-screen h-full sm:h-auto bg-white md:rounded-2xl shadow-lg sm:w-full sm:max-w-2xl grid sm:grid-cols-2 relative sm:gap-8">
//             <button
//               onClick={onClose}
//               className="absolute top-3 right-4 lg:right-3 p-2 text-gray-500 cursor-pointer hover:text-red-500"
//             >
//               <X className="w-5 lg:h-7 h-5 lg:w-7" />
//             </button>

//             {/* left side */}
//             <div className="hidden sm:block">
//               <img src="/loginImg.png" alt="Login Image" className="w-full" />
//             </div>

//             {/* right side */}
//             <div className="px-2 md:p-6 mt-4 md:mt-0 flex flex-col justify-center">
//               <h2 className="text-lg font-semibold mb-2">Log In / Register</h2>
//               <p className="text-[10px] mb-4 leading-3.5">
//                 For an enhanced experience, track your orders and receive
//                 regular updates.
//               </p>

//               <AuthPanel
//                 userId={userId}
//                 step={step}
//                 onStepChange={setStep}
//                 onSendOtp={handleSendOtp}
//                 onVerifyOtp={handleVerifyOtp}
//                 mobileNumber={mobileNumber}
//                 setMobileNumber={setMobileNumber}
//               />

//               {loading && (
//                 <p className="text-sm text-gray-500 mt-2">Processing...</p>
//               )}
//               {error && (
//                 <p className="text-sm text-red-600 mt-2">{String(error)}</p>
//               )}
//             </div>

//             {/* left side for mobile */}
//             <div className="block sm:hidden h-fit p-2 py-4">
//               <img
//                 src="/loginImg.png"
//                 alt="Login Image"
//                 className="w-full h-full"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }