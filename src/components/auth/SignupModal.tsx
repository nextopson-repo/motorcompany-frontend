import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered: () => void;
  mobileNumber: string;
  setMobileNumber: React.Dispatch<React.SetStateAction<string>>;
}

const userTypes = ["Dealer", "Owner", "EndUser"];

export default function SignupModal({
  isOpen,
  onClose,
  onRegistered,
  mobileNumber,
  setMobileNumber,
}: SignupModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // const [mobileNumber, setMobileNumber] = useState("");
  const [userType, setUserType] = useState(userTypes[2]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 🔹 Validation
    if (fullName.trim().length < 2) {
      setError("Please enter a valid full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (
      !mobileNumber ||
      mobileNumber.length !== 10 ||
      isNaN(Number(mobileNumber))
    ) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!userTypes.includes(userType)) {
      setError("Please select a valid user type");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, mobileNumber, userType }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        // ✅ Backend response success
        localStorage.setItem("userId", data.user?.id);
        onRegistered();
        onClose();
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Signup error, please try again");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl grid grid-cols-2 relative gap-8">
        {/* Left side image */}
        <div>
          <img src="/loginImg.png" alt="Signup" className="w-full" />
        </div>

        {/* Right side form */}
        <div className="p-6 flex flex-col justify-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-gray-500 hover:text-red-500"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
          <h2 className="text-lg font-semibold mb-4">Register Here</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-sm bg-gray-100 rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm bg-gray-100 rounded px-3 py-2"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full text-sm bg-gray-100 rounded px-3 py-2"
            />

            {/* UserType Dropdown */}
            <div className="relative">
              <Listbox value={userType} onChange={setUserType}>
                {({ open }) => (
                  <>
                    <Listbox.Button className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm">
                      {userType}
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                          open ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-auto z-10">
                      {userTypes.map((type) => (
                        <Listbox.Option
                          key={type}
                          value={type}
                          className={({ active }) =>
                            `cursor-pointer select-none px-4 py-2 text-sm ${
                              active
                                ? "bg-red-100 text-red-600"
                                : "text-gray-700"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex items-center justify-between">
                              <span>{type}</span>
                              {selected && (
                                <Check className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </>
                )}
              </Listbox>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}






// import { useState } from "react";
// import { Listbox } from "@headlessui/react";
// import { Check, ChevronDown, ChevronRight } from "lucide-react";

// interface SignupModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onRegistered: () => void;
// }

// const userTypes = ["Dealer", "Owner", "EndUser"];

// export default function SignupModal({
//   isOpen,
//   onClose,
//   onRegistered,
// }: SignupModalProps) {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [userType, setUserType] = useState(userTypes[2]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const validateEmail = (email: string) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

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
//     if (!userTypes.includes(userType)) {
//       setError("Please select a valid user type");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signup`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ fullName, email, mobileNumber, userType }),
//         }
//       );
//       const data = await res.json();

//       if (res.ok) {
//         onRegistered();
//         onClose();
//       } else {
//         setError(data.message || "Signup failed");
//       }
//     } catch (err) {
//       setError("Signup error, please try again");
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl grid grid-cols-2 relative gap-8">
//         {/* left side */}
//         <div>
//           <img src="/loginImg.png" alt="Login Image" className="w-full" />
//         </div>

//         {/* right side */}
//         <div className="p-6 flex flex-col justify-center">
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 p-2 text-gray-500 hover:text-red-500 cursor-pointer"
//           >
//             <ChevronRight className="h-7 w-7" />
//           </button>
//           <h2 className="text-lg font-semibold mb-4">Register Here</h2>
//           <form onSubmit={handleSignup} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="w-full text-sm bg-gray-100 rounded px-3 py-2"
//             />
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full text-sm bg-gray-100 rounded px-3 py-2"
//             />
//             <input
//               type="tel"
//               placeholder="Mobile Number"
//               value={mobileNumber}
//               onChange={(e) => setMobileNumber(e.target.value)}
//               className="w-full text-sm bg-gray-100 rounded px-3 py-2"
//             />

//             {/* Custom Dropdown */}
//             <div className="relative">
//               <Listbox value={userType} onChange={setUserType}>
//                 {({ open }) => (
//                   <>
//                     <Listbox.Button className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm transition">
//                       {userType}
//                       <ChevronDown
//                         className={`h-4 w-4 text-gray-500 transform transition-transform duration-300 ${
//                           open ? "rotate-180" : "rotate-0"
//                         }`}
//                       />
//                     </Listbox.Button>

//                     <Listbox.Options className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-auto z-10">
//                       {userTypes.map((type) => (
//                         <Listbox.Option
//                           key={type}
//                           value={type}
//                           className={({ active }) =>
//                             `cursor-pointer select-none px-4 py-2 text-sm ${
//                               active
//                                 ? "bg-red-100 text-red-600"
//                                 : "text-gray-700"
//                             }`
//                           }
//                         >
//                           {({ selected }) => (
//                             <div className="flex items-center justify-between">
//                               <span>{type}</span>
//                               {selected && (
//                                 <Check className="h-4 w-4 text-red-500" />
//                               )}
//                             </div>
//                           )}
//                         </Listbox.Option>
//                       ))}
//                     </Listbox.Options>
//                   </>
//                 )}
//               </Listbox>
//             </div>

//             <button
//               type="submit"
//               className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </button>
//             {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }