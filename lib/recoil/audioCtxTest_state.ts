import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "audioCtxTestState-persist",
  storage: typeof window === "undefined" ? undefined : window.sessionStorage,
});

type EmptyObj = {};

export const audioCtxTestState = atom<AudioContext | EmptyObj>({
  key: "audioCtxTestState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});
