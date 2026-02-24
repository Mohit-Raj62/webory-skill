import axios from "axios";

const API_URL = "http://localhost:3001/api";

const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      message: error.response.data.message || "An error occurred",
      errors: error.response.data.errors || {},
      status: error.response.status,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message:
        "No response from server. Please check if the server is running.",
      status: 503,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message || "An unexpected error occurred",
      status: 500,
    };
  }
};

export const registerStudent = async (studentData) => {
  try {
    const response = await axios.post(`${API_URL}/students`, studentData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
