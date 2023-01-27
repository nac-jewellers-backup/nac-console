import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@material-ui/core";
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
import { ALLCDNPAGES, UPDATE_STATUS_CMS, UPDATE_URL } from "../../graphql/cmsQuery";
import EditIcon from "@material-ui/icons/Edit";
import { useStyles } from "./styles";

const CmsHome = (props) => {
  let history = useHistory();
  const snack = React.useContext(AlertContext);
  const classes = useStyles();

  const [state, setState] = useState([]);
  const [edit, setEdit] = useState({
    open: false,
    page: "",
  });
  console.log("edit",edit);
  const [newPage, setNewPage] = useState("");

  console.log("fetchedPages", state);

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
        const dataRecieved = data.data.allCdns.nodes;
        setState(dataRecieved);
      });
  }, []);

  // Chnage the name of the new UrL
  const handleChangeData = (value) => {
    setNewPage(value);
  };

  // Load the particular page 
  const handleClick = (name) => {
    history.push({
      pathname: "/cmsComponent",
      state: {
        name: name,
      },
    });
  };

  // Fetch the initial data
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
        const dataRecieved = data.data.allCdns.nodes;
        setState(dataRecieved);
      });
  };

  // Open the Edit page 
  const handleOpenEdit = (page) => {
    setEdit({
      open: true,
      page:page
    })
  };

  // Get the Name of the Page
  const getThePageTitle = (name) => {
    let createdName = name.replace(
      /[A-Z]/g,
      (val) => " " + `${val.toLowerCase()}`
    );
    if (name === "loc") {
      return (createdName = "Store Locator Details");
    } else {
      return createdName;
    }
  };

  // Update the Status
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
        snack.setSnack({
          open: true,
          msg: "Status Updated Successfully",
        });
        fetchData();
      });
  };

  // Edit the URL
  const handleEditSumbit = () => {
    fetch(`${API_URL}/graphql`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: UPDATE_URL,
        variables: {
          page: edit.page,
          changePage: newPage
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        snack.setSnack({
          open: true,
          msg: "Status Updated Successfully",
        });
        setEdit({
          open:false,
          page:""
        })
        fetchData();
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
          <div>
            <Card fullwidth className="card2">
              <CardContent>
                <Typography
                  className={classes.cardButton}
                  component="h6"
                  variant="h5"
                  onClick={() => handleClick(val.page)}
                >
                  {getThePageTitle(val.page)}
                </Typography>
                <div className={classes.labelAlign}>
                  <div className={classes.edit}>
                    <Typography>Is page active:</Typography>
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      control={
                        <Switch
                          checked={val.isActive}
                          onChange={() =>
                            handleChangeActive(val.page, val.isActive)
                          }
                          name="checkedB"
                          color="primary"
                        />
                      }
                    />
                  </div>
                  <EditIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => handleOpenEdit(val.page)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          {/* </Link> */}
        </Grid>
      ))}
      <Dialog
        classes={{ paper: classes.dialogPaperMid }}
        open={edit.open}
        onClose={() => {
          setEdit({
            open: false,
            page: "",
          });
        }}
      >
        <DialogTitle id="form-dialog-title">Change the URL</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="page"
            label="Page Route"
            variant="outlined"
            fullWidth
            onChange={(e) => handleChangeData(e.target.value)}
            value={newPage}
            name="page"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditSumbit}>Edit Url</Button>
          <Button
            onClick={() => {
              setEdit({
                open: false,
                page: "",
              });
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default CmsHome;
