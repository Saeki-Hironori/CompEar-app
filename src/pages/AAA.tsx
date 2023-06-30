import React, { useEffect, useState } from "react";

const BiquadFilterTest = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);
  const [noiseBuffer, setNoiseBuffer] = useState<AudioBuffer | null>(null);
  const [musicBuffer, setMusicBuffer] = useState<any>(null);
  const [filter, setFilter] = useState<BiquadFilterNode | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [analyseData, setAnalyseData] = useState(new Float32Array(1024));

  useEffect(() => {
    const setup = async () => {
      const audioCtx = new AudioContext();
      setAudioContext(audioCtx);

      const noiseBuff = audioCtx.createBuffer(
        1,
        audioCtx.sampleRate,
        audioCtx.sampleRate
      );
      const noiseBuffData = noiseBuff.getChannelData(0);
      for (let i = 0; i < audioCtx.sampleRate; ++i) {
        noiseBuffData[i] = (Math.random() - 0.5) * 0.5;
      }
      setNoiseBuffer(noiseBuff);

      const biquadFilter = audioCtx.createBiquadFilter();
      biquadFilter.frequency.value = 5000;
      biquadFilter.Q.value = 5;
      setFilter(biquadFilter);

      const analyserNode = audioCtx.createAnalyser();
      analyserNode.smoothingTimeConstant = 0.7;
      analyserNode.fftSize = 1024;
      setAnalyser(analyserNode);

      biquadFilter.connect(analyserNode).connect(audioCtx.destination);
    };

    setup();
  }, []);

  const playNoise = () => {
    if (audioContext?.state === "suspended") {
      audioContext?.resume();
    }
    if (source) {
      source.stop();
    }
    const audioSource = audioContext!.createBufferSource();
    audioSource.buffer = noiseBuffer;
    audioSource.loop = true;
    audioSource.connect(filter!);
    audioSource.start();
    setSource(audioSource);
  };

  const stop = () => {
    if (source) {
      source.stop();
      setSource(null);
    }
  };

  const handleChangeType = (event: any) => {
    const selectedType = event.target.value;
    filter!.type = selectedType;
    setFilter({ ...filter });
  };

  const handleChangeFrequency = (event: any) => {
    const frequency = event.target.value;
    filter!.frequency.value = frequency;
    setFilter({ ...filter });
  };

  const handleChangeQ = (event: any) => {
    const q = event.target.value;
    filter!.Q.value = q;
    setFilter({ ...filter });
  };

  const handleChangeGain = (event: any) => {
    const gain = event.target.value;
    filter!.gain.value = gain;
    setFilter({ ...filter });
  };

  const drawGraph = () => {
    analyser?.getFloatFrequencyData(analyseData);
    const canvas = document.getElementById("cvs");
    const ctx = canvas!.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = "#009900";
    for (let i = 0; i < 512; ++i) {
      const f = (audioContext!.sampleRate * i) / 1024;
      const y = 128 + (analyseData[i] + 48.16) * 2.56;
      ctx.fillRect(i, 256 - y, 1, y);
    }
    ctx.fillStyle = "#ff8844";
    for (let d = -50; d < 50; d += 10) {
      const y = (128 - (d * 256) / 100) | 0;
      ctx.fillRect(20, y, 512, 1);
      ctx.fillText(d + "dB", 5, y);
    }
    ctx.fillRect(20, 128, 512, 1);
    for (let f = 2000; f < audioContext!.sampleRate / 2; f += 2000) {
      const x = ((f * 1024) / audioContext!.sampleRate) | 0;
      ctx.fillRect(x, 0, 1, 245);
      ctx.fillText(f + "Hz", x - 10, 255);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      drawGraph();
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>BiquadFilter Test</h1>
      <div>
        <table>
          <tr>
            <thead>
              <th>Type</th>
            </thead>
            <tbody>
              <td>
                <select id="type" onChange={handleChangeType}>
                  <option>lowpass</option>
                  <option>highpass</option>
                  <option>bandpass</option>
                  <option>lowshelf</option>
                  <option>highshelf</option>
                  <option>peaking</option>
                  <option>notch</option>
                  <option>allpass</option>
                </select>
              </td>
            </tbody>
          </tr>
          <tr>
            <thead>
              <th>Freq</th>
            </thead>
            <tbody>
              <td>
                <input
                  type="range"
                  id="freq"
                  min="100"
                  max="20000"
                  value={filter ? filter.frequency.value : ""}
                  onChange={handleChangeFrequency}
                />
              </td>
              <td id="freqval">{filter ? filter.frequency.value : ""}</td>
            </tbody>
          </tr>
          <tr>
            <thead>
              <th>Q</th>
            </thead>
            <tbody>
              <td>
                <input
                  type="range"
                  id="q"
                  min="0"
                  max="50"
                  step="0.1"
                  value={filter ? filter.Q.value : ""}
                  onChange={handleChangeQ}
                />
              </td>
              <td id="qval">{filter ? filter.Q.value : ""}</td>
            </tbody>
          </tr>
          <tr>
            <thead>
              <th>Gain</th>
            </thead>
            <tbody>
              <td>
                <input
                  type="range"
                  id="gain"
                  min="-50"
                  max="50"
                  value={filter ? filter.gain.value : ""}
                  onChange={handleChangeGain}
                />
              </td>
              <td id="gainval">{filter ? filter.gain.value : ""}</td>
            </tbody>
          </tr>
        </table>
        <button onClick={playNoise}>Play Noise</button>
        <button onClick={stop}>Stop</button>
      </div>
      <br />
      <canvas id="cvs" width={512} height={256}></canvas>
    </div>
  );
};
export default BiquadFilterTest;
