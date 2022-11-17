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
import { useContext } from "react";
import { AlertContext } from "../../../context";
import { UploadImage } from "../../../utils/imageUpload";

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
  const alert = useContext(AlertContext);
  const initialState = {
    title: "",
    content: "",
    mobile: "",
    web: "",
  };

  const initialEdit = {
    isEdit: false,
    editIndex: null,
  };

  const [editData, setEditData] = React.useState(initialEdit);
  const [state, setState] = React.useState(initialState);
  const [disableButton, setDisable] = React.useState({
    web: false,
    mobile: false,
  });

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

  const handleChange = (file, name) => {
    UploadImage(file)
      .then((res) => {
        if (res?.data?.web) {
          setState({
            ...state,
            [name]: res?.data?.web,
          });
          // setDisable({ ...disableButton, [name]: true });

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

  const onsubmitvalue = async () => {
    if (state.title && state.content && state.mobile && state.web) {
      if (editData.isEdit) {
        const editBanner = props?.data?.props?.banners;
        editBanner.splice(editData.editIndex, 1, state);
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            banners: editBanner,
          },
        };
        setOpen(false);
        props.handleSubmit(getData, "CustomBanner", "banners");
      } else {
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            banners: [...props?.data?.props?.banners, state],
          },
        };
        setOpen(false);
        props.handleSubmit(getData, "CustomBanner", "banners");
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
    const banners = props?.data?.props?.banners;
    banners.splice(rowIndex, 1);
    getData = {
      component: props?.data?.component,
      props: {
        banners: banners,
      },
    };
    props.handleSubmit(getData, "CustomBanner", "banners");
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
          name={"Career Banner Component"}
          handleAddNew={handleClickOpen}
          noAddNew
        />
        <TableComp
          header={header}
          tableData={tableData}
          data={props?.data?.props?.banners}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
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
