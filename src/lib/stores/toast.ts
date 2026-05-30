import { writable } from "svelte/store";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

export const toast = writable<ToastState | null>(null);

export function showToast(message: string, type: ToastState["type"] = "info") {
  toast.set({ message, type });
  setTimeout(() => toast.set(null), 3500);
}
