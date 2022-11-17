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
import { useContext } from "react";
import { TableComp } from "../../../components";
import { AlertContext } from "../../../context";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";

const header = ["Job Role", "Location", "Description", "Button Text", "Action"];

const tableData = [
  { type: "TEXT", name: "job_Role" },
  { type: "TEXT", name: "location" },
  { type: "TEXT", name: "description" },
  { type: "TEXT", name: "button_Text" },
  { type: "ACTION", name: "" },
];

const CustomCareerCardCMS = (props) => {
  console.log("textt", props);
  const classes = useStyles();

  const alert = useContext(AlertContext);

  const [open, setOpen] = React.useState(false);
  const initialState = {
    job_Role: "",
    location: "",
    description: "",
    button_Text: "",
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

  const onsubmitvalue = async () => {
    if (
      state.job_Role &&
      state.location &&
      state.description &&
      state.button_Text
    ) {
      if (editData.isEdit) {
        const editContent = props?.data?.props?.cardContent;
        editContent.splice(editData.editIndex, 1, state);
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            cardContent: editContent,
          },
        };
        setOpen(false);
        props.handleSubmit(getData, "CareerCard", "cardContent");
      } else {
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            cardContent: [...props?.data?.props?.cardContent, state],
          },
        };
        setOpen(false);
        props.handleSubmit(getData, "CareerCard", "cardContent");
      }
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
    const cardContent = props?.data?.props?.cardContent;
    cardContent.splice(rowIndex, 1);
    getData = {
      component: props?.data?.component,
      props: {
        cardContent: cardContent,
      },
    };
    props.handleSubmit(getData, "CareerCard", "cardContent");
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

  const handleEdit = (e, rowData, rowIndex) => {
    setOpen(true);
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setState(rowData);
  };

  return (
    <>
      <Paper className={classes.root}>
        <TableHeaderComp
          name={"Career Card Component"}
          handleAddNew={handleClickOpen}
        />
        <TableComp
          header={header}
          tableData={tableData}
          data={props?.data?.props?.cardContent}
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
              id="job_Role"
              label="Job_Role"
              variant="outlined"
              fullWidth
              value={state.job_Role}
              onChange={onChangeData}
              name="job_Role"
              required
            />
            <TextField
              margin="dense"
              id="location"
              label="Location"
              variant="outlined"
              fullWidth
              value={state.location}
              onChange={onChangeData}
              name="location"
              required
            />
            <TextField
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
            <TextField
              margin="dense"
              id="button_Text"
              label="Button Text"
              variant="outlined"
              fullWidth
              value={state.button_Text}
              onChange={onChangeData}
              name="button_Text"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onsubmitvalue}>Add</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default CustomCareerCardCMS;
