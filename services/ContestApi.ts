import axios from "~/configs/axios";

export class ContestApi {
  static getListContest = async (payload: any) => {
    const response = await axios.get("/contest/get-list-contest", {
      params: payload,
    });
    return response.data;
  };

  static getDetailContest = async (payload: any) => {
    const response = await axios.get("/contest/get-detail-contest", {
      params: payload,
    });
    return response.data;
  };

  static createContest = async (payload: any) => {
    const response = await axios.post("/contest/create-contest", payload);
    return response.data;
  };

  static findContest = async (payload: any) => {
    const response = await axios.post("/contest/find-contest", payload);
    return response.data;
  };

  static startContest = async (payload: any) => {
    const response = await axios.post("/contest/start-contest", payload);
    return response.data;
  };

  static endContest = async (payload: any) => {
    const response = await axios.post("/contest/end-contest", payload);
    return response.data;
  };

  static joinContest = async (payload: any) => {
    const response = await axios.post("/contest/join-contest", payload);
    return response.data;
  };

  static submitAnswer = async (payload: any) => {
    const response = await axios.post("/contest/submit-answer", payload);
    return response.data;
  };
}
