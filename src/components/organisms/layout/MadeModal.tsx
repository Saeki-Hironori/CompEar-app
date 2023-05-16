import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { footerItem1State } from "@/components/atoms/recoil/footerItem1-state";
import { footerItem2State } from "@/components/atoms/recoil/footerItem2-state";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import useSelectItem from "@/hooks/useSelectItem";
import Graph from "@/components/molecules/Graph";
import { db } from "@/components/firebase/firebase";
import { Box, IconButton, Modal, Typography, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Item } from "@/types/Item";
import { modalStyle } from "@/styles/modalStyle";

type Props = {
  gain: number[] | undefined;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MadeModal = (props: Props) => {
  const { gain, open, setOpen } = props;

  const [footerItem1, setFooterItem1] = useRecoilState(footerItem1State);
  const [footerItem2, setFooterItem2] = useRecoilState(footerItem2State);
  const { selectedItem }: { selectedItem: Item | null } = useSelectItem();

  const itemsRef = collection(db, "items");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSetItem1Button = () => {
    setFooterItem1(selectedItem!);
  };
  const handleSetItem2Button = () => {
    setFooterItem2(selectedItem!);
  };

  const deleteItem = async () => {
    const q = query(itemsRef, where("id", "==", selectedItem?.id));
    const deleteData = await getDocs(q);
    deleteData.forEach((data) => {
      console.log(data.id);
      deleteDoc(doc(db, "items", data.id));
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {`${selectedItem?.id}. ${selectedItem?.maker}`}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          （ここに説明追加してもいいかも）
        </Typography>
        <Graph gain={gain} />
        <div style={{ display: "flex", marginTop: "20px" }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleSetItem1Button}
            sx={{ flex: "1", height: "40px", mr: "20px" }}
          >
            <p>Set Item1(Using)</p>
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleSetItem2Button}
            sx={{ flex: "1", height: "40px", mr: "20px" }}
          >
            <p>Set Item2(Target)</p>
          </Button>
          <Box sx={{ flex: "2" }}></Box>
          <IconButton sx={{ color: "red" }} onClick={() => deleteItem()}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </div>
      </Box>
    </Modal>
  );
};

export default MadeModal;
