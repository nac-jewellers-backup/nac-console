import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { TableContainer ,IconButton} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { GRAPHQL_DEV_CLIENT } from "../../config";
import moment from "moment";
import { SHOW_APPOINMENT_DETAILS } from "../../graphql/query";
const columns = [
  { id: "user_id", label: "Id" },
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "mobile", label: "Mobile" },
  { id: "date", label: "Date" },
  { id: "location", label: "Location" },
  { id: "StartTime", label: "Start Time" },
  { id: "EndTime", label: "End Time" },
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

export const Manageappoinment = (props) => {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = useState([]);
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
      body: JSON.stringify({
        query: SHOW_APPOINMENT_DETAILS,
      }),
    };
    fetch(url, opts)
      .then((res) => res.json())
      .then((res) => {
      
        setData(res.data.allAppointments.nodes);
      })
      .catch(console.error);
  }, []);

  const ActionIcon = (props) => {
    return (
      <>
        <IconButton
          onClick={() => {
            window.open(`orderdetails/${props.id}`);
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
        <TableContainer component={Paper}>
        <Table      
          size="small"
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
            {data && data.length > 0
              ? data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
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
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
        </TableContainer>
        
    </div>
  );
};
