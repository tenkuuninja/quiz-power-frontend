import { defineStore } from "pinia";

export const useContestStore = defineStore("contest", {
  state: () => ({
    playerIdByContestId: {} as Record<string, string>,
    contestById: {} as Record<string, string>,
  }),
  actions: {
    setPlayerIdByContestId(contestId: string, playerId: string) {
      this.playerIdByContestId[contestId] = playerId;
    },
    setContest(contest: any) {
      if (contest?.id) {
        this.contestById[contest?.id] = contest;
      }
    },
  },
  getters: {
    getPlayerId: (state: any) => (contestId: string) =>
      state.playerIdByContestId[contestId],
    getContest: (state: any) => (contestId: string) =>
      state.contestById[contestId],
  },
  persist: {
    key: "quiz-power-contest",
    // storage: localStorage,
    paths: ["playerIdByContestId"],
  },
});
