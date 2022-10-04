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
import React, { useCallback, useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import { AlertContext } from "../../context";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { GRAPHQL_DEV_CLIENT } from "../../config";
import SheduleModal from "./shedulemodal";
import SheduleModalShow from "./shedulemodalshow";
import { ALL_APPOINTMENTS_DATE,APPOINTMENTS_TYPE,ALL_APPOINTMENTS_TIMESLOT,FILTER_APPOINTEMENTS } from "../../graphql/query";
import { useQuery } from "react-apollo";
import {
  CREATE_APPOINTMENT_DATE,
  CREATE_APPOINTMENT_TIME,
  DELETE_APPOINTMENT_TIME,
  DELETE_APPOINTMENT_DATE,
} from "../../graphql/mutation";
import { TimePicker, MuiPickersUtilsProvider,DatePicker,KeyboardDatePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
// import timeGridPlugin from "@fullcalendar/timegrid";


export const ManageShedule = (props) => {
  // States
  const [open, setOpen] = React.useState(false);
  const [appointmentDateId, setAppointmentDateId] = React.useState(null);
  const [type, setType] = React.useState();
  const [date, setDate] = React.useState(new Date());
  const [appointmentDate, setAppointmentDate] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [openAppointmentTime, setOpenAppointmentTime] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [timeValue, setTimeValue] = useState({
    startTime: new Date(),
    endTime: new Date(),
    type: 1
  });
  const [filterDate, setFilterDate] = useState({
    startTime: new Date(),
    endTime: new Date(),
    date: new Date()
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
      width:"140px",
      height:"130px",
      margin:5,
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
      border: "1px solid black",
      boxShadow: "0px 3px 6px #c1c1c1",
      width:"140px",
      height:"130px",
      margin:5,
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
    GetAllAppointmentTypes();
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
    GetAllAppointment_TimeSlots(id,1)
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

  const GetAllAppointment_TimeSlots = async (id,type) => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ALL_APPOINTMENTS_TIMESLOT(id ? id : appointmentDateId,type).loc.source.body,
      }),
    };
    await fetch(url, opts)
      .then((res) => res.json())
      .then((res) => {
         setAppointmentSlots(res.data.allAppointmentDateTimeSlots.nodes)
         setOpenAppointmentTime(true);
         setAppointmentDateId(id);
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
          setAppointmentTypes(res.data.allAppointmentTypeMasters.nodes)
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

  const handleSubmitTime = async (id,date,endDate) => {
    if(timeValue.type !== ''){
      await client
      .mutate({
        mutation: CREATE_APPOINTMENT_TIME,
        variables: {
          id: uuid(),
          createdAt: new Date(),
          updatedAt: new Date(),
          startDateTime: new Date(date),
          endDateTime: new Date(endDate) ,
          appointmentTypeId: timeValue.type,
          appointmentDateId: id,
          startTime: moment(timeValue.startTime).format("HH:mm:ss"),
          endTime: moment(timeValue.endTime).format("HH:mm:ss"),
        },
      })
      .then((res) => {
        if (res) {
          GetAllAppointment_TimeSlots(appointmentDateId,timeValue.type);
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
    }   
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


  const handleDateChange= async (date) =>{
    var start = moment(date).startOf('month').format("YYYY-MM-DD");
    var end = moment(date).endOf("month").format("YYYY-MM-DD");
    setFilterDate({...filterDate,date:date,startTime:start,endTime:end})    
  }

  const FilterDate= async () =>{
  if(filterDate.startTime !== "" && filterDate.endTime !== ""){
   await client
      .query({
        query: FILTER_APPOINTEMENTS,
        variables:{
          startDate:filterDate.startTime,
          endDate:filterDate.endTime 
        }
      })
      .then((res) => {
        setAppointmentDate(res.data.allAppointmentDates.nodes);
      })
      .catch((err) => {
        console.error(err);
      });
      
    }  
  }

  const FilterTimeSlotes=(type)=>{
    GetAllAppointment_TimeSlots(appointmentDateId,type)
    setTimeValue({...timeValue,type:type})
  }

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
        <Typography className={classes.available}>Month and Year :</Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              variant="inline"
              inputVariant="outlined"
              format="MM/yyyy"
              margin="normal"
              views={['year', 'month']}
              value={filterDate.date}
              onChange={(date) => handleDateChange(date)}
              style={{ marginTop: 0 }}
            />
          </MuiPickersUtilsProvider>
          
        </Grid>
        <Grid item xs={1.5} style={{marginTop:"10px"}}>
        <Button variant="contained" onClick={FilterDate}>Filter</Button>
        </Grid>
        <Grid item xs={1.5} style={{marginTop:"10px"}}>
        <Button variant="contained" onClick={GetAllAppointment}>Reset</Button>
        </Grid>

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
                    endDate={val.endDateTime}
                    appointmentDateId={appointmentDateId}
                    timing={
                      appointmentSlots ? appointmentSlots : []
                    }
                    close={() => setOpenAppointmentTime(false)}
                    showTime={showTime}
                    timeValue={timeValue}
                    handleTimeValue={handleTimeValue}
                    handleSubmitTime={handleSubmitTime}
                    filterType={FilterTimeSlotes}
                    deleteTime={deleteTime}
                    deleteDate={deleteDate}
                    appointmentTypes={appointmentTypes}
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
