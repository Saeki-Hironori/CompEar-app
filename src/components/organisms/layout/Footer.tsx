import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { allItemsState } from "@/components/atoms/recoil/allItems-state";
import { footerItem1State } from "@/components/atoms/recoil/footerItem1-state";
import { footerItem2State } from "@/components/atoms/recoil/footerItem2-state";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import StartIcon from "@mui/icons-material/Start";
import { Item } from "@/types/Item";
import AddItem from "@/components/atoms/button/AddItem";
import CompareResultModal from "./CompareResultModal";

const noDataGain = Array<number>(31).fill(0);
const defaultValue = { id: 0, maker: "NONE", gain: noDataGain };
const AppBarStyle = {
  top: "auto",
  bottom: 0,
  backgroundColor: "green",
  height: "100px",
  display: "grid",
  alignItems: "center",
};

const Footer = () => {
  const [allItems, setAllItems] = useRecoilState<Item[]>(allItemsState);
  const [footerItem1, setFooterItem1] = useRecoilState(footerItem1State);
  const [footerItem2, setFooterItem2] = useRecoilState(footerItem2State);

  const [open, setOpen] = useState(false);

  const handleItem1Change = (e: any) => {
    if (e.target.value === 0) {
      setFooterItem1(defaultValue);
    }
  };

  const handleItem2Change = (e: any) => {
    if (e.target.value === 0) {
      setFooterItem2(defaultValue);
    }
  };

  const handleClickStart = () => {
    setOpen(true);
  };

  return (
    <>
      <AppBar position="sticky" sx={AppBarStyle}>
        <Toolbar sx={{ display: "flex" }}>
          <AddItem />
          <Box sx={{ flex: "1" }}></Box>
          <Box sx={{ minWidth: 200, flex: "1", mr: "20px" }}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: "bold" }}>Item1(Using)</InputLabel>
              <Select
                value={footerItem1 ? footerItem1.id : 0}
                label="Item1"
                onChange={handleItem1Change}
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {allItems.map((item) => (
                  <MenuItem
                    value={item.id}
                    key={item.id}
                    onClick={() => setFooterItem1(item)}
                  >{`${item.id}. ${item.maker}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <IconButton onClick={handleClickStart} size={"large"}>
            <StartIcon sx={{ fontSize: "48px" }} />
          </IconButton>
          <Box sx={{ minWidth: 200, flex: "1", ml: "20px" }}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: "bold" }}>Item2(Target)</InputLabel>
              <Select
                value={footerItem2 ? footerItem2.id : 0}
                label="Item2"
                onChange={handleItem2Change}
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {allItems.map((item) => (
                  <MenuItem
                    value={item.id}
                    key={item.id}
                    onClick={() => setFooterItem2(item)}
                  >{`${item.id}. ${item.maker}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: "2" }}></Box>
        </Toolbar>
      </AppBar>
      <CompareResultModal open={open} setOpen={setOpen} />
    </>
  );
};

export default Footer;
