import {
  Chart as ChartJs,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Align,
} from "chart.js";
import { Anchor } from "chartjs-plugin-datalabels/types/options";
import { Line } from "react-chartjs-2";

ChartJs.register(LineElement, CategoryScale, LinearScale, PointElement);

type Efficience_Data__Type = {
  date: string;
  value: string;
  project: string;
  responsible: string;
};

type predicted_data_type = {
  date: string;
  value: string;
};

interface LineChartTrendType {
  data: Efficience_Data__Type[];
  selectedBranch: string;
  minDate: string;
  maxDate: string;
  minActualDate: string;
  maxActualDate: string;
  yMaxValue: number;
  currentIndexFilterDate: number;
  predictedEfficienceData: predicted_data_type;
}

const LineChartTrend = (props: LineChartTrendType) => {
  let values: number[] = props.data
    .map((item: Efficience_Data__Type) => parseFloat(item.value))
    .filter((value: number) => !isNaN(value));

  if (props.selectedBranch !== "Absence Trend") {
    // values = values.map((value) => value * 100);
    values = values.map((value: number) =>
      parseFloat(value.toString().slice(0, value.toString().indexOf(".") + 3))
    );
  }
  let dates = props.data.map((item) => item.date);

  if (values.length > props.currentIndexFilterDate) {
    values = values.slice(-props.currentIndexFilterDate);
    dates = dates.slice(-props.currentIndexFilterDate);
  }

  let datasets__value = [
    {
      label: `${props.selectedBranch.replace("Trend", "")}Origine`,
      data: values,
      borderColor: "black",
      borderWidth: 0.8,
      fill: false,
      pointBackgroundColor: (context: { dataIndex: number }) => {
        // Définir la couleur des points pour les valeurs de prédiction
        if (context.dataIndex >= values.length - 2) {
          return "yellow";
        }
        return "black";
      },
    },
  ];

  if (typeof props.predictedEfficienceData?.value === "string") {
    console.log("yeeah itss string ");
    console.log(dates.length);
    console.log(values.length);
    values.push(Number(props.predictedEfficienceData?.value));
    dates.push(props.predictedEfficienceData?.date);
    console.log(dates.length);
    console.log(values.length);
  } else {
    console.log("Opppps it ss not a string ");
  }

  if (props.selectedBranch == "E1 Trend") {
    datasets__value = [
      {
        label: `${props.selectedBranch.replace("Trend", "")}Origine`,
        data: values,
        borderColor: "black",
        borderWidth: 0.8,
        fill: false,
        pointBackgroundColor: (context: { dataIndex: number }) => {
          // Définir la couleur des points pour les valeurs de prédiction
          if (context.dataIndex >= values.length - 2) {
            return "yellow";
          }
          return "black";
        },
      },
    ];
  }
  // Configuration des données pour le graphique
  const chartData = {
    labels: [...dates], // Utiliser les dates comme labels
    datasets: datasets__value,
  };

  // Filtrer les données en fonction de la valeur maximale de l'axe y
  const filteredData = chartData.datasets.map((dataset) => ({
    ...dataset,
    data: dataset.data.map((value) =>
      value > props.yMaxValue ? props.yMaxValue : value
    ),
  }));

  let chartOptions = {};
  if (
    props.minActualDate !== dates[0] ||
    props.maxActualDate != dates.slice(-1)[0]
  ) {
    chartOptions = {
      scales: {
        x: {
          min: props.minActualDate,
          max: props.maxActualDate,
        },
        y: {
          display: true, // Afficher les étiquettes des valeurs Y
          // Autres options de configuration des valeurs Y
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
  } else {
    chartOptions = {
      scales: {
        x: {
          min: dates[0],
          max: dates.slice(-1)[0],
        },
        y: {
          display: true, // Afficher les étiquettes des valeurs Y
          // Autres options de configuration des valeurs Y
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
            size: 10, // Taille du texte des étiquettes de données
            weight: 500,
          },
          anchor: "bottom" as Anchor, // Position des étiquettes de données par rapport aux points ('top', 'center', 'bottom')
          align: "top" as Align, // Alignement horizontal des étiquettes de données ('start', 'center', 'end')
          offset: 15, // Décalage vertical des étiquettes de données par rapport aux points
          clamp: true, // Pour empêcher les étiquettes de sortir du graphique
        },
      },
    };
  }

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

export default LineChartTrend;
