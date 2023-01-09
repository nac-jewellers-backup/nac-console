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
import React, { useContext } from "react";
import { useState } from "react";
import { TableComp } from "../../../components";
import { useStyles } from "./styles";
import CloseIcon from "@material-ui/icons/Close";
import TableHeaderComp from "./TableHeadComp";
import { UploadImage } from "../../../utils/imageUpload";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { AlertContext } from "../../../context";

const header = ["S.No", "City", "Total Stores", "View Stores", "Action"];
const tableData = [
  { type: "INCREMENT", name: "S.No" },
  { type: "TEXT", name: "city" },
  { type: "TOTAL_STORES", name: "stores" },
  { type: "VIEW_STORES", name: "stores", customName: "View Stores" },
  { type: "ACTION", name: "" },
];

const storeHeader = [
  "S.No",
  "Title",
  "Address",
  "Store Id",
  "Location",
  "Image",
  "Button",
  "Action",
];
const viewStoreHeader = [
  "S.No",
  "Title",
  "Address",
  "Store Id",
  "Location",
  "Image",
  "Button",
];

const tableStoreData = [
  { type: "INCREMENT", name: "S.No" },
  { type: "TEXT", name: "title" },
  { type: "TEXT", name: "para" },
  { type: "TEXT", name: "key" },
  { type: "TEXT", name: "location", width: "200px" },
  { type: "WEB_IMAGE", name: "img", width: "200px" },
  { type: "TEXT", name: "button" },
  { type: "ACTION", name: "" },
];

const tableStoreView = [
  { type: "INCREMENT", name: "S.No" },
  { type: "TEXT", name: "title" },
  { type: "TEXT", name: "para" },
  { type: "TEXT", name: "key" },
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

const initialEdit = {
  isEdit: false,
  editIndex: null,
};

function StoreLocatorCMS(props) {
  const classes = useStyles();
  const alert = useContext(AlertContext);

  const [openStores, setOpenStores] = useState(false);
  const [stores, setStores] = useState([]);
  const [addStoresOpens, setAddStores] = useState(false);
  const [state, setState] = useState({
    city: "",
    stores: [],
  });
  const [showStoreFields, setShowStoreFields] = useState(false);
  const [storeState, setStoreState] = useState(initialStoreDetails);
  const [editData, setEditData] = useState(initialEdit);
  const [storesEdit, setStoresEdit] = useState(initialEdit);

  const handleViewStores = (e, data, index) => {
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
    setState({
      city: "",
      stores: [],
    });
    setEditData(initialEdit);
    setStoreState(initialStoreDetails);
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

  const validationHead = ["title", "button", "para", "location", "img", "key"];
  const storeDetailsValidate = () => {
    let err = [];
    validationHead.map((val) => {
      if (storeState[val].length === 0) err.push(val);
    });
    return err;
  };

  const addStoreDetails = () => {
    const validate = storeDetailsValidate();
    if (validate.length === 0) {
      if (storesEdit.isEdit) {
        const editStores = state.stores;
        editStores.splice(storesEdit.editIndex, 1, storeState);
        const newState = {
          city: state.city,
          stores: editStores,
        };
        setShowStoreFields(false);
        setState(newState);
      } else {
        setShowStoreFields(false);
        const newStore = [...state.stores, storeState];
        setState({
          ...state,
          stores: newStore,
        });
        setStoreState(initialStoreDetails);
      }
    } else {
      alert.setSnack({
        open: true,
        severity: "error",
        msg: "Please fill the mandatory details",
      });
    }
  };

  const handleChange = (file, name) => {
    UploadImage(file)
      .then((res) => {
        if (res?.data?.web) {
          setStoreState({
            ...storeState,
            [name]: res?.data?.web,
          });
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
    if (state.city.length > 0 && state.stores.length > 0) {
      if (editData.isEdit) {
        const storeDataEdit = props?.data?.props?.storeData;
        storeDataEdit.splice(editData.editIndex, 1, state);
        const getData = {
          component: props?.data?.component,
          props: {
            storeData: storeDataEdit,
          },
        };
        handleAddNewStoresClose();
        props.handleSubmit(getData, "Storelocator", "storeData");
      } else {
        const getData = {
          component: props?.data?.component,
          props: {
            storeData: [...props?.data?.props?.storeData, state],
          },
        };
        handleAddNewStoresClose();
        props.handleSubmit(getData, "Storelocator", "storeData");
      }
    } else {
      alert.setSnack({
        open: true,
        severity: "error",
        msg: "Please add both the State and the Store",
      });
    }
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
    props.handleSubmit(getData, "Storelocator", "storeData");
  };

  const handleEdit = (e, rowData, rowIndex) => {
    handleAddNew();
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setState(rowData);
  };

  const handleStoresEdit = (e, rowData, rowIndex) => {
    setShowStoreFields(true);
    setStoresEdit({ ...editData, isEdit: true, editIndex: rowIndex });
    setStoreState(rowData);
  };

  const handleDeleteStore = (e, rowData, rowIndex) => {
    const deleteStores = state.stores;
    deleteStores.splice(rowIndex, 1);
    const newState = {
      city: state.city,
      stores: deleteStores,
    };
    setState(newState);
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
        handleEdit={handleEdit}
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
            header={viewStoreHeader}
            tableData={tableStoreView}
            data={stores?.stores}
          />
        </DialogContent>
      </Dialog>

      {/* Add the Data */}
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
                id="key"
                label="Store Id"
                variant="outlined"
                fullWidth
                onChange={onChangeStoreData}
                value={storeState.key}
                name="key"
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
            handleEdit={handleStoresEdit}
            handleDelete={handleDeleteStore}
          />

          <DialogActions style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={onsubmitvalue}>
              Submit
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
