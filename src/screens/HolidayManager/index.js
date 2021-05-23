import React from "react";
import {
  Grid,
  IconButton,
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
  Tooltip,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useApolloClient, useQuery } from "react-apollo";
import {
  CREATE_HOLIDAY,
  DELETE_HOLIDAY,
  UPDATE_HOLIDAY,
} from "../../graphql/mutation";
import { HOLIDAYLIST } from "../../graphql/query";
import HolidayModal from "./HolidayModal";
import { AlertContext } from "../../context";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import moment from "moment";
import axios from "axios";
import { API_URL } from "../../config";
import { NetworkStatus } from "apollo-client";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

export const HolidayManager = (props) => {
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
  const { loading, data, error, refetch, networkStatus } = useQuery(
    HOLIDAYLIST,
    {
      variables: { first: rowsPerPage, offset: page * rowsPerPage },
    }
  );
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState();
  const [item, setItem] = React.useState({ holiday: "", date: null });

  const editItem = (event, type) => {
    var name, value;
    if (type == "date") {
      name = type;
      value = event;
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
    setItem({ holiday: "", date: null });
  };

  const handleSave = () => {
    if (type == "Edit") {
      var id = item.id;
      delete item.id;
      delete item.createdAt;
      delete item.updatedAt;
      delete item.__typename;
      item["updatedAt"] = new Date();
      client
        .mutate({
          mutation: UPDATE_HOLIDAY,
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
    if (type == "Add") {
      client
        .mutate({
          mutation: CREATE_HOLIDAY,
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
          onClose();
          snack.setSnack({
            open: true,
            severity: "error",
            msg: "Some error occured!",
          });
        });
    }
    if (type == "Delete") {
      var id = item.id;
      client
        .mutate({
          mutation: DELETE_HOLIDAY,
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
    // console.log(file);
    axios
      .post(API_URL + "/addholidays", bodyFormData)
      .then((res) => {
        if (res) {
          snack.setSnack({
            open: true,
            msg: "Successfully added holidays!",
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
        xs={12}
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Typography variant="h4">Holiday Manager</Typography>

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
            <Tooltip title="Upload Holidays">
              <CloudUploadIcon />
            </Tooltip>
          </IconButton>
        </label>

        <IconButton
          style={{ color: "#000" }}
          onClick={() => {
            var a = document.createElement("a");
            a.href = "/sample/holidays.csv";
            a.setAttribute("download", "holidays.csv");
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
          }}
        >
          <Tooltip title="Add Holiday">
            <AddCircleIcon />
          </Tooltip>
        </IconButton>
      </Grid>
      <Grid container item xs={12} sm={12} spacing={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align={"center"}>Holiday</TableCell>
                <TableCell align={"center"}>Date</TableCell>
                <TableCell align={"center"}>Created On</TableCell>
                <TableCell align={"center"}>Last Updated On</TableCell>
                <TableCell align={"center"}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(loading || NetworkStatus.refetch === networkStatus) && (
                <TableRow>
                  <TableCell colSpan={5} align={"center"} padding="none">
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={5} align={"center"}>
                    <Typography>
                      Some Error occured please try again!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {data && data?.allHolidayManagers?.nodes.length == 0 && (
                <TableRow>
                  <TableCell colSpan={5} align={"center"}>
                    <Typography>No Holidays found!</Typography>
                  </TableCell>
                </TableRow>
              )}
              {data &&
                data?.allHolidayManagers?.nodes.length > 0 &&
                data?.allHolidayManagers?.nodes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell align={"center"} padding="none">
                      {item.holiday}
                    </TableCell>
                    <TableCell align={"center"} padding="none">
                      {moment(item.date, "YYYY-MM-DD").format("MMM DD,YYYY")}
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
                  colSpan={5}
                  align={"right"}
                  rowsPerPageOptions={[10, 25, 100]}
                  count={data?.allHolidayManagers?.totalCount}
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
      <HolidayModal
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
