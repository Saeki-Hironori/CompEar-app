import React from "react";
import { db } from "../../../../lib/firebase/firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { Button } from "@mui/material";
import { originGain, makers } from "../../../../lib/Constant";

const itemsRef = collection(db, "items");

const AddItem = () => {
  const addItem = async () => {
    const randomGain = originGain.map((value) => value + Math.random() * 4 - 2);
    const roundGain = randomGain.map((num) => Math.round(num * 100) / 100);
    // 追加日時が最も新しいデータを取得
    const q = query(itemsRef, orderBy("addedAt", "desc"), limit(1));
    const latestData = await getDocs(q);
    // データが無い場合はlatestDataが空になりforEach？が動かないので、latestData.docs.lengthが0かどうかで場合分け
    if (latestData.docs.length !== 0) {
      latestData.forEach((data) => {
        addDoc(itemsRef, {
          // 最新データのidに+1
          id: data.data().id + 1,
          maker: makers[Math.floor(Math.random() * makers.length)],
          gain: roundGain,
          addedAt: serverTimestamp(),
        }).then((e) => {
          console.log(`add docId => "${e.id}"`);
        });
      });
    } else {
      addDoc(itemsRef, {
        id: 1,
        maker: makers[Math.floor(Math.random() * makers.length)],
        gain: roundGain,
        addedAt: serverTimestamp(),
      }).then((e) => {
        console.log(`add docId => "${e.id}"`);
        console.log(e);
      });
    }
  };

  return (
    <Button
      variant="outlined"
      color="inherit"
      onClick={addItem}
      sx={{ color: "white", flex: "1" }}
    >
      製品追加
    </Button>
  );
};

export default AddItem;
