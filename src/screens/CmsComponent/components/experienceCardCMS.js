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
import { UploadImage } from "../../../utils/imageUpload";
import { AlertContext } from "../../../context";
import { useContext } from "react";
import EditorConvertToHTML from "./richTextEditor";
const header = [
  "S.No",
  "Background Image",
  "Header Image",
  "Description",
  "Form Title",
  "Submit Text",
  "Button Text",
  "Type",
  "Action",
];
const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "WEB_IMAGE", name: "background_Image" },
  { type: "WEB_IMAGE", name: "header_Image" },
  { type: "HTMLTEXT", name: "description" },
  { type: "HTMLTEXT", name: "form_Title" },
  { type: "TEXT", name: "submit_Content" },
  { type: "TEXT", name: "button_Text" },
  { type: "TEXT", name: "type" },
  { type: "EDIT", name: "" },
];
const initialState = {
  background_Image: "",
  header_Image: "",
  description: "",
  form_Title: "",
  submit_Content: "",
  button_Text: "",
  type: "",
};
const initialEdit = {
  isEdit: false,
  editIndex: null,
};
const ExperienceCardCMS = (props) => {
  console.log("console data", props);
  const { data } = props;
  const classes = useStyles();
  const alert = useContext(AlertContext);
  const [sendData, setSendData] = React.useState([]);
  const [state, setState] = React.useState({ ...initialState });
  const [open, setOpen] = React.useState(false);
  const [editData, setEditData] = React.useState(initialEdit);
  const [disableButton, setDisable] = React.useState({
    background_Image: false,
    header_Image: false,
  });
  const handleClickOpen = () => {
    setOpen(true);
  };
  React.useEffect(() => {
    setSendData([data?.props]);
    setState(data?.props);
  }, [data?.props]);

  const handleClose = () => {
    setOpen(false);
    setEditData(initialEdit);
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
    if (
      state.background_Image &&
      state.header_Image &&
      state.description &&
      state.form_Title &&
      state.submit_Content &&
      state.button_Text &&
      state.type
    ) {
      let getData = [];
      if (editData.isEdit) {
        getData = {
          component: data?.component,
          props: state,
        };
        setOpen(false);
      } else {
        getData = {
          component: data?.component,
          props: [...data?.props, state],
        };
        setOpen(false);
      }
      props.handleSubmit(getData, "ExperienceCard", "props");
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
  const handleEdit = (e, rowData, rowIndex) => {
    setOpen(true);
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setState(rowData);
  };
  const handleChangeState = (data) => {
    setState({
      ...state,
      description: data,
    });
  };
  const handleChangeTitle = (data) => {
    setState({
      ...state,
      form_Title: data,
    });
  };
  return (
    <>
      <Paper className={classes.root}>
        <TableHeaderComp
          name={"Experience Card Component"}
          handleAddNew={handleClickOpen}
          noAddNew
        />
        <TableComp
          header={header}
          tableData={tableData}
          data={sendData}
          handleEdit={handleEdit}
        />
        {/* Dialog */}
        <Dialog
          classes={{ paper: classes.dialogPaperMid }}
          open={open}
          onClose={handleClose}
        >
          <DialogTitle id="form-dialog-title">Add New Card Item</DialogTitle>
          <DialogContent>
            <EditorConvertToHTML
              handleChangeState={handleChangeState}
              parentState={state.description}
            />
            <EditorConvertToHTML
              handleChangeState={handleChangeTitle}
              parentState={state.form_Title}
            />
            <TextField
              autoFocus
              margin="dense"
              id="submit Content"
              label="Submit_Content"
              variant="outlined"
              fullWidth
              value={state.submit_Content}
              onChange={onChangeData}
              name="submit_Content"
              required
            />
            <TextField
              autoFocus
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
            <TextField
              autoFocus
              margin="dense"
              id="type"
              label="Type"
              variant="outlined"
              fullWidth
              value={state.type}
              onChange={onChangeData}
              name="type"
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
                  onChange={(e) =>
                    handleChange(e.target.files[0], "background_Image")
                  }
                />
                <label htmlFor="button-files">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={disableButton.background_Image}
                    startIcon={<CloudUploadIcon />}
                  >
                    Desktop Image
                  </Button>
                </label>
              </Grid>
              {state.background_Image.length > 0 && (
                <Grid item style={{ padding: "0px 8px" }}>
                  <img
                    alt="nacimages"
                    src={state.background_Image}
                    style={{ width: "100px", height: "auto" }}
                  />
                </Grid>
              )}
              <Grid item>
                <input
                  accept="image/*"
                  className={classes.input}
                  style={{ display: "none" }}
                  id="button-files"
                  multiple
                  type="file"
                  onChange={(e) =>
                    handleChange(e.target.files[0], "header_Image")
                  }
                />
                <label htmlFor="button-files">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={disableButton.header_Image}
                    startIcon={<CloudUploadIcon />}
                  >
                    Desktop Image
                  </Button>
                </label>
              </Grid>
              {state.header_Image.length > 0 && (
                <Grid item style={{ padding: "0px 8px" }}>
                  <img
                    alt="nacimages"
                    src={state.header_Image}
                    style={{ width: "100px", height: "auto" }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={onsubmitvalue}>
              Add
            </Button>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};
export default ExperienceCardCMS;
