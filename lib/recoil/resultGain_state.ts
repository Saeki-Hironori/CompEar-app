import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "resultGainState-persist",
  storage: typeof window === "undefined" ? undefined : window.sessionStorage,
});

export const resultGainState = atom<number[]>({
  key: "resultGainState",
  default: Array(31).fill(0),
  effects_UNSTABLE: [persistAtom],
});
