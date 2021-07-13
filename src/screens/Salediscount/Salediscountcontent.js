import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { VoucherContext } from "../../context";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Chip, IconButton } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import RefreshIcon from "@material-ui/icons/Refresh";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import uuid from "uuid/v1";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { palette } from "../../theme";
import Page from "../../components/Page";
import {
  Header,
  Results,
  Products,
  AboutVoucher,
  VoucherComponent,
} from "./components";
import { Button, Grid, Typography } from "@material-ui/core";
import { NetworkContext } from "../../context/NetworkContext";
import FullLoader from "../../components/Loader";

const useStyles = makeStyles((theme) => ({
  root: {
    //  padding: theme.spacing(3)
  },
  aboutvoucher: {
    marginTop: theme.spacing(3),
  },
  results: {
    marginTop: theme.spacing(3),
  },
  productcontent: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    padding: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  },
  errorchip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.error.dark,
    textColor: theme.palette.white,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Salediscountcontent(props) {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [deletedids, setDeletedids] = useState([]);

  const [skus, setSkus] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [productattr, setProductattr] = useState({});
  const [productattrtext, setProductattrtext] = useState("");
  const [errorskus, setErrorskus] = useState([]);
  const [isloaded, setIsloaded] = useState(false);
  const [isshowpriceupdate, setIsshowpriceupdate] = useState(false);
  const [statusmessage, setStatusmessage] = useState("");
  const [titlecontent, setTitlecontent] = useState("");
  const [discount_id, setDiscount_id] = useState("");
  const [loadingtitle, setLoadingtitle] = useState("");

  const [attributeobj, setAttributeobj] = useState({});
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [snackMessage, setSnackMessage] = React.useState({
    message: "Created Successfully",
    severity: "Success",
  });

  const { voucherCtx, setVoucherCtx, materialMaster } =
    React.useContext(VoucherContext);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  async function getdiscountvalue(discount_id) {
    let bodydata = {
      discountid: discount_id,
    };
    let response = await sendNetworkRequest(
      "/getdiscount",
      {},
      bodydata,
      false
    );
    let comparr = [];
    let displyarr = [];
    response.discunt.components.forEach((comp) => {
      comparr.push({
        name: comp,
      });
    });
    // alert(JSON.stringify(response.discunt))

    // alert(Object.keys(response.discunt.product_attributes))

    setProducts(response.discunt.product_ids);
    setAttributeobj({
      ...setAttributeobj,
      discountname: response.discunt.discount_name,
      discountvalue: response.discunt.discount_value,
      discounttype: response.discunt.discount_type,
      discounttitle: response.discunt.discount_title,
      componenets: comparr,
      skucount: response.discunt.product_ids.length,
      displaycomp: response.discunt.components,
      attributes: response.discunt.product_attributes,
      allkeys: Object.keys(response.discunt.product_attributes),
    });
    setIsloaded(true);
  }
  async function creatediscount(ispricerun) {
    let skuarray = [];
    while (skus.length > 0) {
      let sku_content = skus.splice(0, 25000);
      skuarray.push(sku_content);
    }
    if (errorskus.length > 0) {
      alert("Some skus are overlapping");
    } else {
      let discount_count = 0;
      setIsloading(true);
      updatediscount(discount_count);
      async function updatediscount() {
        let bodydata = {
          discountvalue: parseFloat(attributeobj.discountvalue),
          discounttype: attributeobj.discounttype,
          componenets: attributeobj.componenets,
          discountname: attributeobj.discountname,
          discounttitle: attributeobj.discounttitle,
          product_attributes: productattr,
          product_attributes_text: productattrtext,
          skus: skuarray[discount_count],
        };
        console.log(JSON.stringify(productattr));
        let response = await sendNetworkRequest(
          "/creatediscount",
          {},
          bodydata,
          false
        );

        discount_count = discount_count + 1;
        if (skuarray.length > discount_count) {
          setLoadingtitle(skus.length + " Left");
          updatediscount(discount_count);
        } else {
          setIsloading(false);
          setOpen(true);
          setIsshowpriceupdate(false);

          window.location = "/salediscountlist";
        }
      }
    }
  }
  const handleDelete = (chipToDelete) => () => {
    //setProducts([])
    let errorindex = errorskus.indexOf(chipToDelete);
    if (errorindex > -1) {
      errorskus.splice(errorindex, 1);
      var erroritems = [];
      errorskus.forEach((itemname) => {
        erroritems.push(itemname);
      });
      setErrorskus(erroritems);
    }
    let index = products.indexOf(chipToDelete);
    products.splice(index, 1);
    var items = [];
    products.forEach((itemname) => {
      items.push(itemname);
    });
    setProducts(items);

    //setProducts(porudcts)  //setProducts(chips => chips.filter(chip => chip.key !== chipToDelete.key));
  };

  async function filterapllied(value) {
    var bodydata = {};

    let product_ids = [];
    let response = await sendNetworkRequest(
      "/getaliasproduct",
      {},
      value,
      false
    );
    setProducts(response.products);
    setSkus(response.skus);
    setErrorskus(response.eror_skus);
    setIsloading(false);
    setTitlecontent(response.title);
  }
  async function updateprices() {
    alert("i am here");
    var bodydata = {};
    bodydata = {
      pricingcomponent: "updateskuprice",
      req_product_id: products,
    };
    setIsshowpriceupdate(true);

    let response = await sendNetworkRequest(
      "/productpriceupdate",
      {},
      bodydata,
      false
    );
  }
  async function handlestatus(e) {
    let bodydata = {
      component: "updateskuprice",
    };
    let response = await sendNetworkRequest(
      "/getcomponentpricestatus",
      {},
      bodydata,
      false
    );

    setStatusmessage(response.message);
  }
  function attributeadded(value) {
    let componentsstring = {};
    let attrs = [];
    let display_arr = [];
    let keys = Object.keys(value);
    keys.forEach((key) => {
      let values = [];
      let alias_arr = [];
      value[key].forEach((valueobj) => {
        values.push(valueobj.name);
        alias_arr.push(valueobj.alias);
        attrs.push(valueobj.name);
      });
      componentsstring[key] = {
        values: values,
        alias: alias_arr,
      };
      let displaytext = key + " : " + attrs.join(" , ");
      display_arr.push(displaytext);
    });
    setProductattr(componentsstring);
    setProductattrtext(display_arr.join(" | "));
    //alert(JSON.stringify(componentsstring))
    setIsloading(true);
    //setAttributeobj(value)
    filterapllied(value);
  }
  function valuechange(type, value) {
    setAttributeobj({
      ...attributeobj,
      [type]: value,
    });
  }
  useEffect(() => {
    let mounted = true;
    const fetchOrders = () => {};
    fetchOrders();
    if (
      props.location.pathname &&
      props.location.pathname.split("/").length > 2
    ) {
      let discount_id = props.location.pathname.split("/")[2];
      setDiscount_id(discount_id);
      getdiscountvalue(discount_id);
    } else {
      setIsloaded(true);
    }
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <FullLoader title={loadingtitle} isopen={isloading} />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackMessage.severity}>
          {snackMessage.message}
        </Alert>
      </Snackbar>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Page className={classes.root} title="Orders Management List">
          {!discount_id ? (
            <>
              <VoucherComponent
                onAdded={attributeadded}
                className={classes.aboutvoucher}
              />
              {products.length > 0 ? (
                <Products title={titlecontent} products={errorskus} />
              ) : null}
              {/* <Paper className={classes.productcontent}>
     <Typography variant="h5" component="h2">
        {products.length} Products and {skus.length} skus
      </Typography>

     
    </Paper> 
    {products.map(data => (
        <Chip
        key={data}
        label={data}
        variant="outlined"
        color={errorskus.indexOf(data) > -1 ?  "secondary" : "primary"}
        onDelete={handleDelete(data)}
        className={classes.chip}
      />

      
      ))} */}
              {isloaded || !discount_id ? (
                <AboutVoucher
                  discountcontent={attributeobj}
                  className={classes.aboutvoucher}
                  onAdded={valuechange}
                  categories={["Fixed Amount", "percentage"]}
                />
              ) : null}

              {/* <ProductsListing className={classes.aboutvoucher}  products={[]} /> */}

              <Grid
                container
                xs={12}
                spacing={2}
                style={{ textAlign: "center" }}
              >
                <Grid
                  item
                  xs={12}
                  style={{ marginTop: 16, textAlign: "center" }}
                  spacing={2}
                >
                  {!isshowpriceupdate ? (
                    <>
                      <Button
                        onClick={() => creatediscount(false)}
                        color="primary"
                        style={{ margin: 16 }}
                        variant="contained"
                      >
                        Submit
                      </Button>

                      {/* <Button onClick={() => creatediscount(true)} color="primary" variant="contained">Create and Price Run</Button> */}
                    </>
                  ) : null}
                </Grid>
              </Grid>
            </>
          ) : (
            <Grid container xs={12} spacing={2}>
              <Grid item xs={6} style={{ marginTop: 16 }}>
                <Grid item xs={12} style={{ marginTop: 16 }}>
                  <Typography variant="body2" component="body2">
                    Discount Name
                  </Typography>
                  <Typography variant="h5" component="h5">
                    {attributeobj.discountname}
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ marginTop: 16 }}>
                  <Typography variant="body2" component="body2">
                    Discount Title
                  </Typography>
                  <Typography variant="h5" component="h5">
                    {attributeobj.discounttitle}
                  </Typography>
                </Grid>
                <Grid item xs={6} style={{ marginTop: 16 }}>
                  <Typography variant="body2" component="body2">
                    Discount Value
                  </Typography>
                  <Typography variant="h5" component="h5">
                    {attributeobj.discounttype == 2
                      ? attributeobj.discountvalue + "%"
                      : attributeobj.discountvalue}
                  </Typography>
                </Grid>
                <Grid item xs={6} style={{ marginTop: 16 }}>
                  <Typography variant="body2" component="body2">
                    Pricing Compponent
                  </Typography>
                  <Typography variant="h5" component="h5">
                    {attributeobj.displaycomp}
                  </Typography>
                </Grid>
              </Grid>

              {attributeobj.allkeys ? (
                <Grid item xs={6} style={{ marginTop: 16 }}>
                  {attributeobj.allkeys.map((row, index) => (
                    <Grid item xs={12} style={{ marginTop: 16 }}>
                      <Typography variant="body2" component="body2">
                        {row}
                      </Typography>
                      <Typography variant="h5" component="h5">
                        {attributeobj.attributes[row].values}
                      </Typography>
                    </Grid>
                  ))}
                  <Grid item xs={12} style={{ marginTop: 16 }}>
                    <Typography variant="body2" component="body2">
                      Total Sku
                    </Typography>
                    <Typography variant="h5" component="h5">
                      {attributeobj.skucount}
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}
              <Grid item xs={12} style={{ marginTop: 16, textAlign: "center" }}>
                {!isshowpriceupdate ? (
                  <>
                    {/* <Button onClick={() => updateprices()} color="primary" variant="contained">Price Run</Button> */}
                  </>
                ) : (
                  <>
                    {" "}
                    {statusmessage}
                    <IconButton
                      aria-label="delete"
                      onClick={(e) => handlestatus()}
                      color="primary"
                    >
                      <RefreshIcon />
                    </IconButton>
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </Page>
      </MuiPickersUtilsProvider>
    </>
  );
}
