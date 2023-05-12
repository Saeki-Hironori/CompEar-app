import React from "react";
import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "@/components/firebase/firebase";

const Header = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/Login");
      })
      .catch((error) => {});
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "green" }}>
      <Toolbar sx={{ display: "flex" }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <p style={{ flex: "1" }}>{user?.displayName || user?.email}</p>
        <p style={{ flex: "1" }}>（{user?.uid}）</p>
        <div style={{ flex: "5" }}></div>
        <Button variant="outlined" color="inherit" onClick={handleLogout}>
          <p>Logout</p>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
