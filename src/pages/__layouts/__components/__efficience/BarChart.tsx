import {
  Chart as ChartJs,
  BarElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  Tooltip,
  Legend,
  Align,
} from "chart.js";
import { Anchor } from "chartjs-plugin-datalabels/types/options";
import { Bar } from "react-chartjs-2";

ChartJs.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Efficience_Data__Type = {
  date: string;
  value: string;
  project: string;
  responsible: string;
};

interface BarChartType {
  data: Efficience_Data__Type[];
  labels: string[];
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getMonthFromDate(dateString: string) {
  const date = new Date(dateString);
  const monthIndex = date.getMonth();
  return monthNames[monthIndex];
}

function getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const BarChart = (props: BarChartType) => {
  const responsiblesPredefinis = props.labels;
  const datasetByresponsible: { label: string; data: number[] }[] = [];
  // pour chaque responsible je devrais créer un liste qui contient le nom du mois et une liste des effectifs des opérateurs pour
  //  chaque responsable

  monthNames.forEach((month) => {
    const workersByresponsible = props.data.reduce(
      (acc: { [responsible: string]: { workersNumber: number } }, item) => {
        let { value, date, responsible } = item;
        if (value === "") value = "0.0";
        const workersNumber = Number.parseFloat(value);
        if (month === getMonthFromDate(date)) {
          if (!acc[responsible]) {
            acc[responsible] = { workersNumber: workersNumber };
          } else {
            acc[responsible].workersNumber += workersNumber;
          }
        }
        return acc;
      },
      {}
    );

    // 1. Créer un objet vide pour la sortie standardisée
    const sortieStandardisee: Record<string, { workersNumber: number }> = {};
    // 2. Parcourir la liste des responsibles pré-définis
    responsiblesPredefinis.forEach((responsible) => {
      // 3. Vérifier si le responsible existe dans la sortie actuelle
      if (workersByresponsible.hasOwnProperty(responsible)) {
        sortieStandardisee[responsible] = workersByresponsible[responsible];
      } else {
        sortieStandardisee[responsible] = { workersNumber: 0 };
      }
    });
    // 4. Trier la sortie selon l'ordre des responsibles pré-définis
    const sortieTriee: Record<string, { workersNumber: number }> = {};
    responsiblesPredefinis.forEach((responsible) => {
      if (sortieStandardisee.hasOwnProperty(responsible)) {
        sortieTriee[responsible] = sortieStandardisee[responsible];
      }
    });
    // Récupérer les valeurs de sortieTriee sous forme de liste de nombres
    const listeOfNumberOfWorkers: number[] = Object.values(sortieTriee).map(
      (item) => item.workersNumber
    );

    const dataset = {
      label: month,
      data: listeOfNumberOfWorkers,
      backgroundColor: getRandomColor(),
    };

    datasetByresponsible.push(dataset);
  });

  const chartData = {
    labels: props.labels,
    datasets: datasetByresponsible,
  };
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Affiche des nombres entiers sur l'axe Y
        },
      },
    },
    responsive: true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: "black", // Couleur du texte des étiquettes de données
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

  return <Bar data={chartData} options={chartOptions}></Bar>;
};

export default BarChart;
