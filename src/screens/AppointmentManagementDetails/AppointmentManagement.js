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
  Typography,
  Backdrop,
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useApolloClient, useQuery } from "react-apollo";
import AppointmentInfo from "./components/AppointmentInfo";
import AppointmentExtra from "./components/AppointmentExtra";
import moment from "moment";
import Page from "../../components/Page/Page";
import { withRouter } from "react-router-dom";
import { NetworkContext } from "../../context/NetworkContext";
import { GRAPHQL_DEV_CLIENT } from "../../config";
import { NetworkStatus } from "apollo-client";
import { GETORDERCOMMUNICATIONLOGS,SHOW_ALL_PPOINMENT_DETAILS,GETAPPLICATIONCOMMUNICATIONLOGS } from "../../graphql/query";



const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  container: {
    marginTop: theme.spacing(3),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export const AppointmentManagementDetails = withRouter((props) => {
  const classes = useStyles();
  const [order, setOrder] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [communicationLogs, setCommunicationLogs] = useState([]);

  const { sendNetworkRequest } = React.useContext(NetworkContext);

  const getOrderCommunicationLogs = async (order_id) => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GETAPPLICATIONCOMMUNICATIONLOGS,
        variables: {
          id: parseInt(order_id),
        },
      }),
    };
    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        setCommunicationLogs(
          fatchvalue?.data?.appointmentById?.appointmentCommunicationLogsByAppointmentId?.nodes ?? []
        );
      })
      .catch(console.error);
  };

  const { loading, data, error, networkStatus,refetch } = useQuery(SHOW_ALL_PPOINMENT_DETAILS, {
    variables: {
      id: parseInt(order)
    },
    notifyOnNetworkStatusChange:true,
    fetchPolicy:"network-only"
  });
 
  useEffect(() => {
    var com_id = props.location.pathname.split("/")[2];
    getOrderCommunicationLogs(com_id);
    setOrder(com_id)
  }, []);

  if (!order) {
    return null;
  }

  const handleStatusChange=()=>{
    refetch()
  }


  return (
    <Page className={classes.root} title="Appointment Management Details">

       <Backdrop className={classes.backdrop} open={loading || NetworkStatus.refetch === networkStatus}>
                  <CircularProgress color="inherit"/>
                </Backdrop>
       <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid item>
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            Appointments
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            Appointment #{order}
          </Typography>
        </Grid>
      </Grid>
      <Grid className={classes.container} container spacing={3}>
          <Grid container xs={12} style={{ marginTop: "10px" }}>
            <Grid item md={12} xl={12} xs={12} style={{ padding: "14px" }}>
                   <AppointmentInfo order={data}/>
            </Grid>
            <Grid item md={12} xl={12} xs={12} style={{ padding: "14px" }}>
                 <AppointmentExtra order={data} id={order} refetch={refetch}/>
            </Grid>
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
                          val.communicationType === "email" && (
                            <TableRow key={index}>
                              <TableCell>{val.senderResponseId ?? "-"}</TableCell>
                              <TableCell>{val.communicationType ?? "-"}</TableCell>
                              <TableCell>{val.type ?? "-"}</TableCell>{" "}
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
                          val.communicationType === "sms" && (
                            <TableRow key={index}>
                              <TableCell>{val.senderResponseId ?? "-"}</TableCell>
                              <TableCell>{val.communicationType ?? "-"}</TableCell>
                              <TableCell>{val.type ?? "-"}</TableCell>{" "}
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
    </Page>
  );
});

export default AppointmentManagementDetails;
