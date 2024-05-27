import { SetStateAction, useState } from "react";
import EfficienceDropdownList from "./__components/__efficience/efficiencedropdownlist";
import OEEDropdownList from "./__components/__oee/oeedropdownlist";
import "./nav_bar.css";

interface navBarProps {
  companyProjects: string[];
  onKPIChange: (kpi: SetStateAction<string>) => void;
  onSelectorsFilterChange: (selectorsData: string) => void;
  onSerialNumberSelectorChange: (serialNumber: string) => void;
  onShiftChange: (shift: number) => void;
}

const NavBar = (props: navBarProps) => {
  const COMPANY_KPIS: string[] = ["e1", "oee", "ppm", "scrap", "kuso"];
  const [selectedKPI, setSelectedKPI] = useState<string>("");

  const handleKPIChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const selectedOption = event.target.value;
    setSelectedKPI(selectedOption);
    props.onKPIChange(selectedOption);
  };

  const handleProjectChange = (project: string) => {
    props.onSelectorsFilterChange(project);
  };

  const handleSerialNumberChange = (serialNumber: string) => {
    props.onSerialNumberSelectorChange(serialNumber);
  };

  const handleShiftChange = (shift: number) => {
    props.onShiftChange(shift);
  };

  return (
    <>
      <nav className="main-nav-bar">
        <a className="image-logo">
          <img
            src="/static/images/website_logo.jpeg"
            width="180"
            height="40"
            alt="COMPANY LOGO"
          />
        </a>

        <div className="select-company-projects-menu">
          <div className="sub-select-container">
            <select
              className="select-button"
              value={selectedKPI}
              onChange={handleKPIChange}
            >
              <option value="">KPIs</option>
              {COMPANY_KPIS.map((segment) => (
                <option className="option" key={segment} value={segment}>
                  {segment.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="select-company-projects-menu">
          <div className="sub-select-container">
            {selectedKPI && selectedKPI == "e1" && (
              <EfficienceDropdownList
                companyProjects={props.companyProjects}
                onChooseProject={handleProjectChange}
              />
            )}

            {selectedKPI && ["oee", "scrap"].includes(selectedKPI) && (
              <OEEDropdownList
                onChooseSerialNumber={handleSerialNumberChange}
                onChooseShift={handleShiftChange}
              />
            )}
          </div>
        </div>

        <div className="session-control">
          {/* <button>Sign in</button>
          <button>Log in</button> */}
          <button>Log out</button>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
