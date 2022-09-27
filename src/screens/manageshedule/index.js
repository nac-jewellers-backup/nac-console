import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  Button
} from "@material-ui/core";
import moment from "moment";
import uuid from "uuid/v1";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React, { useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import { AlertContext } from "../../context";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { GRAPHQL_DEV_CLIENT } from "../../config";
import SheduleModal from "./shedulemodal";
import SheduleModalShow from "./shedulemodalshow";
import { ALL_APPOINTMENTS_DATE } from "../../graphql/query";

import {
  CREATE_APPOINTMENT_DATE,
  CREATE_APPOINTMENT_TIME,
  DELETE_APPOINTMENT_TIME,
  DELETE_APPOINTMENT_DATE,
} from "../../graphql/mutation";
import { TimePicker, MuiPickersUtilsProvider,DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export const ManageShedule = (props) => {
  // States
  const [open, setOpen] = React.useState(false);
  const [appointmentDateId, setAppointmentDateId] = React.useState(null);
  const [type, setType] = React.useState();
  const [date, setDate] = React.useState(new Date());
  const [appointmentDate, setAppointmentDate] = useState([]);
  const [openAppointmentTime, setOpenAppointmentTime] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [timeValue, setTimeValue] = useState({
    startTime: new Date(),
    endTime: new Date(),
  });

  const client = useApolloClient();
  const snack = React.useContext(AlertContext);
  const useStyles = makeStyles((theme) => ({
    datecard: {
      backgroundColor: "white",
      padding: "12px",
      cursor: "pointer",
      borderTop: "4px solid #3F51B5",
      "&:hover": {
        borderTop: "5px solid #3F51B5",
        boxShadow: "0px 3px 6px #c1c1c1",
      },
    },
    input: {
      display: "none",
    },
    calenderCard:{
      display:"flex",flexWrap:"wrap",marginLeft:"14px"
    },
    inputField: {
      marginBottom: theme.spacing(1),
      "& .MuiOutlinedInput-input":{
        padding: "12.5px 14px"
      }
    },
    closedCard: {
      backgroundColor: "white",
      padding: "12px",
      cursor: "pointer",
      border: "1px solid grey",
      width:"165px",
      height:"130px",
      "&:hover": {
        borderTop: "5px solid red",
        boxShadow: "0px 3px 6px #c1c1c1",
      },
    },

    date: {
      fontSize: "22px",
      padding: "10px 0px",
    },
    day: {
      fontSize: "14px",
    },
  }));

  // LifeCycles
  useEffect(() => {
    GetAllAppointment();
  }, []);

  // Handle Funcs
  const editItem = (value) => {
    setDate(value);
  };
  const onClose = () => {
    setOpen(false);
    setType(null);
  };
  const handlemodalshow = (id) => {
    setAppointmentDateId(id);
    setOpenAppointmentTime(true);
  };

  const handleTimeValue = (value, name) => {
    setTimeValue({ ...timeValue, [name]: value });
  };

  // Query Func
  const GetAllAppointment = async () => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ALL_APPOINTMENTS_DATE,
      }),
    };
    await fetch(url, opts)
      .then((res) => res.json())
      .then((res) => {
        setAppointmentDate(res.data.allAppointmentDates.nodes);
      })
      .catch(console.error);
  };

  const handleSave = async () => {
    await client
      .mutate({
        mutation: CREATE_APPOINTMENT_DATE,
        variables: {
          id: uuid(),
          createdAt: new Date(),
          updatedAt: new Date(),
          date: date,
          startDate: moment(date).format("YYYY-MM-DD"),
          isActive: true,
        },
      })
      .then((res) => {
        if (res) {
          GetAllAppointment();
          onClose();
          snack.setSnack({
            open: true,
            msg: "Successfully Updated!",
          });
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

  const handleSubmitTime = async (id) => {
    await client
      .mutate({
        mutation: CREATE_APPOINTMENT_TIME,
        variables: {
          id: uuid(),
          createdAt: new Date(),
          updatedAt: new Date(),
          startDateTime: timeValue.startTime,
          endDateTime: timeValue.endTime,
          appointmentDateId: id,
          startTime: moment(timeValue.startTime).format("HH:mm:ss"),
          endTime: moment(timeValue.endTime).format("HH:mm:ss"),
        },
      })
      .then((res) => {
        if (res) {
          GetAllAppointment();
          onClose();
          snack.setSnack({
            open: true,
            msg: "Successfully Updated!",
          });
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

    setShowTime(!showTime);
  };
  
  const deleteTime = async (id) => {
    await client
      .mutate({
        mutation: DELETE_APPOINTMENT_TIME,
        variables: {
          id: id,
        },
      })
      .then((res) => {
        if (res) {
          GetAllAppointment();
          onClose();
          snack.setSnack({
            open: true,
            msg: "Deleted Successfully!",
          });
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

  const deleteDate = async (id) => {
    setOpenAppointmentTime(false);
    await client
      .mutate({
        mutation: DELETE_APPOINTMENT_DATE,
        variables: {
          id: id,
        },
      })
      .then((res) => {
        if (res) {
          GetAllAppointment();
          onClose();
          snack.setSnack({
            open: true,
            msg: "Deleted Successfully!",
          });
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

  const classes = useStyles();
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
        <Typography variant="h4">Manage Schedule</Typography>

        <input
          accept=".csv"
          className={classes.input}
          id="icon-button-file"
          type="file"
          // onChange={(event) => {
          //   const files = event.target.files;
          //   if (files) {
          //     handleUpload(files[0]);
          //   }
          // }}
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
            setOpen(true);
            setType("Add");
          }}
        >
          <Tooltip title="Add Warehouse">
            <AddCircleIcon />
          </Tooltip>
        </IconButton>
      </Grid>
      <Grid
        container
        item
        xs={6}
        spacing={1}
        direction="row"
        justify="flex-end"
        alignItems="center"
      >
        <Grid item xs={5}>
        <Typography className={classes.available}>Year :</Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                className={classes.inputField}
                name="startTime"
                placeholder="Select Start Time"
                inputVariant="outlined"
                fullWidth
                minDate={new Date()}
              />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={5}>
        <Typography className={classes.available}>Month :</Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                className={classes.inputField}
                name="startTime"
                placeholder="Select Start Time"
                inputVariant="outlined"
                fullWidth
                minDate={new Date()}
              />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={2} style={{marginTop:'10px'}}><Button variant="contained">Filter</Button></Grid>     
      </Grid>
      <div className={classes.calenderCard}>
        {appointmentDate && appointmentDate.length > 0 ? (
          appointmentDate.map((val) => {
            return (
              <Box  key={val.id}>
                <div
                  className={
                    moment(
                      moment(val.startDateTime).format("YYYY-MM-DD")
                    ).isSameOrAfter(
                      moment(new Date()).format("YYYY-MM-DD"),
                      "day"
                    )
                      ? classes.datecard
                      : classes.closedCard
                  }
                  onClick={() => {
                    handlemodalshow(val.id);
                  }}
                >
                  <Typography className={classes.day}>
                    {moment(val.startDateTime).format("MMM")}
                  </Typography>
                  <Typography className={classes.date}>
                    {moment(val.startDateTime).format("DD")}
                  </Typography>
                  <Typography className={classes.day}>
                    {moment(val.startDateTime).format("YYYY")}
                  </Typography>
                </div>
                {appointmentDateId === val.id && openAppointmentTime && (
                  <SheduleModalShow
                    open={openAppointmentTime}
                    date={val.startDateTime}
                    appointmentDateId={appointmentDateId}
                    timing={
                      val.appointmentDateTimeSlotsByAppointmentDateId.nodes
                    }
                    close={() => setOpenAppointmentTime(false)}
                    showTime={showTime}
                    timeValue={timeValue}
                    handleTimeValue={handleTimeValue}
                    handleTimeShow={() => setShowTime(!showTime)}
                    handleSubmitTime={handleSubmitTime}
                    deleteTime={deleteTime}
                    deleteDate={deleteDate}
                  />
                )}
              </Box>
            );
          })
        ) : (
          <p>No Data</p>
        )}
      </div>
      <SheduleModal
        open={open}
        type={type}
        date={date}
        editItem={editItem}
        handleSave={handleSave}
        onClose={onClose}
      />
    </Grid>
  );
};
