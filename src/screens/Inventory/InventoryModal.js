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
  CircularProgress,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useApolloClient, useQuery } from "react-apollo";
import { VALIDATEGENERATEDSKU, WAREHOUSELIST } from "../../graphql/query";
import { Autocomplete } from "@material-ui/lab";

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

const InventoryModal = (props) => {
  const classes = useStyles();
  const { loading, data } = useQuery(WAREHOUSELIST);

  const client = useApolloClient();
  const [error, setError] = React.useState(false);

  const validateGeneratedSku = (generatedSku) => {
    client
      .mutate({
        mutation: VALIDATEGENERATEDSKU,
        variables: { generatedSku },
      })
      .then((res) => {
        if (res?.data?.allTransSkuLists?.nodes?.length === 0) {
          setError("Tag No doesn't exists!");
        } else {
          setError(false);
        }
      });
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby={"Holiday-Modal"}
    >
      <DialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">{`${props.type} Inventory`}</Typography>
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
              required
              label={"Tag No"}
              name="generatedSku"
              fullWidth
              variant="outlined"
              value={props.item.generatedSku}
              onChange={props.editItem}
              error={Boolean(error)}
              helperText={error}
              onBlur={() => validateGeneratedSku(props.item.generatedSku)}
            />
            <TextField
              className={classes.inputField}
              required
              type={"Number"}
              label={"Quantity"}
              name="numberOfItems"
              fullWidth
              variant="outlined"
              value={props.item.numberOfItems}
              onChange={props.editItem}
            />
            <Autocomplete
              loading={loading}
              options={data?.allWarehouses?.nodes}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              value={props.item.warehouse}
              onChange={props.editItem}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Warehouse"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
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

export default InventoryModal;
