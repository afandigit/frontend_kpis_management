import { Chart as ChartJS, ArcElement, Tooltip, Legend, Align } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Anchor } from "chartjs-plugin-datalabels/types/options";
ChartJS.register(ArcElement, Tooltip, Legend);

type Efficience_Data__Type = {
  date: string;
  value: string;
  project: string;
  responsible: string;
};

interface PieChartType {
  data: Efficience_Data__Type[];
  labels: string[];
  values: number[];
  //   selectedBranch: string;
  //   minDate: string;
  //   maxDate: string;
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
  // Fonction pour générer des couleurs aléatoires

  // Générer les couleurs pour chaque label
  const colors = props.labels.map(() => generateRandomColor());

  // Configuration des données pour le graphique
  const chartData = {
    labels: props.labels,
    datasets: [
      {
        label: "Responsible Activity: Production Hours",
        data: props.values.map((value: number) =>
          parseFloat(
            value.toString().slice(0, value.toString().indexOf(".") + 3)
          )
        ),
        backgroundColor: colors,
        hoverBorderColor: "gray",
        hoverBorderWidth: 2,
        hoverOffset: 3,
      },
    ],
  };

  const chartOptions = {
    // width: 400, // Largeur en pixels
    // height: 300, // Hauteur en pixels
    // Boolean - whether or not the chart should be responsive and resize when the browser does.
    responsive: true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: "black", // Couleur du texte des étiquettes de données
        font: {
          size: 13, // Taille du texte des étiquettes de données
          weight: 400,
        },
        anchor: "bottom" as Anchor, // Position des étiquettes de données par rapport aux points ('top', 'center', 'bottom')
        align: "top" as Align, // Alignement horizontal des étiquettes de données ('start', 'center', 'end')
        offset: 0, // Décalage vertical des étiquettes de données par rapport aux points
        clamp: true, // Pour empêcher les étiquettes de sortir du graphique
      },
    },
  };

  return <Pie data={chartData} options={chartOptions}></Pie>;
};

export default PieChart;
