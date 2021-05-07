import React from "react";
export let AlertProps = {
  vertical: {
    top: "top",
    bottom: "bottom",
  },
  horizontal: {
    left: "left",
    right: "right",
    center: "center",
  },
  severity: {
    success: "success",
    error: "error",
    warning: "warning",
    info: "info",
  },
};

/**
 * AlertContext store the props which are neccessary to show the Alert component,
 * which is provided at the /src/App.js using the /src/App.alert.js.
 */
export let AlertContext = React.createContext({
  open: false,
  severity: AlertProps.severity.success,
  msg: "",
  vertical: AlertProps.vertical.top,
  horizontal: AlertProps.horizontal.center,
  onclose: () => null,
  setSnack: () => null,
});
