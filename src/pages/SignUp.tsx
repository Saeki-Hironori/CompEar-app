import React, { useEffect, useState } from "react";
import {
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithRedirect,
} from "firebase/auth";
import { auth, provider } from "@/components/firebase/firebase";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import Fingerprint from "@mui/icons-material/Fingerprint";
import GoogleIcon from "@mui/icons-material/Google";
import InputEmail from "@/components/atoms/button/InputEmail";
import InputPassword from "@/components/atoms/button/InputPassword";
import Link from "next/link";
import { useRouter } from "next/router";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser.uid);
        router.push("/AllItems");
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        const user = userCredential.user;
        console.log(user.uid);
        // router.push("/Todos");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/network-request-failed":
            setError(
              "通信がエラーになったのか、またはタイムアウトになりました。"
            );
            break;
          case "auth/weak-password":
            setError("パスワードが短すぎます。6文字以上を入力してください。");
            break;
          case "auth/invalid-email":
            setError("メールアドレスが正しくありません");
            break;
          case "auth/email-already-in-use":
            setError(
              "アカウントは既に作成されています。ログインするか別のメールアドレスで作成してください"
            );
            break;
          default: //想定外
            setError("アカウントの作成に失敗しました");
        }
      });
  };

  const GoogleSignUp = () => {
    signInWithRedirect(auth, provider);
  };

  return (
    <>
      {isLoading ? (
        <h1
          style={{
            fontSize: "18px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          読み込み中だよ
          <br />
          （ログアウトしないと登録画面は表示できないよ）
        </h1>
      ) : (
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
          <Avatar sx={{ m: "auto", bgcolor: "green" }}></Avatar>
          <Typography
            component="h1"
            variant="h5"
            textAlign={"center"}
            color={"green"}
          >
            Sign up
          </Typography>
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
              endIcon={<Fingerprint />}
            >
              新規登録
            </Button>
          </form>
          <Button
            onClick={GoogleSignUp}
            fullWidth
            variant="outlined"
            color="success"
            sx={{ mb: "30px" }}
            endIcon={<GoogleIcon />}
          >
            Googleアカウントで登録
          </Button>
          <div style={{ textAlign: "right" }}>
            すでに登録している人は
            <Link
              href="/Login"
              style={{ color: "green", textDecoration: "underline" }}
            >
              ログイン
            </Link>
          </div>
        </Container>
      )}
    </>
  );
};

export default SignUp;
