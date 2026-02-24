// Authentication Data Model
const AuthModel = {
  // User Authentication Information
  user: {
    id: String, // Unique user ID
    email: String, // Email address (used for login)
    password: String, // Hashed password
    role: String, // Role (teacher/student/admin)
    status: String, // Account status (active/inactive)
    lastLogin: Date, // Last login timestamp
    createdAt: Date, // Account creation date
    updatedAt: Date, // Last update date
  },

  // Session Management
  session: {
    id: String, // Session ID
    userId: String, // Reference to user
    token: String, // JWT token
    expiresAt: Date, // Token expiration
    deviceInfo: {
      // Device information
      deviceId: String,
      deviceType: String,
      browser: String,
      os: String,
    },
    isActive: Boolean, // Session status
  },

  // Password Reset
  passwordReset: {
    id: String, // Reset request ID
    userId: String, // Reference to user
    token: String, // Reset token
    expiresAt: Date, // Token expiration
    isUsed: Boolean, // Whether token has been used
  },

  // Login History
  loginHistory: {
    id: String, // History record ID
    userId: String, // Reference to user
    timestamp: Date, // Login timestamp
    ipAddress: String, // IP address
    location: String, // Location
    status: String, // Login status (success/failed)
    deviceInfo: {
      // Device information
      deviceId: String,
      deviceType: String,
      browser: String,
      os: String,
    },
  },
};

export default AuthModel;
