import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { metadata_for_main_dashboard } from "./Data";
ChartJS.register(ArcElement, Tooltip, Legend);

type KPIData = {
  lable: string;
  value: number;
};

interface PieChartType {
  data: KPIData[];
  title: string;
  // labels: string[];
  // values: number[];
}

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const PieChart = (props: PieChartType) => {
  // Générer les couleurs pour chaque label
  const labels = props.data.map((item) => item.lable);
  const colors = labels.map(() => generateRandomColor());
  const values = props.data.map((item) => item.value);

  // Configuration des données pour le graphique
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: metadata_for_main_dashboard[props.title].header,
        data: values,
        backgroundColor: colors,
        hoverBorderColor: "gray",
        hoverBorderWidth: 2,
        hoverOffset: 3,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Pie data={chartData} options={chartOptions}></Pie>;
};

export default PieChart;
