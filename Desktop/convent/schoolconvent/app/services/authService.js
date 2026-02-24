import User from "../models/mongodb/User";
import Teacher from "../models/mongodb/Teacher";
import Student from "../models/mongodb/Student";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";
import "react-native-get-random-values";
import constants from "../config/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthService {
  // Helper function to hash password
  async hashPassword(password) {
    const digest = await digestStringAsync(
      CryptoDigestAlgorithm.SHA256,
      password
    );
    return digest;
  }

  // Helper function to verify password
  async verifyPassword(password, hashedPassword) {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${constants.API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store the token
      if (data.token) {
        await this.storeToken(data.token);
      }

      return data.user;
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  }

  async storeToken(token) {
    try {
      // In a real app, you would use secure storage
      // For now, we'll use AsyncStorage
      await AsyncStorage.setItem("userToken", token);
    } catch (error) {
      console.error("Error storing token:", error);
    }
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem("userToken");
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem("userToken");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }

  // Register new user
  async register(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await this.hashPassword(userData.password);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Create student profile
  async createStudentProfile(studentData) {
    try {
      const student = new Student(studentData);
      await student.save();
      return student;
    } catch (error) {
      throw new Error("Failed to create student profile: " + error.message);
    }
  }

  // Create teacher profile
  async createTeacherProfile(teacherData) {
    try {
      const teacher = new Teacher(teacherData);
      await teacher.save();
      return teacher;
    } catch (error) {
      throw new Error("Failed to create teacher profile: " + error.message);
    }
  }

  // Get user profile with role-specific data
  async getUserProfile(userId, role) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      let profile;
      if (role === "student") {
        profile = await Student.findOne({ authId: userId });
      } else if (role === "teacher") {
        profile = await Teacher.findOne({ authId: userId });
      }

      return {
        user,
        profile,
      };
    } catch (error) {
      throw new Error("Failed to get user profile: " + error.message);
    }
  }
}

const authService = new AuthService();
export default authService;
