import React, { useState } from "react";
import { db } from "@/components/firebase/firebase";
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
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

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

const Footer = () => {
  const [age, setAge] = useState("");
  const itemsRef = collection(db, "items");

  const addItem = async () => {
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
      });
    }
  };

  const handleChange = (event: any) => {
    setAge(event.target.value as string);
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
          onClick={() => addItem()}
          sx={{ color: "white", flex: "1" }}
        >
          製品追加
        </Button>
        <Box sx={{ flex: "1" }}></Box>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: "bold" }}>Item1</InputLabel>
            <Select value={age} label="Item1" onChange={handleChange}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ fontSize: "48px", color: "black", m: "0 20px" }}>-</Box>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: "bold" }}>Item2</InputLabel>
            <Select value={age} label="Item2" onChange={handleChange}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: "2" }}></Box>
        <Box>
          <IconButton>
            <PlayArrowIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
