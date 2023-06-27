import { Button, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { LibraryMusic } from "@mui/icons-material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

const AudioBar = () => {
  //再描画時もAudioContextは不変が好ましい => useRefで宣言
  const audioCtxRef = useRef<AudioContext>();
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode>();
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer>();
  const [audioCtx, setAudioCtx] = useState<AudioContext>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    audioCtxRef.current = new AudioContext();
    setAudioCtx(audioCtxRef.current);
  }, []);

  useEffect(() => {}, [sliderValue]);

  //   useEffect(() => {
  //     const audioContext = new AudioContext();
  //     const source = audioContext.createMediaElementSource(audioFile);

  //     const biquadFilter = audioContext.createBiquadFilter();
  //     biquadFilter.type = "lowpass";
  //     biquadFilter.frequency.value = 1000;

  //     source.connect(biquadFilter);
  //     biquadFilter.connect(audioContext.destination);

  //     return () => {
  //       audioContext.close();
  //     };
  //   }, []);

  const audioLoad = async (e: { target: HTMLInputElement }) => {
    const audioFile = e.target.files![0];
    console.log(audioFile);
    const _audioBuffer = await audioCtx?.decodeAudioData(
      await audioFile.arrayBuffer()
    );
    // ソースノード生成 ＋ 音声を設定
    setAudioBuffer(_audioBuffer);
  };

  const createNewNode = async () => {
    const sourceNode = await audioCtx!.createBufferSource();
    sourceNode.buffer = audioBuffer!;
    sourceNode?.connect(audioCtx!.destination);
    return sourceNode;
  };

  const handlePlayButtonClick = async () => {
    if (!audioCtx) {
      alert("audioCtxが作成されてません");
      return;
    }
    if (!audioBuffer) {
      alert("ファイル読み込んでください");
      return;
    }

    const sourceNode = await createNewNode();

    if (audioCtx.currentTime > 0) {
      audioCtx.resume();
      setIsPlaying(true);
      return;
    }

    // check if context is in suspended state (autoplay policy)
    sourceNode.start();
    setIsPlaying(true);
  };

  const handlePauseButtonClick = () => {
    audioCtx.suspend();
    console.log(audioCtx.currentTime);
    setIsPlaying(false);
  };

  const handleSkipForwardButtonClick = () => {};
  const handleSkipBackButtonClick = () => {};

  const handleSliderChange = (e: any) => {};

  return (
    <>
      <Button variant="outlined" component="label" startIcon={<LibraryMusic />}>
        音楽ファイルを選ぶ
        {/* acceptでaudioファイルのみ選択できるようにする */}
        <input type="file" accept="audio/*" onChange={audioLoad} hidden />
      </Button>
      <IconButton onClick={handleSkipBackButtonClick} size={"large"}>
        <KeyboardDoubleArrowLeftIcon />
      </IconButton>
      {isPlaying ? (
        <IconButton onClick={handlePauseButtonClick} size={"large"}>
          <PauseIcon />
        </IconButton>
      ) : (
        <IconButton onClick={handlePlayButtonClick} size={"large"}>
          <PlayArrowIcon />
        </IconButton>
      )}
      <IconButton onClick={handleSkipForwardButtonClick} size={"large"}>
        <KeyboardDoubleArrowRightIcon />
      </IconButton>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={sliderValue}
        onChange={handleSliderChange}
      />
    </>
  );
};

export default AudioBar;
