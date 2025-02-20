import axios from "axios";

const API_BASE_URL = "https://oasisbackend-production.up.railway.app/api/AccountsPayable"; // Adjust based on your .NET backend URL
const API_BASE_URLS = "https://oasisbackend-production.up.railway.app/api"; // Adjust based on your .NET backend URL

export const apiServices = {
  // Fetch all accounts payable records
  getAllPayables: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching accounts payable:", error);
      throw error;
    }
  },

  // Fetch a single account payable by ID
  getPayableById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching account payable:", error);
      throw error;
    }
  },

  // Create a new account payable
  createPayable: async (accountData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}`, accountData);
      return response.data;
    } catch (error) {
      console.error("Error creating account payable:", error);
      throw error;
    }
  },

  // Update an existing account payable
  updatePayable: async (id, accountData) => {
    try {
      await axios.put(`${API_BASE_URL}/${id}`, accountData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating account payable:", error.response?.data || error);
      throw error;
    }
  },

  paynowPayable: async (id, paymentPayload) => {
    try {
      await axios.put(`${API_BASE_URL}/PayNow/${id}`, paymentPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });      
    } catch (error) {
      console.error("Error updating account payable:", error.response?.data || error);
      throw error;
    }
  },

  // Delete an account payable
  deletePayable: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error("Error deleting account payable:", error);
      throw error;
    }
  },
};

export const apiServices1 = {
  // Fetch all accounts receivable records
  getAllReceivables: async () => {
    try {
      const response = await axios.get(`${API_BASE_URLS}/AccountsReceivable`);
      return response.data;
    } catch (error) {
      console.error("Error fetching accounts receivable:", error);
      throw error;
    }
  },

  // Fetch a single account receivable by ID
  getReceivableById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URLS}/AccountsReceivable/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching account receivable:", error);
      throw error;
    }
  },

  // Create a new account receivable
  createReceivable: async (accountData) => {
    try {
      const response = await axios.post(`${API_BASE_URLS}/AccountsReceivable`, accountData);
      return response.data;
    } catch (error) {
      console.error("Error creating account receivable:", error);
      throw error;
    }
  },

  // Update an existing account receivable
  updateReceivable: async (id, accountData) => {
    try {
      await axios.put(`${API_BASE_URLS}/AccountsReceivable/${id}`, accountData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating account receivable:", error.response?.data || error);
      throw error;
    }
  },

  paynowReceivable: async (id, accountData) => {
    try {
      await axios.put(`${API_BASE_URLS}/AccountsReceivable/PayNow/${id}`, accountData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating account receivable:", error.response?.data || error);
      throw error;
    }
  },

  // Delete an account receivable
  deleteReceivable: async (id) => {
    try {
      await axios.delete(`${API_BASE_URLS}/AccountsReceivable/${id}`);
    } catch (error) {
      console.error("Error deleting account receivable:", error);
      throw error;
    }
  },
};

export const apiServices2 = {
  getAllPayments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URLS}/Payment`);
      return response.data;
    } catch (error) {
      console.error("Error fetching accounts Payment:", error);
      throw error;
    }
  },

  getPaymentById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URLS}/Payment/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching account Payment:", error);
      throw error;
    }
  },

  createPayment: async (accountData) => {
    try {
      const response = await axios.post(`${API_BASE_URLS}/Payment`, accountData);
      return response.data;
    } catch (error) {
      console.error("Error creating account Payment:", error);
      throw error;
    }
  },

  updatePayment: async (id, accountData) => {
    try {
      await axios.put(`${API_BASE_URLS}/Payment/${id}`, accountData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating account Payment:", error.response?.data || error);
      throw error;
    }
  },

  paynowPayment: async (id, accountData) => {
    try {
      await axios.put(`${API_BASE_URLS}/Payment/PayNow/${id}`, accountData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating account Payment:", error.response?.data || error);
      throw error;
    }
  },

  deletePayment: async (id) => {
    try {
      await axios.delete(`${API_BASE_URLS}/Payment/${id}`);
    } catch (error) {
      console.error("Error deleting account Payment:", error);
      throw error;
    }
  },
};
