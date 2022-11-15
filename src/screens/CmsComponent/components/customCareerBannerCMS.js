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
import { TableComp } from "../../../components";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const header = ["Title", "Content", "Mobile Image", "Web Image", "Action"];

const tableData = [
  { type: "TEXT", name: "title" },
  { type: "TEXT", name: "content" },
  { type: "MBL_IMAGE", name: "mobile" },
  { type: "WEB_IMAGE", name: "web" },
  { type: "ACTION", name: "" },
];

const CustomCareerBannerCMS = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const initialState = {
    title: "",
    content: "",
    mobile: "",
    web: "",
  };
  const [state, setState] = React.useState(initialState);
  const [disableButton, setDisable] = React.useState({
    web: false,
    mobile: false,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onsubmitvalue = () => {
    setOpen(false);
    setState(initialState);
    console.log("stt", state);
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
          name={"Career Banner Component"}
          handleAddNew={handleClickOpen}
        />
        <TableComp
          header={header}
          tableData={tableData}
          data={props?.data?.props?.banners}
        />

        {/* Dialog */}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="form-dialog-title">Add New Banner Item</DialogTitle>
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
              id="content"
              label="Content"
              variant="outlined"
              fullWidth
              value={state.content}
              onChange={onChangeData}
              name="content"
              required
            />

            {/* Image Upload */}

            <Grid
              container
              justifyContent="space-around"
              style={{ padding: "16px 0px" }}
            >
              <Grid item>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="button-file"
                  multiple
                  type="file"
                />
                <label htmlFor="button-file">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    disabled={disableButton.mobile}
                  >
                    Mobile Image
                  </Button>
                </label>
              </Grid>
              <Grid item>
                <input
                  accept="image/*"
                  className={classes.input}
                  style={{ display: "none" }}
                  id="button-files"
                  multiple
                  type="file"
                />
                <label htmlFor="button-files">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={disableButton.web}
                    startIcon={<CloudUploadIcon />}
                  >
                    Desktop Image
                  </Button>
                </label>
              </Grid>
            </Grid>
            {(state.mobile.length > 0 || state.web.length > 0) && (
              <Grid
                container
                justifyContent="flex-start"
                style={{ padding: "16px 0px" }}
              >
                {state.mobile.length > 0 && (
                  <Grid style={{ textAlign: "center" }} xs={6} md={6} item>
                    <img
                      alt="nacimages"
                      src={state.mobile}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </Grid>
                )}
                {state.web.length > 0 && (
                  <Grid style={{ textAlign: "center" }} xs={6} md={6} item>
                    <img
                      alt="nacimages"
                      src={state.web}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </Grid>
                )}
              </Grid>
            )}
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

export default CustomCareerBannerCMS;
