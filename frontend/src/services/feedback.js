import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/api";

const getToken = () => localStorage.getItem("token");

const createFeedback = async (feedbackData) => {
  const token = getToken();
  const response = await axios.post(`${API_URL}/feedbacks`, feedbackData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getFeedbacksByOrder = async (orderId) => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/feedbacks/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// For Admin
const getAllFeedbacks = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/feedbacks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const feedbackService = {
  createFeedback,
  getFeedbacksByOrder,
  getAllFeedbacks,
};

export default feedbackService;
