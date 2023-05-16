import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import useAllItems from "@/hooks/useAllItems";
import useSelectItem from "@/hooks/useSelectItem";
import { itemsState } from "@/components/atoms/recoil/items-state";
import { allItemsState } from "@/components/atoms/recoil/allItems-state";
import { Box, Grid, IconButton, Modal, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { auth, db } from "@/components/firebase/firebase";
import Header from "@/components/organisms/layout/Header";
import ItemCard from "@/components/organisms/item/ItemCard";
import Graph from "@/components/molecules/Graph";
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  backgroundColor: "white",
  border: "2px solid rgb(0, 0, 0)",
  padding: "32px",
  textAlign: "center",
};

const AllItems = () => {
  const [items, setItems] = useRecoilState<Item[]>(itemsState);
  const [allItems, setAllItems] = useRecoilState<Item[]>(allItemsState);
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
    setItems(allItems);
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setCurrentUserUid(currentUser.uid);
      } else {
        router.push("/Login");
      }
    });
  }, []);

  const deleteItem = async () => {
    const q = query(itemsRef, where("id", "==", selectedItem?.id));
    const deleteData = await getDocs(q);
    deleteData.forEach((data) => {
      console.log(data.id);
      deleteDoc(doc(db, "items", data.id));
    });
  };

  const onClickItem = useCallback(
    (id: number) => {
      onSelectItem({ id, items });
      setOpen(true);
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
              <Graph gain={selectedItem?.gain} />
              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <IconButton sx={{ color: "red" }} onClick={() => deleteItem()}>
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </div>
            </Box>
          </Modal>
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
