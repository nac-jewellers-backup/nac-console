import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import Typography from "@material-ui/core/Typography";
import "./Configuration.css";

const useStyles = makeStyles(() => ({
  root: {},
  contantview: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));
export const Configuration = withRouter((props) => {
  const master_options = [
    "Daily Metal Rate",
    "Countries & Fx Rates",
    "Attribute Master",
    "Categories",
    "ProductTypes",
    "Materials",
    "Metal Colours",
    "Metal Purities",
    "Collections",
    "Occassions",
    "Styles",
    "Themes",
    "Designs",
    "Weights",
    "Diamond Types",
    "Diamond Settings",
    "Diamond Shapes",
    "Earring Backings",
    "Gemstone Settings",
    "Gemstone Shapes",
    "Gemstone Types",
    "Stones",
    "Stone Colours",
    "Stone Shapes",
    "Gender",
    "SEO Priorities",
    "Tax Settings 1",
    "Tax Settings 2",
    "Payment Status",
    "Order Status",
    "Shipping Zones",
    "Shipment Setting I",
    "Shipment Setting II",
  ];
  const master_options_url = [
    "daily_metal_rate",
    "countries",
    "masterattributes",
    "categories",
    "producttypes",
    "materialmaster",
    "mastercolors",
    "masterpurities",
    "collections",
    "masteroccassions",
    "masterstyles",
    "masterthemes",
    "designs",
    "weights",
    "diamonds",
    "diamondsettings",
    "diamondshapes",
    "earringbacking",
    "gemstonesettings",
    "gemstoneshapes",
    "gemstonetypes",
    "masterstones",
    "masterstonecolors",
    "masterstoneshapes",
    "genders",
    "seopriority",
    "Taxsetup",
    "taxsettings",
    "paymentstatus",
    "orderstatus",
    "zones",
    "shipmensettings",
    "shippingattributes",
  ];

  const [raised, setRaised] = React.useState(false);
  const [cardindex, setCardindex] = React.useState(-1);
  const classes = useStyles();

  const onMouseOver = () => {
    setRaised(true);
  };
  const onMouseOut = () => {
    setRaised(false);
    // setCardindex(-1)
  };

  return (
    <Grid container spacing={3}>
      {/* <AddContact contactlist={[]}/> */}
      <Grid container item xs={12} sm={12} spacing={2}>
        <Typography component="h5" variant="h5">
          Configure
        </Typography>
      </Grid>

      {master_options.map((text, index) => (
        <Grid item xs={6} sm={4} lg={3}>
          <Link
            underline="none"
            component={RouterLink}
            to={master_options_url[index]}
          >
            <Card fullwidth className="card2">
              <CardContent>
                <Typography
                  style={{ textAlign: "center", marginTop: 8 }}
                  component="h6"
                  variant="h5"
                >
                  {text}
                </Typography>

                {/* <Typography variant="body2" style={{textAlign: "center",marginTop:8}} color="textSecondary">
            Lorem Ipsum
          </Typography> */}
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
});

export default Configuration;
