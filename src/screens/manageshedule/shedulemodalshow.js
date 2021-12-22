import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";

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
    fontSize: "20px",
    paddingTop: "8px",
    paddingBottom: "8px",
    borderBottom: "1px solid #c1c1c1",
  },
  available: {
    fontSize: "18px",

    paddingBottom: "8px",
  },
  time: {
    fontSize: "14px",
  },
}));

const SheduleModalShow = (props) => {
  const classes = useStyles();
  const { data } = props;
  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      aria-labelledby={"Shedule-Modal"}
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle id="Shedule-Modal" disableTypography>
        <Typography className={classes.title}>
          {data.day}&nbsp;-{data.date}&nbsp;-{data.year}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography className={classes.available}>
          Available Timinig :
        </Typography>
        {data.time.map((val) => {
          return <Typography className={classes.time}>{val}</Typography>;
        })}
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default SheduleModalShow;
