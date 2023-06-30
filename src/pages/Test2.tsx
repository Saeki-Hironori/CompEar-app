import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { resultGainState } from "../../lib/recoil/resultGain_state";
import Link from "next/link";
import Footer from "@/components/organisms/layout/Footer";
import AudioBar2 from "@/components/organisms/layout/AudioBar2";

const Test2 = () => {
  const resultGain = useRecoilValue(resultGainState);

  useEffect(() => {
    console.log(resultGain);
  }, []);

  return (
    <>
      <div style={{ height: "calc(100vh - 200px)" }}>
        <div>
          <Link href="/AllItems">◀ 一覧ページへ</Link>
          <h1>テスト2ページ</h1>
        </div>
      </div>
      <AudioBar2 />
      <Footer />
    </>
  );
};

export default Test2;
