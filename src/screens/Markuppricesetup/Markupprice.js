import React, { useEffect, useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import { Query, withApollo } from "react-apollo";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Product from "./components/Product";
import Diamonds from "./components/Diamonds";
import Gemstones from "./components/Gemstones";
import Makingcharge from "./components/Makingcharge";
import { API_URL, GRAPHQL_DEV_CLIENT } from "../../config";
import {
  VENDORLIST,
  MASTERCATEGORY,
  PRODUCTDIAMONDTYPES,
} from "../../graphql/query";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Chip, TextField } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({}));
export const Markupprice = withRouter((props) => {
  const [vendorcode, setVendorcode] = React.useState(0);
  const [vendorlist, setVendorlist] = React.useState(0);
  const [categorylist, setCategorylist] = React.useState([]);
  const [producttypes, setProducttypes] = React.useState([]);
  const [materiallist, setMateriallist] = React.useState([]);
  const [puritylist, setPuritylist] = React.useState([]);
  const [isadd, setIsadd] = React.useState(false);

  const classes = useStyle();

  const handlevendorchange = (type) => (event, value) => {
    setVendorcode(value.shortCode);
  };
  useEffect(() => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: MASTERCATEGORY, variables: {} }),
    };
    // console.log("helo",setProductCtx)
    fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        setCategorylist(fatchvalue.data.allMasterProductCategories.nodes);
        setProducttypes(fatchvalue.data.allMasterProductTypes.nodes);
        setMateriallist(fatchvalue.data.allMasterMaterials.nodes);
        setPuritylist(fatchvalue.data.allMasterMetalsPurities.nodes);
        // setVendorlist({
        //   ...vendorlist,
        //   vendors : fatchvalue.data.allMasterVendors.nodes
        // })
      })
      .catch(console.error);
  }, []);

  return (
    <Grid container spacing={1}>
      {/* <Grid item xs={12} sm={12}>

          <Typography component="h6" variant="h6">
            Vendor Based Price List
          </Typography>
          </Grid>

          <Grid item xs={4} sm={4}>

                    <Autocomplete
                      id="free-solo-2-demo"
                      fullWidth
                      disableClearable
                      className={classes.fixedTag}
                      getOptionLabel={option => option.name}
                      options={vendorlist.vendors}
                      onChange={handlevendorchange('vendor')}
                      renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" size="small" label={option.name} {...getTagProps({ index })} />
                      ))
                      }
                      renderInput={params => (
                      <TextField
                      {...params}
                      label="Product Materials"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      InputProps={{ ...params.InputProps, readOnly: true, type: 'search' }}
                      />
                      )}
                      />
    </Grid> */}

      <Grid item xs={12} sm={12}>
        <Product
          categories={categorylist}
          producttypes={producttypes}
          materiallist={materiallist}
          puritylist={puritylist}
          vendor={"Gold"}
        />
      </Grid>
      {/* <Grid item xs={12} sm={12}>

          <Typography component="h6" variant="h6">
          Gem Stone Markup Setup
          </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>

          <Product vendor={"Gem Stone"} />
          </Grid>
          <Grid item xs={12} sm={12}>

          <Typography component="h6" variant="h6">
          Gold Markup Setup
          </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>

          <Product vendor={"Gold"} />
          </Grid>
          <Grid item xs={12} sm={12}>

          <Typography component="h6" variant="h6">
          Making Charge Markup Setup
          </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>

          <Product vendor={"Making Charge"} />
          </Grid> */}
      {/* <Grid item xs={12} sm={12}>
    <Typography component="h6" variant="h6">
           Diamond Price Setup
          </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>

    <Diamonds />
    </Grid> */}

      {/* <Grid item xs={12} sm={12}>
    <Typography component="h6" variant="h6">
           Gemstone Price Setup
          </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>

  <Gemstones /> 
    </Grid> */}

      {/* 
    <Grid item xs={12} sm={12}>
    <Typography component="h6" variant="h6">
           Makingcharge Price Setup
          </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>

    <Makingcharge />
    </Grid> */}
    </Grid>
  );
});

export default withApollo(withRouter(Markupprice));
