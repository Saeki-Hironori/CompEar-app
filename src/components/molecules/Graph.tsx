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
import { FREQ } from "../../../lib/Constant";

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

type Props = {
  gain: number[] | undefined;
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

  const labels = FREQ;
  const graphData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "データ",
        data: gain!,
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
