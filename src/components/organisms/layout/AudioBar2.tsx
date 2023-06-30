import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useDropzone } from "react-dropzone";
import { AppBar, Button, IconButton, Toolbar } from "@mui/material";
import { LibraryMusic, VideoLibrary } from "@mui/icons-material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { FREQ, Q_list } from "../../../../lib/Constant";
import { resultGainState } from "../../../../lib/recoil/resultGain_state";
import { audioCtxTestState } from "../../../../lib/recoil/audioCtxTest_state";

const AppBarStyle = {
  top: "auto",
  bottom: 100,
  backgroundColor: "lightgreen",
  height: "100px",
  display: "grid",
  alignItems: "center",
};

type EmptyObj = {};

const AudioBar2 = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const resultGain = useRecoilValue(resultGainState);
  const [audioCtxTest, setAudioCtxTest] = useRecoilState(audioCtxTestState);

  //再描画時もAudioContextは不変が好ましい => useRefで宣言
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(
    null
  );
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const [biquadFilterNode, setBiquadFilterNode] = useState<BiquadFilterNode[]>(
    []
  );
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [peaking, setPeaking] = useState(1000);

  useEffect(() => {
    if (Object.keys(audioCtxTest).length === 0) {
      audioCtxRef.current = new AudioContext();
      setAudioCtxTest(audioCtxRef.current);
      setAudioCtx(audioCtxRef.current);
      setGainNode(audioCtxRef.current.createGain());
      for (let i = 0; i < FREQ.length; i++) {
        setBiquadFilterNode((node) => [
          ...node,
          audioCtxRef.current!.createBiquadFilter(),
        ]);
      }
    }
  }, []);

  const audioLoad = async (e: { target: HTMLInputElement }) => {
    const audioFile = e.target.files![0];
    console.log(audioFile);
    const _audioBuffer = await audioCtxRef.current!.decodeAudioData(
      await audioFile.arrayBuffer()
    );
    // ソースノード生成 ＋ 音声を設定
    setAudioBuffer(_audioBuffer);
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

    const sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.loop = true;
    sourceNode.connect(gainNode!);
    gainNode?.connect(biquadFilterNode[0]);

    for (let i = 0; i < FREQ.length; i++) {
      biquadFilterNode[i].type = "peaking";
      biquadFilterNode[i].frequency.value = FREQ[i];
      biquadFilterNode[i].gain.value = resultGain[i];
      biquadFilterNode[i].Q.value = Q_list[i];
      if (i === FREQ.length - 1) {
        biquadFilterNode[i].connect(audioCtx.destination);
      } else {
        biquadFilterNode[i].connect(biquadFilterNode[i + 1]);
      }
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
      setIsPlaying(true);
      return;
    }

    // check if context is in suspended state (autoplay policy)
    sourceNode.start();
    setIsPlaying(true);
  };

  const handlePauseButtonClick = () => {
    audioCtx?.suspend();
    console.log(audioCtx!.currentTime);
    setIsPlaying(false);
  };

  const handleSkipForwardButtonClick = () => {
    console.log(audioCtxTest);
    console.log(typeof audioCtxTest);
  };
  const handleSkipBackButtonClick = () => {
    audioCtx?.close();
    console.log(audioCtx);
  };

  const handleVolumeChange = (e: any) => {
    setVolume(e.target.value);
    gainNode!.gain.value = e.target.value;
  };

  return (
    <>
      <AppBar component={"footer"} position="sticky" sx={AppBarStyle}>
        <Toolbar sx={{ display: "flex" }}>
          <div>
            <Button
              variant="outlined"
              component="label"
              startIcon={<LibraryMusic />}
            >
              Audio File
              {/* acceptでaudioファイルのみ選択できるようにする */}
              <input type="file" accept="audio/*" onChange={audioLoad} hidden />
            </Button>
          </div>

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
          <div>
            <p>Volume {Math.round(volume * 100)} / 100</p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default AudioBar2;
