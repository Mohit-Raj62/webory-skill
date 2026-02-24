// For development on Android emulator
const API_URL = process.env.API_URL || "http://10.0.2.2:5000/api";

// For development on iOS simulator
// export const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// For physical device
// export const API_URL = process.env.API_URL || 'http://<your-local-ip>:5000/api';

const constants = {
  API_URL,
};

export default constants;
