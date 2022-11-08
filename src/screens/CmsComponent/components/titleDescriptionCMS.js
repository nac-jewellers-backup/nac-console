import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField } from "@material-ui/core";
import React from "react";
import { useContext } from "react";
import { TableComp } from "../../../components";
import { AlertContext } from "../../../context";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";

const header = [
    "S.No",
    "Title",
    "Descriptiom",
    "Action",
  ];
  const tableData = [
    { type: "INCREMENT", name: "" },
    { type: "TEXT", name: "title" },
    { type: "TEXT", name: "description" },
    { type: "EDIT", name: "" },
  ];

const TitleDescriptionCMS = (props) => {
  const classes = useStyles();
  const alert = useContext(AlertContext);
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    position: "",
    urlParam: "",
    mobile: "",
    web: "",
    url: null,
  });
  const [titleDesc,setTitleDesc] = React.useState([])
  React.useEffect(() => {
    setTitleDesc([props?.data?.props])
  },[])

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
        banners: [...props?.data?.props?.banners, state]
      }
    }
    setOpen(false)
    props.handleSubmit(getData,"BannerComponent","banners")
  };

  const handleEdit = (e, rowData, rowIndex) => {
    debugger;
  }
  return (
    <Paper className={classes.root}>
      <TableHeaderComp
        name={"Title and Description Component"}
        noAddNew
        handleAddNew={handleClickOpen}
      />
      <TableComp
        header={header}
        tableData={tableData}
        data={titleDesc}
        handleEdit={handleEdit}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Add New Title and Description Item</DialogTitle>
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

export default TitleDescriptionCMS;
