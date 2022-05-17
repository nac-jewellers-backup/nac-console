import React, { useState, useContext } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tooltip,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { makeStyles } from "@material-ui/styles";
import { UploadImage } from "../../utils/imageUpload";
import { AlertContext } from "../../context/AlertContext";
const useStyles = makeStyles({
  Card: {
    height: "500px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const ImageUpload = () => {
  const classes = useStyles();
  const alert = useContext(AlertContext);

  const [imgLink, setImgLink] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const handleChange = (file, name) => {
    UploadImage(file)
      .then((res) => {
        if (res?.data?.web) {
          alert.setSnack({
            open: true,
            severity: "success",
            msg: "Image Uploaded Successfully",
          });
        }
        setDisableButton(true);
        setImgLink(res?.data?.web ?? "");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const ResetFunc = () => {
    setImgLink("");
    setDisableButton(false);
  };
  return (
    <Grid container spacing={3}>
      <Grid container item xs={12} sm={12} spacing={2}>
        <Typography component="h5" variant="h5">
          Image upload
        </Typography>
      </Grid>

      <Grid item xs={6} sm={4} lg={6}>
        <Card fullwidth className={classes.Card}>
          <CardContent>
            <input
              accept="image/*"
              className={classes.input}
              style={{ display: "none" }}
              id="button-files"
              multiple
              type="file"
              onChange={(e) => handleChange(e.target.files[0])}
            />
            <label htmlFor="button-files">
              <Button
                variant="outlined"
                component="span"
                disabled={disableButton}
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
              </Button>
            </label>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} lg={6}>
        <Card fullwidth className={classes.Card}>
          <CardContent>
            <Typography
              style={{ textAlign: "center", marginTop: 2 }}
              component="h4"
              variant="h4"
            >
              {imgLink
                ? "Click image to copy link :"
                : "Upload image to get link here"}
            </Typography>

            {imgLink && (
              <div
                onClick={() => {
                  alert.setSnack({
                    open: true,
                    severity: "success",
                    msg: "Link Copied Successfully",
                  });
                }}
              >
                {/* <Tooltip title="Click to Copy Link"> */}
                <img
                  style={{ cursor: "copy", width: "100%", height: "auto" }}
                  src={imgLink}
                  alt="imag"
                  loading="lazy"
                  onClick={() => {
                    navigator.clipboard.writeText(imgLink);
                  }}
                />
                <Typography
                  style={{
                    textAlign: "center",
                    marginTop: 6,
                    cursor: "copy",
                  }}
                  component="h6"
                  variant="h5"
                  onClick={() => {
                    navigator.clipboard.writeText(imgLink);
                  }}
                >
                  {imgLink}
                </Typography>
                {/* </Tooltip> */}
              </div>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid
        item
        style={{
          margin: "auto",
          paddingTop: "8px",
        }}
      >
        <Button variant="outlined" onClick={ResetFunc}>
          Reset
        </Button>
      </Grid>
    </Grid>
  );
};
