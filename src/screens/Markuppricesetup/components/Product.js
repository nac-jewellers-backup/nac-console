import React from "react";
import clsx from "clsx";
import { lighten, makeStyles, useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { NetworkContext } from "../../../context/NetworkContext";
import ConformationAlert from "../../../components/ConformationAlert";

import Toolbar from "@material-ui/core/Toolbar";
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
import { Input, Grid, Card } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { Query, withApollo } from "react-apollo";
import {
  DIAMONDMARKUP,
  PRODUCTLISTSTATUSEDIT,
  DELETEMARKUPPRICE,
} from "../../../graphql/query";
import { useHistory } from "react-router-dom";
import { Button, Switch } from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Moment from "react-moment";
import Addmarkup from "./Addmarkup";
import CancelIcon from "@material-ui/icons/CancelOutlined";
import SaveIcon from "@material-ui/icons/Save";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Chip, TextField } from "@material-ui/core";
import { BASE_URL } from "../../../config";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Filterandsearch from "./../../../screens/Productlist/filterandsearch";
const columns = [
  { id: "Component", label: "Components" },
  { id: "Product Category", label: "product Category" },
  { id: "Product Type", label: "Product Type" },
  { id: "Selling Price Min", label: "Selling Price Min" },
  { id: "Selling Price Max", label: "Selling Price Max" },
  { id: "Markup Type", label: "Markup Type" },
  { id: "Markup value", label: "Markup value" },
  { id: "updatedAt", label: "updatedAt" },
  { id: "Edit / Delete", label: "Edit / Delete", align: "center" },
];

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

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {/* <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? '' : ''}
                </span>
              ) : null}
            </TableSortLabel> */}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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
  },
  cardroot: {
    flexGrow: 1,
  },
  cardcontent: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: "auto",
  },
}));

