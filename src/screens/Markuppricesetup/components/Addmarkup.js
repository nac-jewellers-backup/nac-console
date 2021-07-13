import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { TextField, Grid, Chip } from "@material-ui/core";

const styles = (theme) => ({
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
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function Addmarkup(props) {
  const [open, setOpen] = React.useState(props.isadd);
  const [markup, setMarkup] = React.useState({});

  const handleSave = () => {
    props.actionSave(markup, props.refetch);
  };
  const handleoptionChange = (type) => (event, value) => {
    setMarkup({ ...markup, [type]: value });
  };
  const handleinputChange = (type) => (e) => {
    setMarkup({
      ...markup,
      [type]: e.target.value,
    });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    props.actionclose();
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Add Markup Price For {props.material}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                id="free-solo-2-demo"
                fullWidth
                disableClearable
                onChange={handleoptionChange("category")}
                getOptionLabel={(option) => option.name}
                options={props.category}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      label={option.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose category"
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      readOnly: true,
                      type: "search",
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                id="free-solo-2-demo"
                multiple
                fullWidth
                disableClearable
                onChange={handleoptionChange("producttype")}
                getOptionLabel={(option) => option.name}
                options={props.producttype}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      label={option.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose product type"
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      readOnly: true,
                      type: "search",
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                id="free-solo-2-demo"
                multiple
                fullWidth
                disableClearable
                onChange={handleoptionChange("materiallist")}
                getOptionLabel={(option) => option.name}
                options={props.materiallist}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      label={option.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose Material type"
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      readOnly: true,
                      type: "search",
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                id="free-solo-2-demo"
                multiple
                fullWidth
                disableClearable
                onChange={handleoptionChange("puritylist")}
                getOptionLabel={(option) => option.name}
                options={props.puritylist}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      label={option.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose Purity type"
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      readOnly: true,
                      type: "search",
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="dense"
                label="Selling Price Min"
                fullWidth
                onChange={handleinputChange("sellpricemin")}
                id="productvendorcode"
                name="Selling Price Min"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="dense"
                label="Selling Price Max"
                fullWidth
                onChange={handleinputChange("sellpricemax")}
                id="productvendorcode"
                name="Cost Price"
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                id="free-solo-2-demo"
                fullWidth
                disableClearable
                getOptionLabel={(option) => option.name}
                onChange={handleoptionChange("markuptype")}
                options={[
                  { label: 1, name: "Flat" },
                  { label: 2, name: "Percentage" },
                ]}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      label={option.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Markup Type"
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      readOnly: true,
                      type: "search",
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="dense"
                label="Markup Value "
                onChange={handleinputChange("markup")}
                fullWidth
                id="productvendorcode"
                name="Cost Price"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
