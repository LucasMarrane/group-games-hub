import { SessionStore } from "@/utils/entities/session";
import { useStore } from "zustand";

export function useSessionStore() {
    return useStore(SessionStore);
}
