import React, { useEffect, useRef, useState } from "react";
import { drawBars } from "../../../../lib/Canvas";

import { AppBar, Box, Button, SelectChangeEvent, Toolbar } from "@mui/material";
import { LibraryMusic, VideoLibrary } from "@mui/icons-material";

const AppBarStyle = {
  top: "auto",
  bottom: 100,
  backgroundColor: "lightgreen",
  height: "100px",
  display: "grid",
  alignItems: "center",
};

const Visualizer = () => {
  const [mode, setMode] = useState(0);
  const [imageCtx, setImageCtx] = useState<HTMLImageElement>(null!);
  const [isStartSound, setIsPlaySound] = useState<boolean>(false);
  const [isPauseSound, setIsPauseSound] = useState<boolean>(false);
  const [playSoundDisabled, setPlaySoundDisabled] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext>(null!);
  const streamDestinationRef = useRef<MediaStreamAudioDestinationNode>(null!);
  const analyserRef = useRef<AnalyserNode>(null!);
  // Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const reqIdRef = useRef<number>(null!);

  useEffect(() => {
    // AudioContext
    audioCtxRef.current = new AudioContext();

    // AnalyserNode
    const analyserNode = audioCtxRef.current.createAnalyser();
    analyserNode.fftSize = 2048;
    analyserRef.current = analyserNode;
  }, []);

  const audioBufferSrcRef = useRef<AudioBufferSourceNode>(null!);
  const decodedAudioBufferRef = useRef<AudioBuffer>(null!);
  const setAudioBufferSourceNode = () => {
    // AudioBufferSourceNode作成
    const audioBufferSourceNode = audioCtxRef.current.createBufferSource();
    audioBufferSourceNode.buffer = decodedAudioBufferRef.current;
    audioBufferSourceNode.loop = false;
    // Node接続
    audioBufferSourceNode.connect(analyserRef.current);
    audioBufferSourceNode.connect(audioCtxRef.current.destination);
    streamDestinationRef.current != null &&
      audioBufferSourceNode.connect(streamDestinationRef.current);
    audioBufferSrcRef.current = audioBufferSourceNode;
  };

  const onChangeMode = (event: SelectChangeEvent<string>) => {
    setMode(Number(event.target.value));
  };

  // Canvas Animation
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    reqIdRef.current = requestAnimationFrame(function () {
      return drawBars(canvasRef.current, imageCtx, mode, analyserRef.current);
    });
    return () => cancelAnimationFrame(reqIdRef.current);
  }, [imageCtx, mode]);

  // AudioLoadEvent
  const audioLoad = async (event: { target: HTMLInputElement }) => {
    const audioFile = event.target.files![0];
    try {
      const arraybuffer = await audioFile.arrayBuffer();
      decodedAudioBufferRef.current = await audioCtxRef.current.decodeAudioData(
        arraybuffer
      );
      setPlaySoundDisabled(false);
    } catch (error) {
      // エラー
    }
  };

  // PlaySoundEvent
  const onPlaySound = () => {
    if (isStartSound) {
      audioBufferSrcRef.current.stop();
      audioBufferSrcRef.current.disconnect();
      cancelAnimationFrame(reqIdRef.current);
      setIsPlaySound(false);
      return;
    }
    setAudioBufferSourceNode();
    audioBufferSrcRef.current.start();
    setIsPlaySound(true);
  };

  return (
    <>
      <canvas
        width="1024"
        height="512"
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          backgroundColor: "black",
        }}
      ></canvas>

      <AppBar component={"footer"} position="sticky" sx={AppBarStyle}>
        <Toolbar sx={{ display: "flex" }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<LibraryMusic />}
          >
            音楽ファイルを選ぶ
            <input type="file" accept="audio/*" onChange={audioLoad} hidden />
          </Button>
          <Button
            variant="outlined"
            startIcon={<VideoLibrary />}
            disabled={playSoundDisabled}
            onClick={onPlaySound}
          >
            {isStartSound ? "停止" : "再生"}
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Visualizer;
