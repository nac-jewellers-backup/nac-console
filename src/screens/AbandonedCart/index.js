import React from "react";
import {
  Grid,
  TableContainer,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  TableFooter,
  TablePagination,
  Chip,
  makeStyles,
  Tooltip,
  IconButton,
  Button,
  TableSortLabel,
} from "@material-ui/core";
import { useApolloClient, useQuery } from "react-apollo";
import { ABANDONEDCART } from "../../graphql/query";
import { NetworkStatus } from "apollo-client";
import moment from "moment";
import EmailIcon from "@material-ui/icons/Email";
import CallIcon from "@material-ui/icons/Call";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CartDetails from "./cart_details";
import { green } from "@material-ui/core/colors";
import exportFromJSON from "export-from-json";

let Headers = {
  "Cart ID": {},
  "User Details": {
    asc: [
      "USER_PROFILE_BY_USERPROFILE_ID__FIRST_NAME_ASC",
      "USER_PROFILE_BY_USERPROFILE_ID__USERNAME_ASC",
    ],
    desc: [
      "USER_PROFILE_BY_USERPROFILE_ID__FIRST_NAME_DESC",
      "USER_PROFILE_BY_USERPROFILE_ID__USERNAME_DESC",
    ],
  },
  "Total Products in cart": {
    asc: ["SHOPPING_CART_ITEMS_BY_SHOPPING_CART_ID_COUNT_ASC"],
    desc: ["SHOPPING_CART_ITEMS_BY_SHOPPING_CART_ID_COUNT_DESC"],
  },
  Contact: {
    asc: [
      "USER_PROFILE_BY_USERPROFILE_ID__EMAIL_ASC",
      "USER_PROFILE_BY_USERPROFILE_ID__MOBILE_ASC",
    ],
    desc: [
      "USER_PROFILE_BY_USERPROFILE_ID__EMAIL_DESC",
      "USER_PROFILE_BY_USERPROFILE_ID__MOBILE_DESC",
    ],
  },
  Status: {},
  "Created On": {
    asc: ["CREATED_AT_ASC"],
    desc: ["CREATED_AT_DESC"],
  },
  "Last Updated On": {
    asc: ["UPDATED_AT_ASC"],
    desc: ["UPDATED_AT_DESC"],
  },
  Actions: {},
};

let filterVariables = {
  default: {
    filter: {
      ordersByCartIdExist: false,
    },
  },
  withoutContact: {
    filter: {
      ordersByCartIdExist: false,
      userprofileId: {
        isNull: true,
      },
    },
  },
  withContact: {
    filter: {
      ordersByCartIdExist: false,
      userprofileId: {
        isNull: false,
      },
    },
  },
  emptyCart: {
    filter: {
      ordersByCartIdExist: false,
      shoppingCartItemsByShoppingCartId: {
        every: {
          productSku: {
            isNull: true,
          },
        },
      },
    },
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  button: {
    margin: theme.spacing(1),
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
  chip: {
    color: green[700],
  },
}));

