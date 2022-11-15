import React from "react";
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
import { useContext } from "react";
import { TableComp } from "../../../components";
import { AlertContext } from "../../../context";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";
import { UploadImage } from "../../../utils/imageUpload";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

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
    setState(props?.data?.props);
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
    let getData = [];
    getData = {
      component: props?.data?.component,
      props: state
    };
    setImage([getData.props])
    setOpen(false);
    props.handleSubmit(getData, "QueryForm", "");
  };

  const handleEdit = (e, rowData, rowIndex) => {
    handleClickOpen();
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
        <DialogTitle id="form-dialog-title">Edit Query Form</DialogTitle>
        <DialogContent>
          <Grid>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="button-file"
              multiple
              type="file"
              onChange={(e) => handleChange(e.target.files[0], "image")}
            />
            <label htmlFor="button-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                // disabled={disableButton.mobile}
              >
                Store Image
              </Button>
            </label>
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

export default QueryFormCMS;
