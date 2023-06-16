import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import React, { useState } from "react";
import { useApolloClient, useQuery } from "react-apollo";
import {
  FETCH_COMBO_OFFERED_PRODUCTS,
  GET_UNIQUE_PRODUCT,
  LIST_COMBO_PRODUCTS,
  UPDATE_COMBO_BY_MAIN_PRODUCT,
} from "../../graphql/query";
import { API_URL, BASE_IMAGE_URL } from "../../config";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import socketIOClient from "socket.io-client";
import { AlertContext } from "../../context";
import axios from "axios";
import CircularProgressWithLabel from "../../components/CircularProgress";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Autocomplete } from "@material-ui/lab";
import ChipInput from "material-ui-chip-input";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  comboCard: {
    padding: "10px",
  },
  searchInput: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 8,
    },
  },
  input: {
    display: "none",
  },
  image: {
    height: 230,
    width: 165,
  },
  productName: {
    fontSize: "1em",
  },
  alignCardTypo: {
    paddingTop: "6px",
  },
  details: {
    color: "#3f51b5",
    fontWeight: 600,
  },
  alignItems: {
    display: "flex",
    alignItems: "center",
  },
}));

const InduvidualProductCard = (props) => {
  const classes = useStyles();
  let source = props?.productListByMainProduct ?? props;
  let productId = props?.mainProduct ?? source?.productId;
  return (
    <Card className={classes.image}>
      <CardMedia
        component="img"
        alt={productId}
        image={source?.productImagesByProductId?.nodes?.[0]?.imageUrl}
      />
      <CardContent>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          component="p"
          className={classes.productName}
        >
          {source?.productName}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ComboCard = (props) => {
  const classes = useStyles();
  let { offeredProducts } = props;
  if (offeredProducts.length < 2) {
    offeredProducts = offeredProducts;
  }
  const { loading, data, error, refetch, networkStatus } = useQuery(
    FETCH_COMBO_OFFERED_PRODUCTS,
    { variables: { offeredProducts } }
  );
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
    >
      <Grid item>
        <Typography style={{ fontWeight: 600 }}>Main Product</Typography>
        <InduvidualProductCard {...props} />
        <Typography className={classes.alignCardTypo}>
          Product Id :{" "}
          <span className={classes.details}>{props?.mainProduct}</span>
        </Typography>
      </Grid>
      <Grid>{"+"}</Grid>
      {!loading &&
        data &&
        data.allProductLists.nodes.map((product, index) => (
          <>
            <Grid key={product.id} item>
              <Typography>Combo Product{index + 1}</Typography>
              <InduvidualProductCard {...product} />
              <Typography className={classes.alignCardTypo}>
                Product Id :{" "}
                <span className={classes.details}>{product?.productId}</span>
              </Typography>
            </Grid>
            {index + 1 < data.allProductLists.nodes.length && (
              <Grid>{"+"}</Grid>
            )}
          </>
        ))}
    </Grid>
  );
};

export const ComboOfferConfig = (props) => {
  const initialState = {
    offeredProducts: [],
    discountType: "",
    discountValue: 0,
    mainProduct: "",
    isActive: true,
  };

  const classes = useStyles();
  const snack = React.useContext(AlertContext);
  const [openForm, setOpenForm] = useState(false);
  const [progress, setProgress] = React.useState(0);
  const [editState, setEditState] = useState(initialState);
  const [offerError, setOfferError] = React.useState({});

  const client = useApolloClient();

  React.useEffect(() => {
    const socket = socketIOClient(API_URL);
    socket.on("combo_sync", (data) => {
      if (data.status !== "completed") {
        setProgress(data?.completed * 100);
      } else {
        setProgress(100);
        snack.setSnack({
          severity: "info",
          msg: `Process Completed`,
        });
        socket.close();
      }
    });
  }, []);

  const handleComboForm = (product) => {
    setEditState({
      ...editState,
      offeredProducts: product?.offeredProducts,
      discountType: product?.discountType,
      discountValue: product?.discountValue,
      mainProduct: product?.mainProduct,
      isActive: product?.isActive,
    });
    setOpenForm(true);
  };

  const chipAdd = (chipValue) => {
    client
      .query({ query: GET_UNIQUE_PRODUCT, variables: { productId: chipValue } })
      .then(({ data }) => {
        if (data?.product) {
          setEditState({
            ...editState,
            offeredProducts: [...editState.offeredProducts, chipValue],
          });
        } else {
          setOfferError({
            ...offerError,
            offeredProducts: `${chipValue} is not a valid product!`,
          });
        }
      })
      .catch(console.log);
  };

  const chipDelete = (_chip, index) => {
    let { offeredProducts } = editState;
    offeredProducts.splice(index, 1);
    setEditState({
      ...editState,
      offeredProducts,
    });
  };

  const handleChange = (name, value) => {
    if (name == "discountValue") value = Number(value);
    setEditState({
      ...editState,
      [name]: value,
    });
  };

  const handleClose = () => {
    setEditState(initialState);
    setOpenForm(false);
  };

  const validate = () => {
    const validationField = [
      "offeredProducts",
      "discountType",
      "discountValue",
      "mainProduct",
    ];
    let error = [];
    validationField.forEach((val) => {
      if (Array.isArray(editState[val]) && editState[val].length <= 1) {
        error.push(true);
      }
      if (editState[val] !== null && editState[val] !== "") {
        error.push(true);
      } else {
        error.push(false);
      }
    });
    if (error.includes(false)) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      client
        .mutate({
          mutation: UPDATE_COMBO_BY_MAIN_PRODUCT,
          variables: editState,
        })
        .then(() => {
          refetch();
          setOpenForm(false);
        })
        .catch(console.log);
    } else {
      snack.setSnack({
        open: true,
        severity: "error",
        msg: `Please fill all the fields`,
      });
    }
  };

  const { loading, data, error, refetch, networkStatus } =
    useQuery(LIST_COMBO_PRODUCTS);

  const handleUpload = (file) => {
    var bodyFormData = new FormData();
    bodyFormData.set("file", file);
    axios
      .post(API_URL + "/bulk_upload_combo", bodyFormData)
      .then((res) => {
        if (res) {
          setProgress(1);
          snack.setSnack({
            open: true,
            msg: res?.data?.message,
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
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      className={classes.root}
    >
      <Grid item xs={8}>
        <TextField
          className={classes.searchInput}
          fullWidth
          variant="outlined"
          placeholder="Search by Product ID or Product Name"
          label="Search"
        />
      </Grid>
      <Grid>
        <IconButton
          style={{ color: "#000" }}
          onClick={() => {
            var a = document.createElement("a");
            a.href = `https://s3.ap-southeast-1.amazonaws.com/media.nacjewellers.com/resources/assets/sample_combo.csv`;
            a.setAttribute("download", "sample_combo.csv");
            a.click();
          }}
        >
          <Tooltip title="Download sample file">
            <GetAppIcon />
          </Tooltip>
        </IconButton>
      </Grid>
      {progress == 0 && (
        <Grid item xs={2}>
          <input
            accept=".csv"
            className={classes.input}
            id="icon-button-file"
            type="file"
            onChange={(event) => {
              const files = event.target.files;
              if (files) {
                handleUpload(files[0]);
              }
            }}
          />
          <label htmlFor="icon-button-file">
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              component="span"
            >
              Upload Combo Offers
            </Button>
          </label>
        </Grid>
      )}
      {progress > 0 && (
        <Grid item xs={2}>
          <CircularProgressWithLabel value={progress} />
        </Grid>
      )}
      {!loading &&
        data &&
        data.allProductComboOffers.nodes.map((products) => (
          <Grid key={products.id} component={Paper}>
            <div className={classes.comboCard}>
              <ComboCard {...products} />
            </div>
            <div
              className={classes.alignItems}
              style={{ padding: "0px 10px", justifyContent: "space-between" }}
            >
              <div>
                <Typography>
                  Discount Type :{" "}
                  <span className={classes.details}>
                    {products?.discountType}
                  </span>
                </Typography>
                <Typography>
                  Discount Value :{" "}
                  <span className={classes.details}>
                    {products?.discountValue}
                  </span>
                </Typography>
                <Typography>
                  Combo Status :{" "}
                  <span className={classes.details}>
                    {products?.isActive ? "Active" : "In-Active"}
                  </span>
                </Typography>
              </div>
              <Button
                onClick={() => handleComboForm(products)}
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
            </div>
          </Grid>
        ))}
      <Dialog
        open={openForm}
        onClose={() => handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Edit Combo Offer</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div
              className={classes.alignItems}
              style={{ marginBottom: "18px" }}
            >
              <TextField
                required
                id="outlined-required"
                label="Main Product"
                size="small"
                defaultValue="Hello World"
                variant="outlined"
                disabled={true}
                name="mainProduct"
                value={editState?.mainProduct}
              ></TextField>
              <FormControlLabel
                style={{ margin: "5px" }}
                control={
                  <Switch
                    checked={editState.isActive}
                    onChange={({ target }) => {
                      setEditState({
                        ...editState,
                        isActive: target.checked,
                      });
                    }}
                  />
                }
                label={"Active"}
              />
            </div>
            <Grid container spacing={2} style={{ marginBottom: "18px" }}>
              <Grid item xs={12}>
                <ChipInput
                  value={editState?.offeredProducts}
                  onAdd={chipAdd}
                  onDelete={chipDelete}
                  fullWidth
                  variant="outlined"
                  label={"Offered Products"}
                  error={Boolean(offerError?.offeredProducts)}
                  helperText={offerError?.offeredProducts}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginBottom: "18px" }}>
              <Grid item xs={6}>
                <Autocomplete
                  id="combo-box-demo"
                  options={["FLAT", "PERCENTAGE"]}
                  getOptionLabel={(option) => option}
                  value={editState?.discountType}
                  onChange={(event, newValue) => {
                    setEditState({
                      ...editState,
                      discountType: newValue,
                    });
                  }}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Combo box"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="outlined-required"
                  size="small"
                  label="Discount Value"
                  defaultValue="Hello World"
                  variant="outlined"
                  name="discountValue"
                  onChange={(e) =>
                    handleChange("discountValue", e.target.value)
                  }
                  value={editState?.discountValue}
                ></TextField>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSubmit()} color="primary" autoFocus>
            Sumbit
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