const AddContact = (props) => {
  let history = useHistory();
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [pageCount, setPageCount] = React.useState(0);
  const [offsetValue, setOffsetValue] = React.useState(0);
  const [editmarkup, setEditmarkup] = React.useState({});
  const [goldpricelist, setGoldpricelist] = React.useState({});
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [deleteid, setDeleteid] = React.useState("");
  const [refetch, setRefetch] = React.useState(null);
  const [isdelete, setIsdelete] = React.useState(false);
  const [pricecomponent, setPriceomponent] = React.useState("Diamond");

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.contactlist.length - page * rowsPerPage);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("Product Id");
  const [btnEdit, setBtnEdit] = React.useState({
    action: false,
    id: "",
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [isconformation, setIsconformation] = React.useState(false);
  const showdeleteconformation = () => {
    setIsconformation(true);
  };

  const hidedeleteconformation = () => {
    setIsconformation(false);
  };
  async function handledelete(datacontent, refetch) {
    setIsdelete(true);
    let variables = {
      elementId: deleteid,
    };
    await props.client
      .mutate({ mutation: DELETEMARKUPPRICE, variables })
      .then((res) => {
        if (res !== null) {
          refetch();
          // refetchval()
        }
      })
      .catch((err) => {});
    setIsconformation(false);
  }
  function handleDelete(diamondData, refetch) {
    setDeleteid(diamondData.id);

    setIsconformation(true);
  }

  async function updatemarkup(markupcontent, refetch) {
    let product_type = markupcontent.producttype
      ? markupcontent.producttype
      : [];
    let material_list = markupcontent.materiallist
      ? markupcontent.materiallist
      : [];
    let purity_list = markupcontent.puritylist ? markupcontent.puritylist : [];

    var bodydata = {};
    bodydata["category"] = markupcontent.category.name;
    bodydata["producttype"] = product_type;
    bodydata["sellingPriceMin"] = markupcontent.sellpricemin;
    bodydata["sellingPriceMax"] = markupcontent.sellpricemax;
    bodydata["markuptype"] = markupcontent.markuptype.label;
    bodydata["material_list"] = material_list;
    bodydata["purity_list"] = purity_list;
    bodydata["markupValue"] = markupcontent.markup;
    bodydata["material"] = pricecomponent;
    console.log("XXXXXXXX");
    await sendNetworkRequest("/addmarkup", {}, bodydata);
    setOpen(false);
    setBtnEdit({ ...btnEdit, id: "", action: false });
    refetch();
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
    setOffsetValue(newPage * rowsPerPage);
  }
  function CancelEdit(diamondData) {
    setBtnEdit({ ...btnEdit, id: "", action: false });
  }
  function handleEdit(diamondData) {
    setEditmarkup({
      ...editmarkup,
      markupid: diamondData.id,
      sellingPriceMin: diamondData.sellingPriceMin,
      sellingPriceMax: diamondData.sellingPriceMax,
      markupValue: diamondData.markupValue,
      updatedAt: new Date(),
    });
    // setProductCtx({
    //   ...productCtx,
    //   editleadtime:diamondData.vendorDeliveryTime,
    //   editreadytoship: diamondData.isReadyToShip,
    //   editisdefault:diamondData.isdefault,
    //   editisactive:diamondData.isActive
    // })
    setBtnEdit({ ...btnEdit, id: diamondData.id, action: true });
  }
  async function handleSave(id, refetch) {
    var bodydata = {};

    await sendNetworkRequest("/updatemarkup", {}, editmarkup);

    setBtnEdit({ ...btnEdit, id: "", action: false });
    refetch();
  }
  const handleoptionChange = (type) => (event, value) => {
    setEditmarkup({ ...editmarkup, [type]: value });
  };
  const handlecomponentChange = (type) => (event, value) => {
    setPriceomponent(value);
  };
  const handleinputChange = (type) => (e) => {
    setEditmarkup({
      ...editmarkup,
      [type]: e.target.value,
    });
    // setProductCtx({ ...productCtx, [type]: e.target.value})
  };

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }
  function ProductEdit(id) {
    // localStorage.setItem('productEditId',id);
    history.push(`product_attributes/${id}`);
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // function productItemStatusChange(id,isactive){
  // let variable = {
  //   "productId": id
  // };
  // let status = isactive ? variable.isActive = false :variable.isActive = true;

  // const [productItemStatusChange,{ data }] = useMutation(PRODUCTLISTSTATUSEDIT);
  // }

  return (
    <>
      <Card className={classes.cardcontent}>
        <Grid
          container
          justify="left"
          alignItems="center"
          className={classes.cardroot}
          spacing={4}
        >
          <Grid item xs={3}>
            <Typography variant="h6">{"Selling Price Markup Setup"}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              id="free-solo-2-demo"
              className={classes.fixedTag}
              defaultValue={pricecomponent}
              options={["Diamond", "Gem Stone", "Gold", "Making Charge", "All"]}
              onChange={handlecomponentChange("earringbacking")}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pricing Components"
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  // error = {productCtx.error_message.earringbacking}
                  InputProps={{ ...params.InputProps, type: "search" }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <Button
              color="primary"
              variant="contained"
              size="small"
              style={{ paddingRight: 16, paddingLeft: 16 }}
              onClick={handleClickOpen}
            >
              Add New
            </Button>
          </Grid>
        </Grid>
      </Card>
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            border={1}
            borderColor={"#ddd"}
            size="small"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <Query
                query={DIAMONDMARKUP}
                onCompleted={(data) =>
                  setPageCount(data.allPricingMarkups.totalCount)
                }
                variables={{ vendorCode: pricecomponent }}
              >
                {({ data, loading, error, refetch }) => {
                  debugger;
                  if (loading) {
                    // return <Loader />
                  }
                  if (error) {
                    return <div>{error}</div>;
                    // return false
                  }
                  if (data) {
                    setGoldpricelist(data);
                    return (
                      <>
                        <ConformationAlert
                          title={"Are you sure to delete?"}
                          positivebtn={"Yes"}
                          negativebtn={"No"}
                          message={""}
                          refetch={refetch}
                          onSuccess={handledelete}
                          onCancel={hidedeleteconformation}
                          isshow={isconformation}
                        />
                        {open ? (
                          <Addmarkup
                            isadd={open}
                            material={pricecomponent}
                            refetch={refetch}
                            actionSave={updatemarkup}
                            category={props.categories}
                            producttype={props.producttypes}
                            materiallist={props.materiallist}
                            puritylist={props.puritylist}
                            title={props.title}
                            actionclose={handleClose}
                          />
                        ) : null}

                        {data.allPricingMarkups.nodes.map((row, index) => (
                          <>
                            <TableRow key={row.category}>
                              <TableCell component="th" scope="row">
                                {row.material}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {row.category}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {row.productType ? row.productType : "All"}
                              </TableCell>
                              <TableCell align="left">
                                {/* {
                                    btnEdit.action && btnEdit.id == row.id ? <Input
                                    variant="outlined"
                                    margin="dense"
                                    label="Cost Price"
                                    fullWidth
                                    className={classes.helperinput}
                                    value= {editmarkup.sellingPriceMin}
                                    onChange={handleinputChange('sellingPriceMin')}

                                    id="productvendorcode"
                                    name="Cost Price"
                                    /> :  */}
                                <Typography className={classes.heading}>
                                  {row.sellingPriceMin}{" "}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                {/* {
                                    btnEdit.action && btnEdit.id == row.id ? <Input
                                    variant="outlined"
                                    margin="dense"
                                    label="Cost Price"
                                    fullWidth
                                    className={classes.helperinput}
                                    value= {editmarkup.sellingPriceMax}
                                    onChange={handleinputChange('sellingPriceMax')}
                                    id="productvendorcode"
                                    name="Cost Price"
                                    /> :  */}
                                <Typography className={classes.heading}>
                                  {row.sellingPriceMax}{" "}
                                </Typography>
                              </TableCell>

                              <TableCell align="center">
                                {btnEdit.action && btnEdit.id == row.id ? (
                                  <Autocomplete
                                    id="free-solo-2-demo"
                                    fullWidth
                                    disableClearable
                                    className={classes.fixedTag}
                                    getOptionLabel={(option) => option.name}
                                    onChange={handleoptionChange(
                                      "sellingPriceType"
                                    )}
                                    options={[
                                      { label: 1, name: "Flat" },
                                      { label: 2, name: "Percentage" },
                                    ]}
                                    renderTags={(value, getTagProps) =>
                                      value.map((option, index) => (
                                        <Chip
                                          variant="outlined"
                                          size="small"
                                          label={option.name}
                                          {...getTagProps({ index })}
                                        />
                                      ))
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Price Type"
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                          ...params.InputProps,
                                          readOnly: true,
                                          type: "search",
                                        }}
                                      />
                                    )}
                                  />
                                ) : (
                                  <Typography className={classes.heading}>
                                    {row.markupType === 1
                                      ? "Flat"
                                      : "Percentage"}{" "}
                                  </Typography>
                                )}
                              </TableCell>

                              <TableCell align="left">
                                {btnEdit.action && btnEdit.id == row.id ? (
                                  <Input
                                    variant="outlined"
                                    margin="dense"
                                    label="Cost Price"
                                    fullWidth
                                    className={classes.helperinput}
                                    value={editmarkup.markupValue}
                                    onChange={handleinputChange("markupValue")}
                                    id="productvendorcode"
                                    name="Cost Price"
                                  />
                                ) : (
                                  <Typography className={classes.heading}>
                                    {row.markupValue}{" "}
                                  </Typography>
                                )}
                              </TableCell>

                              <TableCell align="left">
                                <Moment format="DD MMM YYYY hh:mm a">
                                  {btnEdit.action && btnEdit.id == row.id
                                    ? editmarkup.updatedAt
                                    : row.updatedAt}
                                </Moment>
                              </TableCell>
                              {btnEdit.action && btnEdit.id == row.id ? (
                                <TableCell
                                  style={{ width: 170 }}
                                  align="center"
                                >
                                  <Button
                                    onClick={(e) => handleSave(row.id, refetch)}
                                  >
                                    <SaveIcon />
                                  </Button>
                                  <Button onClick={(e) => CancelEdit(row)}>
                                    <CancelIcon />
                                  </Button>
                                </TableCell>
                              ) : (
                                <TableCell
                                  align="center"
                                  style={{ width: 170 }}
                                >
                                  <Button onClick={(e) => handleEdit(row)}>
                                    <EditIcon />
                                  </Button>
                                  <Button
                                    onClick={(e) => handleDelete(row, refetch)}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          </>
                        ))}
                      </>
                    );
                  } else {
                    return <div>{"Fetch Products"}</div>;
                  }
                }}
              </Query>
              {/* {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
            </TableBody>
            {/* <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[50,100,200,500]}
                colSpan={5}
                count={pageCount}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>*/}
          </Table>
        </div>
      </Paper>
    </>
  );
};
export default withApollo(AddContact);
