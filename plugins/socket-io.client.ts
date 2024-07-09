import { io, Socket } from "socket.io-client";
import { API_URL } from "~/configs/app";

export default defineNuxtPlugin((nuxtApp) => {
  const socket: Socket = io(API_URL, {
    transports: ['websocket'],
    reconnectionDelay: 1000,
  });

  nuxtApp.provide("socket", socket);
});
