import { Chart as ChartJs, ArcElement, Tooltip, Legend, Align } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { metadata_for_main_dashboard } from "./Data";
import { Anchor } from "chartjs-plugin-datalabels/types/options";
ChartJs.register(ArcElement, Tooltip, Legend);

interface doughnutPropsType {
  title: string;
  averageLastWeek: number;
  averageOfTheWeekBeforTheLastWeek: number;
}

const DoughnutLayoutForMainDashboard = (props: doughnutPropsType) => {
  const data_dashboard_1 = {
    labels: [metadata_for_main_dashboard[props.title].title, ""],
    datasets: [
      {
        label: `Average ${metadata_for_main_dashboard[props.title].title}`,
        data: [
          props.averageLastWeek,
          Number(Number(100 - props.averageLastWeek).toFixed(2)),
        ],
        backgroundColor: [
          metadata_for_main_dashboard[props.title].chartColor,
          "gray",
        ],
        borderColor: ["black", "gray"],
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options_dashboard_1 = {
    plugins: {
      legend: {
        display: true,
      },

      datalabels: {
        color: "black", // Couleur du texte des étiquettes de données
        font: {
          size: 12, // Taille du texte des étiquettes de données
          weight: 1000,
        },
        offset: 10, // Décalage vertical des étiquettes de données par rapport aux points
        clamp: true, // Pour empêcher les étiquettes de sortir du graphique
      },
    },
  };

  const gaugeText_dashboard_1 = {
    id: "gaugeText",
    beforeDatasetsDraw(
      chart: { getDatasetMeta?: any; ctx?: any; data?: any; chartArea?: any },
      args: any,
      pluginOptions: any
    ) {
      const {
        ctx,
        data,
        chartArea: { top, bottom, left, right, width, height },
      } = chart;
      const xCenter = chart.getDatasetMeta(0).data[0].x;
      const yCenter = chart.getDatasetMeta(0).data[0].y;
      ctx.save();
      ctx.fillStyle = "black";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      // ctx.textBaseline = "baseline";
      ctx.fillText(
        // `Value : ${data.datasets[0].data[0].toFixed(2)}`,
        `Value : ${data.datasets[0].data[0]
          .toString()
          .slice(0, data.datasets[0].data[0].toString().indexOf(".") + 3)} %`,
        xCenter,
        yCenter - 10
      );
    },
  };

  return (
    <>
      <div className="doughnut_header">
        {metadata_for_main_dashboard[props.title].header} over last week{" "}
      </div>
      <div className="doughnut_container">
        <Doughnut
          data={data_dashboard_1}
          options={options_dashboard_1}
          plugins={[gaugeText_dashboard_1]}
        ></Doughnut>
      </div>
      <div className="doughnut_footer">
        {props.averageLastWeek - props.averageOfTheWeekBeforTheLastWeek > 0 ? (
          <span className="increase-indicator-span">
            {" "}
            <img src="/static/icons/increase.png" width="15" height="15" />
            Increase{" "}
          </span>
        ) : (
          <span className="decrease-indicator-span">
            <img src="/static/icons/decrease.png" width="15" height="15" />
            Decrease{" "}
          </span>
        )}
        in {metadata_for_main_dashboard[props.title].title} compared to last
        week by{" "}
        <span
          className={
            props.averageLastWeek - props.averageOfTheWeekBeforTheLastWeek > 0
              ? "increase-indicator-span"
              : "decrease-indicator-span"
          }
        >
          {String(
            props.averageLastWeek - props.averageOfTheWeekBeforTheLastWeek
          ).slice(
            0,
            String(
              props.averageLastWeek - props.averageOfTheWeekBeforTheLastWeek
            ).indexOf(".") + 3
          )}
        </span>
      </div>
    </>
  );
};

export default DoughnutLayoutForMainDashboard;
