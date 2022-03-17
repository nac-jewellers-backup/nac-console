import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

const SheduleModal = (props) => {
  const classes = makeStyles();

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby={"Shedule-Modal"}
    >
      <DialogTitle
        id="Shedule-Modal"
        disableTypography
        className={classes.root}
      >
        <Typography variant="h6">{`Add Shedule Date`}</Typography>
      </DialogTitle>
      <DialogContent className={classes.root}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            className={classes.inputField}
            name="date"
            placeholder="Select a date"
            fullWidth
            inputVariant="outlined"
            value={props.date ?? null}
            onChange={(_, value) => props.editItem(value)}
            minDate={new Date()}
            format={"yyyy-MM-dd"}
          />
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions className={classes.root}>
        <Button onClick={props.handleSave} color="primary" variant="contained">
          Save
        </Button>

        <Button onClick={props.onClose} variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SheduleModal;
