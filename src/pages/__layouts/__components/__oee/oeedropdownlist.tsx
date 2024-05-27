import React, { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import "../../nav_bar.css";

interface dropdownListPropsType {
  onChooseSerialNumber: (serialNumber: string) => void;
  onChooseShift: (shift: number) => void;
}

const OEEDropdownList = (props: dropdownListPropsType) => {
  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
  const shifts: number[] = [1, 2, 3];
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<number>(1);

  useEffect(() => {
    (async () => {
      //Get unique projects(families) names from backend
      const uniqueSN = await axios.get(
        `${process.env.REACT_APP_FLASK_API_BASE_URL}/uniqueCuttingAreaSerialNumbers`
      );
      setSerialNumbers(uniqueSN.data);
    })();
  }, []);

  if (
    // check if the serial number exist in the unique serial number values in the database
    selectedSerialNumber !== "" &&
    serialNumbers.includes(selectedSerialNumber)
  ) {
    // send the current choosen serial number into parent component <nav bar>
    props.onChooseSerialNumber(selectedSerialNumber);
    props.onChooseShift(selectedShift);
  }

  const handleSerialNumberChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedSerialNumber(event.target.value);
  };

  const handleShiftChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedShift(parseInt(String(event.target.value)));
  };

  return (
    <>
      <div className="sub-select-container">
        <select
          className="select-button"
          value={selectedSerialNumber}
          onChange={handleSerialNumberChange}
        >
          {/* <option value="">Select a Serial Number</option> */}
          {serialNumbers.map((serialNumber) => (
            <option className="option" key={serialNumber} value={serialNumber}>
              Machine : {serialNumber}
            </option>
          ))}
        </select>

        <select
          className="select-button"
          value={selectedShift}
          onChange={handleShiftChange}
        >
          {/* <option value="">Select a Shift</option> */}
          {shifts.map((shift) => (
            <option className="option" key={shift} value={shift}>
              Shift : {shift}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default OEEDropdownList;
