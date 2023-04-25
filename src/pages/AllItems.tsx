import PrimaryButton from "@/components/atoms/button/PrimaryButton";
import { auth, db } from "@/components/firebase/firebase";
import Header from "@/components/organisms/layout/Header";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const freq = [
  20, 25, 32, 40, 50, 63, 79, 100, 126, 158, 200, 251, 316, 398, 501, 631, 794,
  1000, 1259, 1585, 1995, 2512, 3162, 3981, 5012, 6310, 7943, 10000, 12589,
  15849, 19953,
];
const originGain = [
  6.78528297, 6.36317576, 6.619082, 6.2277798, 5.58017256, 4.39759436,
  3.31225281, 3.35750401, 4.08871388, 3.27489612, 1.97762444, 0.41068456,
  -0.48917721, -0.51069791, 1.01681708, 2.11055156, 2.61937063, 0.35606997,
  -2.62518341, -4.44702821, -6.89707051, -7.09881315, 0.26507495, -0.09770863,
  -0.28147342, -1.27166011, -0.45185329, -3.55830526, 1.14649245, -5.91527689,
  -7.59936187,
];

const gain = originGain.map((value) => value + Math.random() * 4 - 2);
const roundGain = gain.map((num) => Math.round(num * 100) / 100);
const makers = [
  "SONY",
  "Apple",
  "AKG",
  "SENNHEISER",
  "BOSE",
  "audio-technica",
  "SHURE",
  "JBL",
  "final",
];

const AllItems = () => {
  const [currentUserUid, setCurrentUserUid] = useState("");
  const [id, setId] = useState(1);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setCurrentUserUid(currentUser.uid);
        // console.log(currentUser);
      } else {
        router.push("/Login");
      }
    });
  }, []);

  const addItem = async () => {
    const data = await getDocs(collection(db, "items"));
    console.log(
      data.docs.forEach((res) => {
        console.log({ res });
      })
    );
    addDoc(collection(db, "items"), {
      id: id,
      maker: makers[Math.floor(Math.random() * makers.length)],
      gain: roundGain,
      addedAt: serverTimestamp(),
    });
    setId(id + 1);
  };

  return (
    <>
      {currentUserUid ? (
        <>
          <Header />
          <div>
            <h1>製品一覧だよ</h1>
          </div>
          <PrimaryButton onClick={addItem}>製品追加ボタン</PrimaryButton>
        </>
      ) : (
        <>
          <h1>ログインしてね</h1>
        </>
      )}
    </>
  );
};

export default AllItems;
