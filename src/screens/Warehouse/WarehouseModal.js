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

const WarehouseModal = (props) => {
  const classes = useStyles();

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby={"Warehouse-Modal"}
    >
      <DialogTitle
        id="Warehouse-Modal"
        disableTypography
        className={classes.root}
      >
        <Typography variant="h6">{`${props.type} Warehouse`}</Typography>
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
              label={"Name"}
              name="name"
              fullWidth
              variant="outlined"
              value={props.item.name}
              onChange={props.editItem}
            />
            <TextField
              className={classes.inputField}
              label={"Shipping In Days"}
              name="shippingInDays"
              fullWidth
              variant="outlined"
              value={props.item.shippingInDays}
              onChange={props.editItem}
            />
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

export default WarehouseModal;
