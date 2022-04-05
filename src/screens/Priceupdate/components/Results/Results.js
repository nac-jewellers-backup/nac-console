import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

import RefreshIcon from "@material-ui/icons/Refresh";

import { NetworkContext } from "../../../../context/NetworkContext";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  filterButton: {
    marginRight: theme.spacing(2),
  },
  content: {
    padding: 0,
  },
  inner: {
    overflowX: "auto",
  },
  actions: {
    padding: theme.spacing(0, 1),
    justifyContent: "flex-end",
  },
}));

const Results = (props) => {
  const { className, orders, ...rest } = props;

  const classes = useStyles();
  const { sendNetworkRequest } = React.useContext(NetworkContext);

  const [status, setStatus] = useState({});

  function handleAdd(e) {
    setStatus({ ...status, [e.id]: "0 out of " + props.products.length });

    props.update(e);
  }
  function handleupdate(e) {
    setStatus({ ...status, [e.id]: "0 out of " + props.products.length });

    props.resumeupdate(e);
  }

  function handledownload(e) {
    props.downloadlog();
  }
  async function handlestatus(e) {
    let bodydata = {
      component: e.label,
    };
    let response = await sendNetworkRequest(
      "/getcomponentpricestatus",
      {},
      bodydata,
      false
    );

    setStatus({ ...status, [e.id]: response.message });
  }

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Card style={{ marginTop: 16 }}>
        <CardContent className={classes.content}>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Components</TableCell>

                  <TableCell align="center">Action</TableCell>

                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Restart</TableCell>

                  <TableCell align="center">Log</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.pricingrows.map((order) => (
                  <TableRow>
                    <TableCell>{order.id}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        onClick={(e) => handleAdd(order)}
                        size="small"
                        color="primary"
                        className={classes.margin}
                      >
                        ₹ Run
                      </Button>
                    </TableCell>

                    <TableCell align="center">
                      {status[order.id] ? status[order.id] : ""}

                      <IconButton
                        aria-label="delete"
                        onClick={(e) => handlestatus(order)}
                        color="primary"
                      >
                        <RefreshIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        color="primary"
                        onClick={(e) => handleupdate(order)}
                        size="small"
                      >
                        Re Run
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        color="primary"
                        onClick={(e) => handledownload()}
                        size="small"
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardActions className={classes.actions}></CardActions>
      </Card>
    </div>
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
