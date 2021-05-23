import React from "react";
import {
  Dialog,
  DialogTitle,
  makeStyles,
  IconButton,
  Typography,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

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
}));

const HolidayModal = (props) => {
  const classes = useStyles();

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby={"Holiday-Modal"}
    >
      <DialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">{`${props.type} Holiday`}</Typography>
        {props.onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={props.onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent className={classes.root}>
        {props.type !== "Delete" && (
          <>
            <TextField
              className={classes.inputField}
              label={"Holiday"}
              name="holiday"
              fullWidth
              variant="outlined"
              value={props.item.holiday}
              onChange={props.editItem}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                className={classes.inputField}
                label={"Date"}
                name="date"
                fullWidth
                inputVariant="outlined"
                value={props.item.date}
                onChange={(_, value) => props.editItem(value, "date")}
                format={"yyyy-MM-dd"}
              />
            </MuiPickersUtilsProvider>
          </>
        )}
        {props.type === "Delete" && (
          <Typography>
            Are you sure? This will permanently delete it!
          </Typography>
        )}
      </DialogContent>
      <DialogActions className={classes.root}>
        <Button onClick={props.handleSave} color="primary" variant="contained">
          {`${props.type !== "Delete" ? "Save" : "Delete"}`}
        </Button>
        <Button onClick={props.onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HolidayModal;
