import { Item } from "@/types/Item";
import { atom } from "recoil";

export const itemsState = atom<Item[]>({
  key: "itemsState",
  default: [],
});
