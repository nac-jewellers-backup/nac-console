import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
} from "@material-ui/core";
import { useContext } from "react";
import { TableComp } from "../../../components";
import { AlertContext } from "../../../context";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";

const header = ["S.No", "Image", "Action"];
const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "WEB_IMAGE", name: "image" },
  { type: "EDIT", name: "" },
];

const QueryFormCMS = (props) => {
  const classes = useStyles();
  const alert = useContext(AlertContext);
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    image: "",
  });
  const [image, setImage] = React.useState([]);
  React.useEffect(() => {
    setImage([props?.data?.props]);
  }, []);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onChangeData = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  const onsubmitvalue = async () => {
    let getData = [];
    getData = {
      component: props?.data?.component,
      props: {
        banners: [...props?.data?.props?.banners, state],
      },
    };
    setOpen(false);
    props.handleSubmit(getData, "BannerComponent", "banners");
  };

  const handleEdit = (e, rowData, rowIndex) => {
    debugger;
  };
  return (
    <Paper className={classes.root}>
      <TableHeaderComp
        name={"Query Form Component"}
        noAddNew
        handleAddNew={handleClickOpen}
      />
      <TableComp
        header={header}
        tableData={tableData}
        data={image}
        handleEdit={handleEdit}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">
          Edit Query Form
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="position"
            label="Position"
            variant="outlined"
            fullWidth
            onChange={onChangeData}
            value={state.position}
            name="position"
          />
          <TextField
            margin="dense"
            id="urlParam"
            label="Banner's Redirect Link (Routes Only)"
            variant="outlined"
            fullWidth
            onChange={onChangeData}
            value={state.urlParam}
            name="urlParam"
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

export default QueryFormCMS;
