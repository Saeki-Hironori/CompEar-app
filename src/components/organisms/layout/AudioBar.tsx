import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useDropzone } from "react-dropzone";
import { Button, IconButton } from "@mui/material";
import { LibraryMusic } from "@mui/icons-material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { FREQ } from "../../../../lib/Constant";
import { resultGainState } from "../../../../lib/recoil/resultGain_state";

const AudioBar = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const resultGain = useRecoilValue(resultGainState);

  //再描画時もAudioContextは不変が好ましい => useRefで宣言
  const audioCtxRef = useRef<AudioContext>();
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode>();
  const [gainNode, setGainNode] = useState<GainNode>();
  const [biquadFilterNode, setBiquadFilterNode] = useState<BiquadFilterNode[]>(
    []
  );
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer>();
  const [audioCtx, setAudioCtx] = useState<AudioContext>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [peaking, setPeaking] = useState(1000);

  useEffect(() => {
    audioCtxRef.current = new AudioContext();
    setAudioCtx(audioCtxRef.current);
    setGainNode(audioCtxRef.current.createGain());
    for (let i = 0; i < FREQ.length; i++) {
      setBiquadFilterNode((node: BiquadFilterNode[]) => [
        ...node,
        audioCtxRef.current!.createBiquadFilter(),
      ]);
    }
  }, []);

  const audioLoad = async (e: { target: HTMLInputElement }) => {
    const audioFile = e.target.files![0];
    console.log(audioFile);
    const _audioBuffer = await audioCtx?.decodeAudioData(
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
    sourceNode.connect(gainNode!);
    gainNode!.connect(biquadFilterNode[0]!);
    for (let i = 0; i < FREQ.length - 1; i++) {
      biquadFilterNode[i]!.type = "peaking";
      biquadFilterNode[i]!.gain.value = resultGain[i];
      biquadFilterNode[i].connect(biquadFilterNode[i + 1]);
    }
    biquadFilterNode[FREQ.length - 1].type = "peaking";
    biquadFilterNode[FREQ.length - 1].gain.value =
      resultGain[resultGain.length - 1];
    biquadFilterNode[FREQ.length - 1].connect(audioCtx.destination);

    console.log(biquadFilterNode);

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
    audioCtx!.suspend();
    console.log(audioCtx!.currentTime);
    setIsPlaying(false);
  };

  const handleSkipForwardButtonClick = () => {
    console.log(biquadFilterNode);
  };
  const handleSkipBackButtonClick = () => {
    console.log(resultGain);
  };

  const handleVolumeChange = (e: any) => {
    setVolume(e.target.value);
    gainNode!.gain.value = e.target.value;
  };

  const handlePeakingChange = (e: any) => {
    setPeaking(e.target.value);
    biquadFilterNode[0]!.frequency.value = e.target.value;
  };

  return (
    <>
      <div>
        <Button
          variant="outlined"
          component="label"
          startIcon={<LibraryMusic />}
        >
          音楽ファイルを選ぶ
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
        <span>Volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
        />
        <span>{Math.round(volume * 100)} / 100</span>
      </div>
      <div>
        <span>Filter</span>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={peaking}
          onChange={handlePeakingChange}
        />
        <span>{Math.round(peaking)}</span>
      </div>
    </>
  );
};

export default AudioBar;
