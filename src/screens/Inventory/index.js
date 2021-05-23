import React from "react";
import {
  Badge,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useApolloClient, useQuery } from "react-apollo";
import {
  CREATE_INVENTORY,
  DELETE_INVENTORY,
  UPDATE_INVENTORY,
} from "../../graphql/mutation";
import { INVENTORYLIST, STOCKSTATUS } from "../../graphql/query";
import InventoryModal from "./InventoryModal";
import { AlertContext } from "../../context";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { v4 as uuid } from "uuid";
import { NetworkStatus } from "apollo-client";
import GetAppIcon from "@material-ui/icons/GetApp";
import axios from "axios";
import { API_URL } from "../../config";
import moment from "moment";
import SearchIcon from "@material-ui/icons/Search";
import StoreIcon from "@material-ui/icons/Store";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  iconButton: {
    margin: theme.spacing(2),
    textAlign: "center",
    flexDirection: "column",
  },
  icon: {
    padding: 0,
    "&:hover": {
      backgroundColor: "inherit",
    },
  },
  searchInput: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 8,
    },
  },
}));

const StockStatus = (props) => {
  const classes = useStyles();
  const { data } = useQuery(STOCKSTATUS);
  return (
    <>
      {data &&
        data.allWarehouses.nodes.length > 0 &&
        data.allWarehouses.nodes.map((item, index) => (
          <Badge
            badgeContent={
              item?.inventoriesByWarehouseId?.aggregates?.sum?.numberOfItems
            }
            max={99999999}
            color={"error"}
            key={index}
            component="div"
            className={classes.iconButton}
            overlap="circle"
          >
            <IconButton
              disableRipple
              className={classes.icon}
              onClick={() => {
                props.setWarehouse(item?.name);
              }}
            >
              <StoreIcon
                style={{ fontSize: 35 }}
                color={item?.name === props.warehouse ? "secondary" : "default"}
              />
            </IconButton>
            <Typography variant="subtitle2">{item?.name}</Typography>
          </Badge>
        ))}
    </>
  );
};

