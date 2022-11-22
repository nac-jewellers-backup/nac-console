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

const header = ["S.No", "Image", "Content", "Buttons", "Action"];

const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "WEB_IMAGE", name: "img" },
  { type: "TEXT", name: "content" },
  { type: "BUTTON_ARRAY", name: "buttons" },
  { type: "ACTION", name: "" },
];

const innerHeader = ["S.No", "Buttons", "Link", "Action"];
const innerTableData = [
  { type: "INCREMENT", name: "" },
  { type: "TEXT", name: "name" },
  { type: "TEXT", name: "url" },
  { type: "ACTION", name: "" },
];

const CustomCollectionCardsCMS = (props) => {
  console.log("prop456", props);
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const alert = useContext(AlertContext);

  const initialState = {
    img: "",
    content: "",
    buttons: [],
  };

  const initialEdit = {
    isEdit: false,
    editIndex: null,
  };

  const [state, setState] = React.useState(initialState);
  const [editData, setEditData] = React.useState(initialEdit);
  const [disableButton, setDisable] = React.useState({
    img: false,
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
    if (state.img && state.content) {
      if (editData.isEdit) {
        const editCard = props?.data?.props?.cardContent;
        editCard.splice(editData.editIndex, 1, state);
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            cardContent: editCard,
          },
        };
        setOpen(false);
        props.handleSubmit(getData, "CollectionCards", "cardContent");
      } else {
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            cardContent: [...props?.data?.props?.cardContent, state],
          },
        };
        setOpen(false);
        props.handleSubmit(getData, "CollectionCards", "cardContent");
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
    props.handleSubmit(getData, "CollectionCards", "cardContent");
  };

  const handleEdit = (e, rowData, rowIndex) => {
    setOpen(true);
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setState(rowData);
  };

  const handleInnerDelete = (e, rowData, rowIndex) => {

  }

  const handleInnerEdit= (e, rowData, rowIndex) => {

  }
 
  return (
    <>
      <Paper className={classes.root}>
        <TableHeaderComp
          name={"Collection Cards Component"}
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

        <Dialog
          classes={{ paper: classes.dialogPaperMid }}
          open={open}
          onClose={handleClose}
        >
          <DialogTitle id="form-dialog-title">Add New Card Item</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
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
              <Grid item style={{ padding: "0px 8px" }}>
                    <img
                      alt="nacimages"
                      src={state.img}
                      style={{ width: "100px", height: "auto" }}
                    />
              </Grid>
            )}
            </Grid>
            <TableComp
              header={innerHeader}
              tableData={innerTableData}
              data={state.buttons}
              handleDelete={handleInnerDelete}
              handleEdit={handleInnerEdit}
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

export default CustomCollectionCardsCMS;
