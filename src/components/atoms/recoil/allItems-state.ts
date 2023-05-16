import { Item } from "@/types/Item";
import { atom } from "recoil";

export const allItemsState = atom<Item[]>({
  key: "allItemsState",
  default: [],
});
