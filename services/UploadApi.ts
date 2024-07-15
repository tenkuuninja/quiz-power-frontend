import axios from '~/configs/axios'

export class UploadApi {
  static uploadImage = async (payload: { file: File; path: string }) => {
    const formData = new FormData()
    formData.append('file', payload?.file)
    formData.append('path', payload?.path)
    const response = await axios.post('/upload/file', formData)
    return response.data
  }
}
