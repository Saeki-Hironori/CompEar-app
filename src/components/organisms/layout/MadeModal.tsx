import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { footerItem1State } from "../../../../lib/recoil/footerItem1_state";
import { footerItem2State } from "../../../../lib/recoil/footerItem2_state";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Graph from "@/components/molecules/Graph";
import { db } from "../../../../lib/firebase/firebase";
import { Box, IconButton, Modal, Typography, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Item } from "@/types/Item";

type Props = {
  gain: number[] | undefined;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  footerItem: Item | null;
};

const modalStyle = {
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

const MadeModal = (props: Props) => {
  const { gain, open, setOpen, footerItem } = props;

  const [footerItem1, setFooterItem1] = useRecoilState(footerItem1State);
  const [footerItem2, setFooterItem2] = useRecoilState(footerItem2State);

  const itemsRef = collection(db, "items");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSetItem1Button = () => {
    console.log("↓ Set to footerItem1 ↓");
    console.log(footerItem);
    setFooterItem1(footerItem!);
  };
  const handleSetItem2Button = () => {
    console.log("↓ Set to footerItem2 ↓");
    console.log(footerItem);
    setFooterItem2(footerItem!);
  };

  const deleteItem = async () => {
    const q = query(itemsRef, where("id", "==", footerItem?.id));
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
          {`${footerItem?.id}. ${footerItem?.maker}`}
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
