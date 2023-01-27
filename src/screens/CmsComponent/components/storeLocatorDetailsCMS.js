import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
} from "@material-ui/core";
import React from "react";
import { TableComp } from "../../../components";
import TableHeaderComp from "./TableHeadComp";
import { useStyles } from "./styles";

const header = [
  "S.No",
  "Title",
  "Address",
  "Map Link",
  "Contact Number",
  "Store Id",
  "Action",
];

const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "TEXT", name: "title" },
  { type: "TEXT", name: "address" },
  { type: "TEXT", name: "url", width: "300px" },
  { type: "TEXT", name: "contactNo" },
  { type: "TEXT", name: "key" },
  { type: "ACTION", name: "" },
];

const initialState = {
  title: "",
  address: "",
  url: "",
  contactNo: "",
  key: "",
};

const initialEdit = {
  isEdit: false,
  editIndex: null,
};

const StoreLocatorDetailsCMS = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(initialState);
  const [editData, setEditData] = React.useState(initialEdit);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onChangeData = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setState(initialState);
    setEditData(initialEdit)
  };

  const onsubmitvalue = async () => {
    if (
      state.title &&
      state.address &&
      state.contactNo &&
      state.key
    ) {
      if (editData.isEdit) {
        const editContent = props?.data?.props;
        editContent.splice(editData.editIndex, 1, state);
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: editContent,
        };
        setOpen(false);
        setState(initialState);
        setEditData(initialEdit)
        props.handleSubmit(getData, "StoreDetailsComponent", "");
      } else {
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: [...props?.data?.props, state],
        };
        setOpen(false);
        setState(initialState);
        props.handleSubmit(getData, "StoreDetailsComponent", "cardContent");
      }
    } else {
      alert.setSnack({
        open: true,
        severity: "error",
        msg: "Please fill all the fields",
      });
    }
  };

  const handleEdit = (e, rowData, rowIndex) => {
    setOpen(true);
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setState(rowData);
  };

  const handleDelete = (e, rowData, rowIndex) => {
    let getData = [];
    const deleteContent = props?.data?.props;
    deleteContent.splice(rowIndex, 1);
    getData = {
      component: props?.data?.component,
      props: deleteContent
    };
    props.handleSubmit(getData, "StoreDetailsComponent", "");
  };

  return (
    <Paper className={classes.root}>
      <TableHeaderComp
        name={"Career Card Component"}
        handleAddNew={handleClickOpen}
      />
      <TableComp
        header={header}
        tableData={tableData}
        data={props?.data?.props}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {/* Dialog */}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Add New Card Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            variant="outlined"
            fullWidth
            value={state.title}
            onChange={onChangeData}
            name="title"
            required
          />
          <TextField
            margin="dense"
            id="address"
            label="Address"
            variant="outlined"
            fullWidth
            value={state.address}
            onChange={onChangeData}
            name="address"
            required
          />
          <TextField
            margin="dense"
            id="url"
            label="Map Link"
            variant="outlined"
            fullWidth
            value={state.url}
            onChange={onChangeData}
            name="url"
            required
          />
          <TextField
            margin="dense"
            id="contactNo"
            label="Contact No"
            variant="outlined"
            fullWidth
            value={state.contactNo}
            onChange={onChangeData}
            name="contactNo"
            required
          />
          <TextField
            margin="dense"
            id="key"
            label="Store Id"
            variant="outlined"
            fullWidth
            value={state.key}
            onChange={onChangeData}
            name="key"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onsubmitvalue}>Add</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default StoreLocatorDetailsCMS;
