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
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Backdrop,
  Tooltip,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ChipInput from "material-ui-chip-input";
import { AlertContext, AlertProps } from "../../context";
import socketIOClient from "socket.io-client";
import { API_URL } from "../../config";
import { NetworkContext } from "../../context/NetworkContext";
import SyncIcon from "@material-ui/icons/Sync";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import { Autocomplete } from "@material-ui/lab";
import { useApolloClient, useQuery } from "react-apollo";
import { VERIFYTAGNO, WAREHOUSELIST } from "../../graphql/query";
import { isEmpty } from "validate.js";
import axios from "axios";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

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
  errorTable: {
    margin: 10,
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  customWidth: {
    maxWidth: 420,
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

const ChooseWareHouse = (props) => {
  const { loading, data } = useQuery(WAREHOUSELIST);
  return (
    <Autocomplete
      id={"warehouse-id"}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={data?.allWarehouses?.nodes ?? []}
      value={props.warehouse || null}
      onChange={(event, newValue) => {
        props.setWarehouse(newValue);
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Warehouse"
          fullWidth
          required
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
  );
};

const ProductSync = (props) => {
  const classes = useStyles();
  const client = useApolloClient();
  const snack = React.useContext(AlertContext);
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  var [data, setData] = React.useState({
    action_type: "price_sync",
    sync_url: "",
    new_tagno: [],
  });
  const [progress, setProgress] = React.useState(0);
  const [warehouse, setWarehouse] = React.useState(null);
  const [errorTagNo, setErrorTagNo] = React.useState([]);
  const [validatedTagNo, setValidatedTagNo] = React.useState({
    status: false,
    errors: {},
  });
  const [backDrop, setBackDrop] = React.useState(false);
  var handleChange = (event) => {
    var { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  var handleAddChip = (chip) => {
    var _ = data;
    chip.split(",").forEach((item) => {
      _.new_tagno.push(item);
      setData({ ..._ });
      client
        .query({ query: VERIFYTAGNO, variables: { tagno: item } })
        .then(({ data }) => {
          if (data?.list?.nodes && data?.list?.nodes.length >= 1) {
            setErrorTagNo([...errorTagNo, item]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
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
        setData({
          action_type: "price_sync",
          sync_url: "",
          new_tagno: [],
        });
        snack.setSnack({
          severity: AlertProps.severity.info,
          msg: `Process Completed ${data.timeElapsed}`,
        });
        socket.close();
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
    if (data.sync_url === "") {
      snack.setSnack({
        open: true,
        severity: "error",
        msg: "Sync Data URL cannot be empty!",
      });
      return;
    }
    if (!warehouse?.id && data.action_type === "new_uploads") {
      snack.setSnack({
        open: true,
        severity: "error",
        msg: "Warehouse is mandatory!",
      });
      return;
    }
    setProgress(0);
    var Product_lists = data.Product_lists;
    delete data.Product_lists;
    setBackDrop(true);
    sendNetworkRequest(
      "/product_sync",
      {},
      {
        ...data,
        warehouse: warehouse?.id,
      }
    )
      .then((res) => {
        setBackDrop(false);
        snack.setSnack({
          open: true,
          severity: "success",
          msg: res.message,
        });
      })
      .catch((err) => {
        console.log(err);
        setBackDrop(false);
        snack.setSnack({
          open: true,
          severity: "error",
          msg: "Some error occured while processing!",
        });
      });
  };

  const validatePreSync = () => {
    if (data.sync_url === "") {
      snack.setSnack({
        open: true,
        severity: "error",
        msg: "Sync Data URL cannot be empty!",
      });
      return;
    }
    if (data.action_type === "new_uploads" && data.new_tagno.length === 0) {
      snack.setSnack({
        open: true,
        severity: "error",
        msg: "TAG Number cannot be empty!",
      });
      return;
    }
    setBackDrop(true);
    sendNetworkRequest("/preSync_validator", {}, { ...data })
      .then((response) => {
        let errorStatus = true;
        data.new_tagno.forEach((tagno) => {
          if (response[tagno] && !isEmpty(response[tagno])) {
            errorStatus = false;
          }
        });
        setBackDrop(false);
        setValidatedTagNo({
          status: errorStatus,
          errors: !errorStatus ? response : {},
        });
      })
      .catch((error) => {
        console.log(error);
        setBackDrop(false);
        snack.setSnack({
          open: true,
          severity: "error",
          msg: "Some error occured, Please try again!",
        });
      });
  };

  const handleUpload = (file) => {
    var bodyFormData = new FormData();
    bodyFormData.set("file", file);

    axios
      .post(API_URL + "/file_upload_sync", bodyFormData)
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
    <Dialog fullScreen open={open} TransitionComponent={Transition}>
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
          {data.action_type !== "price_sync" && (
            <Button
              variant="outlined"
              autoFocus
              color="inherit"
              onClick={validatePreSync}
              disabled
              startIcon={<AssignmentTurnedInOutlinedIcon />}
            >
              {"Validate Product Sync"}
            </Button>
          )}
          <Button
            autoFocus
            color="inherit"
            variant="outlined"
            onClick={handleRun}
            startIcon={<SyncIcon />}
            // disabled={
            //   data.action_type !== "price_sync" && !validatedTagNo?.status
            // }
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
        <Grid item xs={12} style={{ padding: "9px" }}>
          <TextField
            value={data.sync_url}
            onChange={handleChange}
            rows={15}
            fullWidth
            label={"Sync Data URL"}
            name="sync_url"
            variant="outlined"
            required
            inputProps={{ className: classes.textarea }}
          />
        </Grid>
        {data.action_type === "new_uploads" && (
          <>
            <Grid item xs={12}>
              <ChooseWareHouse
                warehouse={warehouse}
                setWarehouse={setWarehouse}
              />
            </Grid>
            <Grid item xs={12}>
              <ChipInput
                value={data.new_tagno}
                onAdd={handleAddChip}
                onDelete={handleDeleteChip}
                fullWidth
                newChipKeyCodes={[13, 32]}
                newChipKeys={[","]}
                variant="outlined"
                label={"TAG Number"}
                error={errorTagNo.length > 0}
                helperText={
                  errorTagNo.length > 0
                    ? `${errorTagNo.join(
                        ","
                      )} already exists syncing again could cause loss of data. Please proceed with caution and validate the same in product edit!`
                    : ``
                }
              />
            </Grid>
          </>
        )}
        {!isEmpty(validatedTagNo?.errors) && (
          <Grid item xs={12} className={classes.errorTable}>
            <Typography variant="overline" color="error" style={{ padding: 5 }}>
              {
                "Below masters are missing respectively, Please add them before syncing products"
              }
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Tag No.</TableCell>
                  <TableCell align="center">Master Type</TableCell>
                  <TableCell align="center">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.new_tagno.map(
                  (element, index) =>
                    !isEmpty(validatedTagNo.errors[element]) && (
                      <React.Fragment key={index}>
                        {console.log(
                          Object.keys(validatedTagNo.errors[element]).length
                        )}
                        <TableRow>
                          <TableCell
                            rowSpan={
                              Object.keys(validatedTagNo.errors[element]).length
                            }
                            align="center"
                          >
                            {element}
                          </TableCell>
                          {Object.keys(validatedTagNo.errors[element]).map(
                            (item, i) =>
                              i == 0 && (
                                <React.Fragment key={i}>
                                  <TableCell align="center">{item}</TableCell>
                                  <TableCell align="center">
                                    {validatedTagNo.errors[element][item]}
                                  </TableCell>
                                </React.Fragment>
                              )
                          )}
                        </TableRow>
                        {Object.keys(validatedTagNo.errors[element]).map(
                          (item, i) =>
                            i > 0 && (
                              <TableRow key={i}>
                                <TableCell align="center">{item}</TableCell>
                                <TableCell align="center">
                                  {validatedTagNo.errors[element][item]}
                                </TableCell>
                              </TableRow>
                            )
                        )}
                      </React.Fragment>
                    )
                )}
              </TableBody>
            </Table>
          </Grid>
        )}
        {progress > 0 && (
          <Grid item xs={12}>
            <LinearProgressWithLabel value={progress} />
          </Grid>
        )}
        <Grid
          container
          item
          xs={12}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="h5"
            component="h5"
            style={{
              width: "100%",
              textAlign: "center",
              borderBottom: "1px solid #000",
              lineHeight: "0.1em",
              margin: "10px 0 20px",
            }}
          >
            <span style={{ background: "#fff", padding: "0 10px" }}>OR</span>
          </Typography>
        </Grid>
        <Grid
          container
          item
          xs={12}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <div className={classes.root}>
            <input
              className={classes.input}
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              id="file"
              type="file"
              onChange={(event) => {
                const files = event.target.files;
                if (files) {
                  handleUpload(files[0]);
                }
              }}
            />
            <label htmlFor="file">
              <Tooltip
                title={
                  <div
                    style={{
                      whiteSpace: "normal",
                      textAlign: "left",
                    }}
                  >
                    1.Please make sure data is in sample file format.
                    <br />
                    2.materials,collections,occasions,themes,styles,stone_color,stone_count,hashtags
                    should be comma seperated and already existing in respective
                    masters.
                    <br />
                    3.Diamonds and Gemstones to be added in separate sheets, if
                    multiple entries add each row with same tag no.
                  </div>
                }
                classes={{ tooltip: classes.customWidth }}
                arrow
              >
                <Button variant="contained" color="primary" component="span">
                  Upload Excel file
                </Button>
              </Tooltip>
            </label>
          </div>
          <IconButton
            onClick={() => {
              const link = document.createElement("a");
              link.download = `sample_upload.xlsx`;
              link.href =
                "https://s3.ap-southeast-1.amazonaws.com/media.nacjewellers.com/resources/assets/sample_upload.xlsx";
              link.click();
            }}
          >
            <CloudDownloadIcon />
          </IconButton>
        </Grid>
        <Backdrop className={classes.backdrop} open={backDrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid>
    </Dialog>
  );
};

export default ProductSync;
