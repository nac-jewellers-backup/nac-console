import React from "react";
import {
  Typography,
  IconButton,
  Grid,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BackupOutlinedIcon from "@material-ui/icons/BackupOutlined";
import axios from "axios";
import { API_URL } from "../../config";
import { AlertContext, AlertProps } from "../../context";
import socketIOClient from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h5" component="div" color="textSecondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export const PriceUpload = (props) => {
  const classes = useStyles();

  const snack = React.useContext(AlertContext);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const socket = socketIOClient(API_URL);
    socket.on("price_sync", (data) => {
      if (data.status !== "completed") {
        setProgress(data?.completed * 100);
      } else {
        setProgress(100);
        snack.setSnack({
          severity: AlertProps.severity.info,
          msg: `Process Completed ${data.timeElapsed}`,
        });
        socket.close();
      }
    });
  }, []);

  const handleUpload = (event) => {
    let files = event.target.files;
    if (files) {
      files = files[0];
    } else {
      return;
    }
    var bodyFormData = new FormData();
    bodyFormData.set("file", files);
    axios
      .post(API_URL + "/file_upload_price_sync", bodyFormData)
      .then((res) => {
        if (res) {
          snack.setSnack({
            open: true,
            msg: "Successfully started sync!",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        snack.setSnack({
          open: true,
          severity: "error",
          msg: "Some error occured!",
        });
      });
  };

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <input
            className={classes.input}
            id="icon-button-file"
            type="file"
            onChange={handleUpload}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="error"
              aria-label="upload picture"
              component="span"
            >
              <BackupOutlinedIcon style={{ fontSize: 200 }} />
            </IconButton>
          </label>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">UPLOAD EXCEL FILE</Typography>
        </Grid>
        {progress !== 0 && (
          <Grid item xs={12}>
            <CircularProgressWithLabel size={100} value={progress} />
          </Grid>
        )}
      </Grid>
    </>
  );
};
