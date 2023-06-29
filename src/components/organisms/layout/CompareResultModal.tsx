import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { footerItem1State } from "../../../../lib/recoil/footerItem1_state";
import { footerItem2State } from "../../../../lib/recoil/footerItem2_state";
import { resultGainState } from "../../../../lib/recoil/resultGain_state";
import CompareGraph from "@/components/molecules/CompareGraph";
import { Box, Button, Modal, Typography } from "@mui/material";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  calculationGain: number[];
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
  const { open, setOpen, calculationGain } = props;

  const footerItem1 = useRecoilValue(footerItem1State);
  const footerItem2 = useRecoilValue(footerItem2State);
  const [resultGain, setResultGain] = useRecoilState(resultGainState);

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
