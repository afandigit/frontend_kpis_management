import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./scrap_dashboard.css";
import { SCRAP_dashboard_branchs } from "../Data";
import LineScarpChartOEETrendType from "../__components/__Scrap/ScrapLineChartTrend";

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

interface ScrapDashboardPropsType {
  companySerialNumber: string;
  shift: number;
}

function getMaxValue(numbers: number[]): number {
  return Math.max(...numbers);
}

const Scrap_Dashboard = (props: ScrapDashboardPropsType) => {
  const [data, setData] = useState<SCRAPKPIData[]>([]);

  // Use States For : Side Bar
  const [selected, setSelected] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState<string>("Scrap Trend");

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
  const [currentIndexFilterDate, setCurrentIndexFilterDate] =
    useState<number>(30);
  const [actualStartDate, setActualStartDate] = useState<string>("");
  const [actualEndDate, setActualEndDate] = useState<string>("");

  const [yMaxValue, setYMaxValue] = useState(100);
  const [yLastValue, setYLastValue] = useState(yMaxValue);

  // Use States For : Main dashboard
  const [displayChartLine, setDisplayChartLine] = useState<boolean>(true);
  const [lineChartHeading, setLineChartHeading] = useState<string | undefined>(
    ""
  );

  const decoder = new TextDecoder("utf-8");

  useEffect(() => {
    (async () => {
      // Construct URL
      const branchObjetMatching = SCRAP_dashboard_branchs.find(
        (branch) => branch.heading === selectedBranch
      );
      const url_base = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/${branchObjetMatching?.url_extension_dashboard}`;

      const url = selectedSerialNumber[0]
        ? url_base + "/" + selectedSerialNumber[0] + "/" + selectedShift
        : url_base;
      // ------------------
      // Get Data from backend
      const scrap_data = await axios.get(url);
      setData(scrap_data.data);
      // ------------------
      // Get Y axis Control

      const values: number[] = scrap_data.data
        .map((item: SCRAPKPIData) => item.Scrap)
        .filter((value: number) => !isNaN(value));
      const maxValue: number = getMaxValue(values);
      setYMaxValue(maxValue);
      // ------------------

      if (selectedBranch.includes("Trend")) {
        if (selectedSerialNumber.length === 0) {
          setSelectedSerialNumber(["8471629"]);
        }

        const dateStrings = scrap_data.data.map(
          (item: SCRAPKPIData) => item.Date
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

        const actualDateIndex = scrap_data.data.length * 0.2;

        setCurrentIndexFilterDate(actualDateIndex);

        if (values.length > actualDateIndex) {
          const dateStringsSlice = dateStrings.slice(-actualDateIndex);
          setActualStartDate(dateStringsSlice[0]);
          setActualEndDate(dateStringsSlice.slice(-1)[0]);
        }

        setLineChartHeading(branchObjetMatching?.heading);
        setDisplayChartLine(true);
      }
    })();
  }, [selectedSerialNumber, selectedBranch, selectedShift]);

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
                  min={startdate}
                  id="date_picker_input_element"
                  type="date"
                  className=""
                  placeholder="dd-mm-yyyy"
                  value={actualStartDate}
                  onChange={(e) => {
                    // filterDates(e);
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
                    // filterDates(e);
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
          {SCRAP_dashboard_branchs.map((branch, index) => {
            return (
              <div
                className={
                  selected === index ? "branch-trend active" : "branch-trend"
                }
                key={index}
                onClick={() => {
                  setSelected(index);
                  setSelectedBranch(branch.heading);
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
                      .map((item) => item.Date)
                      .slice(-Number.parseInt(e.target.value));
                    setActualStartDate(dateStringsSlice[0]);
                  }}
                  className="date-range-input"
                />
              </div>
            </div>
          )}
          <div className="dashboard-row-element-2">
            {selectedBranch.includes("Trend") && (
              <div className="yValue-range-input-container">
                <input
                  type="range"
                  min="0"
                  step="0.01"
                  max={yMaxValue}
                  value={yLastValue}
                  onChange={(e) => setYLastValue(parseFloat(e.target.value))}
                  className="yValue-range-input"
                />
              </div>
            )}
            {displayChartLine && (
              <div className="LineChart-container">
                <LineScarpChartOEETrendType
                  data={data}
                  selectedBranch={selectedBranch}
                  minDate={startdate}
                  maxDate={enddate}
                  minActualDate={actualStartDate}
                  maxActualDate={actualEndDate}
                  yMaxValue={selectedBranch.includes("Trend") ? yLastValue : -1}
                  currentIndexFilterDate={currentIndexFilterDate}
                  title={lineChartHeading}
                />
              </div>
            )}
          </div>
        </div>
        {/* ------------------------------------------------------ */}
      </div>
    </>
  );
};

export default Scrap_Dashboard;
