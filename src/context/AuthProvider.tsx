import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "./AuthContext";
import type { RootState, AppDispatch } from "../store/store";
import {
  setAuth as setAuthAction,
  logout as clearAuthAction,
  updateUser as updateUserAction,
} from "../store/slices/authSlices/authSlice";

type Props = { children: React.ReactNode };

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        const user = JSON.parse(userStr);
        dispatch(setAuthAction({ user, token }));
      }
    } catch (error) {
      console.error("Auth hydration error:", error);
    }
  }, [dispatch]);

  const login = useCallback((user: any, token: string) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.warn("Error saving auth to localStorage", error);
    }
    dispatch(setAuthAction({ user, token }));
  }, [dispatch]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.warn("Error removing auth from localStorage", error);
    }
    dispatch(clearAuthAction());
  }, [dispatch]);

  const updateUser = useCallback((payload: any) => {
    dispatch(updateUserAction(payload));
    try {
      const curr = localStorage.getItem("user");
      const currObj = curr ? JSON.parse(curr) : {};
      const updated = { ...currObj, ...payload };
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (error) {
      console.warn("Error updating user in localStorage", error);
    }
  }, [dispatch]);

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token),
      login,
      logout,
      updateUser,
    }),
    [auth.user, auth.token, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



// import React, { useCallback, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AuthContext } from "./AuthContext";
// import type { RootState, AppDispatch } from "../store/store";
// import {
//   setAuth as setAuthAction,
//   clearAuth as clearAuthAction,
//   updateUser as updateUserAction,
// } from "../store/slices/authSlices/authSlice";

// type Props = { children: React.ReactNode };

// export const AuthProvider: React.FC<Props> = ({ children }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const auth = useSelector((state: RootState) => state.auth);

//   useEffect(() => {
//     try {
//       const token = localStorage.getItem("token");
//       const userStr = localStorage.getItem("user");
//       if (token && userStr) {
//         const user = JSON.parse(userStr);
//         dispatch(setAuthAction({ user, token }));
//       }
//     } catch (error) {
//       console.error("Auth hydration error:", error);
//     }
//   }, [dispatch]);

//   const login = useCallback((user: any, token: string) => {
//     try {
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//     } catch (error) {
//       console.warn("Error saving auth to localStorage", error);
//     }
//     dispatch(setAuthAction({ user, token }));
//   }, [dispatch]);

//   const logout = useCallback(() => {
//     try {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//     } catch (error) {
//       console.warn("Error removing auth from localStorage", error);
//     }
//     dispatch(clearAuthAction());
//   }, [dispatch]);

//   const updateUser = useCallback((payload: any) => {
//     dispatch(updateUserAction(payload));
//     try {
//       const curr = localStorage.getItem("user");
//       const currObj = curr ? JSON.parse(curr) : {};
//       const updated = { ...currObj, ...payload };
//       localStorage.setItem("user", JSON.stringify(updated));
//     } catch (error) {
//       console.warn("Error updating user in localStorage", error);
//     }
//   }, [dispatch]);

//   const value = useMemo(
//     () => ({
//       user: auth.user,
//       token: auth.token,
//       isAuthenticated: auth.isAuthenticated,
//       login,
//       logout,
//       updateUser,
//     }),
//     [auth.user, auth.token, auth.isAuthenticated, login, logout, updateUser]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
