import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Button, Dialog, Chip, TextField, Typography, colors, Input } from "@material-ui/core";
import { ProductContext } from "../../../../context";
import Autocomplete from "@material-ui/lab/Autocomplete";

//import getInitials from 'utils/getInitials';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 960,
  },
  header: {
    padding: theme.spacing(3),
    maxWidth: 720,
    margin: "0 auto",
  },
  content: {
    padding: theme.spacing(0, 2),
    maxWidth: 720,
    margin: "0 auto",
  },
  helperText: {
    textAlign: "right",
    marginRight: 0,
  },
  author: {
    margin: theme.spacing(4, 0),
    display: "flex",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  actions: {
    backgroundColor: colors.grey[100],
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
  applyButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    "&:hover": {
      backgroundColor: colors.green[900],
    },
  },
}));

const EditGemstone = (props) => {
  const { diamond, open, onClose, onApply, className, ...rest } = props;
  const initialValues = {
    id: diamond.id,
    gemstonesettings: diamond?.gemstonesettings ?? null,
    gemstonecount: diamond?.gemstonecount ?? "",
    gemstoneweight: diamond?.gemstoneweight ?? "",
    gemstonesize: diamond?.gemstonesize ?? "",
    gemstoneitemname: diamond?.gemstoneitemname ?? "",
    gemstonesubitemname: diamond?.gemstonesubitemname ?? "",
    gemstonedescription: diamond?.gemstonedescription ?? "",
    gemstoneshape: diamond?.gemstoneshape ?? null,
    gemstonetype: diamond?.gemstonetype ?? null,
  };
  const [value, setValue] = useState("");
  const { productCtx, setProductCtx } = React.useContext(ProductContext);

  const [editcontent, setEditcontent] = React.useState({
    ...initialValues,
  });

  const classes = useStyles();
  const handleoptionChange = (type) => (event, value) => {
    setEditcontent({ ...editcontent, [type]: value });
  };
  const handleInputChange = (type) => (e) => {
    setEditcontent({ ...editcontent, [type]: e.target.value });
  };
  const handleChange = (event) => {
    event.persist();

    setValue(event.target.value);
  };
  React.useEffect(() => {
    // alert(JSON.stringify(editcontent.gemstonecount))
  }, [editcontent]);

  return (
    <Dialog maxWidth="lg" onClose={onClose} open={open}>
      <div {...rest} className={clsx(classes.root, className)}>
        <div className={classes.header}>
          <Typography align="center" className={classes.title} gutterBottom variant="h3">
            Gemstone Details
          </Typography>
        </div>
        <div className={classes.content}>
          <TextField
            variant="outlined"
            fullWidth
            id="size"
            margin="dense"
            value={editcontent.gemstoneitemname}
            placeholder={"Item Name"}
            name="size"
            label="Item Name"
            autoComplete="size"
            onChange={handleInputChange("gemstoneitemname")}
          />{" "}
          <TextField
            variant="outlined"
            fullWidth
            id="size"
            margin="dense"
            value={editcontent.gemstonesubitemname}
            label="SubItem Name"
            placeholder={"Diamond SubItem Name"}
            name="size"
            autoComplete="size"
            onChange={handleInputChange("gemstonesubitemname")}
          />{" "}
          <TextField
            variant="outlined"
            fullWidth
            id="size"
            margin="dense"
            value={editcontent.gemstonedescription}
            placeholder={" Description"}
            name="size"
            label="Description"
            autoComplete="size"
            onChange={handleInputChange("gemstonedescription")}
          />
          <TextField
            variant="outlined"
            fullWidth
            id="size"
            margin="dense"
            value={editcontent.gemstonesize}
            label="Size"
            name="size"
            autoComplete="size"
            onChange={handleInputChange("gemstonesize")}
          />
          <TextField
            variant="outlined"
            fullWidth
            id="size"
            label="Weight"
            margin="dense"
            value={editcontent.gemstoneweight}
            name="size"
            autoComplete="size"
            onChange={handleInputChange("gemstoneweight")}
          />
          <TextField
            variant="outlined"
            fullWidth
            id="size"
            margin="dense"
            label="#of Stones"
            placeholder="#of Stones"
            name="size"
            type="number"
            autoComplete="size"
            onChange={handleInputChange("gemstonecount")}
            value={editcontent.gemstonecount}
          />
          <Autocomplete
            id="free-solo-2-demo"
            className={classes.fixedTag}
            getOptionLabel={(option) => option.label}
            options={productCtx.masterData.gemstonesettings}
            value={editcontent.gemstonesettings}
            onChange={handleoptionChange("gemstonesettings")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label=" Setting"
                margin="dense"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, type: "search" }}
              />
            )}
          />
          <Autocomplete
            id="free-solo-2-demo"
            className={classes.fixedTag}
            getOptionLabel={(option) => option.name}
            value={editcontent.gemstoneshape}
            options={productCtx.masterData.gemstonshapes}
            onChange={handleoptionChange("gemstoneshape")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" size="small" label={option.name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Shape"
                margin="dense"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, type: "search" }}
              />
            )}
          />
          <Autocomplete
            id="free-solo-2-demo"
            className={classes.fixedTag}
            getOptionLabel={(option) => option.label}
            value={editcontent.gemstonetype}
            options={productCtx.masterData.gemstontypes}
            onChange={handleoptionChange("gemstonetype")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type"
                margin="dense"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, type: "search" }}
              />
            )}
          />
        </div>
        <div className={classes.actions}>
          <Button className={classes.applyButton} onClick={() => onApply(editcontent)} variant="contained">
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

EditGemstone.propTypes = {
  diamond: PropTypes.object.isRequired,
  className: PropTypes.string,
  onApply: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

export default EditGemstone;
