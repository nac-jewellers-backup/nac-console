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

const header = [
  "S.No",
  "Title",
  "Description",
  "Customer Care",
  "Whats App",
  "Email",
  "Action",
];

const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "TEXT", name: "title" },
  { type: "TEXT", name: "description" },
  { type: "TEXT", name: "customer_Care" },
  { type: "TEXT", name: "whatsApp" },
  { type: "TEXT", name: "email" },
  { type: "EDIT", name: "" },
];

const ContactUsCMS = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const alert = useContext(AlertContext);

  const initialState = {
    title: "",
    description: "",
    customer_Care: "",
    whatsApp: "",
    email: "",
  };

  const initialEdit = {
    isEdit: false,
    editIndex: null,
  };

  const [editData, setEditData] = React.useState(initialEdit);
  const [state, setState] = React.useState(initialState);

  const onChangeData = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setState(initialState);
  };

  const onsubmitvalue = async () => {
    if (
      state.title &&
      state.description &&
      state.customer_Care &&
      state.whatsApp &&
      state.email
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
        props.handleSubmit(getData, "formContent", "cardContent");
      } else {
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            cardContent: [...props?.data?.props?.cardContent, state],
          },
        };
        setOpen(false);
        props.handleSubmit(getData, "formContent", "cardContent");
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
    const content = props?.data?.props?.cardContent;
    content.splice(rowIndex, 1);
    getData = {
      component: props?.data?.component,
      props: {
        cardContent: content,
      },
    };
    props.handleSubmit(getData, "formContent", "cardContent");
  };

  const handleEdit = (e, rowData, rowIndex) => {
    setOpen(true);
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setState(rowData);
  };
  return (
    <Paper className={classes.root}>
      <TableHeaderComp
        name={"Contact Us Component"}
        handleAddNew={handleClickOpen}
        noAddNew
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
        <DialogTitle id="form-dialog-title">
          Add New Advertisement Item
        </DialogTitle>
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
          <TextField
            margin="dense"
            id="customer_Care"
            label="Customer Care"
            variant="outlined"
            fullWidth
            value={state.customer_Care}
            onChange={onChangeData}
            name="customer_Care"
            required
          />
          <TextField
            autoFocus
            margin="dense"
            id="whatsApp"
            label="WhatsApp"
            variant="outlined"
            fullWidth
            value={state.whatsApp}
            onChange={onChangeData}
            name="whatsApp"
            required
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Id"
            variant="outlined"
            fullWidth
            value={state.email}
            onChange={onChangeData}
            name="email"
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

export default ContactUsCMS;
