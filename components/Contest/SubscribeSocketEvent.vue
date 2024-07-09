<script setup lang="ts">
import type { Socket } from "socket.io-client";
import { useContestStore } from "~/stores";

const { $socket } = useNuxtApp();
const route = useRoute();
const contestStore = useContestStore();


onMounted(() => {
  const socket = $socket as Socket;
  const contestId = route?.params?.id;
  
  socket.on("update-contest", (message: any) => {
    console.log('update contest', message)
    contestStore.setContest(message)
  });

  socket.emit("subscribe-contest", { contestId });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
  });
});
</script>

<template>
  <slot />
</template>
