import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import NavBar from "./nav_bar";
import Footer from "./footer";
import MainDashboard from "./__dashboards/main_dashboard";
import EfficienceDashboard from "./__dashboards/efficience_dashboard";
import OEE_Dashboard from "./__dashboards/oee_dashboard";
import Scrap_Dashboard from "./__dashboards/scrap_dashboard";

const MasterPage = () => {
  // -------------------- UseState
  const [selectedKPI, setSelectedKPI] = useState<string>("");
  const [selectorsData, setSelectorsData] = useState<string>("");
  const [serialNumberSelectorData, setSerialNumberSelectorData] =
    useState<string>("");
  const [shiftData, setShiftData] = useState<number>(1);
  const [Projects, setProjects] = useState<string[]>([]);

  // -------------------- Retreive Data From Child Components
  const getKPI = (kpi: SetStateAction<string>) => {
    setSelectedKPI(kpi);
  };
  const getSelectorsData = (selectorsData: string) => {
    setSelectorsData(selectorsData);
  };
  const getSerialNumberSelectorData = (SerialNumberselectorData: string) => {
    setSerialNumberSelectorData(SerialNumberselectorData);
  };
  const getShiftData = (shift: number) => {
    setShiftData(shift);
  };

  // -------------------- UseEffect
  useEffect(() => {
    (async () => {
      //Get unique projects names from backend
      const uniqueProjects = await axios.get(
        `${process.env.REACT_APP_FLASK_API_BASE_URL}/sql/uniqueEfficienceProject`
      );
      setProjects(uniqueProjects.data.data);
    })();
  }, []);

  return (
    <>
      <div className="container-body">
        <div className="nav-bar-master item">
          <NavBar
            companyProjects={Projects}
            onKPIChange={getKPI}
            onSelectorsFilterChange={getSelectorsData}
            onSerialNumberSelectorChange={getSerialNumberSelectorData}
            onShiftChange={getShiftData}
          />
        </div>
        {/* <div className="side-bar-master item">
          <SideBar/> 
        </div> */}
        <div className="body-master item">
          {selectedKPI === "" && (
            <MainDashboard
              companyProject={selectorsData}
              companySerialNumber={serialNumberSelectorData}
            />
          )}

          {selectedKPI === "e1" && (
            <EfficienceDashboard companyProject={selectorsData} />
          )}
          {selectedKPI === "oee" && (
            <OEE_Dashboard
              companySerialNumber={serialNumberSelectorData}
              shift={shiftData}
            />
          )}
          {selectedKPI === "scrap" && (
            <Scrap_Dashboard
              companySerialNumber={serialNumberSelectorData}
              shift={shiftData}
            />
          )}
        </div>
        <div className="footer-master item">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default MasterPage;
