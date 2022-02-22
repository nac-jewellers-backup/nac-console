import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";
import { API_URL, GRAPHQL_DEV_CLIENT } from "../../../../config";
import {
  PAYMENTSTATUSMASTER,
  GETORDERCOMMUNICATIONLOGS,
} from "../../../../graphql/query";
import { UPDATE_ORDER } from "../../../../graphql/mutation";
import { makeStyles } from "@material-ui/styles";
import { useApolloClient } from "react-apollo";
import { AlertContext } from "../../../../context";

import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Divider,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Link,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0,
  },
  actions: {
    flexDirection: "column",
    alignItems: "flex-end",
    "& > * + *": {
      marginLeft: 0,
    },
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
}));

const OrderInfo = (props) => {
  const { order, className, ...rest } = props;
  const client = useApolloClient();
  const classes = useStyles();
  const snack = React.useContext(AlertContext);

  const [paymentstatus, setPaymentstatus] = useState([]);
  const [orderstatus, setOrderstatus] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [updateOrder, setUpdateOrder] = useState({
    waybillNum: null,
    paymentStatus: null,
    orderStatus: null,
    comments: null,
  });
  const [communicationLogs, setCommunicationLogs] = useState([]);
  const handleChange = (event) => {
    setUpdateOrder({ ...updateOrder, [event.target.name]: event.target.value });
    if (updateOrder?.comments?.length > 0) {
      setErrorMsg("");
    }
  };
  async function getmaster() {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: PAYMENTSTATUSMASTER }),
    };
    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        setPaymentstatus(fatchvalue.data.allPaymentStatusMasters.nodes);
        setOrderstatus(fatchvalue.data.allOrderStatusMasters.nodes);

        setUpdateOrder({
          waybillNum: order?.awb_number ?? null,
          paymentStatus: order?.payment_status ?? null,
          orderStatus: order?.order_status ?? null,
          comments: order?.comments ?? null,
        });
      })
      .catch(console.error);
  }
  const getOrderCommunicationLogs = async () => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GETORDERCOMMUNICATIONLOGS,

        variables: {
          id: order?.id,
        },
      }),
    };
    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        setCommunicationLogs(
          fatchvalue?.data?.orderById?.communicationLogsByOrderId?.nodes ?? []
        );
      })
      .catch(console.error);
  };
  React.useEffect(() => {
    getmaster();
    getOrderCommunicationLogs();
  }, []);

  const sendEmail = (order_id, type) => {
    const url = API_URL + "/trigger_mail";
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: order_id, type: type }),
    };
    fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        snack.setSnack({
          open: true,
          msg: "Mail Send Successfully!",
        });
        console.log(fatchvalue);
      })
      .catch((err) => {
        snack.setSnack({
          open: true,
          severity: "error",
          msg: "Some error occured!",
        });
      });
  };
  const handleSubmit = () => {
    if (updateOrder?.comments?.length > 0) {
      client
        .mutate({
          mutation: UPDATE_ORDER,
          variables: {
            id: order?.id,
            awbNumber: updateOrder?.waybillNum ?? "",
            comments: updateOrder?.comments ?? "",
            orderStatus: updateOrder?.orderStatus,
            paymentStatus: updateOrder?.paymentStatus,
          },
        })
        .then((res) => {
          if (res) {
            snack.setSnack({
              open: true,
              msg: "Successfully Updated!",
            });
          }
        })
        .catch((err) => {
          console.log(err);

          snack.setSnack({
            open: true,
            severity: "error",
            msg: "Some error occured!",
          });
        });
    } else {
      setErrorMsg("Enter Comments");
    }
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Order info" />
      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>
                <Link
                  target="_blank"
                  component={RouterLink}
                  to={`/customerdetails/${order.user_profile.id}`}
                >
                  {order.user_profile.first_name} {order.user_profile.last_name}
                </Link>
                <div>
                  {order.shopping_cart
                    ? order.shopping_cart.cart_addresses
                      ? order.shopping_cart.cart_addresses.length > 0
                        ? order.shopping_cart.cart_addresses[0].addressline1
                        : ""
                      : ""
                    : ""}
                </div>
                <div>
                  {order.shopping_cart
                    ? order.shopping_cart.cart_addresses
                      ? order.shopping_cart.cart_addresses.length > 0
                        ? order.shopping_cart.cart_addresses[0].addressline2
                        : ""
                      : ""
                    : ""}
                </div>
                <div>
                  {order.shopping_cart
                    ? order.shopping_cart.cart_addresses
                      ? order.shopping_cart.cart_addresses.length > 0
                        ? order.shopping_cart.cart_addresses[0].city
                        : ""
                      : ""
                    : ""}
                </div>
                <div>
                  {order.shopping_cart
                    ? order.shopping_cart.cart_addresses
                      ? order.shopping_cart.cart_addresses.length > 0
                        ? order.shopping_cart.cart_addresses[0].state
                        : ""
                      : ""
                    : ""}
                </div>
                <div>
                  {order.shopping_cart
                    ? order.shopping_cart.cart_addresses
                      ? order.shopping_cart.cart_addresses.length > 0
                        ? order.shopping_cart.cart_addresses[0].country
                        : ""
                      : ""
                    : ""}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email ID</TableCell>
              <TableCell>{order.user_profile.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mobile Number</TableCell>
              <TableCell>
                {order.shopping_cart
                  ? order.shopping_cart.cart_addresses
                    ? order.shopping_cart.cart_addresses.length > 0
                      ? order.shopping_cart.cart_addresses[0].contact_number
                      : ""
                    : ""
                  : ""}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>
                {moment(order.created_at).format("DD MMM YYYY hh:mm a")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>
                {order.currency}
                {order.shopping_cart.discounted_price}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Waybil Number</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  margin="dense"
                  name="waybillNum"
                  placeholder="Waybill Number"
                  onChange={handleChange}
                  value={updateOrder.waybillNum}
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gift Message</TableCell>
              <TableCell>
                {order.shopping_cart
                  ? order.shopping_cart.giftwraps
                    ? order.shopping_cart.giftwraps.length > 0
                      ? order.shopping_cart.giftwraps[0].message
                      : ""
                    : ""
                  : ""}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Payment Mode</TableCell>
              <TableCell>{order.payment_mode}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Payment Status</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  name="paymentStatus"
                  onChange={handleChange}
                  select
                  margin="dense"
                  SelectProps={{ native: true }}
                  value={updateOrder.paymentStatus}
                  variant="outlined"
                >
                  {paymentstatus.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </TextField>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Order Status</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  name="orderStatus"
                  onChange={handleChange}
                  select
                  margin="dense"
                  SelectProps={{ native: true }}
                  value={updateOrder.orderStatus}
                  variant="outlined"
                >
                  {orderstatus.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </TextField>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Comments</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  margin="dense"
                  name="comments"
                  placeholder="Comments"
                  onChange={handleChange}
                  value={updateOrder.comments}
                  variant="outlined"
                />
                <span style={{ color: "red" }}>{errorMsg}</span>
              </TableCell>
            </TableRow>
          
          </TableBody>
        </Table>
      </CardContent>
      <CardActions className={classes.actions}>
        <Grid>
          {updateOrder.paymentStatus === "Paid" ? (
            <>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "4px 0px" }}
                onClick={() => sendEmail(order?.id, "order")}
              >
                Order Email
              </Button>
              <span>&nbsp;&nbsp;&nbsp;</span>{" "}
            </>
          ) : (
            ""
          )}
          {updateOrder.paymentStatus === "Paid" ? (
            <>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "4px 0px" }}
                onClick={() => sendEmail(order?.id, "payment")}
              >
                Payment Confirmation Email
              </Button>
              <span>&nbsp;&nbsp;&nbsp;</span>{" "}
            </>
          ) : (
            ""
          )}
          {updateOrder.paymentStatus === "Paid" &&
          updateOrder.orderStatus === "Shipped" ? (
            <>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "4px 0px" }}
                onClick={() => sendEmail(order?.id, "shipping")}
              >
                Shipping Email
              </Button>
              <span>&nbsp;&nbsp;&nbsp;</span>{" "}
            </>
          ) : (
            ""
          )}
          {updateOrder.paymentStatus === "Paid" &&
          updateOrder.orderStatus === "Delivered" ? (
            <>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "4px 0px" }}
                onClick={() => sendEmail(order?.id, "shipping")}
              >
                Shipping Email
              </Button>
              <span>&nbsp;&nbsp;&nbsp;</span>{" "}
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "4px 0px" }}
                onClick={() => sendEmail(order?.id, "rate")}
              >
                Rate Email
              </Button>
              <span>&nbsp;&nbsp;&nbsp;</span>{" "}
            </>
          ) : (
            ""
          )}

          <Button
            variant="contained"
            color="primary"
            style={{ margin: "4px 0px" }}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
};

OrderInfo.propTypes = {
  className: PropTypes.string,
  order: PropTypes.object.isRequired,
};

export default OrderInfo;
