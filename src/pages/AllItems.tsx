import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { itemsState } from "../../lib/recoil/items_state";
import { useRouter } from "next/router";
import useAllItems from "@/hooks/useAllItems";
import useSelectItem from "@/hooks/useSelectItem";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase/firebase";
import ItemCard from "@/components/organisms/item/ItemCard";
import Header from "@/components/organisms/layout/Header";
import Footer from "@/components/organisms/layout/Footer";
import MadeModal from "@/components/organisms/layout/MadeModal";
import { Grid } from "@mui/material";
import { Item } from "@/types/Item";

const AllItems = () => {
  const [items, setItems] = useRecoilState<Item[]>(itemsState);
  const [currentUserUid, setCurrentUserUid] = useState("");
  const [open, setOpen] = useState(false);
  const {
    onSelectItem,
    selectedItem,
  }: { onSelectItem: any; selectedItem: Item | null } = useSelectItem();
  const { getAllItems, loading, setLoading } = useAllItems();
  const router = useRouter();

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
