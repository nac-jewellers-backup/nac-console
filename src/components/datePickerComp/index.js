import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export const DatePickerComp = (props) => {
  console.log(props?.value , "ll")
  return (
    <DatePicker selected={props?.value ? new Date(props?.value):null} onChange={(date) => props?.onChange(date)} />
  );
};

