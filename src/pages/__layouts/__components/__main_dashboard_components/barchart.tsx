import {
  Chart as ChartJs,
  BarElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDatalabels from "chartjs-plugin-datalabels";
import { metadata_for_main_dashboard } from "./Data";

ChartJs.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDatalabels
);

type singleDataType = {
  label: string;
  value: number;
};

// type secondDataType = {
//   FirstData: singleDataType[];
//   SecondData: singleDataType[];
// };

interface BarChartType {
  title: string;
  data:
    | {
        FirstData: singleDataType[];
        SecondData: number[];
      }
    | singleDataType[];
}

const BarChart = (props: BarChartType) => {
  const data = props.data;

  let __dataset = [];

  let labels: string[] = [];
  let values: number[] = [];

  // Check the type of props.data
  if (Array.isArray(data)) {
    // It's an array of singleDataType
    labels = data.map((item) => item.label);
    values = data.map((item) => item.value);

    // Add the Downtime dataset to __dataset
    __dataset.push({
      label: props.title,
      data: values,
      backgroundColor: "#a0d3f7",
      borderColor: "black",
      borderWidth: 1,
    });
  } else {
    // It's an object with properties FirstData and SecondData
    labels = data.FirstData.map((item) => item.label);
    values = data.FirstData.map((item) => item.value);

    // Handle SecondData
    const oeeValues = data.SecondData.map((item) => item);
    // Add the Downtime dataset to __dataset
    __dataset.push({
      label: props.title + " Of last week",
      data: values,
      backgroundColor: "#5465ff",
      borderColor: "black",
      borderWidth: 1,
    });
    // Add the OEE dataset to __dataset
    __dataset.push({
      label: props.title + " Of week before last week",
      data: oeeValues,
      backgroundColor: "#bfd7ff",
      borderColor: "black",
      borderWidth: 1,
    });
  }

  return (
    <Bar
      data={{
        labels: labels,
        datasets: __dataset,
      }}
      options={{
        indexAxis: "y", // <-- here
        // responsive: true,
        scales: {
          x: {
            min: 0,
          },
          y: {
            ticks: {
              autoSkip: false,
            },
          },
        },
        plugins: {
          datalabels: {
            color: "black", // Couleur du texte des étiquettes de données
            font: {
              size: 12, // Taille du texte des étiquettes de données
            },
            anchor: "end", // Position des étiquettes de données par rapport aux barres ('start', 'center', 'end')
            align: "end", // Alignement horizontal des étiquettes de données ('start', 'center', 'end')
          },
        },
      }}
      plugins={[ChartDatalabels]}
    />
  );
};

export default BarChart;
