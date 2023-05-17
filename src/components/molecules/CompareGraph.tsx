import React from "react";
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

const freq = [
  20, 25, 32, 40, 50, 63, 79, 100, 126, 158, 200, 251, 316, 398, 501, 631, 794,
  1000, 1259, 1585, 1995, 2512, 3162, 3981, 5012, 6310, 7943, 10000, 12589,
  15849, 19953,
];

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

  const labels = freq;
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
        <Chart data={graphData} options={options} />
      </div>
    </>
  );
};

export default CompareGraph;
