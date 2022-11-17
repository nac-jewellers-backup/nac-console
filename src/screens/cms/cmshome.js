import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../config";
import { ALLCDNPAGES } from "../../graphql/cmsQuery";

const CmsHome = (props) => {
  let history = useHistory();

  const [state, setState] = useState([]);
  console.log("fetchedPages", state);

  const handleClick = (name) => {
    history.push({
      pathname: "/cmsComponent",
      state: {
        name: name,
      },
    });
  };

  useEffect(() => {
    fetch(`${API_URL}/graphql`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: ALLCDNPAGES,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // debugger;
        const dataRecieved = data.data.allCdns.nodes;
        setState(dataRecieved);
      });
  }, []);
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
              <Typography
                style={{ textAlign: "center", marginTop: 8 }}
                component="h6"
                variant="h5"
              >
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
              <Typography
                style={{ textAlign: "center", marginTop: 8 }}
                component="h6"
                variant="h5"
              >
                Featured Product
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>

      <Grid item xs={6} sm={4} lg={3}>
        <Link underline="none" component={RouterLink} to="/comments">
          <Card fullwidth className="card2">
            <CardContent>
              <Typography
                style={{ textAlign: "center", marginTop: 8 }}
                component="h6"
                variant="h5"
              >
                Customers Reviews
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
      <Grid item xs={6} sm={4} lg={3}>
        <Link underline="none" component={RouterLink} to="/newarrival">
          <Card fullwidth className="card2">
            <CardContent>
              <Typography
                style={{ textAlign: "center", marginTop: 8 }}
                component="h6"
                variant="h5"
              >
                New Arrival
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>

      {/* cms page */}
      {state.map((val) => (
        <Grid item xs={6} sm={4} lg={3}>
          {/* <Link underline="none" component={RouterLink} to="/cmsComponent"> */}
          <div
            onClick={() => handleClick(val.page)}
            style={{ cursor: "pointer" }}
          >
            <Card fullwidth className="card2">
              <CardContent>
                <Typography
                  style={{ textAlign: "center", marginTop: 8 }}
                  component="h6"
                  variant="h5"
                >
                  {val.page}
                </Typography>
              </CardContent>
            </Card>
          </div>
          {/* </Link> */}
        </Grid>
      ))}
    </Grid>
  );
};

export default CmsHome;
