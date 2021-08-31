import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Columns from "./columns";
import Popover from "@material-ui/core/Popover";

const useStyles = makeStyles((theme) => ({
  // button: {
  //     color:"#06847B",
  //     border: "1px solid #7bbcb7",
  //     '&:hover':{
  //         backgroundColor: "rgba(6, 132, 123, 0.1)",
  //         border: "1px solid #06847B",
  //     }
  //   },
}));

function SortHeader(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [options, setOptions] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    setOptions(props.columnnames);
  });
  return (
    <Grid container lg={12} md={12} sm={12} xs={12}>
      <Grid
        container
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        style={{ display: "flex", margin: "10px", justifyContent: "flex-end" }}
      >
        <Grid className="column-btn" lg={12} md={12} sm={12} xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
          {/* <Button className="product" size="small" id="one" color="primary" backgroundColor="secondary"  onClick={handleClick} variant="outlined"  color="primary" >
                            COLUMNS<ArrowDownwardIcon fontSize="inherit" />
                        </Button> */}
          <Button
            className="product"
            size="medium"
            id="one"
            color="primary"
            backgroundColor="secondary"
            onClick={handleClick}
            variant="outlined"
            color="primary"
          >
            COLUMNS
            <ArrowDownwardIcon fontSize="inherit" />
          </Button>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Columns
              columns={options}
              getColumnnames={props.getColumnnames}
              displytype={props.displytype}
              columnclose={handleClose}
            />
          </Popover>
        </Grid>
        {/* <Grid className="column-btn" lg={7} md={7} sm={7} xs={7}>
                        <Button id="create"  className="product" variant="contained" size="large" color="primary" backgroundColor="secondary">
                        CREATE PRODUCT
                        </Button>
                    </Grid> */}
      </Grid>
    </Grid>
  );
}
export default SortHeader;
