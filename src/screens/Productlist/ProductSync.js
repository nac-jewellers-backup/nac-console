import React from "react";
import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  LinearProgress,
  Box,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ChipInput from "material-ui-chip-input";
import { AlertContext, AlertProps } from "../../context";
import socketIOClient from "socket.io-client";
import { API_URL } from "../../config";
import { NetworkContext } from "../../context/NetworkContext";
import SyncIcon from "@material-ui/icons/Sync";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  content: {
    width: "90%",
    margin: theme.spacing(5),
  },
  textarea: {
    resize: "both",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const ProductSync = (props) => {
  const classes = useStyles();
  const snack = React.useContext(AlertContext);
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  var [data, setData] = React.useState({
    action_type: "price_sync",
    Product_lists: "",
    new_tagno: [],
  });
  const [progress, setProgress] = React.useState(0);
  var handleChange = (event) => {
    var { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  var handleAddChip = (chip) => {
    var _ = data;
    _.new_tagno.push(chip);
    setData({ ..._ });
  };

  var handleDeleteChip = (chip, index) => {
    var _ = data;
    _.new_tagno.splice(index, 1);
    setData({ ..._ });
  };

  var { open, handleClose } = props;

  React.useEffect(() => {
    const socket = socketIOClient(API_URL);
    socket.on("sync_data", (data) => {
      if (data.status !== "completed") {
        setProgress(data?.completed * 100);
      } else {
        snack.setSnack({
          severity: AlertProps.severity.info,
          msg: `Process Completed ${data.timeElapsed}`,
        });
      }
    });
  }, []);

  const handleRun = () => {
    if (data.action_type === "new_uploads" && data.new_tagno.length === 0) {
      snack.setSnack({
        open: true,
        severity: "error",
        msg: "TAG Number cannot be empty!",
      });
      return;
    }
    if (data.Product_lists === "") {
      snack.setSnack({
        open: true,
        severity: "error",
        msg: "Sync Data cannot be empty!",
      });
      return;
    } else {
      try {
        JSON.parse(data.Product_lists);
      } catch (error) {
        if (error) {
          snack.setSnack({
            open: true,
            severity: "error",
            msg: "Some error occured while parsing data",
          });
          return;
        }
      }
    }
    setProgress(0);
    var Product_lists = data.Product_lists;
    delete data.Product_lists;
    sendNetworkRequest(
      "/product_sync",
      {},
      { ...data, ...JSON.parse(Product_lists) }
    )
      .then((res) => {
        setData({
          action_type: "price_sync",
          Product_lists: "",
          new_tagno: [],
        });
        snack.setSnack({
          open: true,
          severity: "success",
          msg: res.message,
        });
      })
      .catch((err) => {
        console.log(err);
        snack.setSnack({
          open: true,
          severity: "error",
          msg: "Some error occured while processing!",
        });
      });
  };

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      close={handleClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Product Sync
          </Typography>
          <Button
            autoFocus
            color="inherit"
            variant="outlined"
            onClick={handleRun}
            startIcon={<SyncIcon />}
          >
            {data.action_type === "price_sync"
              ? "Run Price Sync"
              : "Run Product Sync"}
          </Button>
        </Toolbar>
      </AppBar>
      <Grid
        className={classes.content}
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <FormControl component="fieldset" fullWidth required>
            <Typography variant="h4">Choose action type</Typography>
            <RadioGroup
              aria-label="action-type"
              name="action_type"
              value={data.action_type}
              onChange={handleChange}
            >
              <FormControlLabel
                value={"price_sync"}
                control={<Radio />}
                label={"Price Sync"}
              />
              <FormControlLabel
                value={"new_uploads"}
                control={<Radio />}
                label={"Product Sync"}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid xs={12} style={{ padding: "9px" }}>
          <TextField
            value={data.Product_lists}
            onChange={handleChange}
            multiline
            rows={15}
            fullWidth
            label={"Sync Data"}
            name="Product_lists"
            variant="outlined"
            required
            inputProps={{ className: classes.textarea }}
          />
        </Grid>
        {data.action_type === "new_uploads" && (
          <Grid item xs={12}>
            <ChipInput
              value={data.new_tagno}
              onAdd={handleAddChip}
              onDelete={handleDeleteChip}
              fullWidth
              newChipKeyCodes={[13, 32]}
              variant="outlined"
              label={"TAG Number"}
            />
          </Grid>
        )}
        {progress > 0 && (
          <Grid item xs={12}>
            <LinearProgressWithLabel value={progress} />
          </Grid>
        )}
      </Grid>
    </Dialog>
  );
};

export default ProductSync;
