import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import { useContext } from "react";
import { TableComp } from "../../../components";
import { AlertContext } from "../../../context";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { UploadImage } from "../../../utils/imageUpload";

const header = [
  "S.No",
  "Title",
  "Image",
  "SkuUrl",
  "Price",
  "Offer Price",
  "Action",
];
const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "TEXT", name: "title" },
  { type: "WEB_IMAGE", name: "img" },
  { type: "TEXT", name: "skuUrl", width: "250px" },
  { type: "TEXT", name: "price" },
  { type: "TEXT", name: "offerPrice" },
  { type: "ACTION", name: "" },
];

const initialState = {
  price: null,
  offerPrice: null,
  title:null,
  save: 0,
  image: {
    placeImage: {
      img: null,
    },
    hoverImage: {
      img: null,
    },
  },
  productId: null,
  diamondType: "",
  purity: "",
  productType: "",
  skuId: null,
  skuID: null,
  skuUrl: null,
  description: null,
};

const initialEdit = {
  isEdit: false,
  editIndex: null,
};

const SlidingImageCardCMS = (props) => {
  const classes = useStyles();
  const alert = useContext(AlertContext);
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(initialState);
  const [constructedData, setConstructedData] = React.useState([]);
  const [editData, setEditData] = React.useState(initialEdit);

  React.useEffect(() => {
    const dataConstruct = props?.data?.props?.listingProducts?.map((val, i) => {
      return {
        ...val,
        img: val?.image?.placeImage?.img,
      };
    });
    setConstructedData(dataConstruct);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setState(initialState);
    setEditData(initialEdit);
  };

  const onChangeData = (event) => {
    if (event.target.name === "skuId") {
      setState({
        ...state,
        skuID: event.target.value,
        skuId: event.target.value,
      });
    } else {
      setState({
        ...state,
        [event.target.name]: event.target.value,
      });
    }
  };

  const validate = () => {
    if (
      state.title &&
      state.description &&
      state.skuUrl &&
      state.image.hoverImage.img &&
      state.image.placeImage.img &&
      state.price &&
      state.offerPrice &&
      state.productId &&
      state.skuID &&
      state.skuId
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onsubmitvalue = async () => {
    if (validate()) {
      if (editData.isEdit) {
        const listingProducts = props?.data?.props?.listingProducts;
        listingProducts.splice(editData.editIndex, 1, state);
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            listingProducts: listingProducts,
          },
        };
        const dataConstruct = getData.props?.listingProducts?.map((val, i) => {
          return {
            ...val,
            img: val?.image?.placeImage?.img,
          };
        });
        setConstructedData(dataConstruct);
        setOpen(false);
        props.handleSubmit(getData, "SlideImgMediaCard", "listingProducts");
      } else {
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            listingProducts: [...props?.data?.props?.listingProducts, state],
          },
        };
        const dataConstruct = getData.props?.listingProducts?.map((val, i) => {
          return {
            ...val,
            img: val?.image?.placeImage?.img,
          };
        });
        setConstructedData(dataConstruct);
        setOpen(false);
        props.handleSubmit(getData, "SlideImgMediaCard", "listingProducts");
      }
    } else {
      alert.setSnack({
        open: true,
        severity: "error",
        msg: "Please fill all the fields in the form ",
      });
    }
  };

  const handleEdit = (e, rowData, rowIndex) => {
    handleClickOpen();
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setState(rowData);
  };

  const handleChange = (file, name) => {
    UploadImage(file)
      .then((res) => {
        if (res?.data?.web) {
          setState({
            ...state,
            image: {
              placeImage: {
                img: res?.data?.web,
              },
              hoverImage: {
                img: res?.data?.web,
              },
            },
          });
          alert.setSnack({
            open: true,
            severity: "success",
            msg: "Image Uploaded Successfully",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (e, rowData, rowIndex) => {
    let getData = [];
    const listingProducts = props?.data?.props?.listingProducts;
    listingProducts.splice(rowIndex, 1);
    getData = {
      component: props?.data?.component,
      props: {
        listingProducts: listingProducts,
      },
    };
    const dataConstruct = getData.props?.listingProducts?.map((val, i) => {
      return {
        ...val,
        img: val?.image?.placeImage?.img,
      };
    });
    setConstructedData(dataConstruct);
    props.handleSubmit(getData, "SlideImgMediaCard", "listingProducts");
  };

  return (
    <Paper className={classes.root}>
      <TableHeaderComp
        name={"Sliding Image Component"}
        handleAddNew={handleClickOpen}
      />
      <TableComp
        header={header}
        tableData={tableData}
        data={constructedData}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <Dialog
        classes={{ paper: classes.dialogPaperMid }}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="form-dialog-title">
          Edit Sliding Image Card Component
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            variant="outlined"
            fullWidth
            onChange={onChangeData}
            value={state.title}
            name="title"
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            onChange={onChangeData}
            value={state.description}
            name="description"
          />
          <TextField
            autoFocus
            margin="dense"
            id="skuUrl"
            label="SKU Url"
            variant="outlined"
            fullWidth
            onChange={onChangeData}
            value={state.skuUrl}
            name="skuUrl"
          />
          <Grid
            container
            justifyContent="flex-start"
            style={{ padding: "16px 0px" }}
          >
            <Grid item>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="button-file"
                multiple
                type="file"
                onChange={(e) => handleChange(e.target.files[0], "mobile")}
              />
              <label htmlFor="button-file">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  // disabled={disableButton.mobile}
                >
                  Image Upload
                </Button>
              </label>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <TextField
                autoFocus
                margin="dense"
                id="skuId"
                label="SKU ID"
                variant="outlined"
                fullWidth
                onChange={onChangeData}
                value={state.skuId}
                name="skuId"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                autoFocus
                margin="dense"
                id="productId"
                label="Product ID"
                variant="outlined"
                fullWidth
                onChange={onChangeData}
                value={state.productId}
                name="productId"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                autoFocus
                margin="dense"
                id="price"
                label="Price"
                variant="outlined"
                fullWidth
                onChange={onChangeData}
                value={state.price}
                name="price"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                autoFocus
                margin="dense"
                id="offerPrice"
                label="Offer Price"
                variant="outlined"
                fullWidth
                onChange={onChangeData}
                value={state.offerPrice}
                name="offerPrice"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onsubmitvalue}>Add</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SlidingImageCardCMS;
