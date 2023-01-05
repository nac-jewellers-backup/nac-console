import React, { useState } from "react";
import {
  Box,
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
import { TableComp } from "../../../components";
import TableHeaderComp from "./TableHeadComp";
import { useStyles } from "./styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { AlertContext } from "../../../context";

const header = ["S.No", "Category Heading", "Category List", "Action"];
const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "TEXT", name: "categoryHeading" },
  { type: "ARRAYTEXT", name: "categoryList" },
  { type: "ACTION", name: "" },
];
const initialEdit = {
  isEdit: false,
  editIndex: null,
};

const initialData = {
  categoryHeading: "",
  categoryList: [],
};
const initialStateRow = {
  url: "",
  name: "",
};
const SiteMapCMS = (props) => {
  const { data } = props;
  const classes = useStyles();
  const alert = React.useContext(AlertContext);
  const [open, setOpen] = React.useState(false);
  const [editData, setEditData] = React.useState(initialEdit);

  //
  const [stateRow, setStateRow] = React.useState(initialStateRow);
  const [data1, setData1] = React.useState(initialData);

  const handleChange = (key, val, i, parentKey) => {
    debugger;
    let tempState = data1;
    tempState[parentKey][i][key] = val;
    setData1({ ...tempState });
  };

  const handleEdit = (e, rowData, rowIndex) => {
    setOpen(true);
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setData1({
      ...data1,
      categoryHeading: rowData?.categoryHeading,
      categoryList: rowData?.categoryList,
    });
    setStateRow(rowData);
  };

  const handleClose = () => {
    setOpen(false);
    setData1(initialData);
    setStateRow(initialStateRow);
  };

  const validate = () => {
    if (data1.categoryHeading && data1.categoryList) {
      return true;
    } else {
      return false;
    }
  };

  const onsubmitvalue = async () => {
    if (validate) {
      if (editData.isEdit) {
        const values = data?.props;
        values.splice(editData.editIndex, 1, data1);
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: values,
        };
        setOpen(false);
        setData1(initialData);
        setEditData(initialEdit);
        props.handleSubmit(getData, "siteMap", "props");
      } else {
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: [...data?.props, data1],
        };
        setOpen(false);
        setData1(initialData);
        props.handleSubmit(getData, "siteMap", "props");
      }
    } else {
      alert.setSnack({
        open: true,
        severity: "error",
        msg: "Please fill all the fields in the form ",
      });
    }
  };

  const handleDeleteItem = (val, i, data1) => {
    const delRow = [...data1?.categoryList];
    delRow.splice(i, 1);
    setData1({ ...data1, categoryList: delRow });
  };

  const handleAddItem = (key, value) => {
    setStateRow({ ...stateRow, [key]: value });
  };

  const handleDelete = (e, rowData, rowIndex) => {
    let getData = [];
    const categoryItems = data?.props;
    categoryItems.splice(rowIndex, 1);
    getData = {
      component: data?.component,
      props: categoryItems,
    };
    props.handleSubmit(getData, "siteMap", "props");
  };

  const handleClickOpen = () => {
    setEditData({ ...editData, isEdit: false });
    setOpen(true);
  };

  const addItems = () => {
    const data = [...data1?.categoryList, stateRow];
    updateState("categoryList", data);
    setStateRow(initialStateRow);
  };

  const updateState = (key, value) => {
    debugger;
    setData1({ ...data1, [key]: value });
  };

  console.log(data1, "data1");
  return (
    <>
      <Paper className={classes.root}>
        <TableHeaderComp
          name={"Site Map Component"}
          handleAddNew={handleClickOpen}
        />
        <TableComp
          header={header}
          tableData={tableData}
          data={data?.props}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <Dialog classes={{ paper: classes.dialogPaperMid }} open={open}>
          <DialogTitle id="form-dialog-title">
            <div className={classes.dialogTitle} style={{ display: "flex" }}>
              <Typography>Edit Site Map Component</Typography>
              {/* {editData?.isEdit && <Button variant="contained" color="primary" onClick={handleAddItem}>
                                Add
                            </Button>} */}
            </div>
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="categoryHeading"
              label="Category Heading"
              variant="outlined"
              fullWidth
              onChange={(e) => updateState("categoryHeading", e.target.value)}
              value={data1.categoryHeading}
            />
            <Grid
              xs={12}
              item
              alignContent={"start"}
              justifyContent={"space-between"}
            >
              <Grid
                container
                spacing={1}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <>
                  <Grid Item xs={5}>
                    <TextField
                      margin="dense"
                      id="name"
                      label="name"
                      variant="outlined"
                      fullWidth
                      rows={3}
                      onChange={(val) =>
                        handleAddItem("name", val.target.value)
                      }
                      value={stateRow?.name}
                      name="name"
                    />
                  </Grid>
                  <Grid Item xs={5}>
                    <TextField
                      margin="dense"
                      id="url"
                      label="url"
                      variant="outlined"
                      fullWidth
                      rows={3}
                      onChange={(val) => handleAddItem("url", val.target.value)}
                      value={stateRow?.url}
                      name="url"
                    />
                  </Grid>
                  <Grid
                    Item
                    xs={1}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addItems}
                    >
                      Add
                    </Button>
                  </Grid>
                </>
                {data1?.categoryList?.length > 0 &&
                  data1?.categoryList?.map((e, i) => {
                    return (
                      <>
                        <Grid Item xs={5}>
                          <TextField
                            margin="dense"
                            id="name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            rows={3}
                            onChange={(val) =>
                              handleChange(
                                "name",
                                val.target.value,
                                i,
                                "categoryList"
                              )
                            }
                            value={e?.name}
                            name="Name"
                          />
                        </Grid>
                        <Grid Item xs={5}>
                          <TextField
                            margin="dense"
                            id="url"
                            label="URL"
                            variant="outlined"
                            fullWidth
                            rows={3}
                            onChange={(val) =>
                              handleChange(
                                "url",
                                val.target.value,
                                i,
                                "categoryList"
                              )
                            }
                            value={e?.url}
                            name="URL"
                          />
                        </Grid>
                        <Grid
                          Item
                          xs={1}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <DeleteIcon
                            onClick={(val) => handleDeleteItem(val, i, data1)}
                            style={{ color: "red", cursor: "pointer" }}
                          />
                        </Grid>
                      </>
                    );
                  })}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onsubmitvalue}>
              {editData.isEdit ? "Update " : "Add"}
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};
export default SiteMapCMS;
