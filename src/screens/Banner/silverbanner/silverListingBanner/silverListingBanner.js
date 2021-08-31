import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SilverListingPage from "../components/silverlistingpage";
import { Breadcrumbs } from "../../../../components";

const useStyles2 = makeStyles((theme) => ({
    root: {
      width: "100%",
      marginTop: theme.spacing(3),
    },
    imagecontainer: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    table: {
      minWidth: 500,
    },
    tableWrapper: {
      overflowX: "auto",
    },
    link: {
      display: "flex",
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
    },
    link_style: {
      color: "#000",
    },
  }));
  const SilverListingbanner = (props) => {
    const classes = useStyles2();
  
    return (
      <>
        <Breadcrumbs url="banner" name="Landing Page Banner"></Breadcrumbs>
        <SilverListingPage />
        {/* <SilverListingRoutingPage /> */}
        {/* <SilverLandingPage /> */}
      </>
    );
  };
  export default SilverListingbanner;
  