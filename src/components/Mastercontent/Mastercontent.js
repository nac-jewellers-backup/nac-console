import { Button, Grid, Paper, Switch, TextField } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import { lighten, makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/CancelOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import SaveIcon from "@material-ui/icons/Save";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import axios from "axios";
import clsx from "clsx";
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { withApollo } from "react-apollo";
import { FilePond, registerPlugin } from "react-filepond";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { useHistory } from "react-router-dom";
import EnhancedTableHead from "../../components/EnhancedTableHead";
import { NetworkContext } from "../../context/NetworkContext";
import EditContent from "./components/EditContent";
import "./tmp.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// const columns = [
//   { id: 'name', label: 'Name' },
//   { id: 'vendorcode', label: 'Vendor Code' },
//   { id: 'Address', label: 'Address' },
//   { id: 'City', label: 'City' },
//   { id: 'gstNo', label: 'gstNo' },
//   { id: 'vendorDelivaryDays', label: 'vendorDelivaryDays' },
//   { id: 'updatedAt', label: 'updated on' },
//   { id: 'actions', label: 'actions' }

// ];

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));
function createData(name, calories, fat) {
  return { name, calories, fat };
}
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
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Dessert (100g serving)",
  },
  { id: "calories", numeric: true, disablePadding: false, label: "Calories" },
  { id: "fat", numeric: true, disablePadding: false, label: "Fat (g)" },
  { id: "carbs", numeric: true, disablePadding: false, label: "Carbs (g)" },
  { id: "protein", numeric: true, disablePadding: false, label: "Protein (g)" },
];

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list"></IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  imagecontainer: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}));

