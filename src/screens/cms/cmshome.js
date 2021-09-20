import React from "react";

import Grid from "@material-ui/core/Grid";

import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import Typography from "@material-ui/core/Typography";
const CmsHome = (props) => {
  return (
    <Grid container spacing={3}>
      {/* <AddContact contactlist={[]}/> */}
      <Grid container item xs={12} sm={12} spacing={2}>
        <Typography component="h5" variant="h5">
          CMS Complete List
        </Typography>
      </Grid>

      <Grid item xs={6} sm={4} lg={3}>
        <Link underline="none" component={RouterLink} to="/silverbanner">
          <Card fullwidth className="card2">
            <CardContent>
              <Typography style={{ textAlign: "center", marginTop: 8 }} component="h6" variant="h5">
                NAC Banners
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>

      <Grid item xs={6} sm={4} lg={3}>
        <Link underline="none" component={RouterLink} to="/featuredproduct">
          <Card fullwidth className="card2">
            <CardContent>
              <Typography style={{ textAlign: "center", marginTop: 8 }} component="h6" variant="h5">
                Featured Product
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    </Grid>
  );
};

export default CmsHome;