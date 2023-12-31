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
import { AlertContext } from "../../../context";
import { useContext } from "react";
import { UploadImage } from "../../../utils/imageUpload";

const header = [
  "S.No",
  "Image",
  "Description",
  "Italic Text",
  "Button Text",
  "Url",
  "Action",
];

const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "WEB_IMAGE", name: "img" },
  { type: "TEXT", name: "description" },
  { type: "TEXT", name: "italic_text" },
  { type: "TEXT", name: "button_text" },
  { type: "TEXT", name: "url" },
  { type: "ACTION", name: "" },
];

const CustomAdvertisementCMS = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const alert = useContext(AlertContext);
  const initialState = {
    img: "",
    description: "",
    italic_text: "",
    button_text: "",
    url: "",
  };

  const initialEdit = {
    isEdit: false,
    editIndex: null,
  };

  const [editData, setEditData] = React.useState(initialEdit);
  const [state, setState] = React.useState(initialState);
  const [disableButton, setDisable] = React.useState({
    img: false,
  });

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
    if (state.img && state.description && state.button_text && state.url) {
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
        props.handleSubmit(getData, "CustomAdvertising", "cardContent");
      } else {
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            cardContent: [...props?.data?.props?.cardContent, state],
          },
        };
        setOpen(false);
        props.handleSubmit(getData, "CustomAdvertising", "cardContent");
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
    props.handleSubmit(getData, "CustomAdvertising", "cardContent");
  };

  const handleEdit = (e, rowData, rowIndex) => {
    setOpen(true);
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setState(rowData);
  };
  return (
    <Paper className={classes.root}>
      <TableHeaderComp
        name={"Advertisement Component"}
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
        <DialogTitle id="form-dialog-title">
          Add New Advertisement Item
        </DialogTitle>
        <DialogContent>
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
            autoFocus
            margin="dense"
            id="italic_text"
            label="Italic_text"
            variant="outlined"
            fullWidth
            value={state.italic_text}
            onChange={onChangeData}
            name="italic_text"
            required
          />
          <TextField
            margin="dense"
            id="button_text"
            label="Button_text"
            variant="outlined"
            fullWidth
            value={state.button_text}
            onChange={onChangeData}
            name="button_text"
            required
          />
          <TextField
            autoFocus
            margin="dense"
            id="url"
            label="Url"
            variant="outlined"
            fullWidth
            value={state.url}
            onChange={onChangeData}
            name="url"
            required
          />

          {/* Image Upload */}

          <Grid container style={{ padding: "16px 0px" }}>
            <Grid item>
              <input
                accept="image/*"
                className={classes.input}
                style={{ display: "none" }}
                id="button-files"
                multiple
                type="file"
                onChange={(e) => handleChange(e.target.files[0], "img")}
              />
              <label htmlFor="button-files">
                <Button
                  variant="outlined"
                  component="span"
                  disabled={disableButton.img}
                  startIcon={<CloudUploadIcon />}
                >
                  Desktop Image
                </Button>
              </label>
            </Grid>

            {state.img.length > 0 && (
              <Grid style={{ textAlign: "center" }} xs={6} md={6} item>
                <img
                  alt="nacimages"
                  src={state.img}
                  style={{ width: "100px", height: "auto" }}
                />
              </Grid>
            )}
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

export default CustomAdvertisementCMS;
