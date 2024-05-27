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

type OEEKPIData = {
  BU: string;
  Machine_Type: string;
  Serial_Number: string;
  Unused_Machines_J1: number;
  Unused_Machines_UNP: number;
  Unused_Machines_PL: number;
  OEE: number;
  OEE_J1: number;
  OEE_J1_H1_G_G6: number;
  Availability: number;
  Performance: number;
  Planned_Downtime: number;
  Unplanned_Downtime: number;
  Performance_losses: number;
  Batch_size: number;
  SetuptimePerMin: number;
  WaitingtimePerMin: number;
  QuantityPerH: number;
  Quantity: number;
  Avg_lengthPerMm: number;
  ShiftTimePerH: number;
  Netto_StandardTimePerH: number;
  DowntimePerH: number;
  Dw_J1: number;
  Planned_DowntimePerH: number;
  Unplanned_DowntimePerH: number;
  Urgent_Orders_A16: number;
  Disciplinary_responsible_vs_Shifthours: number;
  Not_disciplinary_responsible_vs_Shifthours: number;
  No_Orders: number;
  ScrapPerM: number;
  Scrap: number;
  Avg_No_Machines: number;
  Somme_de_Dw_B: number;
  shift: number;
  Day: number;
  Month: number;
  Year: number;
  Date: string;
};

interface LineChartOEETrendType {
  data: OEEKPIData[];
  selectedBranch: string;
  minDate: string;
  maxDate: string;
  title: string | undefined;
}

const OEELineChartTrend = (props: LineChartOEETrendType) => {
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
  let values = props.data.map((item) => item.OEE);
  values = values.map((value: number) =>
    parseFloat(value.toString().slice(0, value.toString().indexOf(".") + 3))
  );
  let dates = props.data.map((item) => item.Date);

  if (values.length > 80) {
    values = values.slice(-80);
    dates = dates.slice(-80);
  }

  if (props.title == "OEE Trend") {
    __datasets__ = [
      {
        label: "OEE",
        data: values, // Utiliser les valeurs de la KPI
        borderColor: "black",
        borderWidth: 1,
        fill: false,
        pointBackgroundColor: (context: { dataIndex: number }) => {
          // Définir la couleur des points pour les 20 dernières valeurs de prédiction
          if (context.dataIndex >= values.length - 10) {
            // return colors[context.dataIndex - (values.length - 10)];
            return "black";
          }
          return "black";
        },
      },
    ];
  } else if (props.title == "OEE Vs Setup time Trend") {
    __datasets__ = [
      {
        label: "OEE",
        data: props.data.map((item) => item.OEE), // Utiliser les valeurs de la KPI
        borderColor: "black",
        borderWidth: 1,
        fill: false,
        pointBackgroundColor: (context: { dataIndex: number }) => {
          // Définir la couleur des points pour les 20 dernières valeurs de prédiction
          if (context.dataIndex >= values.length - 20) {
            // return colors[context.dataIndex - (values.length - 10)];
            return "black";
          }
          return "black";
        },
      },
      {
        label: "Setup time",
        data: props.data.map((item) => item.SetuptimePerMin).slice(0, -20), // Utiliser les valeurs de la KPI
        borderColor: "red",
        borderWidth: 1,
        fill: false,
        pointBackgroundColor: (context: { dataIndex: number }) => {
          // Définir la couleur des points pour les 20 dernières valeurs de prédiction
          if (context.dataIndex >= values.length - 0) {
            // return colors[context.dataIndex - (values.length - 10)];
            return "black";
          }
          return "black";
        },
      },
    ];
  } else if (props.title == "OEE Vs Scrap Trend") {
    __datasets__ = [
      {
        label: "OEE",
        data: props.data.map((item) =>
          parseFloat(
            item.OEE.toString().slice(0, item.OEE.toString().indexOf(".") + 3)
          )
        ), // Utiliser les valeurs de la KPI
        borderColor: "black",
        borderWidth: 1,
        fill: false,
        pointBackgroundColor: (context: { dataIndex: number }) => {
          // Définir la couleur des points pour les 20 dernières valeurs de prédiction
          if (context.dataIndex >= values.length - 20) {
            // return colors[context.dataIndex - (values.length - 10)];
            return "black";
          }
          return "black";
        },
      },
      {
        label: "Scrap",
        data: props.data
          .map((item) => {
            let v = item.Scrap * 10;
            v = parseFloat(
              v.toString().slice(0, v.toString().indexOf(".") + 3)
            );
            return v;
          })
          .slice(0, -20), // Utiliser les valeurs de la KPI
        borderColor: "red",
        borderWidth: 1,
        fill: false,
        pointBackgroundColor: (context: { dataIndex: number }) => {
          // Définir la couleur des points pour les 20 dernières valeurs de prédiction
          if (context.dataIndex >= values.length - 0) {
            // return colors[context.dataIndex - (values.length - 10)];
            return "black";
          }
          return "black";
        },
      },
    ];
  } else if (props.title == "Scrap Trend") {
    __datasets__ = [
      {
        label: "Scrap",
        data: props.data.map((item) =>
          parseFloat(
            item.Scrap.toString().slice(
              0,
              item.Scrap.toString().indexOf(".") + 3
            )
          )
        ), // Utiliser les valeurs de la KPI
        borderColor: "black",
        borderWidth: 1,
        fill: false,
        pointBackgroundColor: (context: { dataIndex: number }) => {
          // Définir la couleur des points pour les 20 dernières valeurs de prédiction
          if (context.dataIndex >= values.length - 0) {
            return "black";
          }
          return "black";
        },
      },
    ];
  }
  // Configuration des données pour le graphique
  const chartData = {
    labels: dates, // Utiliser les dates comme labels
    datasets: __datasets__,
  };

  const chartOptions = {
    scales: {
      x: {
        // min: props.minDate,
        // max: props.maxDate,
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

  return <Line data={chartData} options={chartOptions} />;
};

export default OEELineChartTrend;
