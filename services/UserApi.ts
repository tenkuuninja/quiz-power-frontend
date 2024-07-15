import axios from '~/configs/axios'

export class UserApi {
  static getListUser = async (payload: any) => {
    const response = await axios.get('/user/get-list-user', {
      params: payload,
    })
    return response.data
  }

  static deleteUser = async (payload: any) => {
    const response = await axios.delete('/user/delete-user', {
      params: payload,
    })
    return response.data
  }
}
