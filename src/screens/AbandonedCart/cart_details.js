import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  Typography,
  TextField,
  makeStyles,
  FormGroup,
  FormControlLabel,
  Switch,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@material-ui/core";
import { useApolloClient } from "react-apollo";
import { CARTBYID } from "../../graphql/query";
import Image from "material-ui-image";
import { green } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import MailIcon from "@material-ui/icons/Mail";
import SmsIcon from "@material-ui/icons/Sms";
import CallIcon from "@material-ui/icons/Call";
import moment from "moment";
import { API_URL } from "../../config";
import { AlertContext } from "../../context";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
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
  fieldset: {
    borderColor: theme.palette.primary.main,
    borderRadius: "5px",
    boxSizing: "border-box",
    gridArea: "1 / 1",
    width: "inherit",
  },
  legend: {
    font: "15pt/0",
    //margin: "auto" /* to center */,
    padding: "0 4px",
  },
  textfield: {
    marginTop: theme.spacing(1),
  },
  inline: {
    margin: theme.spacing(0.5),
    display: "inline",
  },
  chip: {
    color: green[700],
  },
}));

export default function CartDetails(props) {
  const classes = useStyles();
  let { open, handleClose } = props;
  const [state, setState] = React.useState({});
  const client = useApolloClient();
  const snack = React.useContext(AlertContext);

  const sendEmail = (order_id, type) => {
    const url = API_URL + "/trigger_mail";
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: order_id, type: type }),
    };
    fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        snack.setSnack({
          open: true,
          msg: "Mail Sent Successfully!",
        });
        console.log(fatchvalue);
      })
      .catch((err) => {
        snack.setSnack({
          open: true,
          severity: "error",
          msg: "Some error occured!",
        });
      });
  };

  React.useEffect(() => {
    if (props.id) {
      client
        .query({
          query: CARTBYID,
          variables: {
            id: props.id,
          },
          fetchPolicy: "network-only",
        })
        .then((res) => {
          setState(res);
        })
        .catch((err) => console.log(err));
    }
    return () => {
      setState({});
    };
  }, [props.id]);
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      maxWidth={"lg"}
      fullWidth
    >
      <DialogTitle
        id="alert-dialog-slide-title"
        disableTypography
        className={classes.root}
      >
        <Typography variant="h4">Cart Details</Typography>
        {handleClose && (
          <>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </>
        )}
      </DialogTitle>
      <DialogContent>
        {(state?.loading == undefined || state?.loading) && (
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <CircularProgress />
            </Grid>
          </Grid>
        )}
        {state?.data && (
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            spacing={1}
          >
            <Grid item xs={6}>
              {/* <Typography variant="h6">User Details</Typography> */}
              <fieldset className={classes.fieldset}>
                <legend className={classes.legend}>User Details</legend>
                <TextField
                  label="First Name"
                  defaultValue={state?.data?.cart?.user?.firstName}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  className={classes.textfield}
                />
                <TextField
                  label="Last Name"
                  defaultValue={state?.data?.cart?.user?.lastName}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  className={classes.textfield}
                />
                <TextField
                  label="User Name"
                  defaultValue={state?.data?.cart?.user?.username}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  className={classes.textfield}
                />
                <TextField
                  label="Email"
                  defaultValue={state?.data?.cart?.user?.email}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  className={classes.textfield}
                />
                <TextField
                  label="Mobile No."
                  defaultValue={state?.data?.cart?.user?.mobile}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  className={classes.textfield}
                />
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state?.data?.user?.isemailverified ?? false}
                        disabled
                      />
                    }
                    labelPlacement="start"
                    label="Email Verified"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state?.data?.user?.ismobileverified ?? false}
                        disabled
                      />
                    }
                    labelPlacement="start"
                    label=" Mobile Verified"
                  />
                </FormGroup>
                {state?.data?.cart?.address?.nodes.length > 0 ? (
                  <div style={{ padding: 5 }}>
                    {state?.data?.cart?.address?.nodes.map((item, index) => {
                      return (
                        <React.Fragment key={item?.id}>
                          <Typography variant="h6">
                            Cart Address #{index + 1} :{" "}
                          </Typography>
                          <Typography variant="body2">
                            {`${item?.salutation ?? ``}${item?.firstname} ${
                              item?.lastname
                            }`.toUpperCase()}
                          </Typography>
                          <Typography variant="body2">
                            {item?.addressline1.toUpperCase()}
                          </Typography>
                          <Typography variant="body2">
                            {item?.addressline2.toUpperCase()}
                          </Typography>
                          <Typography variant="body2">
                            {item?.city.toUpperCase()}
                          </Typography>
                          <Typography variant="body2">
                            {item?.state.toUpperCase()}
                          </Typography>
                          <Typography variant="body2">
                            {item?.country.toUpperCase()}
                          </Typography>
                          <Typography variant="body2">
                            {item?.pincode.toUpperCase()}
                          </Typography>
                          <Typography variant="body2">
                            Contact No.{" "}
                            {`${item?.countryCode} - ${item?.contactNumber}`}
                          </Typography>
                        </React.Fragment>
                      );
                    })}
                  </div>
                ) : (
                  ``
                )}
              </fieldset>
            </Grid>
            <Grid
              item
              xs={6}
              container
              justify="flex-start"
              alignItems="flex-start"
              spacing={1}
            >
              <Grid item xs={12}>
                <fieldset className={classes.fieldset}>
                  <legend className={classes.legend}>Status</legend>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        className={classes.inline}
                      >
                        Status :{" "}
                        <Chip
                          className={classes.chip}
                          label={state?.data?.cart?.status.toUpperCase()}
                          size="small"
                          variant="outlined"
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        className={classes.inline}
                      >
                        Gross Price : &#8377;
                        {`${state?.data?.cart?.grossAmount ?? 0}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        className={classes.inline}
                      >
                        Discounted Price : &#8377;
                        {`${state?.data?.cart?.discountedPrice ?? 0}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        className={classes.inline}
                      >
                        Tax Amount : &#8377;
                        {`${state?.data?.cart?.taxAmount ?? 0}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </fieldset>
              </Grid>
              <Grid item xs={12}>
                <fieldset className={classes.fieldset}>
                  <legend className={classes.legend}>Items</legend>
                  <List className={classes.root} dense={true}>
                    {state?.data?.cart?.cart_items?.nodes.map((item) => {
                      var skuDetails = item?.transSkuListByProductSku;
                      var product =
                        item?.transSkuListByProductSku?.productListByProductId;
                      var image = product?.productImagesByProductId?.nodes[0];
                      return (
                        <>
                          <ListItem
                            alignItems="flex-start"
                            key={item.productSku}
                            disableGutters
                            divider
                          >
                            <ListItemAvatar
                              style={{
                                width: "30%",
                                height: "30%",
                              }}
                            >
                              <Image src={`${image?.imageUrl}`} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="h5">
                                  {
                                    item?.transSkuListByProductSku
                                      ?.productListByProductId?.productName
                                  }
                                </Typography>
                              }
                              secondary={
                                <Grid container>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="subtitle1"
                                      className={classes.inline}
                                    >
                                      SKU : {item?.productSku}
                                    </Typography>
                                    <Typography
                                      variant="subtitle1"
                                      className={classes.inline}
                                    >
                                      Quantity : {item?.qty}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="subtitle1"
                                      className={classes.inline}
                                    >
                                      Price : &#8377;
                                      {skuDetails?.markupPrice}
                                    </Typography>
                                    <Typography
                                      variant="subtitle1"
                                      className={classes.inline}
                                      style={{}}
                                    >
                                      Tax : &#8377;
                                      {skuDetails?.markupPriceTax}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              }
                            />
                          </ListItem>
                        </>
                      );
                    })}
                  </List>
                </fieldset>
              </Grid>
              <Grid item xs={12}>
                <fieldset className={classes.fieldset}>
                  <legend className={classes.legend}>Follow ups</legend>
                  <List className={classes.root} dense={true}>
                    {state?.data?.cart?.follow_ups?.nodes.map((item) => {
                      return (
                        <>
                          <ListItem
                            alignItems="flex-start"
                            key={item.senderResponseId}
                            disableGutters
                            divider
                          >
                            <ListItemIcon>
                              {item.type == "email" && <MailIcon />}
                              {item.type == "sms" && <SmsIcon />}
                              {item.type == "phone" && <CallIcon />}
                            </ListItemIcon>
                            <ListItemText
                              primary={item?.senderResponseId}
                              secondary={moment(item?.createdAt).format(
                                "DD/MMM/YYYY HH:mm A"
                              )}
                            />
                          </ListItem>
                        </>
                      );
                    })}
                  </List>
                </fieldset>
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            sendEmail(props?.id, "abandoned_cart");
          }}
        >
          Send Follow up Email
        </Button>
        <Button variant="contained" onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
