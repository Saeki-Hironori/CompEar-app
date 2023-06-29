import React, { useEffect } from "react";
import AudioBar from "@/components/organisms/layout/AudioBar";
import { useRecoilValue } from "recoil";
import { resultGainState } from "../../lib/recoil/resultGain_state";
import { Button } from "@mui/material";
import Link from "next/link";

const Test = () => {
  const resultGain = useRecoilValue(resultGainState);

  useEffect(() => {
    console.log(resultGain);
  }, []);

  return (
    <div>
      <Link href="/AllItems">◀ 一覧ページへ</Link>
      <h1>テストページ</h1>
      <AudioBar />
    </div>
  );
};

export default Test;
