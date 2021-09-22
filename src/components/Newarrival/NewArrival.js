import React from "react";
import { Breadcrumbs } from "../index";
import Reviewcomponent from "./component/NewarrivalComponent";

const FeaturedProduct = (props) => {
  return (
    <>
      <Breadcrumbs url="/cmshome" name="CMS Home Page"></Breadcrumbs>
      <Reviewcomponent />
    </>
  );
};
export default FeaturedProduct;
