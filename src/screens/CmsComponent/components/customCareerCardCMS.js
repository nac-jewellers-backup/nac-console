import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField } from "@material-ui/core";
import React from "react";
import { TableComp } from "../../../components";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";

const header = ["Job Role", "Location", "Description", "Action"];

const tableData = [
  { type: "TEXT", name: "job_Role" },
  { type: "TEXT", name: "location" },
  { type: "TEXT", name: "description" },
  { type: "ACTION", name: "" },
];

const CustomCareerCardCMS = (props) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const initialState = {
    job_Role: "",
    location: "",
    description: "",
  };
  const [state, setState] = React.useState(initialState);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onsubmitvalue = () => {
    setOpen(false);
    // setState(initialState);
    console.log("stt-1", state);
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
