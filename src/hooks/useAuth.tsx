// import { useState } from "react";
// import axios from "axios";

// const API_URL = "http://192.168.1.3:5000/api/v1/auth";
// //   process.env.REACT_APP_API_URL || "http://192.168.1.3:5000/api/v1/auth";

// interface AuthResponse {
//   user: any;
//   token: string;
//   mobileOTP?: string;
// }

// export const useAuth = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.post<AuthResponse>(
//         `${API_URL}/login`,
//         { email, password },
//         { withCredentials: true }
//       );
//       localStorage.setItem("authToken", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       setLoading(false);
//       return res.data;
//     } catch (err: any) {
//       setLoading(false);
//       setError(err?.response?.data?.message || "Login failed");
//       throw err;
//     }
//   };

//   const signup = async (
//     fullName: string,
//     email: string,
//     mobileNumber: string,
//     password: string,
//     userType?: string
//   ) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.post<AuthResponse>(
//         `${API_URL}/signup`,
//         { fullName, email, mobileNumber, password, userType },
//         { withCredentials: true }
//       );
//       localStorage.setItem("authToken", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       setLoading(false);
//       return res.data;
//     } catch (err: any) {
//       setLoading(false);
//       setError(err?.response?.data?.message || "Signup failed");
//       throw err;
//     }
//   };

//   const verifyOTP = async (emailOrMobile: string, otp: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.post(
//         `${API_URL}/verify-otp`,
//         { emailOrMobile, otp },
//         { withCredentials: true }
//       );
//       localStorage.setItem("authToken", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       setLoading(false);
//       return res.data;
//     } catch (err: any) {
//       setLoading(false);
//       setError(err?.response?.data?.message || "OTP verification failed");
//       throw err;
//     }
//   };

//   return { login, signup, verifyOTP, loading, error, setError };
// };



// // src/hooks/useAuth.ts
// import { useState } from "react";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://192.168.1.3:5000/api/v1/auth";

// export const useAuth = () => {
//   const [loading, setLoading] = useState(false);

//   const signup = async (fullName: string, email: string, mobileNumber: string, userType?: string) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_URL}/signup`, { fullName, email, mobileNumber, userType });
//       setLoading(false);
//       return res.data;
//     } catch (error: any) {
//       setLoading(false);
//       return { status: "Failed", message: error?.response?.data?.message || "Signup failed" };
//     }
//   };

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_URL}/login`, { email, password });
//       setLoading(false);
//       return res.data;
//     } catch (error: any) {
//       setLoading(false);
//       return { status: "Failed", message: error?.response?.data?.message || "Login failed" };
//     }
//   };

//   const sendOTP = async (email: string, mobileNumber: string) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_URL}/send-otp`, { email, mobileNumber });
//       setLoading(false);
//       return res.data;
//     } catch (error: any) {
//       setLoading(false);
//       return { status: "Failed", message: error?.response?.data?.message || "Send OTP failed" };
//     }
//   };

//   const verifyOTP = async (email: string, mobileNumber: string, otp: string, token?: string) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_URL}/verify-otp`, { email, mobileNumber, otp, token });
//       setLoading(false);
//       return res.data;
//     } catch (error: any) {
//       setLoading(false);
//       return { status: "Failed", message: error?.response?.data?.message || "OTP verification failed" };
//     }
//   };

//   return { signup, login, sendOTP, verifyOTP, loading };
// };

// import { useState } from "react";

// const API_BASE = "http://192.168.1.3:5000/api/v1/auth";

// export const useAuth = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();
//       if (data.status === "Success") return data;
//       throw new Error(data.message || "Login failed");
//     } catch (err: any) {
//       setError(err.message);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signup = async (fullName: string, email: string, mobile: string, password: string, userType: string) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fullName, email, mobileNumber: mobile, password, userType }),
//       });
//       const data = await res.json();
//       if (data.status === "Success") return data;
//       throw new Error(data.message || "Signup failed");
//     } catch (err: any) {
//       setError(err.message);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOTP = async (email: string, mobile: string, otp: string, token: string) => {
//     try {
//       const res = await fetch(`${API_BASE}/verify-otp`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ email, mobile, otp }),
//       });
//       return await res.json();
//     } catch (err) {
//       console.error(err);
//       return { status: "Failed", message: "OTP verification failed" };
//     }
//   };

//   const resendOTP = async (type: "email" | "mobile", email: string, mobile: string) => {
//     await fetch(`${API_BASE}/resend-${type}-otp`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, mobile }),
//     });
//   };

//   return { login, signup, verifyOTP, resendOTP, loading, error, setError };
// };
