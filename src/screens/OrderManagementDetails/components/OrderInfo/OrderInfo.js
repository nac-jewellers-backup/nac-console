import {
  Button, Card,
  CardActions,

  CardContent, CardHeader,

  Divider,






  Link, Table,
  TableBody,

  TableCell, TableRow,

  TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { GRAPHQL_DEV_CLIENT } from "../../../../config";
import {
  PAYMENTSTATUSMASTER
} from "../../../../graphql/query";

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

  const classes = useStyles();

  const options = ["Canceled", "Completed", "Rejected"];

  const [option, setOption] = useState(options[0]);
  const [paymentstatus, setPaymentstatus] = useState([]);
  const [orderstatus, setOrderstatus] = useState([]);

  const handleChange = (event) => {
    event.persist();

    setOption(event.target.value);
  };
  async function getmaster() {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: PAYMENTSTATUSMASTER }),
    };
    // console.log("helo",setProductCtx)
    fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        setPaymentstatus(fatchvalue.data.allPaymentStatusMasters.nodes);
        setOrderstatus(fatchvalue.data.allOrderStatusMasters.nodes);
      })
      .catch(console.error);
  }
  React.useEffect(() => {
    getmaster();
  }, []);


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
              <TableCell>Mobile Number</TableCell>
              <TableCell>{order.user_profile.email}</TableCell>
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
                  name="option"
                  placeholder="Waybill Number"
                  onChange={handleChange}
                  value={order.awb_number}
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
                  name="option"
                  onChange={handleChange}
                  select
                  margin="dense"
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={option}
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
                  name="option"
                  onChange={handleChange}
                  select
                  margin="dense"
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={option}
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
                  name="option"
                  placeholder="Comments"
                  onChange={handleChange}
                  value={order.awb_number}
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button variant="contained" color="primary">
          {/* <EditIcon className={classes.buttonIcon} /> */}
          Save
        </Button>
        {/* <Button>
          <ReceiptIcon className={classes.buttonIcon} />
          Resend invoice
        </Button> */}
      </CardActions>
    </Card>
  );
};

OrderInfo.propTypes = {
  className: PropTypes.string,
  order: PropTypes.object.isRequired,
};

export default OrderInfo;
