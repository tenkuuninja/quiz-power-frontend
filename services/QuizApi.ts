import axios from "~/configs/axios";

export class QuizApi {
  static getListQuiz = async (payload: any) => {
    const response = await axios.get("/quiz/get-list-quiz", {
      params: payload,
    });
    return response.data;
  };

  static getDetailQuiz = async (payload: any) => {
    const response = await axios.get("/quiz/get-detail-quiz", {
      params: payload,
    });
    return response.data;
  };

  static createQuiz = async (payload: any) => {
    const response = await axios.post("/quiz/create-quiz", payload);
    return response.data;
  };

  static updateQuiz = async (payload: any) => {
    const response = await axios.patch("/quiz/update-quiz", payload);
    return response.data;
  };

  static deleteQuiz = async (payload: any) => {
    const response = await axios.delete("/quiz/delete-quiz", {
      params: payload,
    });
    return response.data;
  };

  static suggestionQuestion = async (payload: any) => {
    const response = await axios.post("/quiz/suggestion-question", payload);
    return response.data;
  };

  static suggestionAnswer = async (payload: any) => {
    const response = await axios.post("/quiz/suggestion-answer", payload);
    return response.data;
  };
}
