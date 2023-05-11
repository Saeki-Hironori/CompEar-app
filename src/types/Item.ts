import { Timestamp } from "firebase/firestore";

export type Item = {
  id: number;
  maker: string;
  gain: Array<number>;
  addedAt: Timestamp;
};
