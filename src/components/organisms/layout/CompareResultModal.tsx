import React from "react";
import { useRecoilState } from "recoil";
import { footerItem1State } from "../../../../lib/recoil/footerItem1_state";
import { footerItem2State } from "../../../../lib/recoil/footerItem2_state";
import CompareGraph from "@/components/molecules/CompareGraph";
import { Box, Modal, Typography } from "@mui/material";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

const CompareResultModal = (props: Props) => {
  const { open, setOpen } = props;

  const [footerItem1, setFooterItem1] = useRecoilState(footerItem1State);
  const [footerItem2, setFooterItem2] = useRecoilState(footerItem2State);

  const result: number[] = [];
  for (let i = 0; i < footerItem1.gain.length; i++) {
    result.push(footerItem2.gain[i] - footerItem1.gain[i]);
  }
  const calculationGain = result.map((num) => {
    return Math.round(num * 100) / 100;
  });

  const handleClose = () => {
    setOpen(false);
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
          {`${footerItem1.id}. ${footerItem1.maker} ⇒ ${footerItem2.id}. ${footerItem2.maker}`}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Item1 に 差分データ を加えると Item2 の特性になります。
        </Typography>
        <CompareGraph
          compareGain={calculationGain}
          item1Gain={footerItem1.gain}
          item2Gain={footerItem2.gain}
        />
      </Box>
    </Modal>
  );
};

export default CompareResultModal;
