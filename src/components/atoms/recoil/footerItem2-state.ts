import { Item } from "@/types/Item";
import { atom } from "recoil";

export const footerItem2State = atom<Item>({
  key: "footerItem2State",
  default: { id: 0, maker: "NONE", gain: [0] },
});
