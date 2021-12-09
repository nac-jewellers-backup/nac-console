import { Button, Chip, Input, TextField } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/Edit";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import SaveIcon from "@material-ui/icons/Save";
import MuiAlert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";
import React from "react";
import { ProductContext } from "../../context";
import { NetworkContext } from "../../context/NetworkContext";
import EditGemstone from "./Components/EditGemstone/EditGemstone";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const columns = [
  { id: "Gemstone Type", label: "Gemstone Type" },
  { id: "Gemstone Name", label: "Gemstone Name" },
  { id: "SubItemName", label: "SubItem Name" },
  { id: "Description", label: "Description" },

  { id: "Size", label: "Size" },
  { id: "Weight", label: "Weight" },
  { id: "Number", label: "Number" },
  { id: "Amount", label: "Amount" },
  { id: "Carat", label: "Per Carat" },
  { id: "Setting", label: "Setting" },
  { id: "Shape", label: "Shape" },
  {
    id: "Edit",
    label: "Edit",
    minWidth: 120,
    align: "center",
    format: (value) => value.toFixed(2),
  },
];

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  function handleFirstPageButtonClick(event) {
    onChangePage(event, 0);
  }

  function handleBackButtonClick(event) {
    onChangePage(event, page - 1);
  }

  function handleNextButtonClick(event) {
    onChangePage(event, page + 1);
  }

  function handleLastPageButtonClick(event) {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  fixedTag: {
    padding: 0,
    "& .MuiOutlinedInput-root": {
      padding: 0,
    },
  },
  root: {
    marginTop: theme.spacing(2),
  },
  table: {
    // marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(2),
    width: "100%",
  },
  gempapper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: "100%",
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
}));

