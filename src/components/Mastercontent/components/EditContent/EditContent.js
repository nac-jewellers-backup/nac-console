import {
  Avatar,
  Button,







  colors, Dialog,


  FormControlLabel,
  Grid, Switch,


  TextField,
  Typography
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import clsx from "clsx";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { ProductContext } from "../../../../context";
import { NetworkContext } from "../../../../context/NetworkContext";
import "../../tmp.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

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
    paddingBottom: theme.spacing(2),
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
    marginRight: theme.spacing(2),
    // backgroundColor: colors.green[600],
    // '&:hover': {
    //   backgroundColor: colors.green[900]
    // }
  },
}));

const EditContent = (props) => {
  const { diamond, attributes, open, onClose, onApply, className, ...rest } = props;
  const initialValues = {
    ...diamond,
  };
  const [showpreview, setShowpreview] = useState(false);
  const [previewurl, setpreviewurl] = useState("");
  const [value, setValue] = useState("");
  const { productCtx, setProductCtx } = React.useContext(ProductContext);
  const [editcontent, setEditcontent] = React.useState({
    ...initialValues,
  });
  const { sendNetworkRequest } = React.useContext(NetworkContext);

  const classes = useStyles();
  const handleoptionChange = (type) => (event, value) => {
    setEditcontent({ ...editcontent, [type]: value });
  };
  function previewimage(url) {
    // setpreviewurl(url)
    // setShowpreview(true)
  }
  const handleInputChange = (type) => (e) => {

    setEditcontent({ ...editcontent, [type]: e.target.value });
  };
  const toggleChecked = (type) => (e) => {
    setEditcontent({ ...editcontent, [type]: !editcontent[type] });
  };
  function handleInit() {
    console.log("FilePond instance has initialised");
  }

  async function uploadimagetoserver(bodaydata, keyvalue, uploadtype) {
    let imagename = moment(new Date()).format("DD-MM-YYYYHH-MM-SS");
    let responsedata = await sendNetworkRequest(
      "/uploadimage",
      {},
      {
        image: bodaydata.fileExtension,
        filename: imagename,
        foldername: "banner_images",
        product_id: null,
      },
      false
    );
    var returnData = responsedata.data.returnData;
    var signedRequest = returnData.signedRequest;
    var url = returnData.url;
    console.log("responseurl" + url);
    var filepathname = returnData.filepath;
    let imageurl = "https://s3.ap-south-1.amazonaws.com/styloribaseimages/" + filepathname;

    var options = {
      headers: {
        "Content-Type": bodaydata.fileExtension,
        "Access-Control-Allow-Origin": "*",
      },
    };

    await axios.put(signedRequest, bodaydata.file, options);
    let previmagenames = editcontent[keyvalue];
    let previmages = [];
    if (previmagenames) {
      previmages = previmagenames.split(",");
      previmages.push(imageurl);
    }
    setEditcontent({ ...editcontent, [keyvalue]: previmages.join(",") });
  }
  const handleChange = (event) => {
    event.persist();

    setValue(event.target.value);
  };
  React.useEffect(() => { }, [editcontent]);

  return (
    <Dialog maxWidth="lg" onClose={onClose} open={open}>
      <div {...rest} className={clsx(classes.root, className)}>
        <div className={classes.header}>
          <Typography align="center" className={classes.title} gutterBottom variant="h3">
            {props.title}
          </Typography>
        </div>
        <div className={classes.content}>
          {attributes.map((columnname, index) => (
            <>
              {showpreview && (
                <Lightbox
                  class="fade"
                  mainSrc={previewurl}
                  // nextSrc={images[(photoIndex + 1) % images.length]}
                  // prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                  onCloseRequest={() => setShowpreview(false)}
                  onMovePrevRequest={() => alert("prev")}
                  onMoveNextRequest={() => alert("next")}
                />
              )}
              <Grid container xs={12} spacing={2}>
                {(!columnname.type || columnname.type == 1 || columnname.type === 10) && columnname.key != "action" ? (
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      id={columnname.key}
                      name={columnname.key}
                      value={editcontent[columnname.key]}
                      onChange={handleInputChange(columnname.key)}
                      label={columnname.label}
                      disabled={columnname.type === 10}
                    />
                  </Grid>
                ) : null}

                {columnname.key == "email" && !diamond.isedit ? (
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      id={columnname.key}
                      name={columnname.key}
                      value={editcontent[columnname.key]}
                      onChange={handleInputChange(columnname.key)}
                      label={columnname.label}
                      disabled={columnname.type === 10}
                    />
                  </Grid>
                ) : null}
                {columnname.type === 2 && (
                  <Grid item xs={12}>
                    <FormControlLabel
                      label={columnname.key}
                      labelPlacement="start"
                      control={
                        <Switch
                          checked={editcontent[columnname.key]}
                          name="checkedB"
                          color="primary"
                          onChange={toggleChecked(columnname.key)}
                        />
                      }
                    />
                  </Grid>
                )}
                {columnname.type === 3 && (
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      id="combo-box-demo"
                      options={columnname.mastervaluekey ? props.masters[columnname.mastervaluekey] : props.masters}
                      margin="dense"
                      fullWidth
                      value={editcontent[columnname.defaultkey]}
                      onChange={handleoptionChange(columnname.defaultkey)}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth margin="dense" label={columnname.label} variant="outlined" />
                      )}
                    />
                  </Grid>
                )}

                {columnname.type == 4 && (
                  <Grid item xs={12}>
                    <Typography> {diamond[columnname.key]}</Typography>
                  </Grid>
                )}

                {columnname.type == 5 && (
                  <Grid item xs={12}>
                    <Autocomplete
                      id="combo-box-demo"
                      // options={props.masters[columnname.mastervaluekey]}
                      margin="dense"
                      fullWidth
                      options={columnname.mastervaluekey ? props.masters[columnname.mastervaluekey] : props.masters}
                      onChange={handleoptionChange(columnname.defaultkey)}
                      value={editcontent[columnname.defaultkey]}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth margin="dense" label={columnname.label} variant="outlined" />
                      )}
                    />{" "}
                  </Grid>
                )}

                {columnname.type === 6 && (
                  <Grid item xs={12}>
                    <Button variant="outlined" color="primary">
                      {columnname.controllabel}
                    </Button>{" "}
                  </Grid>
                )}

                {columnname.type === 9 && (
                  <Grid container item xs={12}>
                    <Grid item xs={12}>
                      <AvatarGroup max={2}>
                        {diamond[columnname.key]
                          ? diamond[columnname.key]
                            .split(",")
                            .map((diamond, index) => (
                              <Avatar
                                alt="Remy Sharp"
                                src={diamond}
                                onClick={() => previewimage(diamond)}
                                className={classes.small}
                              />
                            ))
                          : null}
                      </AvatarGroup>
                    </Grid>
                    <Grid item xs={3}>
                      <FilePond
                        style={{ height: "100", width: "100" }}
                        oninit={() => handleInit()}
                        labelIdle="Add Banner Image"
                        onaddfile={(error, fileItem) => {
                          if (!error) {
                            uploadimagetoserver(fileItem, columnname.key, "add");
                          } else {
                            // alert(row[columnname.key])
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </>
          ))}
        </div>
        <div className={classes.actions}>
          <Button className={classes.applyButton} onClick={() => onApply(editcontent)} color={"primary"} variant="contained">
            Save
          </Button>
          <Button onClick={() => onClose()} variant="contained">
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

EditContent.propTypes = {
  diamond: PropTypes.object.isRequired,
  attributes: PropTypes.array,

  className: PropTypes.string,
  onApply: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

export default EditContent;
