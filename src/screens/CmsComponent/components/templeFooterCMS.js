import React from "react";
import { TableComp } from "../../../components";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";
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
import { AlertContext } from "../../../context";
import { useContext } from "react";
import DeleteIcon from "@material-ui/icons/Delete";

const header = ["S.No", "Title", "Products", "Action"];
const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "TEXT", name: "title" },
  { type: "ARR_TEXT", name: "sectionOne" },
  { type: "EDIT", name: "" },
];

const TempleFooterCMS = (props) => {
  const { data } = props;

  const classes = useStyles();
  const initialData = {
    title: "",
    sectionOne: [],
  };
  const initialStateRow = {
    products: "",
    location: "",
  };
  const initialEdit = {
    isEdit: false,
    editIndex: null,
  };
  const alert = useContext(AlertContext);
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(initialData);
  const [stateRow, setStateRow] = React.useState(initialStateRow);
  // const [resState, setResState] = React.useState([]);

  const [editData, setEditData] = React.useState(initialEdit);

  // React.useEffect(() => {
  //     setResState(props?.data?.content)
  // }, [])
  console.log(props.data.props.content, "[props?.data?.content]");

  const handleChange = (key, val, i, parentKey) => {
    // debugger
    let tempState = state;
    tempState[parentKey][i][key] = val;
    setState({ ...tempState });
  };

  const updateState = (key, value) => {
    // debugger
    setState({ ...state, [key]: value });
  };

  const handleDeleteItem = (val, i, data1) => {
    const delRow = [...state?.sectionOne];
    delRow.splice(i, 1);
    setState({ ...state, sectionOne: delRow });
  };

  const handleEdit = (e, rowData, rowIndex) => {
    // debugger
    setOpen(true);
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setState({
      ...state,
      title: rowData?.title,
      sectionOne: rowData?.sectionOne,
    });
  };

  const addItems = () => {
    const data = [...state?.sectionOne, stateRow];
    updateState("sectionOne", data);
    setStateRow(initialStateRow);
  };

  const handleClose = () => {
    setOpen(false);
    setState(initialData);
    setStateRow(initialStateRow);
  };

  const handleClickOpen = () => {
    setEditData({ ...editData, isEdit: false });
    setOpen(true);
  };

  const handleAddItem = (key, value) => {
    setStateRow({ ...stateRow, [key]: value });
  };

  const validate = () => {
    if (state.title && state.sectionOne) {
      return true;
    } else {
      return false;
    }
  };

  const onsubmitvalue = async () => {
    if (validate) {
      if (editData.isEdit) {
        debugger;
        const values = data?.props?.content;
        values.splice(editData.editIndex, 1, state);
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            content: values,
          },
        };
        setOpen(false);
        setState(initialData);
        setEditData(initialEdit);
        console.log(getData, "lll");
        props.handleSubmit(getData, "FooterComponent", "content");
      } else {
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            content: [...data?.props, state],
          },
        };
        setOpen(false);
        setState(initialData);
        props.handleSubmit(getData, "FooterComponent", "content");
      }
    } else {
      alert.setSnack({
        open: true,
        severity: "error",
        msg: "Please fill all the fields in the form ",
      });
    }
  };

  return (
    <>
      <Paper className={classes.root}>
        <TableHeaderComp
          name={"Temple Work Footer Component"}
          handleAddNew={handleClickOpen}
          noAddNew
        />
        <TableComp
          header={header}
          tableData={tableData}
          data={data?.props?.content}
          handleEdit={handleEdit}
        />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="form-dialog-title">Add New Foot Item</DialogTitle>
          <DialogContent>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid Item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  label="title"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => updateState("title", e.target.value)}
                  value={state.title}
                  name="title"
                  required
                />
              </Grid>
              <Grid Item xs={5}>
                <TextField
                  margin="dense"
                  id="products"
                  label="Products"
                  variant="outlined"
                  fullWidth
                  rows={3}
                  onChange={(val) =>
                    handleAddItem("products", val.target.value)
                  }
                  value={stateRow?.products}
                  name="products"
                />
              </Grid>
              <Grid Item xs={5}>
                <TextField
                  margin="dense"
                  id="location"
                  label="Location"
                  variant="outlined"
                  fullWidth
                  rows={3}
                  onChange={(val) =>
                    handleAddItem("location", val.target.value)
                  }
                  value={stateRow?.location}
                  name="location"
                />
              </Grid>
              <Grid
                Item
                xs={1}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button variant="contained" color="primary" onClick={addItems}>
                  Add
                </Button>
              </Grid>
            </Grid>
            {state?.sectionOne?.length > 0 &&
              state?.sectionOne?.map((e, i) => {
                return (
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid Item xs={5}>
                      <TextField
                        margin="dense"
                        id="products"
                        label="Products"
                        variant="outlined"
                        fullWidth
                        rows={3}
                        onChange={(val) =>
                          handleChange(
                            "products",
                            val.target.value,
                            i,
                            "sectionOne"
                          )
                        }
                        value={e?.products}
                        name="products"
                      />
                    </Grid>
                    <Grid Item xs={5}>
                      <TextField
                        margin="dense"
                        id="location"
                        label="Location"
                        variant="outlined"
                        fullWidth
                        rows={3}
                        onChange={(val) =>
                          handleChange(
                            "location",
                            val.target.value,
                            i,
                            "sectionOne"
                          )
                        }
                        value={e?.location}
                        name="location"
                      />
                    </Grid>
                    <Grid
                      Item
                      xs={1}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <DeleteIcon
                        onClick={(val) => handleDeleteItem(val, i, state)}
                        style={{ color: "red", cursor: "pointer" }}
                      />
                    </Grid>
                  </Grid>
                );
              })}
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
export default TempleFooterCMS;
