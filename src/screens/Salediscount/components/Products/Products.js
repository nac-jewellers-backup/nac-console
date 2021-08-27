import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
// import moment from 'moment';
import PropTypes from "prop-types";
// import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from "@material-ui/styles";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Viewsku from "../Viewsku";

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
  root: {
    marginTop: theme.spacing(2),
  },
  filterButton: {
    marginRight: theme.spacing(2),
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

const Products = (props) => {
  const { className, orders, ...rest } = props;

  const classes = useStyles();

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectskus, setSelectskus] = useState([]);

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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };
  function handlecancel() {
    setOpen(false);
  }
  function handleOpen(prodskus) {
    setOpen(true);
    setSelectskus(prodskus);
  }
  const paymentStatusColors = {
    canceled: colors.grey[600],
    pending: colors.orange[600],
    completed: colors.green[600],
    rejected: colors.red[600],
  };
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {open ? (
        <Viewsku
          isadd={open}
          products={selectskus}
          actionclose={handlecancel}
        />
      ) : null}

      {/* <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        {orders.length} Records found. Page {page + 1} of{' '}
        {Math.ceil(orders.length / rowsPerPage)}
      </Typography> */}
      <Card>
        <CardHeader title={props.title} />
        <Divider />
        <CardContent className={classes.content}>
          {/* <PerfectScrollbar> */}
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>

                  {/* <TableCell align="center">SKU Count</TableCell>

                    <TableCell align="center">Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.products
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow
                    // key={order.id}
                    // selected={selectedOrders.indexOf(order.id) !== -1}
                    >
                      <TableCell>{order}</TableCell>
                      {/* <TableCell align="center"> 
                      <IconButton aria-label="delete"  onClick={() => handleOpen(order.skus)}  color="primary">
                          <VisibilityIcon />
                      </IconButton>
                      </TableCell>
                      
                      <TableCell align="center">
                      
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
            count={props.products.length}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardActions>
      </Card>
      {/* <TableEditBar selected={selectedOrders} /> */}
    </div>
  );
};

Products.propTypes = {
  className: PropTypes.string,
  orders: PropTypes.array.isRequired,
};

Products.defaultProps = {
  orders: [],
};

export default Products;
