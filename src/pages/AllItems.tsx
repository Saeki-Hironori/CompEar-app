import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import useAllItems from "@/hooks/useAllItems";
import useSelectItem from "@/hooks/useSelectItem";
import { itemsState } from "@/components/atoms/recoil/items-state";
import { Grid } from "@mui/material";
import { auth, db } from "@/components/firebase/firebase";
import Header from "@/components/organisms/layout/Header";
import ItemCard from "@/components/organisms/item/ItemCard";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { Item } from "@/types/Item";
import Footer from "@/components/organisms/layout/Footer";
import MadeModal from "@/components/organisms/layout/MadeModal";
import { footerItem1State } from "@/components/atoms/recoil/footerItem1-state";
import { footerItem2State } from "@/components/atoms/recoil/footerItem2-state";

const AllItems = () => {
  const [items, setItems] = useRecoilState<Item[]>(itemsState);
  const [footerItem1, setFooterItem1] = useRecoilState(footerItem1State);
  const [footerItem2, setFooterItem2] = useRecoilState(footerItem2State);
  const [currentUserUid, setCurrentUserUid] = useState("");
  const [open, setOpen] = useState(false);
  const {
    onSelectItem,
    selectedItem,
  }: { onSelectItem: any; selectedItem: Item | null } = useSelectItem();
  const { getAllItems, loading, setLoading } = useAllItems();
  const router = useRouter();

  const itemsRef = collection(db, "items");

  useEffect(() => {
    getAllItems();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setCurrentUserUid(currentUser.uid);
      } else {
        router.push("/Login");
      }
    });
  }, []);

  const onClickItem = useCallback(
    (id: number) => {
      onSelectItem({ id, items });
      setOpen(true);
    },
    [open, items, onSelectItem]
  );

  return (
    <>
      {currentUserUid ? (
        <>
          <Header />
          <Grid
            container
            spacing={2}
            mt={0}
            mb={3}
            alignItems="center"
            justifyContent="center"
          >
            {items.map((item) => (
              <Grid item xs={2} key={item.id} sx={{ minWidth: "250px" }}>
                <ItemCard
                  imageUrl={`https://source.unsplash.com/random?${item.maker}`}
                  id={item.id}
                  maker={item.maker}
                  addedAt={item.addedAt ? item.addedAt.toDate() : null}
                  onClick={onClickItem}
                />
              </Grid>
            ))}
          </Grid>
          <MadeModal
            gain={selectedItem?.gain}
            open={open}
            setOpen={setOpen}
            footerItem={selectedItem}
          />
          <Footer />
        </>
      ) : (
        <>
          <h3>
            ユーザー情報読み込み中（ログインしてない場合はログイン画面に戻ってね）
          </h3>
        </>
      )}
    </>
  );
};

export default AllItems;