export const AbandonedCart = (props) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [filter, setFilter] = React.useState("default");
  const [sort, setSort] = React.useState({
    by: "Created On",
    direction: "desc",
  });
  const client = useApolloClient();
  const { loading, data, error, refetch, networkStatus } = useQuery(
    ABANDONEDCART,
    {
      variables: {
        first: rowsPerPage,
        offset: page * rowsPerPage,
        orderBy: Headers[sort.by][sort.direction] ?? Headers["Created On"].desc,
        condition: { status: "pending" },
        filter: filterVariables[filter]?.filter ?? null,
      },
    }
  );
  const handleClickFilter = (value) => {
    setFilter(value);
    refetch({
      first: rowsPerPage,
      offset: page * rowsPerPage,
      orderBy: ["CREATED_AT_ASC"],
      condition: { status: "pending" },
      filter: filterVariables[value]?.filter ?? null,
    });
  };

  const applySort = (column) => {
    var { by, direction } = sort;
    if (by == column) {
      if (direction && direction == "asc") {
        direction = "desc";
      } else {
        direction = "asc";
      }
    } else {
      direction = "asc";
    }
    setSort({ by: column, direction });
    refetch({
      first: rowsPerPage,
      offset: page * rowsPerPage,
      orderBy: Headers[by][direction] ?? Headers["Created On"].desc,
      condition: { status: "pending" },
      filter: filterVariables[filter]?.filter ?? null,
    });
  };

  const [open, setOpen] = React.useState();

  const handleClickOpen = (id) => {
    setOpen(id);
  };

  const handleClose = () => {
    setOpen();
  };

  const downloadAbandonedCart = () => {
    client
      .query({
        query: ABANDONEDCART,
        variables: {
          orderBy: ["CREATED_AT_ASC"],
          condition: { status: "pending" },
          filter: { ...filterVariables["withContact"]?.filter },
        },
        fetchPolicy: "network-only",
      })
      .then(
        ({
          data: {
            allShoppingCarts: { nodes: cartDetails },
          },
        }) => {
          exportFromJSON({
            data: cartDetails.map((item) => {
              return {
                cart_id: item.id,
                created_at: moment(item.createdAt).format("DD/MM/YYYY hh:mm a"),
                gross_amount: item.grossAmount,
                discount_amount: item.discountAmount,
                first_name: item.user?.firstName,
                last_name: item.user?.lastName,
                email: item.user?.email,
                mobile_no: item.user?.mobile,
                sku_ids: item?.cart_items?.nodes
                  ?.map((i) => i?.transSkuListByProductSku?.skuId)
                  ?.join(","),
                generated_skus: item?.cart_items?.nodes
                  ?.map((i) => i?.transSkuListByProductSku?.generatedSku)
                  ?.join(","),
                product_names: item?.cart_items?.nodes
                  ?.map(
                    (i) =>
                      i?.transSkuListByProductSku?.productListByProductId
                        ?.productName
                  )
                  ?.join(","),
              };
            }),
            fileName: `abandoned_cart_${moment().format("YYYY-MM-DD")}`,
            exportType: "xls",
          });
        }
      )
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid
        container
        item
        xs={12}
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h4">Abandoned Cart</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color={filter == "withoutContact" ? "primary" : "default"}
            className={classes.button}
            onClick={() => handleClickFilter("withoutContact")}
          >
            Without Contact
          </Button>
          <Button
            variant="outlined"
            color={filter == "withContact" ? "primary" : "default"}
            className={classes.button}
            onClick={() => handleClickFilter("withContact")}
          >
            With Contact
          </Button>
          <Button
            variant="outlined"
            color={filter == "emptyCart" ? "primary" : "default"}
            className={classes.button}
            onClick={() => handleClickFilter("emptyCart")}
          >
            Empty Cart
          </Button>
          <Button
            variant="outlined"
            color={filter == "" ? "primary" : "default"}
            className={classes.button}
            onClick={() => handleClickFilter("default")}
          >
            ALL
          </Button>
          <IconButton
            aria-label="download abandoned cart"
            color="primary"
            className={classes.button}
            disabled={filter != "withContact"}
            onClick={() => downloadAbandonedCart()}
          >
            <CloudDownloadOutlinedIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container item xs={12} sm={12} spacing={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(Headers).map((item) => {
                  return (
                    <TableCell
                      align="center"
                      key={item}
                      sortDirection={
                        sort?.by === item ? sort?.direction : false
                      }
                    >
                      {Headers[item]?.asc ? (
                        <TableSortLabel
                          active={sort?.by === item}
                          direction={
                            sort?.by === item ? sort?.direction : "asc"
                          }
                          onClick={() => applySort(item)}
                        >
                          {item}
                          {sort?.by === item ? (
                            <span className={classes.visuallyHidden}>
                              {sort?.direction === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </span>
                          ) : null}
                        </TableSortLabel>
                      ) : (
                        item
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {(loading || networkStatus === NetworkStatus.refetch) && (
                <TableRow>
                  <TableCell
                    colSpan={Object.keys(Headers).length}
                    align={"center"}
                    padding="none"
                  >
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell
                    colSpan={Object.keys(Headers).length}
                    align={"center"}
                  >
                    <Typography>
                      Some Error occured please try again!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {data && data?.allShoppingCarts?.nodes.length == 0 && (
                <TableRow>
                  <TableCell
                    colSpan={Object.keys(Headers).length}
                    align={"center"}
                  >
                    <Typography>No Cart Data Found!</Typography>
                  </TableCell>
                </TableRow>
              )}
              {data &&
                data?.allShoppingCarts?.nodes.length > 0 &&
                data?.allShoppingCarts?.nodes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell align="center">{item.id}</TableCell>
                    <TableCell align="center">
                      {item?.user?.firstName
                        ? `${item.user.firstName}${
                            item.user?.lastName ? ` ${item.user.lastName}` : ``
                          }`
                        : item?.user?.userName}
                    </TableCell>
                    <TableCell align="center" className={classes.root}>
                      <Tooltip
                        arrow
                        title={item?.cart_items?.nodes
                          .map((i) => i.productSku)
                          .join(",")}
                      >
                        <Chip
                          label={item?.cart_items?.nodes.length}
                          color={"primary"}
                          size="small"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" padding="none">
                      {item?.user?.email && (
                        <Button
                          startIcon={<EmailIcon />}
                          variant="outlined"
                          disableElevation
                          disableFocusRipple
                          disableRipple
                          component="a"
                          href={`mailto:${item?.user?.email}`}
                          className={classes.button}
                        >
                          {item?.user?.email}
                        </Button>
                      )}
                      {item?.user?.mobile && (
                        <Button
                          startIcon={<CallIcon />}
                          variant="outlined"
                          disableElevation
                          disableFocusRipple
                          disableRipple
                          component="a"
                          className={classes.button}
                        >
                          {item?.user?.mobile}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        className={classes.chip}
                        label={item.status.toUpperCase()}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align={"center"}>
                      {moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell align={"center"}>
                      {moment(item.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell align={"center"}>
                      {/* <IconButton size="small">
                        <DeleteForeverIcon />
                      </IconButton> */}
                      <IconButton
                        size="small"
                        onClick={() => handleClickOpen(item.id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={Object.keys(Headers).length}
                  align={"right"}
                  rowsPerPageOptions={[10, 25, 100]}
                  count={data?.allShoppingCarts?.totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
      <CartDetails open={Boolean(open)} handleClose={handleClose} id={open} />
    </Grid>
  );
};
