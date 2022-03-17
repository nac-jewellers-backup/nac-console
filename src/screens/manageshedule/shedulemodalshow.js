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
    borderBottom: "1px solid #c1c1c1",
  },
  available: {
    fontSize: "20px",

    paddingBottom: "8px",
  },
  time: {
    fontSize: "16px",
  },
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
      <DialogTitle id="Shedule-Modal">
        <Typography className={classes.title}>
          {moment(props.startDateTime).format("MMM")} -
          {moment(props.startDateTime).format("DD")} -
          {moment(props.startDateTime).format("YYYY")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {props.timing && props.timing.length > 0 ? (
          <Typography className={classes.available}>
            Available Timinig :
          </Typography>
        ) : (
          <Typography className={classes.available}>No Data</Typography>
        )}

        {props.timing &&
          props.timing.length > 0 &&
          props.timing.map((val) => {
            return (
              <Grid container style={{ paddingBottom: "8px" }} key={val.id}>
                <Typography className={classes.time}>
                  {`Start Time : ${moment(val.startDateTime).format(
                    "hh:mm a"
                  )} - End Time : ${moment(val.endDateTime).format("hh:mm a")}`}
                </Typography>
                <Button
                  style={{ marginLeft: "auto" }}
                  variant="contained"
                  onClick={() => props.deleteTime(val.id)}
                >
                  Delete Time
                </Button>
              </Grid>
            );
          })}
        <br />
        <Divider />
        <br />
        {props.showTime && (
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
        )}
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
        <Button
          variant="contained"
          onClick={() => props.deleteDate(props.appointmentDateId)}
        >
          Delete Date
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SheduleModalShow;
