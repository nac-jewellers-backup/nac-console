import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Query, withApollo } from "react-apollo";
import {
  PRODUCTLIST,
  PRODUCTCATEGORY,
  PRODUCTFILTERMASTER,
  PRODUCTLISTSTATUSEDIT,
} from "../../graphql/query";

import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Product from "../../components/Products";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FullLoader from "../../components/Loader";
import { ProductFilter } from "../../components";
import { NetworkContext } from "../../context/NetworkContext";
import ProductSync from "./ProductSync";

export const Productlist = withRouter(
  withApollo((props) => {
    const [masters, setMasters] = useState({});
    const [filterparams, setFilterparams] = useState({});
    const [dataCSV, setDataCSV] = useState({ keyCSV: [], valueCSV: [] });
    const { sendNetworkRequest } = React.useContext(NetworkContext);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    let responseCSV;
    function onFilter(filterobj) {
      let filtercontent = {};

      if (filterobj.product_category) {
        filtercontent["categoryname"] = filterobj.product_category.name;
        // alert(JSON.stringify(categoryname))
      }
      if (filterobj.product_type) {
        filtercontent["product_type"] = filterobj.product_type.name;
        // alert(JSON.stringify(categoryname))
      }
      setFilterparams({
        ...filterparams,
        ...filtercontent,
      });
      // fetchadminusers()
    }
    function onSearch(searchtext) {
      //  alert(searchtext)
      setFilterparams({
        ...filterparams,
        searchtext,
      });
      // fetchadminusers()
    }
    useEffect(() => {
      const query = props.client.query;
      query({
        query: PRODUCTFILTERMASTER,
        fetchPolicy: "network-only",
      })
        .then((data) => {
          if (data) {
            let product_categories = data.data.allMasterProductCategories.nodes;
            let product_types = data.data.allMasterProductTypes.nodes;
            setMasters({
              product_categories,
              product_types,
            });
          } else {
          }
        })
        .catch((error) => {
          console.log("smbcj");
        });

      // async function fetchCSVdata() {
      //   responseCSV = await sendNetworkRequest("/productdetails", {}, {});
      //   let responseData = responseCSV.res_json;

      //   if (responseCSV.statuscode === 200) {
      //     let keyData = [];

      //     for (const [key] of Object.entries(responseData[0])) {
      //       keyData.push({ label: key, key: key });
      //     }

      //     console.log(keyData);
      //     setDataCSV({ ...dataCSV, keyCSV: keyData, valueCSV: responseData });
      //   }
      // }
      // fetchCSVdata();
    }, []);

    return (
      <Grid container spacing={2}>
        <Grid container item xs={12} sm={12} alignItems={"flex-end"}>
          <Grid fullwidth item xs={6} sm={6}>
            <Typography component="h6" variant="h6">
              Products
            </Typography>
          </Grid>

          <Grid fullwidth item xs={6} sm={6} style={{ "text-align": "right" }}>
            <Link underline="none" component={RouterLink} to={"/productupload"}>
              <Button variant="contained" color="primary">
                Add New Product
              </Button>
            </Link>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              style={{ marginLeft: 2 }}
            >
              Product Sync
            </Button>
          </Grid>
        </Grid>
        <ProductFilter
          masters={masters}
          onSearch={onSearch}
          onFilter={onFilter}
          dataCSV={dataCSV}
        />
        <Product filterparams={filterparams} />
        <ProductSync open={open} handleClose={handleClose} />
      </Grid>
    );
  })
);

export default Productlist;
