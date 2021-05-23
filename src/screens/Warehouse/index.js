import React from "react";
import {
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Switch,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { useApolloClient, useQuery } from "react-apollo";
import {
  CREATE_WAREHOUSE,
  DELETE_WAREHOUSE,
  UPDATE_WAREHOUSE,
} from "../../graphql/mutation";
import { WAREHOUSELIST } from "../../graphql/query";
import WarehouseModal from "./WarehouseModal";
import { AlertContext } from "../../context";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import moment from "moment";

export const Warehouse = (props) => {
  const { loading, data, error, refetch } = useQuery(WAREHOUSELIST);
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState();
  const [item, setItem] = React.useState({ name: "", shippingInDays: "" });

  const editItem = (event) => {
    var { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const client = useApolloClient();

  const snack = React.useContext(AlertContext);

  const onClose = () => {
    setOpen(false);
    setType(null);
    setItem({ name: "", shippingInDays: "" });
  };

  const handleSave = () => {
    item["shippingInDays"] = parseInt(item.shippingInDays);
    if (type === "Edit") {
      var id = item.id;
      delete item.id;
      delete item.createdAt;
      delete item.updatedAt;
      delete item.__typename;
      item["updatedAt"] = new Date();
      client
        .mutate({
          mutation: UPDATE_WAREHOUSE,
          variables: {
            id,
            item,
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
          mutation: CREATE_WAREHOUSE,
          variables: {
            item,
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
          setOpen(false);
          snack.setSnack({
            open: true,
            severity: "error",
            msg: "Some error occured!",
          });
        });
    }
    if (type === "Delete") {
      client
        .mutate({
          mutation: DELETE_WAREHOUSE,
          variables: {
            id: item.id,
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

  const handleSwitch = (id, isActive) => {
    client
      .mutate({
        mutation: UPDATE_WAREHOUSE,
        variables: {
          id,
          item: { isActive: !isActive, updatedAt: new Date() },
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
        <Typography variant="h4">Warehouse</Typography>
        <IconButton
          style={{ color: "#000" }}
          onClick={() => {
            setOpen(true);
            setType("Add");
          }}
        >
          <Tooltip title="Add Warehouse">
            <AddCircleIcon />
          </Tooltip>
        </IconButton>
      </Grid>
      <Grid container item xs={12} sm={12} spacing={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align={"center"}>Name</TableCell>
                <TableCell align={"center"}>Shipping In Days</TableCell>
                <TableCell align={"center"}>Created On</TableCell>
                <TableCell align={"center"}>Last Updated On</TableCell>
                <TableCell align={"center"}>Status</TableCell>
                <TableCell align={"center"}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
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
              {data && data?.allWarehouses?.nodes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align={"center"}>
                    <Typography>No Warehouses found!</Typography>
                  </TableCell>
                </TableRow>
              )}
              {data &&
                data?.allWarehouses?.nodes.length > 0 &&
                data?.allWarehouses?.nodes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell align={"center"} padding="none">
                      {item.name}
                    </TableCell>
                    <TableCell align={"center"} padding="none">
                      {item.shippingInDays}
                    </TableCell>
                    <TableCell align={"center"} padding="none">
                      {moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell align={"center"} padding="none">
                      {moment(item.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell align={"center"} padding="none">
                      <Switch
                        checked={item.isActive}
                        onChange={() => handleSwitch(item.id, item.isActive)}
                        name="active"
                        color="primary"
                      />
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
          </Table>
        </TableContainer>
      </Grid>
      <WarehouseModal
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
