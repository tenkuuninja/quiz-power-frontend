import axios from '~/configs/axios'

export class AuthApi {
  static login = async (payload: { username: string; password: string }) => {
    const response = await axios.post('/auth/login', payload)
    return response.data
  }
  static register = async (payload: {
    username: string
    password: string
    name: string
    email: string
  }) => {
    const response = await axios.post('/auth/register', payload)
    return response.data
  }
  static forgotPassword = async (payload: { email: string }) => {
    const response = await axios.post('/auth/forgot-password', payload)
    return response.data
  }
  static forgotPasswordVerify = async (payload: {
    otp: string
    password: string
    email: string
  }) => {
    const response = await axios.post('/auth/forgot-password-verify', payload)
    return response.data
  }
  static getProfile = async () => {
    const response = await axios.get('/auth/profile')
    return response.data
  }
  static updateProfile = async (payload: any) => {
    const response = await axios.patch('/auth/profile', payload)
    return response.data
  }
  static changePassword = async (payload: any) => {
    const response = await axios.post('/auth/change-password', payload)
    return response.data
  }
}
