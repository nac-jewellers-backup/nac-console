import React, { useEffect, useState } from "react";
import { AlertContext } from "../../context";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { Button, Link } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import Page from "../../components/Page";
import { Results, AboutVoucher } from "./components";
import { productCategory } from "../../services/mapper";
import { NetworkContext } from "../../context/NetworkContext";
import FullLoader from "../../components/Loader";
const rows = [
  { id: "Markup & Discount price update", label: "updateskuprice" },
];
const useStyles = makeStyles((theme) => ({
  root: {},
  aboutvoucher: {
    marginTop: theme.spacing(3),
  },
  results: {
    marginTop: theme.spacing(3),
  },
}));

export default function PriceupdateContent(props) {
  const classes = useStyles();

  const [masters, setMasters] = useState([]);
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const snack = React.useContext(AlertContext);
  const [products, setProducts] = useState([]);
  const [, setCategories] = useState([]);
  const [, setVendors] = useState([]);
  const [startrun, setStartrun] = useState(false);
  const [open, setOpen] = useState(false);

  async function updateprices(component) {
    if (products.length) {
      setOpen(true);
      var bodydata = {};
      bodydata = {
        component: component.label,
        product_sku: products,
      };
      setStartrun(true);
      let response = await sendNetworkRequest(
        "/price_run_latest",
        {},
        bodydata,
        false
      );
      if (response.statuscode == 200) {
        snack.setSnack({
          open: true,
          msg: response.message,
        });
      } else {
        snack.setSnack({
          open: true,
          severity: "error",
          msg: "Something went wrong, Please try later!",
        });
      }
      setOpen(false);
    } else {
      snack.setSnack({
        open: true,
        severity: "error",
        msg: "Apply filter to load products!",
      });
    }
  }
  async function rerun(component) {
    var bodydata = {};
    bodydata = {
      component: component.label,
    };
    let response = await sendNetworkRequest(
      "/getincompletepricerun",
      {},
      bodydata,
      false
    );
    let history_id = response.id;
    let update_products = response.products;
    if (response.products && response.products.length > 0) {
      setOpen(true);

      var bodydata = {};
      bodydata = {
        pricingcomponent: component.label,
        req_product_id: update_products,
        history_id: history_id,
      };
      setStartrun(true);
      let response1 = await sendNetworkRequest(
        "/productpriceupdate",
        {},
        bodydata,
        false
      );
      setOpen(false);
    } else {
      alert(" Doesn't have any incomplete products");
    }
  }

  async function filterapllied(filterdata, categories, producttypes) {
    var bodydata = {};

    bodydata = {
      vendorid: filterdata && filterdata.length > 0 ? filterdata : "",
      product_category: categories && categories.length > 0 ? categories : "",
      product_type: producttypes && producttypes.length > 0 ? producttypes : "",
    };

    let response = await sendNetworkRequest(
      "/getdistinctproduct",
      {},
      bodydata,
      false
    );
    setProducts(response.products);
    setCategories(response.category);
    setVendors(response.vendorlist);
  }
  async function downloadlog() {
    window.location.href = "https://api-staging.stylori.com/getlogfile";
  }

  useEffect(() => {
    let mounted = true;

    setMasters(productCategory.mapper(props.data));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Page className={classes.root} title="Orders Management List">
        <FullLoader title={"Running Price Update"} isopen={open}></FullLoader>
        <AboutVoucher
          isdisabled={startrun}
          className={classes.aboutvoucher}
          apply={filterapllied}
          productids={products.length > 0 ? products : []}
          categorylist={masters.category}
          producttypelist={masters.product_type}
          vendorlist={masters.vendorcode}
          masterData={masters}
          categories={["Fixed Amount", "percentage", "Free Shipping"]}
        />
        <Results
          products={products}
          pricingrows={rows}
          downloadlog={downloadlog}
          update={updateprices}
          resumeupdate={rerun}
        />
        <div
          style={{
            padding: "12px 0px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link href="/price-logs">
            <Button color="primary" variant="contained">
              Price History Logs
            </Button>
          </Link>
        </div>
      </Page>
    </MuiPickersUtilsProvider>
  );
}
