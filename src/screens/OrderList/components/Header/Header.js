import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Grid, Typography, Button, TextField, MenuItem, InputAdornment } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
// import {  SnackBarContext } from '../../../../context';
import SortHeader from "./SortHeader";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

const useStyles = makeStyles(() => ({
  root: {},
  contantview: {
    display: "flex",
    placeItems: "center",
  },
}));

var myDate = new Date();
myDate.setDate(myDate.getDate() + 2);
// const statusval=[
// {
//   value:0,
//   label:"All"
// },
// {
//   value:1,
//   label:"Submitted"
// },
// {
//   value:2,
//   label:"Intiated"
// },
// {
//   value:3,
//   label:"Failed"
// },
// {
//   value:4,
//   label:"Approved"
// }

// ]

const Header = (props) => {
  console.log(props.orderstatus, "the header data");
  const { className, ...rest } = props;
  const [openApplication, setOpenApplication] = useState(false);
  // const showSnackbar = React.useContext(SnackBarContext);
  const [searchtext, setSearchtext] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [ToDate, setToDate] = useState(null);
  const [statusval, setStatusval] = useState([]);

  const handleDateChange = (date, value) => {
    if (value === "from") {
      setFromDate(date);
    }
    if (value === "to") {
      if (date > fromDate) {
        setToDate(date);
      } else alert("the To date must be higher thean from");
    }
  };

  useEffect(() => {
    let orderStatus = [];
    let orderstatus = props?.orderstatus;
    orderstatus.forEach((element) => {
      orderStatus.push({ label: element.name, value: element.id });
    });
    setStatusval(orderStatus);
  }, [props.orderstatus]);

  const handleApplicationOpen = () => {
    setOpenApplication(true);
  };

  const handleApplicationClose = () => {
    setOpenApplication(false);
  };
  const handleApplicationsave = () => {
    // showSnackbar.setSnack({ open: true, type: 'success', msg: 'New Category Added Successfully' })
    setOpenApplication(false);
  };
  function handlesearch() {
    props.onSearch(searchtext);
  }
  const handleinputChange = (type) => (e) => {
    setSearchtext(e.target.value);
    //props.onSearch(e.target.value)
  };
  function handleCancel() {
    props.onCancel();
    setStatus("");
  }
  function handleDate() {
    if (fromDate && ToDate !== "") {
      props.onDate(fromDate, ToDate);
    }
  }
  const handleChange = (event) => {
    props.onSelect(event.target.value);
    setStatus(event.target.value);
  };
  const classes = useStyles();
  console.log(statusval, "options");
  return (
    <div
      className="search"
      style={{
        display: "flex",
        background: "white",
        borderTop: "1px solid #e4e4e4",
        borderBottom: "1px solid #e4e4e4",
      }}
    >
      <Grid className={classes.contantview} container spacing={1}>
        {/* <Grid item xs={1}>
          <Typography variant="h4" style={{ margin: "8px" }}>
            Orders
          </Typography>
        </Grid> */}
        <Grid container item xs={4}>
          <Grid item xs={9}>
            <TextField
              className={classes.helperinput}
              variant="outlined"
              margin="dense"
              value={searchtext}
              id="productname"
              fullWidth
              name="productname"
              label="Search by name/email/mobile"
              //onInput={keyPress.bind(this)}
              style={{ marginLeft: "4px", marginTop: "21px" }}
              onChange={handleinputChange("searchtext")}

              //onChange={(e)=>handleinputChange(e,'productname')}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlesearch()}
              style={{
                marginLeft: "7px",
                marginTop: "22px",
                marginBottom: "10px",
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        <Grid container item xs={8} spacing={3}>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              margin="dense"
              select
              fullWidth
              label="OrderStatus"
              value={status}
              onChange={handleChange}
              style={{ marginTop: "17px" }}
              variant="outlined"
              InputProps={
                status !== "" && {
                  endAdornment: (
                    <InputAdornment position="start" style={{ marginRight: 20, cursor: "pointer" }}>
                      <CancelOutlinedIcon onClick={() => handleCancel()} />
                    </InputAdornment>
                  ),
                }
              }
            >
              {statusval.map((option) => (
                <MenuItem key={option.value} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                variant="inline"
                format="yyyy/MM/dd"
                margin="normal"
                label="From"
                value={fromDate}
                style={{ marginTop: 6 }}
                onChange={(date) => handleDateChange(date, "from")}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                variant="inline"
                format="yyyy/MM/dd"
                margin="normal"
                label="To"
                value={ToDate}
                style={{ marginTop: 6 }}
                onChange={(date) => handleDateChange(date, "to")}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={2}>
            <Button color="primary" variant="contained" style={{ marginTop: "17px" }} onClick={() => handleDate()}>
              Apply
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <SortHeader columnnames={props.columns} getColumnnames={props.getColumnnames} />
        </Grid>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
