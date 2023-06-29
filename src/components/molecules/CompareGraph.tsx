import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { resultGainState } from "../../../lib/recoil/resultGain_state";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { FREQ } from "../../../lib/Constant";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController
);

type Props = {
  compareGain: number[];
  item1Gain: number[];
  item2Gain: number[];
};

const CompareGraph = (props: Props) => {
  const { compareGain, item1Gain, item2Gain } = props;

  const options: ChartOptions<"bar" | "line"> = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "周波数特性",
      },
    },
    scales: {
      x: {
        type: "logarithmic",
        min: 10,
        max: 30000,
        grid: {
          display: true,
        },
      },
      y: {
        max: 15,
        min: -15,
      },
    },
  };

  const labels = FREQ;
  const graphData: ChartData<"bar" | "line"> = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: "Item1",
        data: item1Gain!,
        borderColor: "rgb(0, 250, 0)",
        backgroundColor: "rgba(0, 200, 0, 0.5)",
      },
      {
        type: "line" as const,
        label: "Item2",
        data: item2Gain!,
        borderColor: "rgb(250,0,0)",
        backgroundColor: "rgba(200, 0, 0, 0.5)",
      },
      {
        type: "bar" as const,
        label: "差分",
        data: compareGain!,
        borderColor: "rgb(0, 0, 250)",
        backgroundColor: "rgba(0, 0, 200, 0.5)",
      },
    ],
  };

  return (
    <>
      <div style={{ width: "full" }}>
        <Chart type="bar" data={graphData} options={options} />
      </div>
    </>
  );
};

export default CompareGraph;
