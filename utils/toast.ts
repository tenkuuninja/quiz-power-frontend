import { useToast } from "primevue/usetoast";

const toastService = () => {
  const toastPrimevue = useToast();
  return {
    success: (summary: string) =>
      toastPrimevue.add({
        life: 3000,
        severity: "success",
        summary: summary,
      }),
    error: (summary: string) =>
      toastPrimevue.add({
        life: 3000,
        severity: "error",
        summary: summary,
      }),
    info: (summary: string) =>
      toastPrimevue.add({
        life: 100,
        severity: "info",
        summary: summary,
      }),
    warn: (summary: string) =>
      toastPrimevue.add({
        life: 3000,
        severity: "warn",
        summary: summary,
      }),
  };
};

export const toast = toastService();
