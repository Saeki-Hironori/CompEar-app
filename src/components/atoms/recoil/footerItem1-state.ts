import { Item } from "@/types/Item";
import { atom } from "recoil";

export const footerItem1State = atom<Item>({
  key: "footerItem1State",
  default: { id: 0, maker: "NONE", gain: [0] },
});
