import {
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import uuid from "uuid/v1";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React, { useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import { AlertContext } from "../../context";

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
    closedCard: {
      backgroundColor: "white",
      padding: "12px",
      cursor: "pointer",
      borderTop: "4px solid red",
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
        xs={12}
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Typography variant="h4">Manage Shedule</Typography>
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
      <Grid container spacing={2}>
        {appointmentDate && appointmentDate.length > 0 ? (
          appointmentDate.map((val) => {
            return (
              <Grid item xs={1} key={val.id}>
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
              </Grid>
            );
          })
        ) : (
          <p>No Data</p>
        )}
      </Grid>
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
