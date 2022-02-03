import React from "react";
import {
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  InputAdornment,
  Typography,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { ORDERS } from "./../../services/queries";
import { PAYMENTSTATUSMASTER } from "./../../graphql/query";
import { useApolloClient, useQuery } from "react-apollo";
import { NetworkStatus } from "apollo-client";
import moment from "moment";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SearchIcon from "@material-ui/icons/Search";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { gql } from "apollo-boost";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";

let getAddress = (data) => {
  if (!data) return "";
  return (
    data?.addressline1 +
    "," +
    data?.addressline2 +
    "," +
    data?.city +
    "," +
    data?.state +
    "," +
    data?.pincode
  );
};

let getGiftMessage = (data) => {
  if (!data) return "";
  return data?.message + "  from:" + data?.giftFrom + "  to:" + data?.giftTo;
};

let getPaymentStatus = (data) => {
  if (data?.paymentMode === "COD") {
    return data.paymentStatus;
  }
  if (!data?.paymentResponse) return data.paymentStatus;
  let payment_response = JSON.parse(data?.paymentResponse);
  return (
    <div>
      <p style={{ margin: 0, padding: 0 }}>
        {payment_response?.APTRANSACTIONID}
      </p>
      <p style={{ margin: 0, padding: 0 }}>
        {payment_response?.MESSAGE ||
          payment_response?.TRANSACTIONPAYMENTSTATUS}
      </p>
    </div>
  );
};

let defaultColumns = {
  "Order ID": {
    is_active: true,
    is_default: true,
    identifier: "id",
  },
  "Order Date": {
    is_active: true,
    is_default: true,
    identifier: "order_date",
  },
  "Customer Name": {
    is_active: true,
    is_default: true,
    identifier: "customer_name",
  },
  SKUs: { is_active: false, identifier: "SKUs" },
  Email: { is_active: true, identifier: "email" },
  "Phone Number": { is_active: true, identifier: "phone_number" },
  "Shipping Address": { is_active: true, identifier: "shipping_address" },
  "Gift Message": { is_active: false, identifier: "gift_message" },
  "Order Status": { is_active: false, identifier: "order_status" },
  "Payment Mode": { is_active: true, identifier: "payment_mode" },
  "Payment Status": { is_active: true, identifier: "payment_status" },
  "Waybill No": { is_active: false, identifier: "waybill" },
  Comments: { is_active: false, identifier: "comments" },
 
  Actions: {
    is_active: true,
    is_default: true,
  },
};

const ActionIcon = (props) => {
  return (
    <>
      <IconButton
        onClick={() => {
          window.open(`orderdetails/${props.id}`);
        }}
      >
        <VisibilityIcon />
      </IconButton>
    </>
  );
};

let filterData = {};

export const OrderList = withRouter((props) => {
  let user_id = props.location.pathname.split("/")[2];
  if (user_id) {
    filterData = {
      userProfileId: {
        equalTo: user_id,
      },
    };
  }
  const [columnName, setColumnName] = React.useState(defaultColumns);
  const [orderFilter, setOrderFilter] = React.useState({
    ...filterData,
    id: { isNull: false },
  });
  const [orderBy, setOrderBy] = React.useState(["CREATED_AT_DESC"]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [masterData, setMasterData] = React.useState({
    orderMaster: [],
    paymentMaster: [
      { name: "SUCCESS" },
      { name: "FAIL" },
      { name: "TRANSACTION CANCELLED" },
    ],
  });
  const [selectedStatus, setSelectedStatus] = React.useState({
    orderStatus: "",
    paymentStatus: "",
  });
  const [fromDate, setFromDate] = React.useState(null);
  const [ToDate, setToDate] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (date, value) => {
    let createdAt = orderFilter?.createdAt;
    if (value === "from") {
      setFromDate(date);
      setOrderFilter({
        ...orderFilter,
        createdAt: {
          ...createdAt,
          greaterThanOrEqualTo: moment(date).format("yyyy-MM-DD"),
        },
      });
    }
    if (value === "to") {
      if (date > fromDate) {
        setToDate(date);
        setOrderFilter({
          ...orderFilter,
          createdAt: {
            ...createdAt,
            lessThanOrEqualTo: moment(date).format("yyyy-MM-DD"),
          },
        });
      } else alert("the To date must be higher thean from");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const client = useApolloClient();

  React.useEffect(() => {
    client
      .query({
        query: gql`
          ${PAYMENTSTATUSMASTER}
        `,
      })
      .then(({ data: { allOrderStatusMasters, allPaymentStatusMasters } }) => {
        setMasterData({
          orderMaster: allOrderStatusMasters?.nodes || [],
          paymentMaster: [
            ...masterData.paymentMaster,
            ...allPaymentStatusMasters?.nodes,
          ],
        });
      })
      .catch(console.error);
  }, []);

  const { loading, data, error, networkStatus } = useQuery(ORDERS, {
    variables: {
      limit: rowsPerPage,
      offset: page * rowsPerPage,
      order_filter: { ...orderFilter },
      order_by: orderBy,
    },
  });

  let rowData = data?.allOrders?.nodes;
  if (rowData) {
    rowData = rowData.map((item) => {
      return {
        id: item.id,
        order_date: moment(item?.createdAt).format("DD MMM YYYY HH:mm:ss"),
        SKUs: item?.shoppingCartByCartId?.shoppingCartItemsByShoppingCartId?.nodes
          .map((i) => i?.transSkuListByProductSku?.generatedSku)
          .join(", "),
        customer_name:
          item?.shoppingCartByCartId?.cartAddressesByCartId?.nodes?.[0]
            ?.firstname,
        email: item?.shoppingCartByCartId?.userProfileByUserprofileId?.email,
        phone_number:
          item?.shoppingCartByCartId?.cartAddressesByCartId?.nodes?.[0]
            ?.contactNumber,
        shipping_address: getAddress(
          item?.shoppingCartByCartId?.cartAddressesByCartId?.nodes?.[0]
        ),
        gift_message: getGiftMessage(item?.shoppingCartByCartId?.nodes?.[0]),
        payment_mode: item?.paymentMode,
        order_status: item?.orderStatus,
        payment_status: getPaymentStatus({
          paymentMode: item?.paymentMode,
          paymentResponse:
            item?.paymentDetailsByOrderId?.nodes?.[0]?.paymentResponse,
        }),
        emailMessageId: item?.emailMessageId,
        smsDeliveredId: item?.smsDeliveredId?.replace("otp-nacjotp-", ""),
        waybill: item?.awbNumber,
        comments: item?.comments,
      };
    });
  }
  let colSpan = Object.keys(columnName).filter(
    (item) => columnName[item].is_active
  ).length;
  return (
    <Grid container spacing={3}>
      <Grid
        container
        item
        xs={12}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Typography variant="h4">Orders</Typography>
      </Grid>
      <Grid container item xs={12} sm={12} spacing={2}>
        <Grid container item xs={3}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search by name, email, phone"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(event) => {
              setOrderFilter({
                shoppingCartByCartId: {
                  or: [
                    {
                      userProfileByUserprofileId: {
                        email: { includesInsensitive: event.target.value },
                      },
                    },
                    {
                      cartAddressesByCartId: {
                        some: {
                          or: [
                            {
                              firstname: {
                                includesInsensitive: event.target.value,
                              },
                            },
                            {
                              contactNumber: {
                                includesInsensitive: event.target.value,
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              });
            }}
          />
        </Grid>
        <Grid container item xs={2}>
          <TextField
            fullWidth
            variant="outlined"
            value={selectedStatus?.orderStatus}
            onChange={(event) => {
              setSelectedStatus({
                ...selectedStatus,
                orderStatus: event.target.value,
              });
              setOrderFilter({
                ...orderFilter,
                orderStatus: { includesInsensitive: event.target.value },
              });
            }}
            select
            label="Order Status"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start" style={{ cursor: "pointer" }}>
                  {selectedStatus?.orderStatus !== "" && (
                    <CancelOutlinedIcon
                      onClick={(event) => {
                        setSelectedStatus({
                          ...selectedStatus,
                          orderStatus: "",
                        });
                        delete orderFilter.orderStatus;
                        setOrderFilter({ ...orderFilter });
                      }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          >
            {masterData.orderMaster.map((option, index) => (
              <MenuItem key={index} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid container item xs={2}>
          <TextField
            fullWidth
            variant="outlined"
            value={selectedStatus?.paymentStatus}
            onChange={(event) => {
              setSelectedStatus({
                ...selectedStatus,
                paymentStatus: event.target.value,
              });
              setOrderFilter({
                ...orderFilter,
                paymentDetailsByOrderId: {
                  some: {
                    paymentResponse: {
                      includesInsensitive: event.target.value,
                    },
                  },
                },
              });
            }}
            select
            label="Payment Status"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start" style={{ cursor: "pointer" }}>
                  {selectedStatus?.paymentStatus !== "" && (
                    <CancelOutlinedIcon
                      onClick={(event) => {
                        setSelectedStatus({
                          ...selectedStatus,
                          paymentStatus: "",
                        });
                        delete orderFilter.paymentDetailsByOrderId;
                        setOrderFilter({ ...orderFilter });
                      }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          >
            {masterData.paymentMaster.map((option, index) => (
              <MenuItem key={index} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid container item xs={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoOk
              variant="inline"
              inputVariant="outlined"
              format="yyyy/MM/dd"
              margin="normal"
              label="From"
              value={fromDate}
              style={{ marginTop: 0 }}
              onChange={(date) => handleDateChange(date, "from")}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid container item xs={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoOk
              variant="inline"
              inputVariant="outlined"
              format="yyyy/MM/dd"
              margin="normal"
              label="To"
              value={ToDate}
              disableFuture={true}
              style={{ marginTop: 0 }}
              onChange={(date) => handleDateChange(date, "to")}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid container item xs={1}>
          <IconButton onClick={handleClick}>
            <ViewColumnIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                height:
                  Object.keys(columnName).filter((item) => !item?.is_default)
                    .length * 20,
                width: "50ch",
              },
            }}
          >
            <Grid container style={{ padding: 10 }}>
              {Object.keys(columnName).map(
                (item) =>
                  !columnName[item]?.is_default && (
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={item}
                            color="primary"
                            checked={columnName[item].is_active}
                            onClick={(_) => {
                              columnName[item].is_active =
                                !columnName[item].is_active;
                              setColumnName({ ...columnName });
                            }}
                          />
                        }
                        label={item}
                      />
                    </Grid>
                  )
              )}
            </Grid>
          </Menu>
        </Grid>
      </Grid>
      <Grid container item xs={12} sm={12} spacing={2}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {Object.keys(columnName).map(
                  (item) =>
                    columnName[item].is_active && (
                      <TableCell key={item} align={"center"}>
                        {item}
                      </TableCell>
                    )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(loading || NetworkStatus.refetch === networkStatus) && (
                <TableRow>
                  <TableCell colSpan={colSpan} align={"center"} padding="none">
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={colSpan} align={"center"}>
                    <Typography>
                      Some Error occured please try again!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {rowData &&
                rowData.length > 0 &&
                rowData.map((item) => (
                  <TableRow key={item.id}>
                    {Object.keys(columnName).map(
                      (column) =>
                        columnName[column].is_active && (
                          <TableCell key={column} align={"center"}>
                            {column !== "Actions" &&
                              item[columnName[column]?.identifier]}
                            {column === "Actions" && (
                              <ActionIcon id={item.id} />
                            )}
                          </TableCell>
                        )
                    )}
                  </TableRow>
                ))}
              {rowData && rowData.length == 0 && (
                <TableRow>
                  <TableCell colSpan={colSpan} align={"center"}>
                    <Typography>No Orders found!</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={colSpan}
                  align={"right"}
                  rowsPerPageOptions={[10, 25, 100]}
                  count={data?.allOrders?.totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  onPageChange={() => {}}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
});
export default OrderList;
