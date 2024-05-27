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

type SCRAPKPIData = {
  BU: string;
  Machine_Type: string;
  Serial_Number: string;
  Performance: number;
  Performance_losses: number;
  Batch_size: number;
  QuantityPerH: number;
  Quantity: number;
  Avg_lengthPerMm: number;
  ScrapPerM: number;
  Scrap: number;
  shift: number;
  Day: number;
  Month: number;
  Year: number;
  Date: string;
};
interface LineChartScrapTrendType {
  data: SCRAPKPIData[];
  selectedBranch: string;
  minDate: string;
  maxDate: string;
  minActualDate: string;
  maxActualDate: string;
  yMaxValue: number;
  currentIndexFilterDate: number;
  title: string | undefined;
}

const LineScarpChartOEETrendType = (props: LineChartScrapTrendType) => {
  let __datasets__: {
    label: string;
    data: number[];
    borderColor: string;
    borderWidth: number;
    pointBackgroundColor: (context: {
      dataIndex: number;
    }) => "black" | "yellow";
    fill: boolean;
  }[] = [];

  // Extraire les valeurs et les dates du KPI
  let values = props.data.map((item) => item.Scrap);
  let dates = props.data.map((item) => item.Date);
  if (values.length > props.currentIndexFilterDate) {
    values = values.slice(-props.currentIndexFilterDate);
    dates = dates.slice(-props.currentIndexFilterDate);
  }

  if (props.title?.includes("Trend")) {
    __datasets__ = [
      {
        label: "Scrap",
        data: values,
        borderColor: "black",
        borderWidth: 1,
        fill: false,
        pointBackgroundColor: (context: { dataIndex: number }) => {
          if (context.dataIndex >= values.length - 0) {
            return "yellow";
          }
          return "black";
        },
      },
    ];
  }
  const chartData = {
    labels: dates,
    datasets: __datasets__,
  };
  // Filtrer les données en fonction de la valeur maximale de l'axe y
  const filteredData = chartData.datasets.map((dataset) => ({
    ...dataset,
    data: dataset.data.map((value) =>
      value > props.yMaxValue ? props.yMaxValue : value
    ),
  }));

  const chartOptions = {
    scales: {
      x: {
        min: props.minActualDate,
        max: props.maxActualDate,
      },
      y: {
        display: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: props.selectedBranch,
      },
      datalabels: {
        color: "red", // Couleur du texte des étiquettes de données
        font: {
          size: 0, // Taille du texte des étiquettes de données
          weight: 0,
        },
        anchor: "bottom" as Anchor, // Position des étiquettes de données par rapport aux points ('top', 'center', 'bottom')
        align: "top" as Align, // Alignement horizontal des étiquettes de données ('start', 'center', 'end')
        offset: 0, // Décalage vertical des étiquettes de données par rapport aux points
        clamp: true, // Pour empêcher les étiquettes de sortir du graphique
      },
    },
  };
  if (props.yMaxValue === -1) {
    return <Line data={chartData} options={chartOptions} />;
  }

  return (
    <Line
      data={{ ...chartData, datasets: filteredData }}
      options={chartOptions}
    />
  );
};

export default LineScarpChartOEETrendType;
