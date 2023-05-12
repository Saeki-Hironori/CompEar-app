import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  ChartOptions,
  ChartData,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend
);

const freq = [
  20, 25, 32, 40, 50, 63, 79, 100, 126, 158, 200, 251, 316, 398, 501, 631, 794,
  1000, 1259, 1585, 1995, 2512, 3162, 3981, 5012, 6310, 7943, 10000, 12589,
  15849, 19953,
];

type Props = {
  gain: number[];
};

const Graph = (props: Props) => {
  const { gain } = props;

  const options: ChartOptions<"line"> = {
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
  const graphData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "データ",
        data: gain,
        borderColor: "rgb(0, 250, 0)",
        backgroundColor: "rgba(0, 200, 0, 0.5)",
      },
    ],
  };

  return (
    <>
      <div style={{ width: "full" }}>
        <Line data={graphData} options={options} />
      </div>
    </>
  );
};

export default Graph;
