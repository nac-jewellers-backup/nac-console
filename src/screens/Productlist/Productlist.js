import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { withApollo } from "react-apollo";
import { PRODUCTFILTERMASTER } from "../../graphql/query";

import Link from "@material-ui/core/Link";
import Product from "../../components/Products";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { ProductFilter } from "../../components";
import ProductSync from "./ProductSync";

export const Productlist = withRouter(
  withApollo((props) => {
    const [masters, setMasters] = useState({});
    const [filterparams, setFilterparams] = useState({});

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

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
            <Link underline="none">
              <Button variant="contained" color="primary" disabled>
                Add New Product
              </Button>
            </Link>
            <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginLeft: 2 }}>
              Product Sync
            </Button>
          </Grid>
        </Grid>
        <ProductFilter masters={masters} onSearch={onSearch} onFilter={onFilter} />
        <Product filterparams={filterparams} />
        <ProductSync open={open} handleClose={handleClose} />
      </Grid>
    );
  })
);

export default Productlist;
