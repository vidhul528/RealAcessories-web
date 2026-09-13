import { api } from '../ApiConfig';

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  mobileNumber?: string;
  mobileCode?: string;
  password?: string;
}

export interface VerifyOtpPayload {
  email?: string;
  otp: string;
}

export interface ForgetPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  [key: string]: any;
}

export interface AddressPayload {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
  [key: string]: any;
}

// User API Module using Axios
export const userAPI = {
  // Authentication Routes
  login: async (credentials: LoginPayload) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return { success: true, data: response.data, message: response.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed', error };
    }
  },

  register: async (userData: RegisterPayload) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data, message: response.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed', error };
    }
  },

  verifyOtp: async (payload: VerifyOtpPayload) => {
    try {
      const response = await api.post('/auth/verify-otp', payload);
      return { success: true, data: response.data, message: response.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'OTP verification failed', error };
    }
  },

  forgetPassword: async (payload: ForgetPasswordPayload) => {
    try {
      const response = await api.post('/auth/forget-password', payload);
      return { success: true, data: response.data, message: response.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Password reset request failed', error };
    }
  },

  verifyResetOtp: async (payload: VerifyResetOtpPayload) => {
    try {
      const response = await api.post('/auth/verify-reset-otp', payload);
      return { success: true, data: response.data, message: response.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Reset OTP verification failed', error };
    }
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    try {
      const response = await api.post('/auth/reset-password', payload);
      return { success: true, data: response.data, message: response.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Password update failed', error };
    }
  },

  // Authenticated Profile Routes
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to load profile', error };
    }
  },

  updateProfile: async (data: UpdateProfilePayload) => {
    try {
      const response = await api.put('/auth/update-profile', data);
      return { success: true, data: response.data, message: response.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to update profile', error };
    }
  },

  // Authenticated Address Routes
  addAddress: async (addressData: AddressPayload) => {
    try {
      const response = await api.post('/auth/add-address', addressData);
      return { success: true, data: response.data, message: response.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to add address', error };
    }
  },

  editAddress: async (addressId: string, addressData: AddressPayload) => {
    try {
      const response = await api.put(`/auth/edit-address/${addressId}`, addressData);
      return { success: true, data: response.data, message: response.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to update address', error };
    }
  },

  deleteAddress: async (addressId: string) => {
    try {
      const response = await api.delete(`/auth/delete-address/${addressId}`);
      return { success: true, data: response.data, message: response.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to delete address', error };
    }
  },
};

export default userAPI;
