import React from "react";

import { Breadcrumbs } from "../index";
import FeaturedProductComponent from "./Component/FeaturedProductComponent";
const FeaturedProduct = (props) => {
  return (
    <>
      <Breadcrumbs url="/cmshome" name="CMS Home Page"></Breadcrumbs>
      <FeaturedProductComponent />
    </>
  );
};
export default FeaturedProduct;
