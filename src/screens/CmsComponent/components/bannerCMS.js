import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { TableComp } from "../../../components";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { UploadImage } from "../../../utils/imageUpload";
import { AlertContext } from "../../../context";
import { useContext } from "react";
import { useEffect } from "react";

const header = [
  "Position",
  "Link to Check",
  "Mobile Image",
  "Desktop Image",
  "Action",
];
const tableData = [
  { type: "INCREMENT", name: "position" },
  { type: "TEXT", name: "url" },
  { type: "MBL_IMAGE", name: "mobile" },
  { type: "WEB_IMAGE", name: "web" },
  { type: "ACTION", name: "" },
];

const BannerCMS = (props) => {
  const classes = useStyles();
  const alert = useContext(AlertContext);
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    position: "",
    urlParam: "",
    mobile: "",
    web: "",
    url: null
  });
  const [disableButton, setDisable] = React.useState({
    web: false,
    mobile: false,
  });

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

  const handleChange = (file, name) => {
    UploadImage(file)
      .then((res) => {
        if (res?.data?.web) {
          setState({
            ...state,
            [name]: res?.data?.web,
          });
          setDisable({ ...disableButton, [name]: true });

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

  const handleDelete = (e, rowData, rowIndex) => {
    let getData = [];
    const banners = props?.data?.props?.banners
    banners.splice(rowIndex,1);
    
    getData = {
      component: props?.data?.component,
      props: {
        banners: banners
      }
    }
    console.log("spliceBanners",getData)
    props.handleSubmit(getData,"BannerComponent","banners")
  }
  return (
    <Paper className={classes.root}>
      <TableHeaderComp
        name={"Banner Component"}
        handleAddNew={handleClickOpen}
      />
      <TableComp
        header={header}
        tableData={tableData}
        data={props?.data?.props?.banners}
        handleDelete={handleDelete}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Add New Banner Item</DialogTitle>
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
                onChange={(e) => handleChange(e.target.files[0], "mobile")}
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
                onChange={(e) => handleChange(e.target.files[0], "web")}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onsubmitvalue}>Add</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BannerCMS;
