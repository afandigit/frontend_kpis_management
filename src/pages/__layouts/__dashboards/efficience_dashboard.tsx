import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./efficience_dashboard.css";
import { E1_dashboard_branchs } from "../Data";
import LineChartTrend from "../__components/__efficience/LineChartTrend";
import PieChart from "../__components/__efficience/PieChart";
import BarChart from "../__components/__efficience/BarChart";

type Efficience_Data_Type = {
  Project: string;
  Responsible: string;
  Date: string;
  Efficience: string;
  Headcout: string;
  PostedHours: string;
  HoursOfProduction: string;
  Absents: string;
  RegistredHeadCount: string;
};

type Efficience_Data__Type = {
  date: string;
  value: string;
  project: string;
  responsible: string;
};

type acc_type = {
  [responsable: string]: {
    total: number;
    count: number;
  };
};

type predicted_data_type = {
  date: string;
  value: string;
};

function getMaxValue(numbers: number[]): number {
  return Math.max(...numbers);
}

interface EfficienceDashboardType {
  companyProject: string;
}

const EfficienceDashboard = (props: EfficienceDashboardType) => {
  const [selected, setSelected] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState<string>("E1 Trend");

  const [showChartLine, setShowChartLine] = useState<boolean>(true);
  const [showPieChart, setShowPieChart] = useState<boolean>(false);
  const [showBarChart, setShowBarChart] = useState<boolean>(false);

  const [data, setData] = useState<Efficience_Data__Type[]>([]);
  const [predictedEfficienceData, setPredictedEfficienceData] =
    useState<predicted_data_type>({ date: "", value: "" });

  const [realTimeDate, setRealTimeDate] = useState<Efficience_Data__Type[]>([]);

  const [uniqueResponsibles, setUniqueResponsibles] = useState<string[]>([]);

  const [selectedProjects, setSelectedProjects] = useState<string[]>([
    "PROJECT ETA",
  ]);

  useEffect(() => {
    if (props.companyProject !== "") {
      setSelectedProjects([props.companyProject]);
    }
  }, [props.companyProject]);

  const [startdate, setStartdate] = useState<string>("");
  const [enddate, setEnddate] = useState<string>("");
  const [currentIndexFilterDate, setCurrentIndexFilterDate] =
    useState<number>(10);
  const [actualStartDate, setActualStartDate] = useState<string>("");
  const [actualEndDate, setActualEndDate] = useState<string>("");

  const [yMaxValue, setYMaxValue] = useState(100);
  const [yLastValue, setYLastValue] = useState(yMaxValue);

  const [pieLabels, setPieLabels] = useState<string[]>([]);
  const [pieValues, setPieValues] = useState<number[]>([]);

  const [uniqueDates, setUniqueDates] = useState<string[]>([]);

  const socket = io(`${process.env.REACT_APP_FLASK_API_BASE_URL}`);
  const decoder = new TextDecoder("utf-8");

  useEffect(() => {
    (async () => {
      socket.on("updateEfficienceData", (data) => {
        const jsonString = decoder.decode(data.data);
        const jsonData = JSON.parse(jsonString);
        setRealTimeDate(jsonData.data);
      });

      const dates = await axios.get(
        `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/efficience/efficience_unique_dates`
      );
      setUniqueDates(dates.data);
    })();
  }, []);

  useEffect(() => {
    if (realTimeDate.length > 0) {
      if (realTimeDate[0].project === data[0].project) {
        setData(realTimeDate);
      }
    }
  }, [realTimeDate]);

  useEffect(() => {
    (async () => {
      // Construct URL
      const branchObjetMatching = E1_dashboard_branchs.find(
        (branch) => branch.heading === selectedBranch
      );

      socket.emit("update_description_family", {
        url_extension: branchObjetMatching?.url_extension_dashboard,
        family: selectedProjects,
      });

      const url_base = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/efficience_full_data/${branchObjetMatching?.url_extension_dashboard}`;

      const url = selectedProjects[0]
        ? url_base + "/" + selectedProjects[0]
        : url_base;
      // ------------------
      // Get Data from backend
      const e1 = await axios.get(url);
      setData(e1.data.data);
      // ------------------
      // Get Y axis Control
      let values: number[] = e1.data.data
        .map((item: Efficience_Data__Type) => parseFloat(item.value))
        .filter((value: number) => !isNaN(value));

      // const maxValue: number = getMaxValue(values) * 100;
      const maxValue: number = getMaxValue(values);
      setYMaxValue(maxValue);

      // ------------------

      if (selectedBranch.includes("Trend")) {
        if (selectedProjects.length === 0) {
          setSelectedProjects(["PROJECT ETA"]);
        }
        //  Si on va afficher un graphique de type Time Series on voudra controller les dates de début de chaque projet et la date de fin.
        const dateStrings = e1.data.data.map(
          (item: Efficience_Data__Type) => item.date
        );

        const minDate: string = dateStrings.reduce(
          (min: number, current: number) => {
            return current < min ? current : min;
          }
        );

        const maxDate: string = dateStrings.reduce(
          (max: number, current: number) => {
            return current > max ? current : max;
          }
        );

        setStartdate(minDate);
        setEnddate(maxDate);

        const actualDateIndex = e1.data.data.length * 0.06;

        setCurrentIndexFilterDate(actualDateIndex);

        if (values.length > actualDateIndex) {
          const dateStringsSlice = dateStrings.slice(-actualDateIndex);
          setActualStartDate(dateStringsSlice[0]);
          setActualEndDate(dateStringsSlice.slice(-1)[0]);
        }

        setShowPieChart(false);
        setShowBarChart(false);
        setShowChartLine(true);
      } else if (selectedBranch === "The activity of responsible") {
        // Calculate average KPI value for each responsible person
        const statistcsKPIByResponsible: acc_type = e1.data.data.reduce(
          (acc: acc_type, item: Efficience_Data__Type) => {
            const { responsible, value } = item; // Nous utilisons la déstructuration d'objet pour extraire les propriétés responsible et kpi de l'objet item.
            // La variable responsible contiendra la valeur de la propriété responsible de l'objet item.
            // La variable kpi contiendra la valeur de la propriété kpi de l'objet item.
            if (value !== "") {
              const kpi = Number.parseFloat(value);
              if (!acc[responsible]) {
                acc[responsible] = { total: kpi, count: 1 };
              } else {
                acc[responsible].total += kpi;
                acc[responsible].count++;
              }
            }
            return acc;
          },
          {}
        );

        // Calculate the average/sum value for each responsible person
        const statistics = Object.entries(statistcsKPIByResponsible).map(
          ([responsible, { total, count }]) => ({
            responsible,
            sumOfHours: total,
            // average: total / count,
          })
        );

        // Extract labels and data for the Pie Chart
        const labels = statistics.map((item) => item.responsible);
        const values = statistics.map((item) => item.sumOfHours);

        setPieLabels(labels);
        setPieValues(values);
        setShowChartLine(false);
        setShowBarChart(false);
        setShowPieChart(true);
      } else if (selectedBranch === "N.Workers/Responsible") {
        const responsibles = e1.data.data.map(
          (item: Efficience_Data__Type) => item.responsible
        );
        const uniqueResponsible = responsibles.filter(
          (value: any, index: any, array: string | any[]) =>
            array.indexOf(value) === index
        );
        setUniqueResponsibles(uniqueResponsible);

        setShowChartLine(false);
        setShowPieChart(false);
        setShowBarChart(true);
      }
    })();
  }, [selectedProjects, selectedBranch]);

  return (
    <>
      <div
        className={`e1-dashboard ${
          selectedBranch.includes("Trend")
            ? "e1-dashboard-grid-with-header"
            : "e1-dashboard-grid-without-header"
        }`}
      >
        {/* ------------------------------------------------------ */}
        {/* Header Filter*/}
        <div
          className="header-filter"
          style={{
            display: selectedBranch.includes("Trend") ? "block" : "none",
          }}
        >
          {/* Date Picker - Filter */}
          <div className="date-pick">
            <div className="fromdate-container">
              <strong> Start Date </strong> : <br /> {startdate}
            </div>
            <div className="fromdate-container">
              <label htmlFor="">From Date</label>
              <div className="input-fromdate-container">
                <input
                  min={startdate}
                  id="date_picker_input_element"
                  type="date"
                  className=""
                  placeholder="dd-mm-yyyy"
                  value={actualStartDate}
                  onChange={(e) => {
                    setActualStartDate(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="fromdate-container">
              <label htmlFor="">To Date</label>
              <div className="input-fromdate-container">
                <input
                  max={enddate}
                  id="date_picker_input_element"
                  type="date"
                  className=""
                  placeholder="dd-mm-yyyy"
                  value={actualEndDate}
                  onChange={(e) => {
                    setActualEndDate(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="fromdate-container">
              {" "}
              <strong> Last Date </strong> : <br /> {enddate}
            </div>
          </div>
        </div>
        {/* ------------------------------------------------------ */}
        {/* Side Bar */}
        <div className="sidebar">
          {E1_dashboard_branchs.map((branch, index) => {
            return (
              <div
                className={
                  selected === index ? "branch-trend active" : "branch-trend"
                }
                key={index}
                onClick={() => {
                  setSelected(index); // For adding "active" class to the div
                  setSelectedBranch(branch.heading); // to switch between Charts Components inside useEffect
                }}
              >
                <img src={branch.iconPath} height="30" width="30" />
                <a>{branch.heading}</a>
              </div>
            );
          })}
        </div>
        {/* ------------------------------------------------------ */}
        {/* Main Dashboard */}

        <div className="main" id="main-dashboard">
          {selectedBranch.includes("Trend") && (
            <div className="dashboard-row-element-1">
              <div className="date-range-input-container">
                <input
                  type="range"
                  min={startdate}
                  max={enddate}
                  value={currentIndexFilterDate}
                  onChange={(e) => {
                    setCurrentIndexFilterDate(Number.parseInt(e.target.value));
                    const dateStringsSlice = data
                      .map((item) => item.date)
                      .slice(-Number.parseInt(e.target.value));
                    setActualStartDate(dateStringsSlice[0]);
                  }}
                  className="date-range-input"
                />
              </div>
            </div>
          )}
          <div className="dashboard-row-element-2">
            {selectedBranch === "E1 Trend" && (
              <div className="yValue-range-input-container">
                <input
                  type="range"
                  min="0"
                  max={yMaxValue}
                  value={yLastValue}
                  onChange={(e) => setYLastValue(parseFloat(e.target.value))}
                  className="yValue-range-input"
                />
              </div>
            )}
            <div className="charts-container">
              {showChartLine && (
                <LineChartTrend
                  data={data}
                  selectedBranch={selectedBranch}
                  minDate={startdate}
                  maxDate={enddate}
                  minActualDate={actualStartDate}
                  maxActualDate={actualEndDate}
                  yMaxValue={selectedBranch === "E1 Trend" ? yLastValue : -1}
                  currentIndexFilterDate={currentIndexFilterDate}
                  predictedEfficienceData={predictedEfficienceData}
                />
              )}
              {showPieChart && (
                <div className="PieChart-container">
                  <PieChart data={data} labels={pieLabels} values={pieValues} />
                </div>
              )}
              {showBarChart && (
                <div className="BarChart-container">
                  <BarChart data={data} labels={uniqueResponsibles}></BarChart>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ------------------------------------------------------ */}
      </div>
    </>
  );
};

export default EfficienceDashboard;
