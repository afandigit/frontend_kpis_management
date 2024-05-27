import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./oee_dashboard.css";
import { OEE_dashboard_branchs } from "../Data";
import OEELineChartTrend from "../__components/__oee/LineChartTrend";
import LineScarpChartOEETrendType from "../__components/__oee/ScrapLineChartTrend";

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

interface OEEDashboardPropsType {
  companySerialNumber: string;
  shift: number;
}

const OEE_Dashboard = (props: OEEDashboardPropsType) => {
  const [data, setData] = useState<OEEKPIData[]>([]);

  // Use States For : Side Bar
  const [selected, setSelected] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState<string>("OEE Trend");

  // Use States For : Header Nav
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<string[]>([
    "8471629",
  ]);
  // Use States For : Header Nav
  const [selectedShift, setSelectedShift] = useState<number>(1);

  useEffect(() => {
    if (props.companySerialNumber !== "") {
      setSelectedSerialNumber([props.companySerialNumber]);
      setSelectedShift(props.shift);
    }
  }, [props.companySerialNumber, props.shift]);

  const [startdate, setStartdate] = useState<string>("");
  const [enddate, setEnddate] = useState<string>("");

  // Use States For : Main dashboard
  const [displayChartLine, setDisplayChartLine] = useState<boolean>(true);
  const [displayScrapChartLine, setDisplayScrapChartLine] =
    useState<boolean>(false);
  const [lineChartHeading, setLineChartHeading] = useState<string | undefined>(
    ""
  );
  const [displayPieChart, setDisplayPieChart] = useState<boolean>(false);
  const [displayBarChart, setDisplayBarChart] = useState<boolean>(false);
  const [pieLabels, setPieLabels] = useState<string[]>([]);
  const [pieValues, setPieValues] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      // Construct URL
      const branchObjetMatching = OEE_dashboard_branchs.find(
        (branch) => branch.heading === selectedBranch
      );
      const url_base = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/${branchObjetMatching?.url_extension_dashboard}`;
      const url = selectedSerialNumber[0]
        ? url_base + "/" + selectedSerialNumber[0] + "/" + selectedShift
        : url_base;
      // ------------------
      // Get Data from backend
      const oee = await axios.get(url);
      setData(oee.data.data);
      // ------------------

      if (selectedBranch.includes("Trend")) {
        if (selectedSerialNumber.length === 0) {
          setSelectedSerialNumber(["8471629"]);
        }
        //  Si on va afficher un graphique de type Time Series on voudra controller les dates de début de chaque projet et la date de fin.
        console.log(oee.data);
        const dateStrings = oee.data.data.map((item: OEEKPIData) => item.Date);

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

        setDisplayPieChart(false);
        setDisplayBarChart(false);
        setLineChartHeading(branchObjetMatching?.heading);
        setDisplayChartLine(true);
      }
    })();
  }, [selectedSerialNumber, selectedBranch]);

  const handleCheckboxChange = (item: string) => {
    if (selectedSerialNumber.includes(item)) {
      setSelectedSerialNumber(
        selectedSerialNumber.filter(
          (selectedItem: any) => selectedItem !== item
        )
      );
      setSelectedSerialNumber(["3552862"]);
    } else {
      setSelectedSerialNumber([item]);
    }
  };
  return (
    <>
      <div
        className={`oee-dashboard ${
          selectedBranch.includes("Trend")
            ? "oee-dashboard-grid-with-header"
            : "oee-dashboard-grid-without-header"
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
                  type="date"
                  className=""
                  placeholder="dd-mm-yyyy"
                  value={startdate}
                  onChange={(e) => setStartdate(e.target.value)}
                />
              </div>
            </div>
            <div className="fromdate-container">
              <label htmlFor="">To Date</label>
              <div className="input-fromdate-container">
                <input
                  type="date"
                  className=""
                  placeholder="dd-mm-yyyy"
                  value={enddate}
                  onChange={(e) => setEnddate(e.target.value)}
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
          {OEE_dashboard_branchs.map((branch, index) => {
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
                <a href="#">{branch.heading}</a>
              </div>
            );
          })}
        </div>
        {/* ------------------------------------------------------ */}
        {/* Main Dashboard */}
        <div className="main" id="main-dashboard">
          {displayChartLine && (
            <div className="LineChart-container">
              <OEELineChartTrend
                data={data}
                selectedBranch={selectedBranch}
                minDate={startdate}
                maxDate={enddate}
                title={lineChartHeading}
              />
            </div>
          )}
        </div>
        {/* ------------------------------------------------------ */}
      </div>
    </>
  );
};

export default OEE_Dashboard;
