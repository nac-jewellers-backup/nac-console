import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { GRAPHQL_DEV_CLIENT } from "../../../config";
import { NetworkContext } from "../../../context/NetworkContext";
import { REVIEWQUERY } from "../../../graphql/query";

const columns = [
  { id: "product_sku", label: "Product Sku" },
  { id: "customerName", label: "customer Name" },
  { id: "rating", label: "Rating" },
  { id: "title", label: "Title" },
  { id: "message", label: "Message" },
  { id: "ispublish", label: "Publish" },
  { id: "isactive", label: "Active" },
];

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));
function createData(name, calories, fat) {
  return { name, calories, fat };
}
function EnhancedTableHead(props) {
  const {
    classes,

    order,
    orderBy,

    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            style={{ whiteSpace: "nowrap" }}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "" : ""}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list"></IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: "auto",
  },
}));
const ISACTIVEREVIEW = `mutation MyMutation($id: UUID!, $isActive: Boolean) {
    updateCustomerReviewById(
      input: { customerReviewPatch: { isActive: $isActive }, id: $id }
    ) {
      customerReview {
        id
        isActive
        message
        productId
        title
        customerName
        productSku
        rating
      }
    }
  }
`;
const ISPUBLISHREVIEW = `mutation MyMutation($id: UUID!, $isPublish: Boolean) {
  updateCustomerReviewById(
    input: { customerReviewPatch: { isPublish: $isPublish }, id: $id }
  ) {
    customerReview {
      id
      isPublish
      message
      productId
      title
      customerName
      productSku
      rating
    }
  }
}
`;
const CustomerReview = (props) => {
  let history = useHistory();
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [allReview, setAllReview] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: REVIEWQUERY }),
    };
    fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        let data = fatchvalue.data.allCustomerReviews.nodes;
        console.log(data);
        setAllReview(data);
      })
      .catch(console.error);
  }, []);

  const handleChangeIsPublish = (Id) => async (event) => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ISPUBLISHREVIEW,
        variables: { id: Id, isPublish: event.target.checked },
      }),
    };

    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        window.location.reload();
      })
      .catch(console.error);
  };
  const handleChangeIsActive = (Id) => async (event) => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ISACTIVEREVIEW,
        variables: { id: Id, isActive: event.target.checked },
      }),
    };

    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        window.location.reload();
      })
      .catch(console.error);
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table
          className={classes.table}
          border={1}
          borderColor={"#ddd"}
          size="small"
          stickyHeader
        >
          <EnhancedTableHead classes={classes} />
          <TableBody>
            {allReview
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell align="left">{row.productSku}</TableCell>
                  <TableCell align="left">{row.customerName}</TableCell>
                  <TableCell align="left">{row.rating}</TableCell>
                  <TableCell align="left">{row.title}</TableCell>
                  <TableCell align="left">{row.message}</TableCell>
                  <TableCell align="left">
                    <Switch
                      checked={row.isPublish ?? false}
                      onChange={handleChangeIsPublish(row.id)}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Switch
                      checked={row.isActive ?? false}
                      onChange={handleChangeIsActive(row.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                count={allReview.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Paper>
  );
};
export default CustomerReview;
