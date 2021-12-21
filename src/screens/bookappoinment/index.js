import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React from "react";

const columns = [
  { id: "user_id", label: "User Id" },
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "mobile", label: "Mobile" },
  { id: "date", label: "Date" },
  { id: "location", label: "Location" },
  { id: "time", label: "Time" },
];
const row = [
  {
    userid: "1",
    username: "siva",
    date: "22-01-2021",
    location: "T.Nager",
    email: "siva22@gmail.com",
    phone: "1234567890",
    time: "12.00 am",
  },
  {
    userid: "2",
    username: "vijay",
    date: "20-02-2021",
    location: "T.Nager",
    email: "vijay22@gmail.com",
    phone: "1234567890",
    time: "1.00 pm",
  },
  {
    userid: "3",
    username: "surya",
    date: "12-02-2021",
    location: "T.Nager",
    email: "surya22@gmail.com",
    phone: "1234567890",
    time: "4.00 pm",
  },
  {
    userid: "4",
    username: "ajith",
    date: "30-03-2021",
    location: "T.Nager",
    email: "ajith22@gmail.com",
    phone: "1234567890",
    time: "8.00 pm",
  },
  {
    userid: "5",
    username: "karthik",
    date: "21-04-2021",
    location: "T.Nager",
    email: "karthik22@gmail.com",
    phone: "1234567890",
    time: "6.00 pm",
  },
  {
    userid: "6",
    username: "Kaviya",
    date: "12-01-2021",
    location: "T.Nager",
    email: "kaviya22@gmail.com",
    phone: "1234567890",
    time: "7.00 pm",
  },
];
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
  title: {
    color: "black",

    fontSize: "16px",
    padding: "20px",
  },
}));

export const Bookappoinment = (props) => {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Typography className={classes.title}>Book Appointment</Typography>
        <Table
          className={classes.table}
          border={1}
          borderColor={"#ddd"}
          size="small"
          stickyHeader
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
            {row
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell align="left">{row.userid}</TableCell>
                  <TableCell align="left">{row.username}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.phone}</TableCell>
                  <TableCell align="left">{row.date}</TableCell>
                  <TableCell align="left">{row.location}</TableCell>
                  <TableCell align="left">{row.time}</TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                count={row.length}
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
