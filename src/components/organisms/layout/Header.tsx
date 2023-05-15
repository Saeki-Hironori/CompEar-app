import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { itemsState } from "@/components/atoms/recoil/items-state";
import { signOut } from "firebase/auth";
import { auth } from "@/components/firebase/firebase";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  FormControl,
  IconButton,
  TextField,
  Toolbar,
} from "@mui/material";
import useAllItems from "@/hooks/useAllItems";
import { Item } from "@/types/Item";

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

const Header = () => {
  const [items, setItems] = useRecoilState<Array<Item>>(itemsState);

  const router = useRouter();
  const user = auth.currentUser;
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const { getItems } = useAllItems();

  useEffect(() => {
    getItems();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/Login");
      })
      .catch((error) => {});
  };

  const searchMaker = (str: string) => {
    console.log(items);
    const searchedItems = items.filter((item) => {
      return item.maker === str;
    });
    console.log(searchedItems);
    setItems(searchedItems);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (value) {
      console.log(`Valueは"${value}"`);
      searchMaker(value);
      setValue(null);
    } else {
      console.log(`inputValueは${inputValue}`);
      searchMaker(inputValue);
      setInputValue("");
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "green" }}>
      <Toolbar sx={{ display: "flex" }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ flex: "0.2", mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <p style={{ flex: "1" }}>{user?.displayName || user?.email}</p>
        <FormControl>
          <Autocomplete
            value={value}
            onChange={(event: any, newValue) => {
              setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onKeyDown={handleInputKeyDown}
            options={makers}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Maker" />}
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
