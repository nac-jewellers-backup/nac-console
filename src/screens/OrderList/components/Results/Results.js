import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
// import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from "@material-ui/styles";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import Moment from "react-moment";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/CancelOutlined";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";

import EnhancedTableHead from "../../../../components/EnhancedTableHead";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  CardHeader,
  Divider,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  colors,
} from "@material-ui/core";

import { Label, ReviewStars } from "../../../../components";

const useStyles = makeStyles((theme) => ({
  root: {},
  filterButton: {
    marginRight: theme.spacing(2),
  },
  table: {
    // minWidth: 500,
  },
  tableWrapper: {
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "100vh",
  },
  containergrid: {
    overflowX: "scroll",
    width: 1000,
    height: 20,
    overflowY: "hidden",
  },
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 1150,
  },
  actions: {
    padding: theme.spacing(0, 1),
    justifyContent: "flex-end",
  },
}));

const Results = (props) => {
  // debugger
  console.log(props, "the list data");
  const { className, orders, ...rest } = props;
  const [editcontent, setEditcontent] = React.useState({});
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState(props.columnobjs.length > 0 ? props.columnobjs[0].orderdate : "Order Date");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";

    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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
    return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
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
  const classes = useStyles();
  const [btnEdit, setBtnEdit] = React.useState({
    action: false,
    id: "",
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAll = (event) => {
    const selectedOrders = event.target.checked ? orders.map((order) => order.id) : [];

    setSelectedOrders(selectedOrders);
  };
  const handleInputChange = (type) => (e) => {
    setEditcontent({ ...editcontent, [type]: e.target.value });
  };
  const handleoptionChange = (type) => (event, value) => {
    setEditcontent({ ...editcontent, [type]: value });
  };
  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedOrders.indexOf(id);

    let newSelectedOrders = [];

    if (selectedIndex === -1) {
      newSelectedOrders = newSelectedOrders.concat(selectedOrders, id);
    } else if (selectedIndex === 0) {
      newSelectedOrders = newSelectedOrders.concat(selectedOrders.slice(1));
    } else if (selectedIndex === selectedOrders.length - 1) {
      newSelectedOrders = newSelectedOrders.concat(selectedOrders.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedOrders = newSelectedOrders.concat(
        selectedOrders.slice(0, selectedIndex),
        selectedOrders.slice(selectedIndex + 1)
      );
    }

    setSelectedOrders(newSelectedOrders);
  };
  async function Savevendor(refetch) {
    props.onupdate(editcontent);
    // setIsadd(false)
    // alert(JSON.stringify(editcontent))
    //  let response =  await sendNetworkRequest('/updatetax', {}, editcontent)
    setBtnEdit({ ...btnEdit, id: "", action: false });
    // refetch()
  }
  const handleChangePage = (event, page) => {
    setPage(page);
  };
  async function showorderdetails(orderurl) {
    window.open(orderurl);
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };
  function Editvendor(vendordata) {
    let paymentstatusobj = {};
    props.orderstatus.forEach((element) => {
      if (vendordata.orderstatus === element.name) {
        paymentstatusobj = element;
      }
    });

    delete vendordata["action"];

    setEditcontent({
      ...editcontent,
      ...vendordata,
      orderstatus: paymentstatusobj,
      isedit: true,
    });

    setBtnEdit({ ...btnEdit, id: vendordata.orderid, action: true });
  }
  function CancelEdit(diamondData) {
    //  alert(diamondData.paymentstatus)
    // if(isadd)
    // {
    //   let masters = masterlist;

    //  masters.splice(0, 1)
    //  setMasterlist(masterlist)

    // }
    //    setIsadd(false)
    setEditcontent({});
    setBtnEdit({ ...btnEdit, id: "", action: false });
  }
  const paymentStatusColors = {
    canceled: colors.grey[600],
    pending: colors.orange[600],
    completed: colors.green[600],
    rejected: colors.red[600],
  };

  return (
    <Card>
      <CardContent className={classes.content}>
        {/* <PerfectScrollbar> */}

        <div className={classes.tableWrapper}>
          <Table className={classes.table} stickyHeader size="small" border={1} borderColor={"#ddd"} size="small">
            {/* <TableHead>
                  <TableRow>
                  {props.columnobjs.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.name}
                </TableCell>
              ))} */}
            <EnhancedTableHead
              columns={props.columnobjs}
              columnsname={props.showcolumns}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            {/* <TableCell>Order ID</TableCell>
                    
                    <TableCell align="left">Order Date</TableCell>
                    <TableCell align="center">Customer Name</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Mobile</TableCell>
                    <TableCell align="center">Shipping Address</TableCell>
                    <TableCell align="center">Gift Message</TableCell>
                    <TableCell align="center">Payment Type</TableCell>
                    <TableCell align="center">Payment Status</TableCell> */}
            {/* <TableCell align="center">Waybill No</TableCell>
                    <TableCell align="center">Comments</TableCell>
                    <TableCell align="center">PG Response</TableCell> */}

            {/* </TableRow>
                </TableHead> */}
            <TableBody style={{ overflow: "scroll" }}>
              {stableSort(orders, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  // {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
                  <TableRow
                  // key={order.id}
                  // selected={selectedOrders.indexOf(order.id) !== -1}
                  >
                    {props.columnobjs.map((col) => (
                      <>
                        {col.key === "action" && props.iswrite ? (
                          <TableCell align="center" style={{ width: 20 }}>
                            {btnEdit.action && btnEdit.id == order.orderid ? (
                              <>
                                <Button onClick={(e) => Savevendor()}>
                                  <SaveIcon />
                                </Button>
                                <Button onClick={(e) => CancelEdit(order)}>
                                  <CancelIcon />
                                </Button>
                              </>
                            ) : (
                              <Button>
                                <VisibilityIcon onClick={(e) => showorderdetails(`/orderdetails/${order.orderid}`)} />
                              </Button>
                            )}
                          </TableCell>
                        ) : (
                          <>
                            {btnEdit.action && btnEdit.id == order.orderid ? (
                              <TableCell>
                                {!col.type || col.type == 1 ? <Typography> {order[col.key]}</Typography> : null}
                                {col.type == 2 ? (
                                  <TextField
                                    variant="outlined"
                                    margin="dense"
                                    id={col.key}
                                    name={col.key}
                                    value={editcontent[col.key]}
                                    onChange={handleInputChange(col.key)}
                                    label={col.label}
                                  />
                                ) : null}
                                {col.type == 4 ? <Moment format="DD MMM YYYY hh:mm a">{order[col.key]}</Moment> : null}

                                {col.type == 5 && order.paymentmode == "COD" ? (
                                  <Autocomplete
                                    id="combo-box-demo"
                                    options={props.paymentstatus}
                                    margin="dense"
                                    fullWidth
                                    value={editcontent[col.key]}
                                    onChange={handleoptionChange(col.key)}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => <TextField {...params} label="Payment Status" variant="outlined" />}
                                  />
                                ) : null}
                                {col.type == 5 && order.paymentmode != "COD" ? <Typography> {order[col.key]}</Typography> : null}

                                {col.type == 3 ? (
                                  <Autocomplete
                                    id="combo-box-demo"
                                    options={props.orderstatus}
                                    margin="dense"
                                    fullWidth
                                    value={editcontent[col.key]}
                                    onChange={handleoptionChange(col.key)}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => <TextField {...params} label="Order Status" variant="outlined" />}
                                  />
                                ) : null}
                              </TableCell>
                            ) : (
                              <TableCell align="center" style={{ width: 20 }}>
                                {col.type == 4 ? (
                                  <Moment format="DD MMM YYYY hh:mm a">{order[col.key]}</Moment>
                                ) : (
                                  <Typography> {order[col.key]}</Typography>
                                )}
                              </TableCell>
                            )}
                          </>
                        )}
                      </>
                    ))}

                    {/* {props.showcolumns.indexOf('Order ID') > -1 ? <TableCell >{order.id}</TableCell> : null }
                      {props.showcolumns.indexOf('Order Date') > -1 ? <TableCell align="left" style = {{width: 120}}>            
                                  <Moment format="DD MMM YYYY hh:mm a">
                                  {order.createdAt}
                                  </Moment>
                                  </TableCell> : null }
                      {props.showcolumns.indexOf('Customer Name') > -1 ? <TableCell align="left">{order.shoppingCartByCartId.userProfileByUserprofileId ? order.shoppingCartByCartId.userProfileByUserprofileId.firstName : ''}</TableCell> :  null}
                      {props.showcolumns.indexOf('Email') > -1 ? <TableCell align="left" style = {{width: 40}}>{order.shoppingCartByCartId.userProfileByUserprofileId ? order.shoppingCartByCartId.userProfileByUserprofileId.email : ''}</TableCell> : null}
                      {props.showcolumns.indexOf('Phone Number') > -1 ? <TableCell align="left" style = {{width: 40}}>{order.shoppingCartByCartId.userProfileByUserprofileId ? order.shoppingCartByCartId.userProfileByUserprofileId.mobile : ''}</TableCell> : null }
                      {props.showcolumns.indexOf('Shipping Address') > -1 ?  <TableCell align="left">{order.shoppingCartByCartId.cartAddressesByCartId.nodes.length > 0 ? order.shoppingCartByCartId.cartAddressesByCartId.nodes[0].addressline1 : ''}</TableCell> : null }
                      {props.showcolumns.indexOf('Gift Message') > -1 ? <TableCell align="left">{order.shoppingCartByCartId.giftwrapsByCartId.nodes.length > 0 ? order.shoppingCartByCartId.giftwrapsByCartId.nodes[0].message : ''}</TableCell> : null }
                      {props.showcolumns.indexOf('Payment Type') > -1 ? <TableCell >{order.paymentMode}</TableCell> : null }
                      {props.showcolumns.indexOf('Payment Status') > -1 ? <TableCell >{order.paymentStatus}</TableCell> : null }
                      {props.showcolumns.indexOf('Waybill No') > -1 ? <TableCell >{order.waybill}</TableCell> : null }
                      {props.showcolumns.indexOf('Comments') > -1 ? <TableCell >{order.comments}</TableCell> : null }
                      {props.showcolumns.indexOf('Pg Response') > -1 ? <TableCell >{order.pgresponse}</TableCell> : null }
                      {props.showcolumns.indexOf('SKUs') > -1 ? <TableCell >{order.skus}</TableCell> : null } */}

                    {/* <TableCell align="center">
                      <IconButton aria-label="add to favorites">
                        <CreateIcon />
                        </IconButton>
                        <IconButton aria-label="add to favorites">
                        <DeleteIcon />
                        </IconButton>
                      </TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {/* </PerfectScrollbar> */}
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={orders.length}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 50, 100, 250]}
        />
      </CardActions>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  orders: PropTypes.array.isRequired,
};

Results.defaultProps = {
  orders: [],
};

export default Results;
