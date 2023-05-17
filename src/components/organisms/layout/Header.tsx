import React, { useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { itemsState } from "@/components/atoms/recoil/items-state";
import { signOut } from "firebase/auth";
import { auth } from "@/components/firebase/firebase";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  FormControl,
  TextField,
  Toolbar,
} from "@mui/material";
import { Item } from "@/types/Item";
import { allItemsState } from "@/components/atoms/recoil/allItems-state";
import MenuBar from "@/components/atoms/button/MenuBar";

const makers = [
  "---All---",
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

const Header = () => {
  const [items, setItems] = useRecoilState<Array<Item>>(itemsState);
  const [allItems, setAllItems] = useRecoilState<Item[]>(allItemsState);

  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/Login");
      })
      .catch((error) => {});
  };

  const searchMaker = async (str: string) => {
    if (str === "" || str === "---All---") {
      setItems(allItems);
    } else {
      const searchedItems = allItems.filter((item) => {
        return item.maker === str;
      });
      // console.log(searchedItems);
      setItems(searchedItems);
    }
  };

  const handleOnChange = (newValue: string | null) => {
    console.log(newValue);
    if (newValue !== null) {
      searchMaker(newValue);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (value) {
      // console.log(`Valueは${value}`);
      searchMaker(value);
    } else {
      // console.log(`inputValueは${inputValue}`);
      searchMaker(inputValue);
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "green" }}>
      <Toolbar sx={{ display: "flex" }}>
        <MenuBar />
        <p style={{ flex: "1.15" }}>{user?.displayName || user?.email}</p>
        <FormControl>
          <Autocomplete
            value={value}
            onChange={(event: any, newValue) => {
              setValue(newValue);
              handleOnChange(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onKeyDown={handleInputKeyDown}
            options={makers}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Sort" />}
          />
        </FormControl>
        <Box sx={{ flex: "1" }}></Box>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleLogout}
          sx={{ flex: "0.2", height: "40px" }}
        >
          <p>Logout</p>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
