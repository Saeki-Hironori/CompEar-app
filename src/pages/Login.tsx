import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import {
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { useRouter } from "next/router";
import InputEmail from "@/components/atoms/button/InputEmail";
import InputPassword from "@/components/atoms/button/InputPassword";
import { auth, provider } from "@/components/firebase/firebase";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser);
        router.push("/AllProduct");
      }
    });
  }, []);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        console.log("Email:", email);
        console.log("Password:", password);
        console.log(userCredential.user.uid);
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/user-not-found":
            setError("アカウントが存在しません");
            break;
          case "auth/wrong-password":
            setError("パスワードが間違っています");
            break;
          case "auth/too-many-requests":
            setError("何度もパスワードを間違えています");
            break;
        }
      });
  };

  const GoogleLogin = () => {
    signInWithRedirect(auth, provider);
  };

  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          mt: "10vh",
          p: "30px",
          border: 2,
          borderColor: "green",
          borderRadius: "50px",
        }}
      >
        <CssBaseline />
        <div>
          <Avatar sx={{ m: "auto", bgcolor: "green" }}></Avatar>
          <Typography
            component="h1"
            variant="h5"
            textAlign={"center"}
            color={"green"}
          >
            Login
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <InputEmail value={email} onChange={handleChangeEmail} />
          <InputPassword value={password} onChange={handleChangePassword} />
          <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="success"
            sx={{ mb: "30px" }}
            endIcon={<ArrowForwardIcon />}
          >
            ログイン
          </Button>
        </form>
        <Button
          onClick={GoogleLogin}
          fullWidth
          variant="outlined"
          color="success"
          sx={{ mb: "30px" }}
          endIcon={<GoogleIcon />}
        >
          Googleアカウントでログイン
        </Button>
        <div style={{ textAlign: "right" }}>
          新規登録は
          <Link
            href="/"
            style={{ color: "green", textDecoration: "underline" }}
          >
            こちら
          </Link>
        </div>
      </Container>
    </>
  );
};

export default Login;
