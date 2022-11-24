import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import React from "react";
import { useContext } from "react";
import { TableComp } from "../../../components";
import { AlertContext } from "../../../context";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";

const header = ["S.No", "Title", "Description", "Action"];

const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "TEXT", name: "title" },
  { type: "TEXT", name: "description" },
  { type: "EDIT", name: "" },
];

const CustomCollectionHeaderCMS = (props) => {
  console.log("prop123", props);
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const alert = useContext(AlertContext);
  const initialState = {
    title: "",
    description: "",
  };

  const initialEdit = {
    isEdit: false,
    editIndex: null,
  };

  const [editData, setEditData] = React.useState(initialEdit);
  const [state, setState] = React.useState(initialState);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setState(initialState);
  };

  const onChangeData = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const onsubmitvalue = async () => {
    if (state.title && state.description) {
      if (editData.isEdit) {
        const editHeader = props?.data?.props?.header;
        editHeader.splice(editData.editIndex, 1, state);
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            header: editHeader,
          },
        };
        setOpen(false);
        props.handleSubmit(getData, "CollectionHeader", "header");
      } else {
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            header: [...props?.data?.props?.header, state],
          },
        };
        setOpen(false);
        props.handleSubmit(getData, "CollectionHeader", "header");
      }
      setEditData(initialEdit);
      setState(initialState);
    } else {
      alert.setSnack({
        open: true,
        severity: "error",
        msg: "Please fill all the fields",
      });
    }
  };

  const handleDelete = (e, rowData, rowIndex) => {
    let getData = [];
    const header = props?.data?.props?.header;
    header.splice(rowIndex, 1);
    getData = {
      component: props?.data?.component,
      props: {
        header: header,
      },
    };
    props.handleSubmit(getData, "CollectionHeader", "header");
  };

  const handleEdit = (e, rowData, rowIndex) => {
    setOpen(true);
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setState(rowData);
  };

  return (
    <>
      <Paper className={classes.root}>
        <TableHeaderComp
          name={"Collection Header Component"}
          handleAddNew={handleClickOpen}
          noAddNew
        />
        <TableComp
          header={header}
          tableData={tableData}
          data={props?.data?.props?.header}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </Paper>

      {/* Dialog */}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Add New Header Item</DialogTitle>
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
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            variant="outlined"
            fullWidth
            value={state.description}
            onChange={onChangeData}
            name="description"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onsubmitvalue}>Add</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomCollectionHeaderCMS;
