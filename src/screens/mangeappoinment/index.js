import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { TableContainer ,IconButton,Grid,TextField,InputAdornment, Select, MenuItem } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SearchIcon from "@material-ui/icons/Search";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { GRAPHQL_DEV_CLIENT } from "../../config";
import { useApolloClient, useQuery } from "react-apollo";
import moment from "moment";
import { SHOW_APPOINMENT_DETAILS } from "../../graphql/query";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const columns = [
  { id: "user_id", label: "Id" },
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "mobile", label: "Mobile" },
  { id: "date", label: "Date" },
  { id: "location", label: "Location" },
  { id: "StartTime", label: "Start Time" },
  { id: "EndTime", label: "End Time" },
  { id: "Status", label: "Status" },
  { id: "actions", label: "" },
];

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 500,
    backgroundColor:"white"
  },
  tableWrapper: {
    overflowX: "auto",
  },
  title: {
    color: "black",
    fontSize: "16px",
    padding: "20px",
  },
}));

let filterData = {};

export const Manageappoinment = (props) => {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [appointmentFilter, setAppointmentFilter] = React.useState({
    ...filterData,
    id: { isNull: false },
  });

  const [orderBy, setOrderBy] = React.useState(["CREATED_AT_DESC"]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const { loading, data, error, networkStatus } = useQuery(SHOW_APPOINMENT_DETAILS, {
    variables: {
      limit: rowsPerPage,
      offset: page * rowsPerPage,
      appointment_filter: { ...appointmentFilter },
      order_by: orderBy,
    },
  });

  let rowData = data?.allAppointments?.nodes;

  // useEffect(() => {
  //   const url = GRAPHQL_DEV_CLIENT;
  //   const opts = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       query: SHOW_APPOINMENT_DETAILS,
  //     }),
  //   };
  //   fetch(url, opts)
  //     .then((res) => res.json())
  //     .then((res) => {
  //       setData(res.data.allAppointments.nodes);
  //     })
  //     .catch(console.error);
  // }, []);



  const handleDateChange = (date, value) => {
    if (value === "start") {
      setStartDate(date);
    }
    if (value === "end") {
      if (date > startDate && startDate) {
        setEndDate(date);
        setAppointmentFilter({
          ...appointmentFilter,
          appointmentDateTimeSlotBySlotId: {
            appointmentDateByAppointmentDateId: {
              startDate: { equalTo: moment(startDate).format("YYYY-MM-DD")},
              endDate: { equalTo: moment(date).format("YYYY-MM-DD"),}
            }
          },   
        });
      } else alert("the To date must be higher than from");
    }
  };

  const ActionIcon = (props) => {
    return (
      <>
        <IconButton
          onClick={() => {
            window.open(`appointmentdetails/${props.id}`);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </>
    );
  };

  function tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

  return (
    <div className={classes.root}>
        <Typography className={classes.title}>Manage Appointment</Typography>
        <Grid container item xs={12} sm={12} spacing={2}>
        <Grid container item xs={3}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search by name, email, phone"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(event) => {
              setAppointmentFilter({
                  ...appointmentFilter,
                  or: [ {mobile: { includesInsensitive: event.target.value }} , {customerName: { includesInsensitive: event.target.value }}, {email: { includesInsensitive: event.target.value } }]
              });
            }}
          />
        </Grid>
        <Grid container item xs={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          margin="normal"
          label="Start Date"
          value={startDate}
          onChange={(date) => handleDateChange(date, "start")}
          style={{ marginTop: 0 }}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
          autoOk
          variant="inline"
          inputVariant="outlined"
        />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid container item xs={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
          margin="normal"
          label="End Date"
          value={endDate}
          onChange={(date) => handleDateChange(date, "end")}
          style={{ marginTop: 0 }}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
          autoOk
          variant="inline"
          inputVariant="outlined"
        />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
        <TableContainer component={Paper}>
        <Table      
        >
          <TableHead>
            <TableRow>
              {columns.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  style={{ whiteSpace: "nowrap" }}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData &&
                rowData.length > 0 ?
                rowData.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell align="left">{row?.id ?? ""}</TableCell>
                      <TableCell align="left">
                        {row?.customerName ?? ""}
                      </TableCell>
                      <TableCell align="left">{row?.email ?? ""}</TableCell>
                      <TableCell align="left">{row?.mobile ?? ""}</TableCell>
                      <TableCell align="left">
                        {row?.appointmentDateTimeSlotBySlotId?.startDateTime
                          ? moment(
                              row?.appointmentDateTimeSlotBySlotId
                                ?.startDateTime
                            ).format("Do MMM YYYY")
                          : ""}
                      </TableCell>
                      <TableCell align="left">
                        {row?.storeLocationByLocationId?.name ?? ""}
                      </TableCell>
                      <TableCell align="left">
                        {row?.appointmentDateTimeSlotBySlotId?.startTime
                          ? tConvert(
                              row?.appointmentDateTimeSlotBySlotId?.startTime
                            )
                          : ""}
                      </TableCell>
                      <TableCell align="left">
                        {row?.appointmentDateTimeSlotBySlotId?.endTime
                          ? tConvert(
                              row?.appointmentDateTimeSlotBySlotId?.endTime
                            )
                          : ""}
                      </TableCell>
                      <TableCell>
                        <Select fullWidth>
                          <MenuItem>In-Progress</MenuItem>
                          <MenuItem>Approved</MenuItem>
                          <MenuItem>Completed</MenuItem>
                          <MenuItem>Submitted</MenuItem>
                          <MenuItem>Cancelled</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="left">
                        <ActionIcon id={row.id}/>
                      </TableCell>
                    </TableRow>
                  ))
              : "No Data"}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                count={data?.allAppointments?.totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                onPageChange={() => {}}
              />
            </TableRow>
          </TableFooter>
        </Table>
        </TableContainer>
        
    </div>
  );
};
