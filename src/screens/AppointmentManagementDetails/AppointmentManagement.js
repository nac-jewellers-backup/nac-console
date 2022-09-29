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
import Page from "../../components/Page/Page";
import { withRouter } from "react-router-dom";
import { NetworkContext } from "../../context/NetworkContext";
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

export const AppointmentManagementDetails = withRouter((props) => {
  const classes = useStyles();
  const [order, setOrder] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [communicationLogs, setCommunicationLogs] = useState([]);

  const { sendNetworkRequest } = React.useContext(NetworkContext);

 
  useEffect(() => {
    var com_id = props.location.pathname.split("/")[2];
    console.log(com_id)
  }, []);

  if (!order) {
    return null;
  }

  return (
    <Page className={classes.root} title="Appointment Management Details">
      
      <Grid className={classes.container} container spacing={3}>
        <Grid item md={4} xl={3} xs={12}>
          
        </Grid>
        <Grid item md={8} xl={9} xs={12}>
         
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

export default AppointmentManagementDetails;
