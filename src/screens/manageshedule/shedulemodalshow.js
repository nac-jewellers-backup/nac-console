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
  MenuItem
} from "@material-ui/core";
import React from "react";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
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
  time: {
    fontSize: "16px",
  },
  notchedOutline:{
   width:"20%"
  },
  day:{
    fontSize:"14px"
  }
}));

const SheduleModalShow = (props) => {
  const classes = useStyles();

  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle id="Schedule-Modal">
      <div style={{display:"flex",justifyContent:"space-between",}}>
        <Typography className={classes.title}>
          {moment(props.startDateTime).format("MMM")} -
          {moment(props.startDateTime).format("DD")} -
          {moment(props.startDateTime).format("YYYY")}
        </Typography>
          <Select
                className={classes.notchedOutline}
                variant="outlined"
                margin="dense"
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                placeholder="Select Type"
           >
         
          <MenuItem style={{backgroundColor:"white"}}>Visibility</MenuItem>
          <MenuItem style={{backgroundColor:"white"}}>Stock</MenuItem>
          <MenuItem style={{backgroundColor:"white"}}>Price</MenuItem>
        </Select>
        </div>
        <br/>
        <Divider/>
        
      </DialogTitle>
      <DialogContent>
        
        {props.timing && props.timing.length > 0 ? (
          <Typography className={classes.available}>
            Available Timing :
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
               <Button  
                 variant="contained"
                 size="small"
                 onClick={() => props.deleteTime(val.id)}
               >
                 Delete Time
               </Button>

               <Button 
                 color="primary"
                 variant="contained"      
                 size="small"
                 style={{marginLeft:5}}
               >
                 Edit Time
               </Button>
                  </div>
                

                <div style={{paddingTop:"20px"}}>
                <Typography className={classes.day}>
                  {`Start Time : ${moment(val?.startDateTime).format("hh:mm a")}`}
                  </Typography>
                  <Typography className={classes.day}>
                  {`End Time : ${moment(val?.endDateTime).format("hh:mm a")}`}
                  </Typography>
                </div>
                 
                </div>       
              </Grid>
                     
            );
          })}
          </Grid>
          <Grid item xs={5}>
  
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
          </>
      
          </Grid>
        </Grid>

       
        <br />
        <Divider />
        <br />
        
      </DialogContent>
      <DialogActions>
        {props.showTime && (
          <Button
            onClick={() => props.handleSubmitTime(props.appointmentDateId)}
            color="primary"
            variant="contained"
          >
            Submit Time
          </Button>
        )}
        {!props.showTime && (
          <Button
            onClick={props.handleTimeShow}
            color="primary"
            variant="contained"
          >
            Add Time
          </Button>
        )}
        <Button onClick={props.close} variant="contained">
          {" "}
          Close
        </Button>
        {/* <Button
          variant="contained"
          onClick={() => props.deleteDate(props.appointmentDateId)}
        >
          Delete Date
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default SheduleModalShow;
