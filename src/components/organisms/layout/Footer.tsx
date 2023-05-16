import React, { useState } from "react";
import { db } from "@/components/firebase/firebase";
import { useRecoilState } from "recoil";
import { allItemsState } from "@/components/atoms/recoil/allItems-state";
import { footerItem1State } from "@/components/atoms/recoil/footerItem1-state";
import { footerItem2State } from "@/components/atoms/recoil/footerItem2-state";
import {
  AppBar,
  Button,
  Toolbar,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import StartIcon from "@mui/icons-material/Start";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { Item } from "@/types/Item";
import useSelectItem from "@/hooks/useSelectItem";

const originGain = [
  6.78528297, 6.36317576, 6.619082, 6.2277798, 5.58017256, 4.39759436,
  3.31225281, 3.35750401, 4.08871388, 3.27489612, 1.97762444, 0.41068456,
  -0.48917721, -0.51069791, 1.01681708, 2.11055156, 2.61937063, 0.35606997,
  -2.62518341, -4.44702821, -6.89707051, -7.09881315, 0.26507495, -0.09770863,
  -0.28147342, -1.27166011, -0.45185329, -3.55830526, 1.14649245, -5.91527689,
  -7.59936187,
];
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

const Footer = () => {
  const [allItems, setAllItems] = useRecoilState<Item[]>(allItemsState);
  const [footerItem1, setFooterItem1] = useRecoilState(footerItem1State);
  const [footerItem2, setFooterItem2] = useRecoilState(footerItem2State);
  const { selectedItem }: { selectedItem: Item | null } = useSelectItem();

  const [item1, setItem1] = useState<any>(0);
  const [item2, setItem2] = useState<number>(0);

  const itemsRef = collection(db, "items");
  const defaultValue = { id: 0, maker: "NONE", gain: [0] };

  const addItem = async () => {
    const randomGain = originGain.map((value) => value + Math.random() * 4 - 2);
    const roundGain = randomGain.map((num) => Math.round(num * 100) / 100);
    // 追加日時が最も新しいデータを取得
    const q = query(itemsRef, orderBy("addedAt", "desc"), limit(1));
    const latestData = await getDocs(q);
    // データが無い場合はlatestDataが空になりforEach？が動かないので、latestData.docs.lengthが0かどうかで場合分け
    if (latestData.docs.length !== 0) {
      latestData.forEach((data) => {
        addDoc(itemsRef, {
          // 最新データのidに+1
          id: data.data().id + 1,
          maker: makers[Math.floor(Math.random() * makers.length)],
          gain: roundGain,
          addedAt: serverTimestamp(),
        }).then((e) => {
          console.log(`add docId => "${e.id}"`);
        });
      });
    } else {
      addDoc(itemsRef, {
        id: 1,
        maker: makers[Math.floor(Math.random() * makers.length)],
        gain: roundGain,
        addedAt: serverTimestamp(),
      }).then((e) => {
        console.log(`add docId => "${e.id}"`);
        console.log(e);
      });
    }
  };

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
    const result: number[] = [];
    for (let i = 0; i < footerItem1.gain.length; i++) {
      result.push(footerItem2.gain[i] - footerItem1.gain[i]);
    }
    const compareGain = result.map((num) => {
      return Math.round(num * 100) / 100;
    });
    console.log(compareGain);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        top: "auto",
        bottom: 0,
        backgroundColor: "green",
        height: "100px",
        display: "grid",
        alignItems: "center",
      }}
    >
      <Toolbar sx={{ display: "flex" }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={addItem}
          sx={{ color: "white", flex: "1" }}
        >
          製品追加
        </Button>
        <Box sx={{ flex: "1" }}></Box>
        <Box sx={{ minWidth: 200, flex: "1" }}>
          <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: "bold" }}>Item1(Using)</InputLabel>
            <Select
              value={footerItem1?.id}
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
                  onClick={() => {
                    setFooterItem1(item);
                  }}
                >{`${item.id}. ${item.maker}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <IconButton onClick={handleClickStart} size={"large"}>
          <StartIcon sx={{ fontSize: "48px" }} />
        </IconButton>
        <Box sx={{ minWidth: 200, flex: "1" }}>
          <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: "bold" }}>Item2(Target)</InputLabel>
            <Select
              value={footerItem2?.id}
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
  );
};

export default Footer;
