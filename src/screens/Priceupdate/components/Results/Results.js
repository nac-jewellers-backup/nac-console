import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
// import moment from 'moment';
import PropTypes from "prop-types";
// import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from "@material-ui/styles";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@material-ui/icons/Refresh";

import { NetworkContext } from "../../../../context/NetworkContext";

import {
  Button,
  Card,
  CardActions,
  CardContent,
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

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [status, setStatus] = useState({});

  const handleSelectAll = (event) => {
    const selectedOrders = event.target.checked
      ? orders.map((order) => order.id)
      : [];

    setSelectedOrders(selectedOrders);
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

  const handleChangePage = (event, page) => {
    setPage(page);
  };
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
  async function getpricestatus(component) {}
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  const paymentStatusColors = {
    canceled: colors.grey[600],
    pending: colors.orange[600],
    completed: colors.green[600],
    rejected: colors.red[600],
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {/* <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        {orders.length} Records found. Page {page + 1} of{' '}
        {Math.ceil(orders.length / rowsPerPage)}
      </Typography> */}
      <Card style={{ marginTop: 16 }}>
        <CardContent className={classes.content}>
          {/* <PerfectScrollbar> */}
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
                  <TableRow
                  // key={order.id}
                  // selected={selectedOrders.indexOf(order.id) !== -1}
                  >
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
          {/* </PerfectScrollbar> */}
        </CardContent>
        <CardActions className={classes.actions}></CardActions>
      </Card>
      {/* <TableEditBar selected={selectedOrders} /> */}
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
