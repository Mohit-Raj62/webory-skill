import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { authAPI } from "../utils/api";

// Set base URL for axios
axios.defaults.baseURL = "http://localhost:5004"; // Updated port to match actual server

// Add request interceptor for better error handling
axios.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate email format
      if (!isValidEmail(userData.email)) {
        throw new Error("Please enter a valid email address");
      }

      console.log("Attempting registration with:", userData.email);

      // Use authAPI instead of direct axios call
      const response = await authAPI.register(userData);

      console.log("Registration response:", response.data);

      if (response.data) {
        const newUser = {
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token,
        };
        setUser(newUser);
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(newUser));
        return newUser;
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      // Validate email format
      if (!isValidEmail(credentials.email)) {
        throw new Error("Please enter a valid email address");
      }

      console.log("Attempting login with:", credentials.email);

      // Use authAPI instead of direct axios call
      const response = await authAPI.login(credentials);

      console.log("Login response:", response.data);

      if (response.data) {
        const loggedInUser = {
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token,
        };
        setUser(loggedInUser);
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(loggedInUser));
        return loggedInUser;
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCode = async (email) => {
    try {
      setLoading(true);
      setError(null);

      // Validate email format
      if (!isValidEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      console.log("Sending verification code to:", email);

      // Use authAPI instead of direct axios call
      const response = await authAPI.sendVerificationCode({ email });

      console.log("Verification code response:", response.data);

      if (response.data) {
        // Check if we're in development mode and have a verification code
        if (response.data.verificationCode) {
          console.log(
            "Development mode - Verification code:",
            response.data.verificationCode
          );
          // Show a more user-friendly message
          setSuccess("Verification code generated successfully (DEV MODE)");
        }
        return response.data;
      } else {
        throw new Error("Failed to send verification code. Please try again.");
      }
    } catch (error) {
      console.error("Verification code error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Check if there's a verification code in the error response (for development mode)
      if (error.response?.data?.verificationCode) {
        console.log(
          "Development mode - Verification code from error:",
          error.response.data.verificationCode
        );
        // Return the verification code even though there was an error
        setSuccess("Verification code generated successfully (DEV MODE)");
        return error.response.data;
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Verification code sending failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (email, code) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Verifying code for email:", email);

      // Use authAPI instead of direct axios call
      const response = await authAPI.verifyCode({ email, code });

      console.log("Code verification response:", response.data);

      if (response.data) {
        return response.data;
      } else {
        throw new Error("Code verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Code verification error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Code verification failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const confirmPasswordReset = async (code, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Resetting password with verification code");

      // Use authAPI instead of direct axios call
      const response = await authAPI.resetPassword({ code, newPassword });

      console.log("Password reset response:", response.data);

      if (response.data) {
        setSuccess("Password reset successfully");
        return response.data;
      } else {
        throw new Error("Password reset failed. Please try again.");
      }
    } catch (error) {
      console.error("Password reset error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Password reset failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Check for stored token and user data on initial load
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("userToken");
      const storedUserData = localStorage.getItem("userData");

      if (token && storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          const response = await axios.get("/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.data) {
            setUser({
              ...userData,
              ...response.data,
              token: token,
            });
          } else {
            throw new Error("Failed to validate token");
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("userToken");
          localStorage.removeItem("userData");
          setUser(null);
        }
      }
    };

    validateToken();
  }, []);

  // Add token to all axios requests
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    success,
    register,
    login,
    logout,
    sendVerificationCode,
    verifyCode,
    confirmPasswordReset,
    isValidEmail,
    isAdmin: user?.role === "admin",
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
