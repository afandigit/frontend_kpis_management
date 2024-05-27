import React, { useState } from "react";
import "../../nav_bar.css";

interface CompanyProjects {
  [key: string]: string[];
}
interface CompanyProjectsFamilies {
  [key: string]: string[];
}

interface dropdownListPropsType {
  companyProjects: string[];
  onChooseProject: (project: string) => void;
}

const EfficienceDropdownList = (props: dropdownListPropsType) => {
  const COMPANY_SEGMENTS: string[] = ["BU1", "BU2"];
  const COMPANY_PROJECTS: CompanyProjects = {
    BU1: [
      "DELTA",
      "PROJECT ETA",
      "PROJECT MU",
      "PROJECT ZETA",
      "S01201",
      "VIVO",
      "PROJECT ALPHA",
      "PROJECT KAPPA 1",
      "PROJECT KAPPA 2",
      "PROJECT IOTA",
    ],
    BU2: ["PROJECT CC", "PROJECT Z"],
  };
  const COMPANY_PROJECTS_FAMILIES: CompanyProjectsFamilies = {
    DELTA: ["PROJECT DELTA 1", "PROJECT DELTA 2"],
    S01201: ["PROJECT S5", "PROJECT S0"],
    VIVO: [
      "PROJECT THETA",
      "PROJECT EPSILON",
      "PROJECT BETA",
      "PROJECT 54",
      "PROJECT GAMMA 1",
      "PROJECT GAMMA 2",
      "PROJECT GAMMA 3",
      "PROJECT LAMBDA",
      "PROJECT LAMBDA 2",
      "PROJECT LAMBDA 3",
    ],
  };

  const [selectedSegment, setSelectedSegment] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedFamily, setSelectedFamily] = useState<string>("");

  const handleSegmentChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedSegment(event.target.value);
    setSelectedProject("");
    setSelectedFamily("");
  };

  const handleProjectChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedProject(event.target.value);
    setSelectedFamily("");
  };

  const handleFamilyChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedFamily(event.target.value);
  };

  if (selectedFamily !== "" && props.companyProjects.includes(selectedFamily)) {
    props.onChooseProject(selectedFamily);
  } else if (
    selectedProject !== "" &&
    props.companyProjects.includes(selectedProject)
  ) {
    props.onChooseProject(selectedProject);
  } else if (
    selectedSegment !== "" &&
    props.companyProjects.includes(selectedSegment)
  ) {
    props.onChooseProject(selectedSegment);
  } else if (selectedSegment === "") {
    props.onChooseProject("");
  }

  return (
    <>
      <div className="sub-select-container">
        {/* <label className="select-button-label">Segment</label> */}
        <select
          className="select-button"
          value={selectedSegment}
          onChange={handleSegmentChange}
        >
          <option value="">Select a segment</option>
          {COMPANY_SEGMENTS.map((segment) => (
            <option className="option" key={segment} value={segment}>
              {segment}
            </option>
          ))}
        </select>
      </div>

      {selectedSegment && (
        <div className="sub-select-container">
          {/* <label className="select-button-label">Project</label> */}
          <select
            className="select-button"
            value={selectedProject}
            onChange={handleProjectChange}
          >
            <option value="">Select a project</option>
            {COMPANY_PROJECTS[selectedSegment].map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedProject && COMPANY_PROJECTS_FAMILIES[selectedProject] && (
        <div className="sub-select-container">
          {/* <label className="select-button-label">Family</label> */}
          <select
            className="select-button"
            value={selectedFamily}
            onChange={handleFamilyChange}
          >
            <option value="">Select a family</option>
            {COMPANY_PROJECTS_FAMILIES[selectedProject].map((family) => (
              <option key={family} value={family}>
                {family}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default EfficienceDropdownList;
