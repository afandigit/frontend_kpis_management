import { useState, useEffect, useRef, SetStateAction } from "react";
import axios from "axios";
// import io from "socket.io-client";
import "./main_dashboard.css";
import { E1_dashboard_branchs } from "../Data";
import DoughnutLayoutForMainDashboard from "../__components/__main_dashboard_components/doughnut";
import LineChartTrend from "../__components/__main_dashboard_components/linechart";
import BarChart from "../__components/__main_dashboard_components/barchart";
import PieChart from "../__components/__main_dashboard_components/piechart";

type EfficienceKPIData = {
  date: string;
  e1_value: string;
  family: string;
  responsable: string;
};

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

type acc_type = {
  [responsable: string]: {
    total: number;
    count: number;
  };
};

function getMaxValue(numbers: number[]): number {
  return Math.max(...numbers);
}

interface MainDashboardType {
  companyProject: string;
  companySerialNumber: string;
}
const decoder = new TextDecoder("utf-8");

const MainDashboard = (props: MainDashboardType) => {
  // const [selected, setSelected] = useState(0);
  // const [selectedBranch, setSelectedBranch] = useState<string>("E1 Trend");

  const [efficienceKpiData, setEfficienceKpiData] = useState<
    EfficienceKPIData[]
  >([]);
  const [efficienceProductionHoursData, setEfficienceProductionHoursData] =
    useState<EfficienceKPIData[]>([]);
  const [efficienceEffectifsData, setEfficienceEffectifsData] = useState<
    EfficienceKPIData[]
  >([]);
  const [efficienceAbsentsData, setEfficienceAbsentsData] = useState<
    EfficienceKPIData[]
  >([]);
  // const [realTimeEfficienceDate, setRealTimeEfficienceDate] = useState<
  //   EfficienceKPIData[]
  // >([]);

  const [oeeData, setOeeData] = useState<OEEKPIData[]>([]);
  // const [realTimeOeeDate, setRealTimeOeeDate] = useState<OEEKPIData[]>([]);

  const [averageOeeLastWeek, setAverageOeeLastWeek] = useState<number>(0);
  const [
    averageOeeOfTheWeekBeforTheLastWeek,
    setAverageOeeOfTheWeekBeforTheLastWeek,
  ] = useState<number>(0);
  const [
    averageOeeCuttingAreaAvailabilityLastWeek,
    setAverageOeeCuttingAreaAvailabilityLastWeek,
  ] = useState<number>(0);
  const [
    averageOeeCuttingAreaAvailabilityOfTheWeekBeforTheLastWeek,
    setAverageOeeCuttingAreaAvailabilityOfTheWeekBeforTheLastWeek,
  ] = useState<number>(0);
  const [
    averageOeeCuttingAreaScrapLastWeek,
    setAverageOeeCuttingAreaScrapLastWeek,
  ] = useState<number>(0);
  const [
    averageOeeCuttingAreaScrapOfTheWeekBeforTheLastWeek,
    setAverageOeeCuttingAreaScrapOfTheWeekBeforTheLastWeek,
  ] = useState<number>(0);
  const [
    averageOeeCuttingAreaPerformanceLossesLastWeek,
    setAverageOeeCuttingAreaPerformanceLossesLastWeek,
  ] = useState<number>(0);
  const [
    averageOeeCuttingAreaPerformanceLossesOfTheWeekBeforTheLastWeek,
    setAverageOeeCuttingAreaPerformanceLossesOfTheWeekBeforTheLastWeek,
  ] = useState<number>(0);
  const [
    averageOeeCuttingAreaPerformanceLastWeek,
    setAverageOeeCuttingAreaPerformanceLastWeek,
  ] = useState<number>(0);
  const [
    averageOeeCuttingAreaPerformanceOfTheWeekBeforTheLastWeek,
    setAverageOeeCuttingAreaPerformanceOfTheWeekBeforTheLastWeek,
  ] = useState<number>(0);

  const [
    averageOeeCuttingAreaUnusedMachinesLastWeek,
    setAverageOeeCuttingAreaUnusedMachinesLastWeek,
  ] = useState<number>(0);
  const [
    totalOeeCuttingAreaQuantityLastWeek,
    setTotalOeeCuttingAreaQuantityLastWeek,
  ] = useState<number>(0);
  const [
    averageOeeCuttingAreaQuantityPerHourLastWeek,
    setAverageOeeCuttingAreaQuantityPerHourLastWeek,
  ] = useState<number>(0);
  const [
    averageOeeCuttingAreaSetupTimeLastWeek,
    setAverageOeeCuttingAreaSetupTimeLastWeek,
  ] = useState<number>(0);

  const [averageOeeDataLastWeek, setAverageOeeDataLastWeek] = useState<
    {
      date: string;
      value: number;
    }[]
  >([]);
  const [startDateForOee, setStartDateForOee] = useState<string>("");
  const [endDateForOee, setEndDateForOee] = useState<string>("");
  const [cuttingAreaMachinesNumber, setCuttingAreaMachinesNumber] =
    useState<number>(0);
  const [topFiveDowntimeMachines, setTopFiveDowntimeMachines] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [oeeOfTopFiveDowntimeMachines, setOeeOfTopFiveDowntimeMachines] =
    useState<number[]>([]);
  const [topFiveOeeMachines, setTopFiveOeeMachines] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  // -------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------
  //                            USE States For Efficience Data
  const [averageEfficienceLastWeek, setAverageEfficienceLastWeek] =
    useState<number>(0);
  const [
    averageEfficienceWeekBeforLastWeek,
    setAverageEfficienceWeekBeforLastWeek,
  ] = useState<number>(0);
  const [averageProductionHoursLastWeek, setAverageProductionHoursLastWeek] =
    useState<number>(0);
  const [
    averageProductionHoursWeekBeforLastWeek,
    setAverageProductionHoursWeekBeforLastWeek,
  ] = useState<number>(0);

  const [averageEfficiencesDataLastWeek, setAverageEfficiencesDataLastWeek] =
    useState<{ date: string; value: number }[]>([]);
  const [startDateForEfficience, setStartDateForEfficience] =
    useState<string>("");
  const [endDateForEfficience, setEndDateForEfficience] = useState<string>("");
  const [
    productionHoursPerFamilyForLastWeek,
    setProductionHoursPerFamilyForLastWeek,
  ] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [
    onlyValueOfproductionHoursPerFamilyForWeekBeforLastWeek,
    setOnlyValueOfproductionHoursPerFamilyForWeekBeforLastWeek,
  ] = useState<number[]>([]);
  const [
    productionHoursPerResponsibleForLastWeek,
    setProductionHoursPerResponsibleForLastWeek,
  ] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [
    onlyValueOfproductionHoursPerResponsibleForWeekBeforLastWeek,
    setOnlyValueOfproductionHoursPerResponsibleForWeekBeforLastWeek,
  ] = useState<number[]>([]);

  // -------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------
  const [uniqueResponsibles, setUniqueResponsibles] = useState<string[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([
    "PROJECT ETA",
  ]);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<string[]>([
    "8471629",
  ]);

  useEffect(() => {
    (async () => {
      // OEE Urls
      const oee_last_week_data_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/oee/lastWeek`;
      const oee_the_week_befor_the_last_week_data_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/oee/week_befor_lastWeek`;
      const average_oee_last_week_data_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/average/oee/lastWeek`;
      const number_of_cutting_area_machines_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/oee/number_machines/lastWeek`;
      // TOP 5 URLs
      const top_5_downtime_machines_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/oee/top5/downtime/lastWeek`;

      const top_5_oee_machines_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/oee/top5/oee/lastWeek`;

      // Efficience Urls
      const efficience_last_week_data_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/average/efficience/lastWeek`;
      const efficience_week_befor_last_week_data_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/average/efficience/weekbeforlastWeek`;
      const production_hours_last_week_data_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/average/productionHours/lastWeek`;
      const production_hours_week_befor_last_week_data_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/average/productionHours/weekBeforelastWeek`;
      const averages_efficience_last_week_data_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/averages/efficience/lastWeek`;
      const production_hours_per_family_efficience_last_week_and_beforlastWeek_data_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/production_hours_per_project/efficience/lastWeek_and_beforlastWeek`;
      const production_hours_per_responsible_efficience_last_week_and_beforlastWeek_data_url = `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/production_hours_per_responsible/efficience/lastWeek_and_beforlastWeek`;
      // ----------------------------------------------------------
      // Get OEE Data From Database of the Last Week
      const oee_last_week_data = await axios.get(oee_last_week_data_url);
      // console.log(JSON.parse(oee_last_week_data.data));
      // console.log(Array.from(oee_last_week_data.data));
      const values__oee_last_week_data = oee_last_week_data.data.map(
        (item: OEEKPIData) => item.OEE
      );
      const average_oee_last_week =
        values__oee_last_week_data.reduce((sum: number, current: number) => {
          return sum + current;
        }) / values__oee_last_week_data.length;
      setAverageOeeLastWeek(Number(Number(average_oee_last_week).toFixed(2)));
      // ----------------------------------------------------------
      // Get OEE Data From Database of the Week befor the Last Week
      const oee_week_befor_last_week_data = await axios.get(
        oee_the_week_befor_the_last_week_data_url
      );
      const values__oee_week_befor_last_week_data =
        oee_week_befor_last_week_data.data.map((item: OEEKPIData) => item.OEE);
      const average_oee_week_befor_last_week =
        values__oee_week_befor_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) / values__oee_week_befor_last_week_data.length;
      setAverageOeeOfTheWeekBeforTheLastWeek(
        Number(Number(average_oee_week_befor_last_week).toFixed(2))
      );
      // ----------------------------------------------------------
      const values__cutting_area_availability_last_week_data =
        oee_last_week_data.data.map((item: OEEKPIData) => item.Availability);
      const average_oee_cutting_area_availability_last_week =
        values__cutting_area_availability_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) / values__cutting_area_availability_last_week_data.length;
      setAverageOeeCuttingAreaAvailabilityLastWeek(
        Number(
          Number(average_oee_cutting_area_availability_last_week).toFixed(2)
        )
      );
      // ----------------------------------------------------------
      const values__oee_cutting_area_availability_week_befor_last_week_data =
        oee_week_befor_last_week_data.data.map(
          (item: OEEKPIData) => item.Availability
        );
      const average_oee_cutting_area_availability_week_befor_last_week =
        values__oee_cutting_area_availability_week_befor_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) /
        values__oee_cutting_area_availability_week_befor_last_week_data.length;
      setAverageOeeCuttingAreaAvailabilityOfTheWeekBeforTheLastWeek(
        Number(
          Number(
            average_oee_cutting_area_availability_week_befor_last_week
          ).toFixed(2)
        )
      );
      // ----------------------------------------------------------
      const values__cutting_area_scrap_last_week_data =
        oee_last_week_data.data.map((item: OEEKPIData) => item.Scrap);
      const average_oee_cutting_area_scrap_last_week =
        values__cutting_area_scrap_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) / values__cutting_area_scrap_last_week_data.length;
      setAverageOeeCuttingAreaScrapLastWeek(
        Number(Number(average_oee_cutting_area_scrap_last_week).toFixed(2))
      );
      // ----------------------------------------------------------
      const values__oee_cutting_area_scrap_week_befor_last_week_data =
        oee_week_befor_last_week_data.data.map(
          (item: OEEKPIData) => item.Scrap
        );
      const average_oee_cutting_area_scrap_week_befor_last_week =
        values__oee_cutting_area_scrap_week_befor_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) / values__oee_cutting_area_scrap_week_befor_last_week_data.length;
      setAverageOeeCuttingAreaScrapOfTheWeekBeforTheLastWeek(
        Number(
          Number(average_oee_cutting_area_scrap_week_befor_last_week).toFixed(2)
        )
      );
      // ----------------------------------------------------------
      const values__cutting_area_performance_losses_last_week_data =
        oee_last_week_data.data.map(
          (item: OEEKPIData) => item.Performance_losses
        );
      const average_oee_cutting_area_performance_losses_last_week =
        values__cutting_area_performance_losses_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) / values__cutting_area_performance_losses_last_week_data.length;
      setAverageOeeCuttingAreaPerformanceLossesLastWeek(
        Number(
          Number(average_oee_cutting_area_performance_losses_last_week).toFixed(
            2
          )
        )
      );
      // ----------------------------------------------------------
      const values__oee_cutting_area_performance_losses_week_befor_last_week_data =
        oee_week_befor_last_week_data.data.map(
          (item: OEEKPIData) => item.Performance_losses
        );
      const average_oee_cutting_area_performance_losses_week_befor_last_week =
        values__oee_cutting_area_performance_losses_week_befor_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) /
        values__oee_cutting_area_performance_losses_week_befor_last_week_data.length;
      setAverageOeeCuttingAreaPerformanceLossesOfTheWeekBeforTheLastWeek(
        Number(
          Number(
            average_oee_cutting_area_performance_losses_week_befor_last_week
          ).toFixed(2)
        )
      );
      // ----------------------------------------------------------
      const values__cutting_area_performance_last_week_data =
        oee_last_week_data.data.map((item: OEEKPIData) => item.Performance);
      const average_oee_cutting_area_performance_last_week =
        values__cutting_area_performance_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) / values__cutting_area_performance_last_week_data.length;
      setAverageOeeCuttingAreaPerformanceLastWeek(
        Number(
          Number(average_oee_cutting_area_performance_last_week).toFixed(2)
        )
      );
      // ----------------------------------------------------------
      const values__oee_cutting_area_performance_week_befor_last_week_data =
        oee_week_befor_last_week_data.data.map(
          (item: OEEKPIData) => item.Performance
        );
      const average_oee_cutting_area_performance_week_befor_last_week =
        values__oee_cutting_area_performance_week_befor_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) /
        values__oee_cutting_area_performance_week_befor_last_week_data.length;
      setAverageOeeCuttingAreaPerformanceOfTheWeekBeforTheLastWeek(
        Number(
          Number(
            average_oee_cutting_area_performance_week_befor_last_week
          ).toFixed(2)
        )
      );
      // ----------------------------------------------------------
      // Get Average OEE Data From Database of the Last Week
      const average_oee_last_week_data = await axios.get(
        average_oee_last_week_data_url
      );
      setAverageOeeDataLastWeek(average_oee_last_week_data.data);
      const date__values__average_oee_last_week_data =
        average_oee_last_week_data.data.map(
          (item: { date: string; value: number }) => item.date
        );
      const minDate: string = date__values__average_oee_last_week_data.reduce(
        (min: number, current: number) => {
          return current < min ? current : min;
        }
      );
      const maxDate: string = date__values__average_oee_last_week_data.reduce(
        (max: number, current: number) => {
          return current > max ? current : max;
        }
      );
      setStartDateForOee(minDate);
      setEndDateForOee(maxDate);
      // ----------------------------------------------------------
      const number_of_cutting_area_machines_data = await axios.get(
        number_of_cutting_area_machines_url
      );
      setCuttingAreaMachinesNumber(
        number_of_cutting_area_machines_data.data.data
      );
      // ----------------------------------------------------------
      const values__cutting_area_unused_machines_last_week_data =
        oee_last_week_data.data.map(
          (item: OEEKPIData) =>
            item.Unused_Machines_J1 +
            item.Unused_Machines_PL +
            item.Unused_Machines_UNP
        );
      const average_oee_cutting_area_unused_machines_last_week =
        values__cutting_area_unused_machines_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) / values__cutting_area_unused_machines_last_week_data.length;
      setAverageOeeCuttingAreaUnusedMachinesLastWeek(
        average_oee_cutting_area_unused_machines_last_week
      );
      // ----------------------------------------------------------
      const values__cutting_area_quantity_per_hour_last_week_data =
        oee_last_week_data.data.map((item: OEEKPIData) => item.QuantityPerH);
      const average_oee_cutting_area_quantity_per_hour_last_week =
        values__cutting_area_quantity_per_hour_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) / values__cutting_area_quantity_per_hour_last_week_data.length;
      setAverageOeeCuttingAreaQuantityPerHourLastWeek(
        average_oee_cutting_area_quantity_per_hour_last_week
      );
      // ----------------------------------------------------------
      const values__cutting_area_total_quantity_last_week_data =
        oee_last_week_data.data.map((item: OEEKPIData) => item.Quantity);
      const sum_oee_cutting_area_total_quantity_last_week =
        values__cutting_area_total_quantity_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        );
      setTotalOeeCuttingAreaQuantityLastWeek(
        sum_oee_cutting_area_total_quantity_last_week
      );
      // ----------------------------------------------------------
      const values__cutting_area_setup_time_last_week_data =
        oee_last_week_data.data.map((item: OEEKPIData) => item.Quantity);
      const average_oee_cutting_area_setup_time_last_week =
        values__cutting_area_setup_time_last_week_data.reduce(
          (sum: number, current: number) => {
            return sum + current;
          }
        ) / values__cutting_area_setup_time_last_week_data.length;
      setAverageOeeCuttingAreaSetupTimeLastWeek(
        average_oee_cutting_area_setup_time_last_week
      );
      // ----------------------------------------------------------
      const top_5_downtime_machines_data = await axios.get(
        top_5_downtime_machines_url
      );
      setTopFiveDowntimeMachines(top_5_downtime_machines_data.data.data);
      setOeeOfTopFiveDowntimeMachines(top_5_downtime_machines_data.data.oee);
      // ----------------------------------------------------------
      const top_5_oee_machines_data = await axios.get(top_5_oee_machines_url);
      setTopFiveOeeMachines(top_5_oee_machines_data.data.data);
      // ----------------------------------------------------------
      // Get Efficience Data From Database of the Last Week
      const efficience_last_week_data = await axios.get(
        efficience_last_week_data_url
      );
      const values__efficience_last_week_data =
        efficience_last_week_data.data.data;
      setAverageEfficienceLastWeek(values__efficience_last_week_data);
      // ----------------------------------------------------------
      const efficience_week_befor_last_week_data = await axios.get(
        efficience_week_befor_last_week_data_url
      );
      const values__efficience_week_befor_last_week_data =
        efficience_week_befor_last_week_data.data.data;
      setAverageEfficienceWeekBeforLastWeek(
        values__efficience_week_befor_last_week_data
      );
      // ----------------------------------------------------------
      const averages_efficience_last_week_data = await axios.get(
        averages_efficience_last_week_data_url
      );
      const values__averages_efficience_last_week_data =
        averages_efficience_last_week_data.data.data;
      setAverageEfficiencesDataLastWeek(
        values__averages_efficience_last_week_data
      );
      const date__values__averages_efficience_last_week_data =
        values__averages_efficience_last_week_data.map(
          (item: { date: string; value: number }) => item.date
        );
      const minDateForEfficience: string =
        date__values__averages_efficience_last_week_data.reduce(
          (min: number, current: number) => {
            return current < min ? current : min;
          }
        );
      const maxDateForEfficience: string =
        date__values__averages_efficience_last_week_data.reduce(
          (max: number, current: number) => {
            return current > max ? current : max;
          }
        );
      setStartDateForEfficience(minDateForEfficience);
      setEndDateForEfficience(maxDateForEfficience);
      // ----------------------------------------------------------
      const production_hours_per_family_efficience_last_week_data =
        await axios.get(
          production_hours_per_family_efficience_last_week_and_beforlastWeek_data_url
        );

      setProductionHoursPerFamilyForLastWeek(
        production_hours_per_family_efficience_last_week_data.data.firstData
      );
      setOnlyValueOfproductionHoursPerFamilyForWeekBeforLastWeek(
        production_hours_per_family_efficience_last_week_data.data.secondData
      );
      // ----------------------------------------------------------
      const production_hours_per_responsible_efficience_last_week_data =
        await axios.get(
          production_hours_per_responsible_efficience_last_week_and_beforlastWeek_data_url
        );

      setProductionHoursPerResponsibleForLastWeek(
        production_hours_per_responsible_efficience_last_week_data.data
          .firstData
      );
      setOnlyValueOfproductionHoursPerResponsibleForWeekBeforLastWeek(
        production_hours_per_responsible_efficience_last_week_data.data
          .secondData
      );

      // ----------------------------------------------------------
      const production_hours_last_week_data = await axios.get(
        production_hours_last_week_data_url
      );
      const values__production_hours_last_week_data =
        production_hours_last_week_data.data.data;
      setAverageProductionHoursLastWeek(
        values__production_hours_last_week_data
      );
      // ----------------------------------------------------------
      const production_hours_week_befor_last_week_data = await axios.get(
        production_hours_week_befor_last_week_data_url
      );
      const values__production_hours_week_befor_last_week_data =
        production_hours_week_befor_last_week_data.data.data;
      setAverageProductionHoursWeekBeforLastWeek(
        values__production_hours_week_befor_last_week_data
      );
    })();
  }, []);

  return (
    <>
      <div className="main-dashboard main-dashboard-grid-without-header">
        <div className="main-dashboard-header">
          <p>
            <i>Last Week reporting</i>
          </p>
        </div>
        <div className="main-dashboard-sub-header-1">
          <p>
            <i>Cutting Area</i>
          </p>
        </div>
        <div className="dashboard_1">
          <DoughnutLayoutForMainDashboard
            title={"OEE"}
            averageLastWeek={averageOeeLastWeek}
            averageOfTheWeekBeforTheLastWeek={
              averageOeeOfTheWeekBeforTheLastWeek
            }
          />
        </div>
        <div className="dashboard_6">
          <DoughnutLayoutForMainDashboard
            title={"Availability"}
            averageLastWeek={averageOeeCuttingAreaAvailabilityLastWeek}
            averageOfTheWeekBeforTheLastWeek={
              averageOeeCuttingAreaAvailabilityOfTheWeekBeforTheLastWeek
            }
          />
        </div>
        <div className="dashboard_3">
          <strong>Indicators</strong>
          <hr />
          <div className="kpi-numerical-element">
            <span>{cuttingAreaMachinesNumber}</span>
            <br />
            <span>Number of Machines</span>
          </div>
          <hr />
          <div className="kpi-numerical-element">
            <span>
              {Number(averageOeeCuttingAreaUnusedMachinesLastWeek * 100)
                .toString()
                .slice(
                  0,
                  Number(averageOeeCuttingAreaUnusedMachinesLastWeek * 100)
                    .toString()
                    .indexOf(".") + 3
                )}{" "}
              %
            </span>
            <br />
            <span>Unused Machines</span>
          </div>
          <hr />
          <div className="kpi-numerical-element">
            <span>
              {Number(averageOeeCuttingAreaQuantityPerHourLastWeek)
                .toString()
                .slice(
                  0,
                  Number(averageOeeCuttingAreaQuantityPerHourLastWeek)
                    .toString()
                    .indexOf(".") + 0
                )}
            </span>
            <br />
            <span>Quantity Per Hour</span>
          </div>
          <hr />
          <div className="kpi-numerical-element">
            <span>{Number(totalOeeCuttingAreaQuantityLastWeek)}</span>
            <br />
            <span>Total Quantity</span>
          </div>
          <hr />
          <div className="kpi-numerical-element">
            <span>
              {" "}
              {Number(averageOeeCuttingAreaSetupTimeLastWeek)
                .toString()
                .slice(
                  0,
                  Number(averageOeeCuttingAreaSetupTimeLastWeek)
                    .toString()
                    .indexOf(".") + 2
                )}{" "}
              min
            </span>
            <br />
            <span>Average Setup Time</span>
          </div>
          <hr />
        </div>
        <div className="dashboard_8">
          <DoughnutLayoutForMainDashboard
            title={"Scrap"}
            averageLastWeek={averageOeeCuttingAreaScrapLastWeek}
            averageOfTheWeekBeforTheLastWeek={
              averageOeeCuttingAreaScrapOfTheWeekBeforTheLastWeek
            }
          />
        </div>
        <div className="dashboard_7">
          <DoughnutLayoutForMainDashboard
            title={"PerformanceLosses"}
            averageLastWeek={averageOeeCuttingAreaPerformanceLossesLastWeek}
            averageOfTheWeekBeforTheLastWeek={
              averageOeeCuttingAreaPerformanceLossesOfTheWeekBeforTheLastWeek
            }
          />
        </div>
        <div className="dashboard_2">
          <DoughnutLayoutForMainDashboard
            title={"Performance"}
            averageLastWeek={averageOeeCuttingAreaPerformanceLastWeek}
            averageOfTheWeekBeforTheLastWeek={
              averageOeeCuttingAreaPerformanceOfTheWeekBeforTheLastWeek
            }
          />
        </div>
        <div className="dashboard_4_linechart">
          <strong>Average OEE Trend For Last Week</strong>
          <LineChartTrend
            kpi_name={"OEE"}
            data={averageOeeDataLastWeek}
            minDate={startDateForOee}
            maxDate={endDateForOee}
          />
        </div>
        <div className="dashboard_9">
          <div>
            <strong>Top 5 Downtime / Machines & OEE</strong>
            <br />
            <small>
              Average downtime (Unplanned downtime + Planned downtime) for last
              week / serial number
            </small>
          </div>
          <div className="BarChart-container">
            <BarChart
              title="Downtime Machine"
              data={{
                FirstData: topFiveDowntimeMachines,
                SecondData: oeeOfTopFiveDowntimeMachines,
              }}
            ></BarChart>
          </div>
        </div>
        <div className="dashboard_11">
          <div>
            <strong>Best Top 5 OEE / Machines</strong>
            <br />
            <small>Average OEE for last week / serial number</small>
          </div>
          <div className="BarChart-container">
            <BarChart
              title={"DowntimeMachine"}
              data={topFiveOeeMachines}
            ></BarChart>
          </div>
        </div>
        <div className="main-dashboard-sub-header-2">
          <p>
            <i>Assembly Area</i>
          </p>
        </div>
        <div className="dashboard_14">
          <DoughnutLayoutForMainDashboard
            title={"Efficience"}
            averageLastWeek={averageEfficienceLastWeek}
            averageOfTheWeekBeforTheLastWeek={
              averageEfficienceWeekBeforLastWeek
            }
          />
        </div>

        <div className="dashboard_15">
          <DoughnutLayoutForMainDashboard
            title={"ProductionHours"}
            averageLastWeek={averageProductionHoursLastWeek}
            averageOfTheWeekBeforTheLastWeek={
              averageProductionHoursWeekBeforLastWeek
            }
          />
        </div>

        <div className="dashboard_18">
          <strong>Average E1 Trend For Last Week</strong>
          <LineChartTrend
            kpi_name={"Efficience"}
            data={averageEfficiencesDataLastWeek}
            minDate={startDateForEfficience}
            maxDate={endDateForEfficience}
          />
        </div>

        <div className="dashboard_17">
          <div>
            <strong>Best Top 5 Projects Activity: Production Hours</strong>
            <br />
            <small>The Last Week Product Hours / Project </small>
            <br />
            <small>
              The <b>Week Before</b> Last Week Product Hours / Project{" "}
            </small>
          </div>
          <div className="BarChart-container">
            <BarChart
              title="Production Hours"
              data={{
                FirstData: productionHoursPerFamilyForLastWeek.slice(0, 5),
                SecondData:
                  onlyValueOfproductionHoursPerFamilyForWeekBeforLastWeek.slice(
                    0,
                    5
                  ),
              }}
            ></BarChart>
          </div>
        </div>

        <div className="dashboard_25">
          <div>
            <strong> Responsible Activity: Production Hours</strong>
            <br />
            <small>The Last Week Product Hours / Responsible </small>
            <br />
            <small>
              The <b>Week Before</b> Last Week Product Hours / Responsible
            </small>
          </div>
          <div className="BarChart-container">
            <BarChart
              title="Production Hours"
              data={{
                FirstData: productionHoursPerResponsibleForLastWeek,
                SecondData:
                  onlyValueOfproductionHoursPerResponsibleForWeekBeforLastWeek,
              }}
            ></BarChart>
          </div>
        </div>

        <div className="dashboard_22">
          <div>
            <strong>Bottom 5 Projects Activity: Production Hours</strong>
            <br />
            <small>The Last Week Product Hours / Project </small>
            <br />
            <small>
              The <b>Week Before</b> Last Week Product Hours / Project{" "}
            </small>
          </div>
          <div className="BarChart-container">
            <BarChart
              title="Production Hours"
              data={{
                FirstData: productionHoursPerFamilyForLastWeek.slice(-5),
                SecondData:
                  onlyValueOfproductionHoursPerFamilyForWeekBeforLastWeek.slice(
                    -5
                  ),
              }}
            ></BarChart>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDashboard;