const Vendor = (props) => {
  let history = useHistory();
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [pageCount, setPageCount] = React.useState(0);
  const [offsetValue, setOffsetValue] = React.useState(0);
  const [masterlist, setMasterlist] = React.useState(props.values);
  const [editcontent, setEditcontent] = React.useState(null);

  const [productlists, setProductlists] = React.useState([]);
  const [allproductlists, setAllProductlists] = React.useState([]);
  const [mastercategories, setMastercategories] = React.useState([]);
  const [masterproducttypes, setMasterproducttypes] = React.useState([]);
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [searchtext, setSearchtext] = React.useState("");
  const [openedit, setOpenedit] = React.useState(false);
  const [editEmail, setEditEmail] = React.useState(false);
  const [isadd, setIsadd] = React.useState(false);
  const [isedit, setIsedit] = React.useState(false);
  const handleApplicationClose = () => {
    setEditcontent(null);
    setOpenedit(false);
  };
  const [aliasName, setaliasName] = React.useState("");
  const [btnEdit, setBtnEdit] = React.useState({
    action: false,
    id: "",
  });
  function addnewvendor() {
    let sort_id = masterlist.length > 0 ? masterlist[0].filterOrder + 1 : 1;
    setaliasName(props.prefix + sort_id);

    setEditcontent({
      alias: aliasName,
      ...editcontent,
      isedit: false,
    });

    // let masters = masterlist;
    // masters.insert(0, []);

    //setMasterlist(masters)
    setIsadd(true);
    setOpenedit(true);
    //setBtnEdit({ ...btnEdit, id:null, action: true })
  }
  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
  };
  function Editvendor(vendordata) {
    setEditEmail(true);
    delete vendordata["action"];

    setEditcontent({
      ...editcontent,
      ...vendordata,
      isedit: true,
    });
    setOpenedit(true);
    // setBtnEdit({ ...btnEdit, id:vendordata.id, action: true })
  }
  async function Savevendor(content) {
    props.onCreate(content);
    setIsadd(false);
    setEditcontent(null);
    setOpenedit(false);
    //  let response =  await sendNetworkRequest('/updatetax', {}, editcontent)
    //  setBtnEdit({ ...btnEdit, id:'', action: false })
    // refetch()
  }
  function Cancelcreate() {
    props.onCancel();

    setBtnEdit({ ...btnEdit, id: "", action: false });
  }
  function searrchcontent() {
    props.onSearch(
      editcontent.searchcontent ? editcontent.searchcontent.toLowerCase() : ""
    );
  }
  function handleInit() {
    console.log("FilePond instance has initialised");
  }
  function removeimage(imagename, keyvalue) {
    let previmagenames = editcontent[keyvalue];
    let newimages = [];
    let previmages = previmagenames.split(",");
    previmages.forEach((element) => {
      if (element == imagename) {
      } else {
        newimages.push(element);
      }
    });
    setEditcontent({ ...editcontent, [keyvalue]: newimages.join(",") });
  }
  function CancelEdit(diamondData) {
    if (isadd) {
      let masters = masterlist;

      masters.splice(0, 1);
      setMasterlist(masterlist);
    }
    setIsadd(false);
    setEditcontent({});
    setBtnEdit({ ...btnEdit, id: "", action: false });
  }
  const handleInputChange = (type) => (e) => {
    setEditcontent({ ...editcontent, [type]: e.target.value });
  };
  const handleoptionChange = (type) => (event, value) => {
    setEditcontent({ ...editcontent, [type]: value });
  };
  const handleSearchChange = (type) => (e) => {
    props.onSearch(e.target.value);
  };
  const handleChange = (type) => (event) => {
    setEditcontent({ ...editcontent, [type]: event.target.checked });
  };
  const [showpreview, setShowpreview] = useState(false);
  const [previewurl, setpreviewurl] = useState("");
  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.contactlist.length - page * rowsPerPage);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("hsnNumber");
  function handleChangePage(event, newPage) {
    setPage(newPage);
    setOffsetValue(newPage * rowsPerPage);
  }

  async function uploadimagetoserver(bodaydata, keyvalue, uploadtype) {
    let imagename = moment(new Date()).format("DD-MM-YYYYHH-MM-SS");
    let responsedata = await sendNetworkRequest(
      "/uploadimage",
      {},
      {
        image: bodaydata.fileExtension,
        filename: imagename,
        foldername: "banner_images",
        product_id: null,
      },
      false
    );
    var returnData = responsedata.data.returnData;
    var signedRequest = returnData.signedRequest;
    var url = returnData.url;
    console.log("responseurl" + url);
    var filepathname = returnData.filepath;
    let imageurl =
      "https://s3.ap-south-1.amazonaws.com/styloribaseimages/" + filepathname;

    var options = {
      headers: {
        "Content-Type": bodaydata.fileExtension,
        "Access-Control-Allow-Origin": "*",
      },
    };

    await axios.put(signedRequest, bodaydata.file, options);
    let previmagenames = editcontent[keyvalue];
    let previmages = [];
    if (previmagenames) {
      previmages = previmagenames.split(",");
      previmages.push(imageurl);
    }
    setEditcontent({ ...editcontent, [keyvalue]: previmages.join(",") });
  }
  useEffect(() => {
    setMasterlist(props.values);
  }, [props.values]);
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }
  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }
  function previewimage(url) {
    setpreviewurl(url);
    setShowpreview(true);
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";

    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <>
      {showpreview && (
        <Lightbox
          class="fade"
          mainSrc={previewurl}
          // nextSrc={images[(photoIndex + 1) % images.length]}
          // prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setShowpreview(false)}
          onMovePrevRequest={() => alert("prev")}
          onMoveNextRequest={() => alert("next")}
        />
      )}
      <Paper className={classes.root}>
        <Grid
          container
          item
          xs={12}
          style={{ padding: "16px" }}
          sm={12}
          alignItems={"flex-end"}
        >
          <Grid fullwidth item xs={3} sm={3}>
            <Typography component="h6" variant="h6">
              {props.title}
            </Typography>
          </Grid>
          <Grid fullwidth container xs={6} sm={6} alignItems="center">
            <Grid fullwidth item xs={9} sm={9}>
              <TextField
                variant="outlined"
                margin="dense"
                fullWidth
                autoComplete="off"
                id="vendordeliverydays"
                name="vendordeliverydays"
                //  /  value={editcontent.searchcontent}
                onChange={handleInputChange("searchcontent")}
                label="Search text"
              />
            </Grid>
            <Grid fullwidth item xs={3} sm={3}>
              <Button
                variant="contained"
                onClick={() => searrchcontent()}
                color="primary"
              >
                Search
              </Button>
            </Grid>
          </Grid>
          <Grid fullwidth item xs={3} sm={3} style={{ "text-align": "right" }}>
            {props?.fxSyncAPI && (
              <Button
                className={classes.button}
                variant="contained"
                onClick={() => props.fxSyncAPI()}
                color="primary"
              >
                Sync Latest Fx Rate
              </Button>
            )}
            {props.button_title ? (
              <Button
                className={classes.button}
                variant="contained"
                onClick={() => addnewvendor()}
                color="primary"
              >
                {props.button_title}
              </Button>
            ) : null}
          </Grid>
        </Grid>
        {/* <Filterandsearch applyfilter={applyfilter} mastercategory={mastercategories} masterproducttype={masterproducttypes} searchproduct={searchproduct} /> */}
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            border={1}
            borderColor={"#ddd"}
            size="small"
            stickyHeader
          >
            {/* <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead> */}
            <EnhancedTableHead
              columns={props.columns}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {masterlist.map((row, index) => (
                <>
                  <TableRow>
                    {props.columns.map((columnname, index) => (
                      <>
                        {columnname.key === "action" ? (
                          <TableCell align="center" style={{ width: 20 }}>
                            {btnEdit.action && btnEdit.id == row.id ? (
                              <>
                                <Button onClick={(e) => Savevendor()}>
                                  <SaveIcon />
                                </Button>
                                <Button onClick={(e) => CancelEdit(row)}>
                                  <CancelIcon />
                                </Button>
                              </>
                            ) : (
                              <Button onClick={(e) => Editvendor(row)}>
                                <EditIcon />
                              </Button>
                            )}
                          </TableCell>
                        ) : (
                          <>
                            {btnEdit.action && btnEdit.id == row.id ? (
                              <TableCell align="left">
                                {columnname.type === 2 ? (
                                  <Switch
                                    onChange={handleChange(columnname.key)}
                                    checked={editcontent[columnname.key]}
                                    color="primary"
                                    name="checkedB"
                                    inputProps={{
                                      "aria-label": "primary checkbox",
                                    }}
                                  />
                                ) : null}
                                {columnname.type === 6 ? (
                                  <Button variant="outlined" color="primary">
                                    {columnname.controllabel}
                                  </Button>
                                ) : null}
                                {columnname.type == 3 ? (
                                  <Autocomplete
                                    multiple
                                    id="combo-box-demo"
                                    options={
                                      columnname.mastervaluekey
                                        ? props.masters[
                                            columnname.mastervaluekey
                                          ]
                                        : props.masters
                                    }
                                    margin="dense"
                                    fullWidth
                                    value={editcontent[columnname.defaultkey]}
                                    onChange={handleoptionChange(
                                      columnname.defaultkey
                                    )}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label={columnname.label}
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                ) : null}
                                {columnname.type == 9 ? (
                                  <>
                                    <FilePond
                                      oninit={() => handleInit()}
                                      labelIdle="Add Banner Image"
                                      onaddfile={(error, fileItem) => {
                                        if (!error) {
                                          uploadimagetoserver(
                                            fileItem,
                                            columnname.key,
                                            "add"
                                          );
                                        } else {
                                          // alert(row[columnname.key])
                                        }
                                      }}
                                    />
                                    <div className={classes.imagecontainer}>
                                      {editcontent[columnname.key]
                                        ? editcontent[columnname.key]
                                            .split(",")
                                            .map((row, index) => (
                                              <Badge
                                                overlap="circle"
                                                anchorOrigin={{
                                                  vertical: "top",
                                                  horizontal: "right",
                                                }}
                                                badgeContent={
                                                  <HighlightOffIcon
                                                    fontSize="small"
                                                    onClick={() =>
                                                      removeimage(
                                                        row,
                                                        columnname.key
                                                      )
                                                    }
                                                  />
                                                }
                                              >
                                                <Avatar
                                                  alt="Remy Sharp"
                                                  src={row}
                                                  className={classes.small}
                                                />
                                              </Badge>
                                            ))
                                        : null}
                                    </div>
                                  </>
                                ) : null}
                                {columnname.type == 5 ? (
                                  <Autocomplete
                                    id="combo-box-demo"
                                    // options={
                                    //   props.masters[columnname.mastervaluekey]
                                    // }
                                    margin="dense"
                                    fullWidth
                                    options={
                                      columnname.mastervaluekey
                                        ? props.masters[
                                            columnname.mastervaluekey
                                          ]
                                        : props.masters
                                    }
                                    onChange={handleoptionChange(
                                      columnname.defaultkey
                                    )}
                                    value={editcontent[columnname.defaultkey]}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label={columnname.label}
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                ) : null}
                                {columnname.type == 4 ? (
                                  <Typography>
                                    {" "}
                                    {row[columnname.key]}
                                  </Typography>
                                ) : null}
                                {columnname.type == 8 ? (
                                  <Button
                                    onClick={() => props.onPermissionadd(row)}
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                  >
                                    View
                                  </Button>
                                ) : null}
                                {!columnname.type || columnname.type == 1 ? (
                                  <TextField
                                    variant="outlined"
                                    margin="dense"
                                    id={columnname.key}
                                    name={columnname.key}
                                    value={editcontent[columnname.key]}
                                    onChange={handleInputChange(columnname.key)}
                                    label={columnname.label}
                                  />
                                ) : null}{" "}
                              </TableCell>
                            ) : (
                              <TableCell>
                                {/* {columnname.type === 8 ?
                  <Button
                  color="primary"
                  component={RouterLink}
                  size="small"
                  to={'/management/invoices/1'}
                  variant="outlined"
                >
                  View
                </Button>
                : null} */}

                                {columnname.type == 8 ? (
                                  <Button
                                    onClick={() => props.onPermissionadd(row)}
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                  >
                                    View
                                  </Button>
                                ) : null}
                                {columnname.type === 6 ? (
                                  <Button
                                    onClick={() => props.onPermissionadd(row)}
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                  >
                                    {columnname.controllabel}
                                  </Button>
                                ) : null}

                                {columnname.type === 9 ? (
                                  <AvatarGroup max={2}>
                                    {row[columnname.key]
                                      ? row[columnname.key]
                                          .split(",")
                                          .map((row, index) => (
                                            <Avatar
                                              alt="Remy Sharp"
                                              src={row}
                                              onClick={() => previewimage(row)}
                                              className={classes.small}
                                            />
                                          ))
                                      : null}{" "}
                                    {/* className={classes.small} />)) : null } */}
                                  </AvatarGroup>
                                ) : null}
                                {columnname.type === 2 ? (
                                  <Switch
                                    color="primary"
                                    name="checkedB"
                                    onChange={handleInputChange(columnname.key)}
                                    checked={row[columnname.key]}
                                    inputProps={{
                                      "aria-label": "primary checkbox",
                                    }}
                                  />
                                ) : null}
                                {columnname.type != 2 &&
                                columnname.type != 6 &&
                                columnname.type != 8 &&
                                columnname.type != 9 ? (
                                  <Typography>
                                    {" "}
                                    {row[columnname.key]}
                                  </Typography>
                                ) : null}
                              </TableCell>
                            )}
                          </>
                        )}
                      </>
                    ))}
                  </TableRow>
                </>
              ))}

              {/* {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}  */}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[50, 100, 200, 500]}
                  count={[props.values.length]}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  // ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
          {editcontent && (
            <EditContent
              diamond={editcontent}
              attributes={props.columns}
              title={props.title}
              masters={props.masters}
              onApply={Savevendor}
              onClose={handleApplicationClose}
              open={openedit}
              prefix={aliasName}
              editemail={editEmail}
            />
          )}
        </div>
      </Paper>
    </>
  );
};
export default withApollo(Vendor);
