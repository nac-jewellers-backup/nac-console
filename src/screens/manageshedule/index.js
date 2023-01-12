import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  Button,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import moment from "moment";
import uuid from "uuid/v1";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React, { useCallback, useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import { AlertContext } from "../../context";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { GRAPHQL_DEV_CLIENT } from "../../config";
import SheduleModal from "./shedulemodal";
import SheduleModalShow from "./shedulemodalshow";
import {
  ALL_APPOINTMENTS_DATE,
  APPOINTMENTS_TYPE,
  ALL_APPOINTMENTS_TIMESLOT,
  FILTER_APPOINTEMENTS,
  CHECK_APPOINTMENT,
  CHECK_TIMESLOT,
} from "../../graphql/query";
import {
  CREATE_APPOINTMENT_DATE,
  CREATE_APPOINTMENT_TIME,
  DELETE_APPOINTMENT_TIME,
  DELETE_APPOINTMENT_DATE,
} from "../../graphql/mutation";
import {
  TimePicker,
  MuiPickersUtilsProvider,
  DatePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import { API_URL } from "../../config";
// import timeGridPlugin from "@fullcalendar/timegrid";

export const ManageShedule = (props) => {
  // States
  const [open, setOpen] = React.useState(false);
  const [appointmentDateId, setAppointmentDateId] = React.useState(null);
  const [type, setType] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [modalloading, setModalLoading] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [appointmentDate, setAppointmentDate] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [openAppointmentTime, setOpenAppointmentTime] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [timeValue, setTimeValue] = useState({
    startTime: new Date(),
    endTime: new Date(),
    type: 1,
  });
  const [filterDate, setFilterDate] = useState({
    startTime: moment(new Date()).startOf("month").format("YYYY-MM-DD"),
    endTime: moment(new Date()).endOf("month").format("YYYY-MM-DD"),
    date: new Date(),
  });

  const client = useApolloClient();
  const snack = React.useContext(AlertContext);
  const useStyles = makeStyles((theme) => ({
    datecard: {
      backgroundColor: "white",
      padding: "12px",
      cursor: "pointer",
      border: "1px solid black",
      boxShadow: "0px 3px 6px #c1c1c1",
      width: "140px",
      height: "130px",
      margin: 5,
      "&:hover": {
        borderTop: "5px solid #3F51B5",
        boxShadow: "0px 3px 6px #c1c1c1",
      },
    },
    input: {
      display: "none",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    calenderCard: {
      display: "flex",
      flexWrap: "wrap",
      marginLeft: "14px",
    },
    inputField: {
      marginBottom: theme.spacing(1),
      "& .MuiOutlinedInput-input": {
        padding: "12.5px 14px",
      },
    },
    closedCard: {
      backgroundColor: "white",
      padding: "12px",
      cursor: "pointer",
      border: "1px solid black",
      boxShadow: "0px 3px 6px #c1c1c1",
      width: "140px",
      height: "130px",
      margin: 5,
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
    GetAllAppointmentTypes();
    FilterDates(filterDate.startTime, filterDate.endTime);
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
    GetAllAppointment_TimeSlots(id, 1);
  };

  const handleTimeValue = (value, name) => {
    setTimeValue({ ...timeValue, [name]: value });
  };

  // Query Func
  const GetAllAppointment = async () => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch(console.error);
  };

  const CheckAppointment = async () => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: CHECK_APPOINTMENT,
        variables: {
          startDate: moment(date).format("YYYY-MM-DD"),
          endDate: moment(date).format("YYYY-MM-DD"),
        },
      }),
    };
    await fetch(url, opts)
      .then((res) => res.json())
      .then(async (res) => {
        if (res?.data?.allAppointmentDateTimeSlots?.nodes.length > 0) {
          snack.setSnack({
            open: true,
            severity: "warning",
            msg: "Date already available!",
          });
        } else {
          await handleSave();
        }
      })
      .catch(console.error);
  };

  const GetAllAppointment_TimeSlots = async (id, type) => {
    setModalLoading(true);
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ALL_APPOINTMENTS_TIMESLOT(id ? id : appointmentDateId, type).loc
          .source.body,
      }),
    };
    await fetch(url, opts)
      .then((res) => res.json())
      .then((res) => {
        setAppointmentSlots(res.data.allAppointmentDateTimeSlots.nodes);
        setOpenAppointmentTime(true);
        setAppointmentDateId(id);
        setModalLoading(false);
      })
      .catch(console.error);
  };

  const GetAllAppointmentTypes = async () => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: APPOINTMENTS_TYPE,
      }),
    };
    await fetch(url, opts)
      .then((res) => res.json())
      .then((res) => {
        setAppointmentTypes(res.data.allAppointmentTypeMasters.nodes);
      })
      .catch(console.error);
  };

  const handleSave = async () => {
    setLoading(true);
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
        FilterDates(filterDate.startTime, filterDate.endTime);
        onClose();
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

  const CheckTimeslot = async (id, date, endDate) => {
    await client
      .query({
        query: CHECK_TIMESLOT,
        variables: {
          appointmentDateId: id,
          appointmentTypeId: timeValue.type,
          startTime: moment(timeValue.startTime).format("HH:mm:00"),
          endTime: moment(timeValue.endTime).format("HH:mm:00"),
        },
        fetchPolicy: "no-cache",
      })
      .then((res) => {
        if (res?.data?.allAppointmentDateTimeSlots?.nodes.length > 0) {
          snack.setSnack({
            open: true,
            severity: "warning",
            msg: "TimeSlot already available!",
          });
        } else {
          handleSubmitTime(id, date, endDate);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmitTime = async (id, date, endDate) => {
    if (timeValue.type !== "") {
      setModalLoading(true);
      await client
        .mutate({
          mutation: CREATE_APPOINTMENT_TIME,
          variables: {
            id: uuid(),
            createdAt: new Date(),
            updatedAt: new Date(),
            startDateTime: new Date(date),
            endDateTime: new Date(endDate),
            appointmentTypeId: timeValue.type,
            appointmentDateId: id,
            startTime: moment(timeValue.startTime).format("HH:mm:00"),
            endTime: moment(timeValue.endTime).format("HH:mm:00"),
          },
          fetchPolicy: "no-cache",
        })
        .then((res) => {
          if (res) {
            GetAllAppointment_TimeSlots(appointmentDateId, timeValue.type);
            snack.setSnack({
              open: true,
              msg: "Successfully Updated!",
            });
            setModalLoading(false);
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
    }
  };

  const deleteTime = async (id) => {
    setModalLoading(true);
    await client
      .mutate({
        mutation: DELETE_APPOINTMENT_TIME,
        variables: {
          id: id,
        },
      })
      .then((res) => {
        if (res) {
          GetAllAppointment_TimeSlots(appointmentDateId, timeValue.type);
          onClose();
          setModalLoading(false);
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
          FilterDates(filterDate.startTime, filterDate.endTime);
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

  const handleDateChange = async (date) => {
    var start = moment(date).startOf("month").format("YYYY-MM-DD");
    var end = moment(date).endOf("month").format("YYYY-MM-DD");
    setFilterDate({
      ...filterDate,
      date: date,
      startTime: start,
      endTime: end,
    });
    FilterDates(start, end);
  };

  const FilterDates = async (start, end) => {
    setLoading(true);
    await client
      .query({
        query: FILTER_APPOINTEMENTS,
        variables: {
          startDate: start,
          endDate: end,
        },
        fetchPolicy: "no-cache",
      })
      .then((res) => {
        setAppointmentDate(res.data.allAppointmentDates.nodes);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleUpload = (file) => {
    var bodyFormData = new FormData();
    bodyFormData.set("file", file);
    console.log(file);
    axios
      .post(API_URL + "/appointment/upload_schedule", bodyFormData)
      .then((res) => {
        if (res) {
          snack.setSnack({
            open: true,
            msg: res.data.message || "Successfully uploaded!",
          });
          FilterDates(filterDate.startTime, filterDate.endTime);
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

  const FilterTimeSlotes = (type) => {
    GetAllAppointment_TimeSlots(appointmentDateId, type);
    setTimeValue({ ...timeValue, type: type });
  };

  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
            <Tooltip title="Upload Dates">
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
        justifyContent="center"
      >
        <Grid item xs={5}>
          <Typography className={classes.available}>
            Month and Year :
          </Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              variant="inline"
              inputVariant="outlined"
              format="MM/yyyy"
              margin="normal"
              views={["year", "month"]}
              value={filterDate.date}
              onChange={(date) => handleDateChange(date)}
              style={{ marginTop: 0 }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      <div className={classes.calenderCard}>
        {appointmentDate && appointmentDate.length > 0 ? (
          appointmentDate.map((val) => {
            return (
              <Box key={val.id}>
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
                    endDate={val.endDateTime}
                    appointmentDateId={appointmentDateId}
                    timing={appointmentSlots ? appointmentSlots : []}
                    close={() => setOpenAppointmentTime(false)}
                    showTime={showTime}
                    timeValue={timeValue}
                    handleTimeValue={handleTimeValue}
                    handleSubmitTime={CheckTimeslot}
                    filterType={FilterTimeSlotes}
                    deleteTime={deleteTime}
                    deleteDate={deleteDate}
                    appointmentTypes={appointmentTypes}
                    loading={modalloading}
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
        handleSave={CheckAppointment}
        onClose={onClose}
      />
    </Grid>
  );
};
