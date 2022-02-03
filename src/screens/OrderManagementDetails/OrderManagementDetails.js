import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import Page from "../../components/Page";
import { Header, OrderInfo, OrderItems } from "./components";
import { withRouter } from "react-router-dom";
import { NetworkContext } from "../../context/NetworkContext";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import { GRAPHQL_DEV_CLIENT } from "../../config";
import { GETORDERCOMMUNICATIONLOGS } from "../../graphql/query";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  container: {
    marginTop: theme.spacing(3),
  },
}));

export const OrderManagementDetails = withRouter((props) => {
  const classes = useStyles();
  const [order, setOrder] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [communicationLogs, setCommunicationLogs] = useState([]);

  const { sendNetworkRequest } = React.useContext(NetworkContext);

  async function fetchorderdetails(order_id) {
    let response = await sendNetworkRequest(
      "/getorderdetails",
      {},
      { order_id }
    );
    console.log(response);
    setOrder(response.orders);
    setProductDetails(response.product_detail);
  }

  const getOrderCommunicationLogs = async (order_id) => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GETORDERCOMMUNICATIONLOGS,

        variables: {
          id: order_id,
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

  useEffect(() => {
    let mounted = true;
    var com_id = props.location.pathname.split("/")[2];

    fetchorderdetails(com_id);
    getOrderCommunicationLogs(com_id);
    return () => {
      mounted = false;
    };
  }, []);

  if (!order) {
    return null;
  }

  return (
    <Page className={classes.root} title="Order Management Details">
      <Header order={order} />
      <Grid className={classes.container} container spacing={3}>
        <Grid item md={4} xl={3} xs={12}>
          <OrderInfo order={order} />
        </Grid>
        <Grid item md={8} xl={9} xs={12}>
          <OrderItems order={order} productDetails={productDetails} />
          <OrderDetails
            order={order}
            productDetails={productDetails}
            style={{ marginTop: 30 }}
          />
          <Grid container xs={12} style={{ marginTop: "10px" }}>
            <Grid item md={6} xl={6} xs={12} style={{ padding: "14px" }}>
              <Card>
                <CardHeader title="Email Info" />
                <Divider />
                <CardContent className={classes.content}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Response Id</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Message Type</TableCell>
                        <TableCell>Create At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {communicationLogs.map(
                        (val, index) =>
                          val.type === "email" && (
                            <TableRow key={index}>
                              <TableCell>{val.senderResponseId}</TableCell>
                              <TableCell>{val.type}</TableCell>
                              <TableCell>{val.messageType}</TableCell>{" "}
                              <TableCell>
                                {moment(val.createdAt).format(
                                  "DD/MM/YYYY HH:mm:ss"
                                )}
                              </TableCell>
                            </TableRow>
                          )
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={6} xl={6} xs={12} style={{ padding: "14px" }}>
              <Card>
                <CardHeader title="Message Info" />
                <Divider />
                <CardContent className={classes.content}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Response Id</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Message Type</TableCell>
                        <TableCell>Create At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {communicationLogs.map(
                        (val, index) =>
                          val.type === "sms" && (
                            <TableRow key={index}>
                              <TableCell>{val.senderResponseId}</TableCell>
                              <TableCell>{val.type}</TableCell>
                              <TableCell>{val.messageType}</TableCell>{" "}
                              <TableCell>
                                {moment(val.createdAt).format(
                                  "DD/MM/YYYY HH:mm:ss"
                                )}
                              </TableCell>
                            </TableRow>
                          )
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
});

export default OrderManagementDetails;
