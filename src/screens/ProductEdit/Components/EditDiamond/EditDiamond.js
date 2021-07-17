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

const EditDiamond = (props) => {


  const { diamond, open, onClose, onApply, className, ...rest } = props;
  const initialValues = {
    id: diamond.id,
    diamondweight: diamond.diamondweight ? diamond.diamondweight : "",
    diamondcount: diamond.diamondcount ? diamond.diamondcount : "",
    diamondsettings: diamond.diamondsettings ? diamond.diamondsettings : null,
    diamondshape: diamond.diamondshape ? diamond.diamondshape : null,
    diamonditemname: diamond.diamonditemname ?? "",
    diamondsubitemname: diamond.diamondsubitemname ?? "",
    diamonddescription: diamond.diamonddescription ?? "",
    diamondclarity: diamond.diamondClarity ?? "",
    diamondtype: diamond.diamondType ?? "",
    diamondcolor: diamond.diamondColour ?? "",
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
  React.useEffect(() => {}, [editcontent]);

  return (
    <Dialog maxWidth="lg" onClose={onClose} open={open}>
      <div {...rest} className={clsx(classes.root, className)}>
        <div className={classes.header}>
          <Typography align="center" className={classes.title} gutterBottom variant="h3">
            Diamond Details
          </Typography>
        </div>
        <div className={classes.content}>
          <TextField
            variant="outlined"
            fullWidth
            id="size"
            margin="dense"
            value={editcontent.diamonditemname}
            placeholder={"Item Name"}
            name="size"
            label="Item Name"
            autoComplete="size"
            onChange={handleInputChange("diamonditemname")}
          />{" "}
          {/* <TextField
            variant="outlined"
            fullWidth
            id="size"
            margin="dense"
            value={editcontent.diamondsubitemname}
            label="SubItem Name"
            placeholder={"Diamond SubItem Name"}
            name="size"
            autoComplete="size"
            onChange={handleInputChange("diamondsubitemname")}
          />{" "} */}
          <TextField
            variant="outlined"
            fullWidth
            id="size"
            margin="dense"
            value={editcontent.diamonddescription}
            placeholder={"Diamond Description"}
            name="size"
            label="Description"
            autoComplete="size"
            onChange={handleInputChange("diamonddescription")}
          />
          <TextField
            variant="outlined"
            fullWidth
            id="size"
            margin="dense"
            value={editcontent.diamondweight}
            placeholder={"Weight"}
            name="size"
            autoComplete="size"
            label="Weight"
            onChange={handleInputChange("diamondweight")}
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
            onChange={handleInputChange("diamondcount")}
            value={editcontent.diamondcount}
          />
          <Autocomplete
            id="free-solo-2-demo"
            className={classes.fixedTag}
            getOptionLabel={(option) => option.label}
            options={productCtx.masterData.diamondsettings}
            value={editcontent.diamondsettings}
            onChange={handleoptionChange("diamondsettings")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Diamond Setting"
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
            value={editcontent.diamondshape}
            options={productCtx.masterData.diamondshapes}
            onChange={handleoptionChange("diamondshape")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Diamond Shape"
                margin="dense"
                variant="outlined"
                fullWidth
                label="Shape"
                InputProps={{ ...params.InputProps, type: "search" }}
              />
            )}
          />
          <Autocomplete
            id="free-solo-2-demo"
            className={classes.fixedTag}
            getOptionLabel={(option) => option.label}
            value={editcontent.diamondcolor}
            options={productCtx.masterData.diamondcolors}
            onChange={handleoptionChange("diamondcolor")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Diamond Color"
                margin="dense"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, type: "search" }}
              />
            )}
          />{" "}
          <Autocomplete
            id="free-solo-2-demo"
            className={classes.fixedTag}
            getOptionLabel={(option) => option.label}
            value={editcontent.diamondclarity}
            options={productCtx.masterData.diamondclarities}
            onChange={handleoptionChange("diamondclarity")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Diamond Clarity"
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
            value={editcontent.diamondtype}
            options={productCtx.masterData.diamondtypes}
            onChange={handleoptionChange("diamondtype")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Diamond Type"
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

EditDiamond.propTypes = {
  diamond: PropTypes.object.isRequired,
  className: PropTypes.string,
  onApply: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

export default EditDiamond;
