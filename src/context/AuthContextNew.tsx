import { createContext } from "react";
import type { AuthContextType } from "../types/authType";
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

