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
  
  const header = ["S.No", "Image", "Title", "Description", "Url", "Action"];
  
  const tableData = [
    { type: "INCREMENT", name: "" },
    { type: "WEB_IMAGE", name: "image" },
    { type: "TEXT", name: "title" },
    { type: "TEXT", name: "description" },
    { type: "TEXT", name: "url" },
    { type: "ACTION", name: "" },
  ];
  
  const ExperienceTableCardCMS = (props) => {
    const classes = useStyles();
    const alert = useContext(AlertContext);
  
    const initialState = {
      image: "",
      title: "",
      description: "",
      url: "",
    };
  
    const initialEdit = {
      isEdit: false,
      editIndex: null,
    };
  
    const [state, setState] = React.useState(initialState);
    const [open, setOpen] = React.useState(false);
    const [editData, setEditData] = React.useState(initialEdit);
    const [disableButton, setDisable] = React.useState({
      image: false,
    });
    const [buttonEditState, setButtonEditState] = React.useState(initialEdit);
  
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
      if (state.image && state.title && state.description && state.url) {
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
          props.handleSubmit(getData, "experienceCard", "cardContent");
        } else {
          let getData = [];
          getData = {
            component: props?.data?.component,
            props: {
              cardContent: [...props?.data?.props?.cardContent, state],
            },
          };
          setOpen(false);
          props.handleSubmit(getData, "experienceCard", "cardContent");
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
      props.handleSubmit(getData, "experienceCard", "cardContent");
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
            name={"Experience Cards Component"}
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
                    onChange={(e) => handleChange(e.target.files[0], "image")}
                  />
                  <label htmlFor="button-files">
                    <Button
                      variant="outlined"
                      component="span"
                      disabled={disableButton.image}
                      startIcon={<CloudUploadIcon />}
                    >
                      Desktop Image
                    </Button>
                  </label>
                </Grid>
                {state.image.length > 0 && (
                  <Grid item style={{ padding: "0px 8px" }}>
                    <img
                      alt="nacimages"
                      src={state.image}
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
  
  export default ExperienceTableCardCMS;