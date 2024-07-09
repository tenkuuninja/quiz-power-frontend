import axios from "~/configs/axios";

export class CategoryApi {
  static getListCategory = async (payload: any): Promise<{ data: any[] }> => {
    const response = await axios.get("/quiz/get-list-category", {
      params: payload,
    });
    return response.data;
  };
}
