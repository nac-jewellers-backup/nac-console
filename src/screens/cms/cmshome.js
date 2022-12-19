import { FormControlLabel, Switch } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../config";
import { AlertContext } from "../../context";
import { ALLCDNPAGES, UPDATE_STATUS_CMS } from "../../graphql/cmsQuery";

const CmsHome = (props) => {
  let history = useHistory();
  const snack = React.useContext(AlertContext);

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

  const fetchData = () => {
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
  }

  const getThePageTitle = (name) => {
    let createdName = name.replace(/[A-Z]/g, val => " " + `${val.toLowerCase()}`);
    if (name === "loc") {
      return createdName = "Store Locator Details"
    } else {
      return createdName
    }
  };

  const handleChangeActive = (page, isActive) => {
    fetch(`${API_URL}/graphql`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: UPDATE_STATUS_CMS,
        variables: {
          isActive: !isActive,
          page: page,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // debugger;
        snack.setSnack({
          open: true,
          msg: "Status Updated Successfully",
        });
        fetchData()
      });
  }
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
          <div>
            <Card fullwidth className="card2">
              <CardContent>
                <Typography
                  style={{
                    textAlign: "center",
                    margin: "8px 0px",
                    textTransform: "capitalize",
                    cursor: "pointer",
                    borderRadius: "8px",
                    backgroundColor: "#3f51b5",
                    padding: "8px",
                    color: "#fff"
                  }}
                  component="h6"
                  variant="h5"
                  onClick={() => handleClick(val.page)}
                >
                  {getThePageTitle(val.page)}
                </Typography>
                <FormControlLabel
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  control={
                    <Switch
                      checked={val.isActive}
                      onChange={() => handleChangeActive(val.page, val.isActive)}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="Is Page Active?"
                />
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
