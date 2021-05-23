import React from "react";
import { Redirect } from "react-router-dom";

import route from "./route";
import { withAppBar } from "../components/PrimaryAppBar";

const PrivateRoute = (props) => {
  const { component, ...rest } = props;

  const checkAuth = () => {
    let accesstoken = localStorage.getItem("accesstoken");
    if (accesstoken) {
      return true;
    } else {
      return false;
    }
  };

  const Component = (props) => withAppBar(component, props);
  return checkAuth() ? (
    rest.path === "/" || rest.path === "/login" ? (
      <Redirect to={route.productlist} />
    ) : (
      <Component {...rest} />
    )
  ) : (
    <Redirect to={route.login} />
  );
};

export default PrivateRoute;
