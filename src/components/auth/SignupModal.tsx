import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { signup } from "../../store/slices/authSlices/authSlice";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered: () => void;
  mobileNumber: string;
  setMobileNumber: React.Dispatch<React.SetStateAction<string>>;
  otpToken: string;
  onLoginClose: () => void;
}

export default function SignupModal({
  isOpen,
  onClose,
  onRegistered,
  mobileNumber,
  setMobileNumber,
  onLoginClose,
  otpToken
}: SignupModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { loading } = useSelector((state: RootState) => state.auth);

  if (!isOpen) return null;

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError("Please enter a valid full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!mobileNumber || mobileNumber.length !== 10 || isNaN(Number(mobileNumber))) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      const action = await dispatch(
        signup({ fullName, email, mobileNumber, otpToken, })
      );
      const data: any = action.payload;

      if (data?.statusCode === 200 || action.meta.requestStatus === "fulfilled") {
        onRegistered();
        onClose();
        onLoginClose();
        alert("You are signed up Successfully");
      } else {
        setError(data?.message || "Signup failed");
      }
    } catch (err) {
      setError("Signup error, please try again");
      console.error(err);
    }
  }; 

  return (
    <div className="fixed inset-0 bg-black/50 sm:flex items-center justify-center z-50">
      <div className="bg-white sm:rounded-2xl shadow-lg w-full h-full sm:h-auto max-w-2xl sm:grid sm:grid-cols-2 relative sm:gap-8">
        <div>
          <img src="/loginImg.png" alt="Signup" className="hidden sm:block w-full" />
        </div>

        <div className="p-4 lg:p-6 flex flex-col justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 lg:top-3 right-5 lg:right-3 lg:p-2 text-gray-500 hover:text-red-500 active:text-red-500 active:scale-95"
          >
            <ChevronRight className="w-5 lg:h-7 h-5 lg:w-7" />
          </button>
          <h2 className="text-sm lg:text-lg font-semibold mb-2 lg:mb-4">Register Here</h2>

          <form onSubmit={handleSignup} className="space-y-2 lg:space-y-4">
            <label htmlFor="fullname" className="text-[10px] lg:text-xs">Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs lg:text-sm bg-gray-100 rounded-xs lg:rounded px-3 py-2 placeholder:text-xs mt-1"
            />
            <label htmlFor="email" className="text-[10px] lg:text-xs">Email</label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs lg:text-sm bg-gray-100 rounded-xs lg:rounded px-3 py-2 placeholder:text-xs mt-1"
            />
            <label htmlFor="phone" className="text-[10px] lg:text-xs">Phone</label>
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full text-xs lg:text-sm bg-gray-100 rounded-xs lg:rounded px-3 py-2 placeholder:text-xs mt-1"
              disabled // 🔹 disable to prevent changes
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 font-semibold bg-red-500 text-white text-base rounded-xs lg:rounded hover:bg-red-600 disabled:opacity-50 active:scale-95 active:bg-red-600"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            {error && <p className="text-red-600 mt-2 text-xs lg:text-sm">{error}</p>}
          </form>
        </div>

        <div className="block sm:hidden h-fit p-2">
          <img src="/loginImg.png" alt="Login Image" className="w-full h-full object-bottom" />
        </div>
      </div>
    </div>
  );
}




// import { useState } from "react";
// import { ChevronRight } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../store/store";
// import { signup } from "../../store/slices/authSlices/authSlice";

// interface SignupModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onRegistered: () => void;
//   mobileNumber: string;
//   setMobileNumber: React.Dispatch<React.SetStateAction<string>>;
// }

// export default function SignupModal({
//   isOpen,
//   onClose,
//   onRegistered,
//   mobileNumber,
//   setMobileNumber,
// }: SignupModalProps) {
//   const dispatch = useDispatch<AppDispatch>();

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   const { loading } = useSelector((state: RootState) => state.auth);

//   if (!isOpen) return null;

//   const validateEmail = (email: string) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     // 🔹 Validation
//     if (fullName.trim().length < 2) {
//       setError("Please enter a valid full name");
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }
//     if (
//       !mobileNumber ||
//       mobileNumber.length !== 10 ||
//       isNaN(Number(mobileNumber))
//     ) {
//       setError("Please enter a valid 10-digit mobile number");
//       return;
//     }

//     try {
//       const action = await dispatch(
//         signup({ fullName, email, mobileNumber, userType: "EndUser" })
//       );
//       const data: any = action.payload;

//       if (data?.statusCode === 200 || action.meta.requestStatus === "fulfilled") {
//         localStorage.setItem("userId", data?.user?.id);
//         onRegistered();
//         onClose();
//       } else {
//         setError(data?.message || "Signup failed");
//       }
//     } catch (err) {
//       setError("Signup error, please try again");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 sm:flex items-center justify-center z-50">
//       <div className="bg-white sm:rounded-2xl shadow-lg w-full h-full sm:h-auto max-w-2xl sm:grid sm:grid-cols-2 relative sm:gap-8">
//         {/* Left side image */}
//         <div>
//           <img src="/loginImg.png" alt="Signup" className="hidden sm:block w-full" />
//         </div>

//         {/* Right side form */}
//         <div className="p-4 lg:p-6 flex flex-col justify-center">
//           <button
//             onClick={onClose}
//             className="absolute top-4 lg:top-3 right-5 lg:right-3 lg:p-2 text-gray-500 hover:text-red-500 active:text-red-500 active:scale-95"
//           >
//             <ChevronRight className="w-5 lg:h-7 h-5 lg:w-7" />
//           </button>
//           <h2 className="text-sm lg:text-lg font-semibold mb-2 lg:mb-4">Register Here</h2>

//           <form onSubmit={handleSignup} className="space-y-2 lg:space-y-4">
//             <label htmlFor="fullname" className="text-[10px] lg:text-xs">Full Name</label>
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="w-full text-xs lg:text-sm bg-gray-100 rounded-xs lg:rounded px-3 py-2 placeholder:text-xs mt-1"
//             />
//             <label htmlFor="email" className="text-[10px] lg:text-xs">Email</label>
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full text-xs lg:text-sm bg-gray-100 rounded-xs lg:rounded px-3 py-2 placeholder:text-xs mt-1"
//             />
//             <label htmlFor="phone" className="text-[10px] lg:text-xs">Phone</label>
//             <input
//               type="tel"
//               placeholder="Mobile Number"
//               value={mobileNumber}
//               onChange={(e) => setMobileNumber(e.target.value)}
//               className="w-full text-xs lg:text-sm bg-gray-100 rounded-xs lg:rounded px-3 py-2 placeholder:text-xs mt-1"
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2 font-semibold bg-red-500 text-white text-base rounded-xs lg:rounded hover:bg-red-600 disabled:opacity-50 active:scale-95 active:bg-red-600"
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </button>

//             {error && <p className="text-red-600 mt-2 text-xs lg:text-sm">{error}</p>}
//           </form>
//         </div>

//         {/* left side for mobile */}
//         <div className="block sm:hidden h-fit p-2">
//           <img src="/loginImg.png" alt="Login Image" className="w-full h-full object-bottom" />
//         </div>
//       </div>
//     </div>
//   );
// }
