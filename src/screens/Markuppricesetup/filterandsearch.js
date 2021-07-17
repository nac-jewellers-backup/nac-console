import React from "react";
import { Form, Grid, Select } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const useStyless = makeStyles((theme) => ({
  button: {
    color: "#06847B",
    border: "1px solid #7bbcb7",
    "&:hover": {
      backgroundColor: "rgba(6, 132, 123, 0.1)",
      border: "1px solid #06847B",
    },
  },
}));

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

const options = [
  "Show some love to Material-UI",
  "Show all notification content",
  "Hide sensitive notification content",
  "Hide all notification content",
];

export default function FormPropsTextFields() {
  const classess = useStyless();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div
      className="search"
      style={{
        display: "flex",
        justifyContent: "space-around",
        background: "white",
        borderTop: "1px solid #e4e4e4",
        borderBottom: "1px solid #e4e4e4",
      }}
    >
      <Grid lg={2} md={2} sm={3}>
        <Button
          onClick={handleClick}
          variant="outlined"
          color="primary"
          backgroundColor="secondary"
          size="large"
          style={{
            fontSize: "15px",
            width: "95%",
            marginLeft: "15px",
            marginTop: "18px",
            marginBottom: "10px",
            padding: "6px 0px",
          }}
        >
          ADD FILTER
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
          <Typography
            style={{
              paddingBottom: "0px",
              FontWeight: "400",
              color: "#6f6f6f",
            }}
            className={classes.typography}
            variant="h5"
          >
            Select all products where:
          </Typography>

          <div
            className={classes.root}
            style={{ padding: "4px 10px 10px 10px" }}
          >
            <Select
              className={classes.notchedOutline}
              fullWidth
              variant="outlined"
              margin="dense"
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
            >
              <MenuItem
                style={{
                  backgroundColor: "white",
                  color: "#6f6f6f",
                  padding: "15px 20px",
                  fontSize: "17px",
                }}
              >
                Visibility
              </MenuItem>
              <MenuItem
                style={{
                  backgroundColor: "white",
                  color: "#6f6f6f",
                  padding: "15px 20px",
                  fontSize: "17px",
                }}
              >
                Stock
              </MenuItem>
              <MenuItem
                style={{
                  backgroundColor: "white",
                  color: "#6f6f6f",
                  padding: "15px 20px",
                  fontSize: "17px",
                }}
              >
                Price
              </MenuItem>
            </Select>

            <Menu
              id="lock-menu"
              // anchorEl={anchorEl}

              keepMounted
              // open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={option}
                  onClick={(event) => handleMenuItemClick(event, index)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Popover>
      </Grid>
      <Grid lg={10} md={10} sm={9}>
        <form
          noValidate
          autoComplete="off"
          style={{
            width: "97%",
            margin: "auto",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <TextField
            fullWidth
            margin="dense"
            id="outlined-basic"
            variant="outlined"
          />
        </form>
      </Grid>
    </div>
  );
}
