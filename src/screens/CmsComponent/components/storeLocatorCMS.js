import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  DialogActions,
} from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { TableComp } from "../../../components";
import { useStyles } from "./styles";
import CloseIcon from "@material-ui/icons/Close";
import TableHeaderComp from "./TableHeadComp";
import { UploadImage } from "../../../utils/imageUpload";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const header = ["S.No", "City", "Total Stores", "View Stores", "Action"];
const tableData = [
  { type: "INCREMENT", name: "S.No" },
  { type: "TEXT", name: "city" },
  { type: "TOTAL_STORES", name: "stores" },
  { type: "VIEW_STORES", name: "stores" },
  { type: "ACTION", name: "" },
];

const storeHeader = ["S.No", "Title", "Address", "Location", "Image", "Button"];
const tableStoreData = [
  { type: "INCREMENT", name: "S.No" },
  { type: "TEXT", name: "title" },
  { type: "TEXT", name: "para" },
  { type: "TEXT", name: "location", width: "200px" },
  { type: "WEB_IMAGE", name: "img", width: "200px" },
  { type: "TEXT", name: "button" },
];

const initialStoreDetails = {
  title: "",
  button: "",
  para: "",
  location: "",
  img: "",
  key: "",
  href: "",
};

function StoreLocatorCMS(props) {
  const classes = useStyles();
  const [openStores, setOpenStores] = useState(false);
  const [stores, setStores] = useState([]);
  const [addStoresOpens, setAddStores] = useState(false);
  const [state, setState] = useState({
    city: "",
    stores: [],
  });
  console.log("stateLocatorNew", state);
  const [showStoreFields, setShowStoreFields] = useState(false);
  const [storeState, setStoreState] = useState(initialStoreDetails);
  console.log("storeState", storeState);
  const handleViewStores = (e, data, index) => {
    console.log("dataClicked", data);
    setOpenStores(true);
    setStores(data);
  };

  const handleCloseStores = () => {
    setOpenStores(false);
  };

  const handleAddNew = () => {
    setAddStores(true);
  };

  const handleAddNewStoresClose = () => {
    setAddStores(false);
  };

  const onChangeData = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const onChangeStoreData = (event) => {
    setStoreState({
      ...storeState,
      [event.target.name]: event.target.value,
    });
  };

  const handleShowStoreField = () => {
    setShowStoreFields(true);
  };

  const addStoreDetails = () => {
    debugger;
    setShowStoreFields(false);
    const newStore = [...state.stores, storeState];
    setState({
      ...state,
      stores: newStore,
    });
    setStoreState(initialStoreDetails);
  };

  const handleChange = (file, name) => {
    UploadImage(file)
      .then((res) => {
        if (res?.data?.web) {
          setStoreState({
            ...storeState,
            [name]: res?.data?.web,
          });
          // setDisable({ ...disableButton, [name]: true });

          alert.setSnack({
            open: true,
            severity: "success",
            msg: "Image Uploaded Successfully",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onsubmitvalue = () => {
    const getData = {
      component: props?.data?.component,
      props: {
        storeData: [...props?.data?.props?.storeData, state],
      },
    };
    handleAddNewStoresClose();
    props.handleSubmit(getData, "Storelocator", "storeData");
  };

  const handleDelete = (e, rowData, rowIndex) => {
    let getData = [];
    const storeData = props?.data?.props?.storeData;
    storeData.splice(rowIndex, 1);
    getData = {
      component: props?.data?.component,
      props: {
        storeData: storeData,
      },
    };
    console.log("StorelocatorDelete", getData);
    props.handleSubmit(getData, "Storelocator", "storeData");
  };

  return (
    <Paper className={classes.root}>
      <TableHeaderComp
        name={"Store Locator Component"}
        handleAddNew={handleAddNew}
      />

      <TableComp
        header={header}
        tableData={tableData}
        data={props?.data?.props?.storeData}
        handleViewStores={handleViewStores}
        handleDelete={handleDelete}
      />

      {/* View the Stores */}
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullWidth
        open={openStores}
        onClose={handleCloseStores}
      >
        <DialogTitle id="form-dialog-title">
          <div className={classes.dialogHeader}>
            <div>Stores in {stores?.city}</div>
            <div style={{ cursor: "pointer" }} onClick={handleCloseStores}>
              <CloseIcon />
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <TableComp
            header={storeHeader}
            tableData={tableStoreData}
            data={stores?.stores}
          />
        </DialogContent>
      </Dialog>

      {/* View the Stores */}
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullWidth
        open={addStoresOpens}
        onClose={handleAddNewStoresClose}
      >
        <DialogTitle id="form-dialog-title" style={{ paddingBottom: "0px" }}>
          <div className={classes.dialogHeader}>
            <div>Add new data</div>
            <div
              style={{ cursor: "pointer" }}
              onClick={handleAddNewStoresClose}
            >
              <CloseIcon />
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div
            className={classes.dialogHeader}
            style={{
              borderBottom: "1px solid #e0e0e0",
              marginBottom: "6px",
              paddingBottom: "6px",
            }}
          >
            <TextField
              margin="dense"
              id="url"
              label="Add New State"
              variant="outlined"
              onChange={onChangeData}
              value={state.city.toUpperCase()}
              name="city"
              required
              style={{ width: "80%" }}
            />
            {!showStoreFields && (
              <Button onClick={handleShowStoreField}>Add New Store</Button>
            )}
          </div>

          {showStoreFields && (
            <div>
              <Typography variant="h6">Add Store Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    margin="dense"
                    id="title"
                    label="City"
                    variant="outlined"
                    fullWidth
                    onChange={onChangeStoreData}
                    value={storeState.title}
                    name="title"
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="dense"
                    id="button"
                    label="Button"
                    variant="outlined"
                    fullWidth
                    onChange={onChangeStoreData}
                    value={storeState.button}
                    name="button"
                    required
                  />
                </Grid>
              </Grid>
              <TextField
                margin="dense"
                id="link"
                label="Link"
                variant="outlined"
                fullWidth
                onChange={onChangeStoreData}
                value={storeState.href}
                name="href"
              />
              <TextField
                margin="dense"
                id="location"
                label="Location"
                variant="outlined"
                fullWidth
                onChange={onChangeStoreData}
                value={storeState.location}
                name="location"
                required
              />
              <TextField
                margin="dense"
                id="para"
                label="Address"
                variant="outlined"
                fullWidth
                onChange={onChangeStoreData}
                value={storeState.para}
                name="para"
                required
              />
              <Grid container style={{ paddingTop: "8px" }}>
                <Grid item>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="button-file"
                    multiple
                    type="file"
                    onChange={(e) => handleChange(e.target.files[0], "img")}
                  />
                  <label htmlFor="button-file">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                    >
                      Add Image
                    </Button>
                  </label>
                </Grid>
                {storeState.img.length > 0 && (
                  <Grid item>
                    <img
                      alt="nacimages"
                      src={storeState.img}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </Grid>
                )}
              </Grid>
              <div
                className={classes.dialogHeader}
                style={{ justifyContent: "center" }}
                onClick={addStoreDetails}
              >
                <Button variant="contained" color="primary">
                  Add Store Details
                </Button>
              </div>
            </div>
          )}
          <Typography variant="h6" style={{ margin: "10px 0px" }}>
            Stores Added
          </Typography>
          <TableComp
            header={storeHeader}
            tableData={tableStoreData}
            data={state?.stores}
          />

          <DialogActions style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={onsubmitvalue}>
              Add
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddNewStoresClose}
            >
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

export default StoreLocatorCMS;
