import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
  Button,
  Divider,
  Grid,
  Select,
  MenuItem,
  IconButton,
  Backdrop,
  CircularProgress
} from "@material-ui/core";
import React from "react";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { DeleteOutline } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  datecard: {
    backgroundColor: "white",
    padding: "25px",
    cursor: "pointer",
    boxShadow: "0px 3px 6px #c1c1c1",
    position:"relative"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  inputField: {
    marginBottom: theme.spacing(1),
  },
  title: {
    fontSize: "22px",
    paddingTop: "8px",
    paddingBottom: "8px",
  },
  available: {
    fontSize: "20px",
    paddingBottom: "8px",
  },
  availableTitle:{
    fontSize: "20px",
    paddingTop: "10px",
  },
  time: {
    fontSize: "16px",
  },
  notchedOutline:{
   width:"20%"
  },
  day:{
    fontSize:"14px"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const SheduleModalShow = (props) => {
  const classes = useStyles();
  const {appointmentTypes} = props;

  const getTime=(time)=>{
    let x = time;
    const [ hour,minute,second] = x.split(":");
    let d = new Date();
    d.setHours(hour);
    d.setMinutes(minute);
    d.setSeconds(second)
    return moment(d).format('hh:mm a');
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      maxWidth="md"
      fullWidth={true}
    >
       <Backdrop className={classes.backdrop} open={props.loading}>
                  <CircularProgress color="inherit"/>
                </Backdrop>
      <DialogTitle id="Schedule-Modal">
      <div style={{display:"flex",justifyContent:"space-between",}}>
           <Typography className={classes.availableTitle}>
            Available Timing - ({moment(props.date).format("MMM")} -
          {moment(props.date).format("DD")} -
          {moment(props.date).format("YYYY")})
          </Typography>
          <Select
                className={classes.notchedOutline}
                variant="outlined"
                margin="dense"
                labelId="demo-controlled-open-select-label"
                defaultValue={1}
                id="demo-controlled-open-select"
                placeholder="Select Type"
                onChange={(e) => props.filterType(e.target.value)}
           >
         {appointmentTypes?.map((_)=>{
          return(
            <MenuItem value={_.id}>{_.name}</MenuItem>
          )
         })}
        </Select>
        </div>
        <br/>
        <Divider/>
        
      </DialogTitle>
      <DialogContent>
        
        {props.timing && props.timing.length > 0 ? (
          <Typography className={classes.available}>
           
          </Typography>
        ) : (
          <Typography className={classes.available}>No Data</Typography>
        )}

       <Grid container spacing={1}>
          <Grid item xs={7} container spacing={1}>
          {props.timing &&
          props.timing.length > 0 &&
          props.timing.map((val) => {
            return (  
              <Grid item xs={6}>
                <div
                  className={
                    classes.datecard
                  }
                >
                  <div  style={{ position: 'absolute',
                    right: '5px',
                    top: '5px',}}>
                      <IconButton  onClick={() => props.deleteTime(val.id)}>
                         <DeleteOutline style={{color:"red"}}/>
                      </IconButton>
                  </div>
                

                <div style={{paddingTop:"20px"}}>
                  
                 <Typography className={classes.day}>
                  {`Start Time : ${getTime(val?.startTime)}`}
                  </Typography>
                  <Typography className={classes.day}>
                  {`End Time : ${getTime(val?.endTime)}`}
                  </Typography>
                  
                </div>
                 
                </div>       
              </Grid>              
            );
          })}
          </Grid>
          <Grid item xs={1} style={{display: 'flex',
              justifyContent: 'center',}}>
            <Divider variant="vertical"/>
          </Grid>
          <Grid item xs={4}>
          <>
            {" "}
            <Typography className={classes.available}>Start Time :</Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <TimePicker
                className={classes.inputField}
                name="startTime"
                placeholder="Select Start Time"
                inputVariant="outlined"
                value={props?.timeValue?.startTime ?? null}
                fullWidth
                onChange={(value) => props.handleTimeValue(value, "startTime")}
                minDate={new Date()}
              />
            </MuiPickersUtilsProvider>
            <Typography className={classes.available}>End Time :</Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <TimePicker
                className={classes.inputField}
                name="endTime"
                placeholder="Select End Time"
                inputVariant="outlined"
                fullWidth
                value={props?.timeValue?.endTime ?? null}
                onChange={(value) => props.handleTimeValue(value, "endTime")}
                minDate={new Date()}
              />
            </MuiPickersUtilsProvider>{" "}
            {/* <Typography className={classes.available}>Type :</Typography>
            <Select
               className={classes.inputField}
                variant="outlined"
                fullWidth
                margin="dense"
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                placeholder="Select Type"
                onChange={(e) => props.handleTimeValue(e.target.value, "type")}
             >
            {appointmentTypes?.map((_)=>{
              return(
                <MenuItem value={_.id}>{_.name}</MenuItem>
              )
             })}
             </Select> */}

                     <Button
                      onClick={() => props.handleSubmitTime(props.appointmentDateId,props.date,props.endDate)}
                      color="primary"
                      variant="contained"
                     >
                      Add Time
                    </Button>
          </>
      
          </Grid>
        </Grid>

       
        <br />
        <Divider />
        <br />
        
      </DialogContent>
      <DialogActions>
  
          {/* <Button
            onClick={() => props.handleSubmitTime(props.appointmentDateId)}
            color="primary"
            variant="contained"
          >
            Submit Time
          </Button> */}
        <Button onClick={props.close} variant="contained">
          {" "}
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.deleteDate(props.appointmentDateId)}
        >
          Delete Date
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SheduleModalShow;
