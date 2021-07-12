import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import TableHead from "@material-ui/core/TableHead";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Typography, Button, Chip, TextField, Input } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ProductContext } from "../../context";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { NetworkContext } from "../../context/NetworkContext";
import CancelIcon from "@material-ui/icons/CancelOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";
import EditDiamond from "./Components/EditDiamond/EditDiamond";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const columns = [
  { id: "Diamond", label: "Diamond" },
  { id: "ItemName", label: "Item Name" },
  { id: "SubItemName", label: "SubItem Name" },
  { id: "Description", label: "Description" },
  { id: "Colour", label: "Colour" },
  { id: "Clarity", label: "Clarity" },
  { id: "Weight", label: "Weight" },
  { id: "Number", label: "Number" },
  { id: "Setting", label: "Setting" },
  { id: "Shape", label: "Shape" },

  {
    id: "Edit",
    label: "Edit",
    minWidth: 80,
    maxWidth: 80,
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
    display: "flex",

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
    //marginTop: theme.spacing(2)
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

export default function DiamondDetails(props) {
  const [open, setOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState({
    message: "",
    severity: "",
  });
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [openedit, setOpenedit] = React.useState(false);
  const [editcontent, setEditcontent] = React.useState(null);

  const handleClick = () => {
    setOpen(true);
  };
  const handleApplicationOpen = () => {
    setOpenedit(true);
  };

  const handleApplicationClose = () => {
    setEditcontent(null);
    setOpenedit(false);
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
  let [diamondEditObject, setDiamondEditObject] = React.useState({
    edit: "",
  });
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.diamond && props.diamond.length - page * rowsPerPage);
  function DiamondEdit(diamondData) {
    debugger;
    console.log(diamondData);
    setDiamondEditObject({
      ...diamondEditObject,
      edit: JSON.parse(JSON.stringify(diamondData)),
    });

    setProductCtx({
      ...productCtx,
      diamondsettings: productCtx.masterData.diamondsettings.filter(
        (settingData, index) => settingData.name === diamondData.diamondSettings
      )[0],
      diamondshape: productCtx.masterData.diamondshapes.filter(
        (shapeData, index) => shapeData.name === diamondData.diamondShape
      )[0],
      diamondcount: diamondData.stoneCount,
      diamondweight: diamondData.stoneWeight,
      diamonditemname: diamondData.itemName,
      diamondsubitemname: diamondData.subItemName,
      diamonddescription: diamondData.description,
    });
    setEditcontent({
      id: diamondData.id,
      diamondsettings: productCtx.masterData.diamondsettings.filter(
        (settingData, index) => settingData.name === diamondData.diamondSettings
      )[0],
      diamondshape: productCtx.masterData.diamondshapes.filter(
        (shapeData, index) => shapeData.name === diamondData.diamondShape
      )[0],
      diamondcount: diamondData.stoneCount,
      diamondweight: diamondData.stoneWeight,
      diamonditemname: diamondData.itemName,
      diamondsubitemname: diamondData.subItemName,
      diamonddescription: diamondData.description,
    });
    // setBtnEdit({ ...btnEdit, id:diamondData.id, action: true })
    setOpenedit(true);
  }
  async function DiamondSave(diamondobj) {
    // alert(JSON.stringify(productCtx.diamondsettings))
    // alert(JSON.stringify(productCtx.diamondshape))
    // alert(JSON.stringify(productCtx.diamondcount))
    // alert(JSON.stringify(id))
    var bodydata = {};
    if (diamondobj.diamondsettings && diamondobj.diamondshape && diamondobj.diamondcount && diamondobj.diamondweight) {
      let list_data = props.diamond;
      let DiamondChangeData = list_data.map((diamondListData, index) => {
        if (diamondobj.id === diamondListData.id) {
          diamondListData.diamondSettings = diamondobj.diamondsettings.name;
          diamondListData.diamondShape = diamondobj.diamondshape.name;
          diamondListData.stoneCount = diamondobj.diamondcount;
          diamondListData.stoneWeight = diamondobj.diamondweight;
          bodydata["diamondSettings"] = diamondobj.diamondsettings.name;
          bodydata["diamondShape"] = diamondobj.diamondshape.name;
          bodydata["stoneCount"] = diamondobj.diamondcount;
          bodydata["stoneWeight"] = diamondobj.diamondweight;
          bodydata["diamondid"] = diamondobj.id;
          bodydata["itemname"] = diamondobj.diamonditemname;
          bodydata["subitemname"] = diamondobj.diamondsubitemname;
          bodydata["description"] = diamondobj.diamonddescription;
          return diamondListData;
        }
        return diamondListData;
      });
      let response = await sendNetworkRequest("/editproductdiamond", {}, bodydata);

      // setBtnEdit({ ...btnEdit, id:"", action: false })

      // let editDiamondList = DiamondChangeData && DiamondChangeData.filter((edit_data,index)=>edit_data.id===id)[0];
      // let editDiamondLists = productCtx.editDiamondLists;
      // if(JSON.stringify(editDiamondList)!==JSON.stringify(diamondEditObject.edit)){
      //   let status = editDiamondLists&& editDiamondLists.some((check_edit,index)=>check_edit.id===editDiamondList.id) ?
      //   editDiamondLists = editDiamondLists && editDiamondLists
      //   .map((diamond_list,index)=>{
      //     if(diamond_list.id === editDiamondList.id){
      //       return editDiamondList;
      //     }
      //     return diamond_list;
      //   })
      //   : editDiamondLists.push(editDiamondList);
      // }
      // // console.log(editDiamondLists,'editDiamondList')
      setSnackMessage({
        ...snackMessage,
        message: "This is successfully saved",
        severity: "success",
      });
      // handleClick();
      // setProductCtx({
      //   ...productCtx,
      //   diamondlist:DiamondChangeData,
      //   editDiamondLists,
      //   diamondsettings:"",
      //   diamondshape: "",
      //   diamondcount:"",
      //   diamondweight:"",
      // })
      // setBtnEdit({ ...btnEdit, id:"", action: false })
      setEditcontent(null);
      setOpenedit(false);
    } else {
      setSnackMessage({
        ...snackMessage,
        message: "You are not fill all item",
        severity: "info",
      });
      handleClick();
    }
  }
  function CancelEdit(diamondData) {
    setBtnEdit({ ...btnEdit, id: "", action: false });
  }
  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }
  const handleoptionChange = (type) => (event, value) => {
    setProductCtx({ ...productCtx, [type]: value });
  };
  const handleInputChange = (type) => (e) => {
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
        {/* <CircularProgress color="secondary"/> */}

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
            {props.diamond &&
              props.diamond.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  <TableCell align={"center"} style={{ width: 40 }} component="th" scope="row">
                    {row.diamondType}
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
                  <TableCell align={"center"} style={{ width: 40 }} component="th" scope="row">
                    {row.diamondColour}
                  </TableCell>
                  <TableCell align={"center"} style={{ width: 40 }} component="th" scope="row">
                    {row.diamondClarity}
                  </TableCell>

                  {btnEdit.action && btnEdit.id == row.id ? (
                    <TableCell align={"center"} component="th" scope="row">
                      <Input
                        variant="outlined"
                        style={{ width: 40 }}
                        id="size"
                        margin="dense"
                        label="Weight"
                        name="size"
                        autoComplete="size"
                        onChange={handleInputChange("diamondweight")}
                        value={productCtx.diamondweight}
                      />
                    </TableCell>
                  ) : (
                    <TableCell align={"center"} style={{ width: 40 }} component="th" scope="row">
                      {row.stoneWeight}
                    </TableCell>
                  )}
                  {btnEdit.action && btnEdit.id == row.id ? (
                    <TableCell component="th" scope="row">
                      <Input
                        variant="outlined"
                        style={{ width: 40 }}
                        id="size"
                        margin="dense"
                        label="#of Stones"
                        name="size"
                        type="number"
                        autoComplete="size"
                        onChange={handleInputChange("diamondcount")}
                        value={productCtx.diamondcount}
                      />
                    </TableCell>
                  ) : (
                    <TableCell style={{ width: 40 }} component="th" scope="row">
                      {row.stoneCount}
                    </TableCell>
                  )}
                  {btnEdit.action && btnEdit.id == row.id ? (
                    <TableCell component="th" scope="row">
                      <Autocomplete
                        id="free-solo-2-demo"
                        className={classes.fixedTag}
                        getOptionLabel={(option) => option.label}
                        value={productCtx.diamondsettings}
                        options={productCtx.masterData.diamondsettings}
                        onChange={handleoptionChange("diamondsettings")}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Diamond Setting"
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            InputProps={{ ...params.InputProps, type: "search" }}
                          />
                        )}
                      />
                    </TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      {row.diamondSettings}
                    </TableCell>
                  )}
                  {btnEdit.action && btnEdit.id == row.id ? (
                    <TableCell component="th" scope="row">
                      <Autocomplete
                        id="free-solo-2-demo"
                        className={classes.fixedTag}
                        getOptionLabel={(option) => option.label}
                        value={productCtx.diamondshape}
                        options={productCtx.masterData.diamondshapes}
                        onChange={handleoptionChange("diamondshape")}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Diamond Shape"
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            InputProps={{ ...params.InputProps, type: "search" }}
                          />
                        )}
                      />
                    </TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      {row.diamondShape}
                    </TableCell>
                  )}

                  {btnEdit.action && btnEdit.id == row.id ? (
                    <TableCell align="center" style={{ width: 80 }}>
                      <Button onClick={(e) => DiamondSave(row.id)}>
                        <SaveIcon />
                      </Button>
                      <Button onClick={(e) => CancelEdit(row)}>
                        <CancelIcon />
                      </Button>
                    </TableCell>
                  ) : (
                    <TableCell align="center" style={{ width: 80 }}>
                      <Button onClick={(e) => DiamondEdit(row)}>
                        <EditIcon />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            {emptyRows == 0 ? (
              <>
                <TableRow style={{ height: 1 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              </>
            ) : null}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={props.diamond && props.diamond.length}
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
          <EditDiamond diamond={editcontent} onApply={DiamondSave} onClose={handleApplicationClose} open={openedit} />
        )}
      </div>
    </Paper>
  );
}