export const Inventory = (props) => {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState(null);
  const [warehouse, setWarehouse] = React.useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const { loading, data, error, refetch, networkStatus } = useQuery(
    INVENTORYLIST,
    {
      variables: {
        first: rowsPerPage,
        offset: page * rowsPerPage,
        filter: {
          ["generatedSku"]: search ? { includesInsensitive: search } : null,
          warehouseByWarehouseId: {
            name: {
              includesInsensitive: warehouse,
            },
          },
        },
      },
    }
  );
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState();
  const [item, setItem] = React.useState({
    generatedSku: "",
    numberOfItems: "",
    warehouse: { id: "", name: "" },
  });

  const editItem = (event, newValue) => {
    var name, value;
    if (newValue) {
      console.log(newValue);
      name = "warehouse";
      value = newValue;
    } else {
      name = event.target.name;
      value = event.target.value;
    }
    setItem({ ...item, [name]: value });
  };

  const client = useApolloClient();

  const snack = React.useContext(AlertContext);

  const onClose = () => {
    setOpen(false);
    setType(null);
  };

  const handleSave = () => {
    if (type === "Edit") {
      var id = item.id;
      client
        .mutate({
          mutation: UPDATE_INVENTORY,
          variables: {
            id,
            item: {
              generatedSku: item.generatedSku,
              numberOfItems: parseInt(item.numberOfItems),
              warehouseId: item.warehouse.id,
              updatedAt: new Date(),
            },
          },
        })
        .then((res) => {
          if (res) {
            onClose();
            snack.setSnack({
              open: true,
              msg: "Successfully Updated!",
            });
            refetch();
          }
        })
        .catch((err) => {
          console.log(err);
          onClose();
          snack.setSnack({
            open: true,
            severity: "error",
            msg: "Some error occured!",
          });
        });
    }
    if (type === "Add") {
      client
        .mutate({
          mutation: CREATE_INVENTORY,
          variables: {
            item: {
              id: uuid(),
              generatedSku: item.generatedSku,
              numberOfItems: parseInt(item.numberOfItems),
              warehouseId: item.warehouse.id,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
        .then((res) => {
          if (res) {
            onClose();
            snack.setSnack({
              open: true,
              msg: "Successfully Added!",
            });
            refetch();
          }
        })
        .catch((err) => {
          console.log(err);
          onClose();
          snack.setSnack({
            open: true,
            severity: "error",
            msg: "Some error occured!",
          });
        });
    }
    if (type === "Delete") {
      var id = item.id;
      client
        .mutate({
          mutation: DELETE_INVENTORY,
          variables: {
            id,
          },
        })
        .then((res) => {
          if (res) {
            onClose();
            snack.setSnack({
              open: true,
              msg: "Successfully Deleted!",
            });
            refetch();
          }
        })
        .catch((err) => {
          console.log(err);
          onClose();
          snack.setSnack({
            open: true,
            severity: "error",
            msg: "Some error occured!",
          });
        });
    }
  };

  const handleUpload = (file) => {
    var bodyFormData = new FormData();
    bodyFormData.set("file", file);
    console.log(file);
    axios
      .post(API_URL + "/addinventories", bodyFormData)
      .then((res) => {
        if (res) {
          snack.setSnack({
            open: true,
            msg: res.data.message || "Successfully uploaded!",
          });
          refetch();
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
  };

  return (
    <Grid container spacing={3}>
      <Grid
        container
        item
        xs={6}
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Typography variant="h4">Inventory</Typography>

        <input
          accept=".csv"
          className={classes.input}
          id="icon-button-file"
          type="file"
          onChange={(event) => {
            const files = event.target.files;
            if (files) {
              handleUpload(files[0]);
            }
          }}
        />
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <Tooltip title="Upload Inventory">
              <CloudUploadIcon />
            </Tooltip>
          </IconButton>
        </label>

        <IconButton
          style={{ color: "#000" }}
          onClick={() => {
            var a = document.createElement("a");
            a.href = "/sample/inventory.csv";
            a.setAttribute("download", "inventory.csv");
            a.click();
          }}
        >
          <Tooltip title="Download sample file">
            <GetAppIcon />
          </Tooltip>
        </IconButton>

        <IconButton
          style={{ color: "#000" }}
          onClick={() => {
            setOpen(true);
            setType("Add");
            setItem({
              generatedSku: "",
              numberOfItems: "",
              warehouse: { id: "", name: "" },
            });
          }}
        >
          <Tooltip title="Add Inventory">
            <AddCircleIcon />
          </Tooltip>
        </IconButton>
        <TextField
          className={classes.searchInput}
          name="tagno"
          placeholder="Search Tag No."
          size="medium"
          variant="outlined"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid
        item
        container
        xs={6}
        direction="row"
        justify="flex-end"
        alignItems="center"
      >
        <StockStatus warehouse={warehouse} setWarehouse={setWarehouse} />
      </Grid>
      <Grid container item xs={12} sm={12} spacing={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align={"center"}>Tag No</TableCell>
                <TableCell align={"center"}>Quantity</TableCell>
                <TableCell align={"center"}>Warehouse</TableCell>
                <TableCell align={"center"}>Created On</TableCell>
                <TableCell align={"center"}>Last Updated On</TableCell>
                <TableCell align={"center"}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(loading || networkStatus === NetworkStatus.refetch) && (
                <TableRow>
                  <TableCell colSpan={6} align={"center"} padding="none">
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={6} align={"center"}>
                    <Typography>
                      Some Error occured please try again!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {data && data?.allInventories?.nodes.length == 0 && (
                <TableRow>
                  <TableCell colSpan={6} align={"center"}>
                    <Typography>No items in inventory!</Typography>
                  </TableCell>
                </TableRow>
              )}
              {data &&
                data?.allInventories?.nodes.length > 0 &&
                data?.allInventories?.nodes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell align={"center"} padding="none">
                      {item.generatedSku}
                    </TableCell>
                    <TableCell align={"center"} padding="none">
                      {item.numberOfItems}
                    </TableCell>
                    <TableCell align={"center"} padding="none">
                      {item.warehouse.name}
                    </TableCell>
                    <TableCell align={"center"} padding="none">
                      {moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell align={"center"} padding="none">
                      {moment(item.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell align={"center"} padding="none">
                      <IconButton
                        color="inherit"
                        onClick={() => {
                          setType("Edit");
                          setOpen(true);
                          setItem(item);
                        }}
                      >
                        <Tooltip title="Edit">
                          <EditIcon />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        color="inherit"
                        onClick={() => {
                          setType("Delete");
                          setOpen(true);
                          setItem(item);
                        }}
                      >
                        <Tooltip title="Delete">
                          <DeleteForeverIcon />
                        </Tooltip>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  align={"right"}
                  rowsPerPageOptions={[10, 25, 100]}
                  count={data?.allInventories?.totalCount}
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
      <InventoryModal
        open={open}
        type={type}
        item={item}
        editItem={editItem}
        handleSave={handleSave}
        onClose={onClose}
      />
    </Grid>
  );
};
