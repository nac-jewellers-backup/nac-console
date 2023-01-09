import React from "react";
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
import { TableComp } from "../../../components";
import TableHeaderComp from "./TableHeadComp";
import { useStyles } from "./styles";
import { UploadImage } from "../../../utils/imageUpload";
import { AlertContext } from "../../../context";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const header = ["S.No", "Title", "Action"];
const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "TEXT", name: "title" },
  { type: "EDIT", name: "" },
];

const TitleComp = (props) => {
  const { data } = props;
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState([]);
  const [state, setState] = React.useState({
    title: "",
  });

  React.useEffect(() => {
    setTitle([data?.props]);
    setState(data?.props);
  }, []);

  const onChangeData = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleEdit = (e, rowData, rowIndex) => {
    setState(state);
    handleClickOpen();
    setState(rowData);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validation = () => {
    if (state.title.length < 1) {
      return false;
    } else {
      return true;
    }
  };

  const onsubmitvalue = async () => {
    if (validation()) {
      let getData = [];
      getData = {
        component: props?.data?.component,
        props: state,
      };
      setTitle([getData.props]);
      setOpen(false);
      props.handleSubmit(getData, "titleComp", "");
    } else {
      alert.setSnack({
        open: true,
        severity: "error",
        msg: "Please fill all the fields in the form ",
      });
    }
  };
  return (
    <Paper className={classes.root}>
      <TableHeaderComp name={" Title Component"} noAddNew />
      <TableComp
        header={header}
        tableData={tableData}
        data={title}
        handleEdit={handleEdit}
      />
      <Dialog
        classes={{ paper: classes.dialogPaperMid }}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="form-dialog-title">Edit Title Component</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="title"
            variant="outlined"
            fullWidth
            onChange={onChangeData}
            value={state?.title}
            name="title"
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
export default TitleComp;
