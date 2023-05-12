import React, { useCallback, useEffect, useState } from "react";
import PrimaryButton from "@/components/atoms/button/PrimaryButton";
import { auth, db } from "@/components/firebase/firebase";
import Header from "@/components/organisms/layout/Header";
import { Grid, Box, Modal, Typography } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import useAllItems from "../hooks/useAllItems";
import ItemCard from "@/components/organisms/item/ItemCard";
import useSelectItem from "@/hooks/useSelectItem";
import Graph from "@/components/molecules/Graph";
import { Item } from "@/types/Item";

const originGain = [
  6.78528297, 6.36317576, 6.619082, 6.2277798, 5.58017256, 4.39759436,
  3.31225281, 3.35750401, 4.08871388, 3.27489612, 1.97762444, 0.41068456,
  -0.48917721, -0.51069791, 1.01681708, 2.11055156, 2.61937063, 0.35606997,
  -2.62518341, -4.44702821, -6.89707051, -7.09881315, 0.26507495, -0.09770863,
  -0.28147342, -1.27166011, -0.45185329, -3.55830526, 1.14649245, -5.91527689,
  -7.59936187,
];

const randomGain = originGain.map((value) => value + Math.random() * 4 - 2);
const roundGain = randomGain.map((num) => Math.round(num * 100) / 100);
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  backgroundColor: "white",
  border: "2px solid rgb(0, 0, 0)",
  padding: "32px",
};

const AllItems = () => {
  const [currentUserUid, setCurrentUserUid] = useState("");
  const [selectId, setSelectId] = useState<number>();
  const [selectMaker, setSelectMaker] = useState("");
  const [open, setOpen] = useState(false);
  const {
    onSelectItem,
    selectedItem,
  }: { onSelectItem: any; selectedItem: Item | null } = useSelectItem();
  const { getItems, items, loading } = useAllItems();
  const router = useRouter();

  const itemsRef = collection(db, "items");

  useEffect(() => {
    getItems();
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
    const q = query(itemsRef, orderBy("addedAt", "desc"), limit(1));
    const data = await getDocs(q);
    data.forEach((doc) => {
      addDoc(itemsRef, {
        id: doc.data().id + 1,
        maker: makers[Math.floor(Math.random() * makers.length)],
        gain: roundGain,
        addedAt: serverTimestamp(),
      }).then((e) => {
        console.log(`add docId => "${e.id}"`);
      });
    });
    // ドキュメントが無いときに上では動作しないので、データ有無で場合分けしたい

    // await addDoc(itemsRef, {
    //   id: 1,
    //   maker: makers[Math.floor(Math.random() * makers.length)],
    //   gain: roundGain,
    //   addedAt: serverTimestamp(),
    // });
  };

  const addFirstItem = async () => {
    addDoc(itemsRef, {
      id: 1,
      maker: makers[Math.floor(Math.random() * makers.length)],
      gain: roundGain,
      addedAt: serverTimestamp(),
    }).then((e) => {
      console.log(`add docId => "${e.id}"`);
      getItems();
    });
  };

  const onClickItem = useCallback(
    (id: number, maker: string) => {
      onSelectItem({ id, items });
      setOpen(true);
      console.log(selectedItem);
    },
    [open, items, onSelectItem]
  );

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {currentUserUid ? (
        <>
          <Header />
          <div>
            <h1>製品一覧だよ</h1>
          </div>
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={3} key={item.id} sx={{ minWidth: "250px" }}>
                <ItemCard
                  imageUrl={`https://source.unsplash.com/random?${item.id}`}
                  id={item.id}
                  maker={item.maker}
                  addedAt={item.addedAt ? item.addedAt.toDate() : null}
                  onClick={onClickItem}
                />
              </Grid>
            ))}
          </Grid>

          <PrimaryButton onClick={() => addItem()}>
            製品追加ボタン
          </PrimaryButton>
          <br />
          <PrimaryButton onClick={() => addFirstItem()}>
            最初の一個追加ボタン
          </PrimaryButton>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {`${selectedItem?.id}. ${selectedItem?.maker}`}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                （ここに説明のデータ追加してもいいかも）
              </Typography>
              <Graph />
            </Box>
          </Modal>
        </>
      ) : (
        <>
          <h1>
            ユーザー情報読み込み中（ログインしてない場合はログイン画面に戻ってね）
          </h1>
        </>
      )}
    </>
  );
};

export default AllItems;
