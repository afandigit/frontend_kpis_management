import { Line } from "react-chartjs-2";
import {
  Chart as ChartJs,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Align,
} from "chart.js";
import { Anchor } from "chartjs-plugin-datalabels/types/options";

ChartJs.register(LineElement, CategoryScale, LinearScale, PointElement);

type KPIData = {
  date: string;
  value: number;
};

interface LineChartTrendType {
  kpi_name: string;
  data: KPIData[];
  minDate: string;
  maxDate: string;
}

const LineChartTrend = (props: LineChartTrendType) => {
  let values = props.data.map((item) => item.value);
  let dates = props.data.map((item) => item.date);
  // Configuration des données pour le graphique
  const chartData = {
    labels: [...dates], // Utiliser les dates comme labels
    datasets: [
      {
        label: `Average ${props.kpi_name}`,
        data: values,
        borderColor: "black",
        borderWidth: 0.8,
        fill: false,
        pointBackgroundColor: "black",
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        min: props.minDate,
        max: props.maxDate,
      },
      y: {
        display: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: `Average ${props.kpi_name} Trend For Last Week`,
      },
      datalabels: {
        color: "red", // Couleur du texte des étiquettes de données
        font: {
          size: 12, // Taille du texte des étiquettes de données
          weight: 1000,
        },
        anchor: "bottom" as Anchor, // Position des étiquettes de données par rapport aux points ('top', 'center', 'bottom')
        align: "top" as Align, // Alignement horizontal des étiquettes de données ('start', 'center', 'end')
        offset: 10, // Décalage vertical des étiquettes de données par rapport aux points
        clamp: true, // Pour empêcher les étiquettes de sortir du graphique
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default LineChartTrend;