export default function GemstoneDetails(props) {
  const [open, setOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState({
    message: "",
    severity: "",
  });
  const [openedit, setOpenedit] = React.useState(false);
  const [editcontent, setEditcontent] = React.useState(null);

  const { sendNetworkRequest } = React.useContext(NetworkContext);

  const handleClick = () => {
    setOpen(true);
  };
  const handleApplicationClose = () => {
    setEditcontent(null);
    setOpenedit(false);
  };
  const handleApplicationOpen = () => {
    setOpenedit(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { productCtx, setProductCtx } = React.useContext(ProductContext);

  const [btnEdit, setBtnEdit] = React.useState({
    action: false,
    id: "",
  });
  let [gemstoneEditObject, setGemstoneEditObject] = React.useState({
    edit: "",
  });
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.gemstone && props.gemstone.length - page * rowsPerPage);
  function GemstoneEdit(gemstoneData) {

    setGemstoneEditObject({
      ...gemstoneEditObject,
      edit: JSON.parse(JSON.stringify(gemstoneData)),
    });
    setProductCtx({
      ...productCtx,
      gemstonesettings: productCtx.masterData.gemstonesettings.filter(
        (settingData, index) => settingData.name === gemstoneData.gemstoneSetting
      )[0],
      gemstoneshape: productCtx.masterData.gemstonshapes.filter(
        (shapeData, index) => shapeData.name === gemstoneData.gemstoneShape
      )[0],
      gemstonecount: gemstoneData.stoneCount,
      gemstoneweight: gemstoneData.stoneWeight,
      gemstonesize: gemstoneData.gemstoneSize,
      gemstoneitemname: gemstoneData.itemName,
      gemstonesubitemname: gemstoneData.subItemName,
      gemstonedescription: gemstoneData.description,
      gemstonetype: gemstoneData.gemstoneType,
    });
    setEditcontent({
      id: gemstoneData.id,
      gemstonesettings: productCtx.masterData.gemstonesettings.filter(
        (settingData, index) => settingData.name === gemstoneData.gemstoneSetting
      )[0],
      gemstoneshape: productCtx.masterData.gemstonshapes.filter(
        (shapeData, index) => shapeData.name === gemstoneData.gemstoneShape
      )[0],
      gemstonecount: gemstoneData.stoneCount,
      gemstoneweight: gemstoneData.stoneWeight,
      gemstonesize: gemstoneData.gemstoneSize,
      gemstoneitemname: gemstoneData.itemName,
      gemstonesubitemname: gemstoneData.subItemName,
      gemstonedescription: gemstoneData.description,
      gemstonetype: gemstoneData.gemstoneType,
    });
    // setBtnEdit({ ...btnEdit, id: gemstoneData.id, action: true })
    setOpenedit(true);
  }

  async function GemstoneSave(gemdata) {

    if (
      gemdata.gemstonesettings &&
      gemdata.gemstoneshape &&
      gemdata.gemstonecount &&
      gemdata.gemstoneweight &&
      gemdata.gemstonesize
    ) {

      let list_data = props.gemstone;
      var bodydata = {};
      let gemstoneChangeData = list_data.map((gemstoneListData, index) => {
        if (gemdata.id === gemstoneListData.id) {
          gemstoneListData.gemstoneSetting = gemdata.gemstonesettings.name;
          gemstoneListData.gemstoneShape = gemdata.gemstoneshape.name;
          gemstoneListData.stoneCount = gemdata.gemstonecount;
          gemstoneListData.stoneWeight = gemdata.gemstoneweight;
          gemstoneListData.gemstoneSize = gemdata.gemstonesize;
          bodydata["gemstoneSetting"] = gemdata.gemstonesettings.name;
          bodydata["gemstoneShape"] = gemdata.gemstoneshape.name;
          bodydata["stoneCount"] = gemdata.gemstonecount;
          bodydata["gemstoneSize"] = gemdata.gemstonesize;
          bodydata["stoneWeight"] = gemdata.gemstoneweight;
          bodydata["id"] = gemdata.id;
          bodydata["itemname"] = gemdata.gemstoneitemname;
          bodydata["subitemname"] = gemdata.gemstonesubitemname;
          bodydata["description"] = gemdata.gemstonedescription;
          bodydata["gemstonetype"] = gemdata.gemstonetype.label;

          return gemstoneListData;
        }

        return gemstoneListData;
      });

      let response = await sendNetworkRequest("/editproductgemstone", {}, bodydata);
      let editGemstoneList =
        gemstoneChangeData && gemstoneChangeData.filter((edit_data, index) => edit_data.id === gemdata.id)[0];
      let editGemstoneLists = productCtx.editGemstoneLists;
      if (JSON.stringify(editGemstoneList) !== JSON.stringify(gemstoneEditObject.edit)) {
        let status =
          editGemstoneLists && editGemstoneLists.some((check_edit, index) => check_edit.id === editGemstoneList.id)
            ? (editGemstoneLists =
              editGemstoneLists &&
              editGemstoneLists.map((gemstone_list, index) => {
                if (gemstone_list.id === editGemstoneList.id) {
                  return editGemstoneList;
                }
                return gemstone_list;
              }))
            : editGemstoneLists.push(editGemstoneList);
      }
      setSnackMessage({
        ...snackMessage,
        message: "This is successfully saved",
        severity: "success",
      });
      handleClick();
      setProductCtx({
        ...productCtx,
        gemstonelist: gemstoneChangeData,
        editGemstoneLists,
        gemstonesettings: "",
        gemstoneshape: "",
        gemstonecount: "",
        gemstoneweight: "",
        gemstonesize: "",
      });
      setEditcontent(null);
      setOpenedit(false);
      //  setBtnEdit({ ...btnEdit, id: "", action: false })
    } else {
      setSnackMessage({
        ...snackMessage,
        message: "You are not fill all item",
        severity: "info",
      });
      handleClick();
      window.location.reload();
    }

  }
  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }
  const handleoptionChange = (type) => (event, value) => {
    console.log(type, event.target.value, value, "aaaaaaa")
    debugger;
    setProductCtx({ ...productCtx, [type]: value });
  };
  const handleInputChange = (type) => (e) => {
    console.log(type, e.target.value, "aaaaaaa")
    debugger;
    setProductCtx({ ...productCtx, [type]: e.target.value });
  };
  return (
    <Paper className={classes.root}>
      <React.Fragment>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={snackMessage.severity}>
            {snackMessage.message}
          </Alert>
        </Snackbar>
      </React.Fragment>
      <div className={classes.tableWrapper}>
        <Table className={classes.table} border={1} borderColor={"#ddd"} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {props.gemstone &&
              props.gemstone.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.gemstoneType}
                  </TableCell>

                  <TableCell align={"center"} style={{ width: 40 }} component="th" scope="row">
                    {row.itemName}
                  </TableCell>

                  <TableCell align={"center"} style={{ width: 40 }} component="th" scope="row">
                    {row.subItemName}
                  </TableCell>
                  <TableCell align={"center"} style={{ width: 40 }} component="th" scope="row">
                    {row.description}
                  </TableCell>

                  {btnEdit.action && btnEdit.id == row.id ? (
                    <TableCell component="th" scope="row">
                      <Input
                        variant="outlined"
                        fullWidth
                        id="size"
                        margin="dense"
                        label="Gemstone Size"
                        name="size"
                        onChange={handleInputChange("gemstonesize")}
                        autoComplete="size"
                        value={productCtx.gemstonesize}
                      />
                    </TableCell>
                  ) : (
                      <TableCell component="th" scope="row">
                        {row.gemstoneSize}
                      </TableCell>
                    )}
                  {btnEdit.action && btnEdit.id == row.id ? (
                    <TableCell component="th" scope="row">
                      <Input
                        variant="outlined"
                        fullWidth
                        id="size"
                        margin="dense"
                        label="Weight"
                        name="size"
                        autoComplete="size"
                        onChange={handleInputChange("gemstoneweight")}
                        value={productCtx.gemstoneweight}
                      />
                    </TableCell>
                  ) : (
                      <TableCell component="th" scope="row">
                        {row.stoneWeight}
                      </TableCell>
                    )}
                  {btnEdit.action && btnEdit.id == row.id ? (
                    <TableCell component="th" scope="row">
                      <Input
                        variant="outlined"
                        fullWidth
                        id="size"
                        margin="dense"
                        label="#of Stones"
                        name="size"
                        autoComplete="size"
                        onChange={handleInputChange("gemstonecount")}
                        value={productCtx.gemstonecount}
                      />
                    </TableCell>
                  ) : (
                      <TableCell component="th" scope="row">
                        {row.stoneCount}
                      </TableCell>
                    )}
                  <TableCell style={{ width: 40 }} component="th" scope="row">
                    {row.stoneWeight}
                  </TableCell>
                  <TableCell style={{ width: 40 }} component="th" scope="row">
                    {row.stoneAmount}
                  </TableCell>
                  {btnEdit.action && btnEdit.id == row.id ? (
                    <TableCell component="th" scope="row">
                      <Autocomplete
                        id="free-solo-2-demo"
                        className={classes.fixedTag}
                        getOptionLabel={(option) => option.label}
                        value={productCtx.gemstonesettings}
                        options={productCtx.masterData.gemstonesettings}
                        onChange={handleoptionChange("gemstonesettings")}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Gemstone Setting"
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              type: "search",
                            }}
                          />
                        )}
                      />
                    </TableCell>
                  ) : (
                      <TableCell component="th" scope="row">
                        {row.gemstoneSetting}
                      </TableCell>
                    )}
                  {btnEdit.action && btnEdit.id == row.id ? (
                    <TableCell component="th" scope="row">
                      <Autocomplete
                        id="free-solo-2-demo"
                        className={classes.fixedTag}
                        getOptionLabel={(option) => option.label}
                        value={productCtx.gemstoneshape}
                        options={productCtx.masterData.gemstonshapes}
                        onChange={handleoptionChange("gemstoneshape")}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Gemstone Shape"
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              type: "search",
                            }}
                          />
                        )}
                      />
                    </TableCell>
                  ) : (
                      <TableCell component="th" scope="row">
                        {row.gemstoneShape}
                      </TableCell>
                    )}
                  {btnEdit.action && btnEdit.id == row.id ? (
                    <TableCell align="center">
                      <Button onClick={(e) => GemstoneSave(row.id)}>
                        <SaveIcon />
                      </Button>
                    </TableCell>
                  ) : (
                      <TableCell align="center">
                        <Button onClick={(e) => GemstoneEdit(row)}>
                          <EditIcon />
                        </Button>
                      </TableCell>
                    )}
                </TableRow>
              ))}
            {emptyRows == 0 && (
              <TableRow style={{ height: 1 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={props.gemstone && props.gemstone.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
        {editcontent && (
          <EditGemstone diamond={editcontent} onApply={GemstoneSave} onClose={handleApplicationClose} open={openedit} />
        )}
      </div>
    </Paper>
  );
}
