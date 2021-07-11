import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { VoucherContext } from "../../../../context";
import { DateTimePicker } from "@material-ui/pickers";
import { makeid } from "../../../../utils/commonmethod";
import { Autocomplete } from "@material-ui/lab";
import { NetworkContext } from "../../../../context/NetworkContext";

import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Popper,
  Chip,
  CardActionArea,
  CardActions,
  Radio,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Divider,
  colors,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  option: {
    border: `1px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "flex-center",
    padding: theme.spacing(1),

    cursor: "pointer",
    "& + &": {
      marginLeft: theme.spacing(2),
    },
  },
  metaloption: {
    border: `1px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "flex-center",
    padding: theme.spacing(1),
    cursor: "pointer",
    "& + &": {
      marginLeft: theme.spacing(2),
    },
  },
  cardcontent: {
    display: "flex",
    alignItems: "flex-center",
  },
  selectedOption: {
    backgroundColor: theme.palette.primary.main,
    // border: `3px solid ${theme.palette.divider}`,
  },
  selectedOptiondefault: {
    backgroundColor: theme.palette.common.white,
    // border: `3px solid ${theme.palette.divider}`,
  },
  optionRadio: {
    margin: -10,
  },
  margin: {
    marginTop: theme.spacing(2),
  },
  optionDetails: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
  optionmaterialDetails: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  selectedtext: {
    color: theme.palette.common.white,
  },
}));

const AboutVoucher = (props) => {
  const { className, ...rest } = props;
  const { voucherCtx, setVoucherCtx } = React.useContext(VoucherContext);
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [vendorlist, setVendorlist] = useState(props.masterData.vendorcode);
  const [categorylist, setCategorylist] = useState(props.masterData.category);
  const [producttypelist, setProducttypelist] = useState(
    props.masterData.product_type
  );
  const [productids, setProductids] = useState(props.productids);

  const [updatestatus, setUpdatestatus] = useState("");

  const [vouchercode, setVouchercode] = useState("");
  const [discounttype, setDiscounttype] = useState("");
  const [minreq, setMinreq] = useState("None");
  const [usagelimit, setUsagelimit] = useState("once");
  const [formData, setFormData] = useState({});

  const [isonce, setIsonce] = useState(false);

  const classes = useStyles();

  const [selected, setSelected] = useState(1);
  const [selectedDate, handleDateChange] = useState(new Date());

  const handleChange = (event, option) => {
    setSelected(option);
  };

  const handleproducttypechange = (type) => (event, option) => {
    let vendorsarray = [];
    option.forEach((element) => {
      vendorsarray.push(element.name);
    });
    setFormData({ ...formData, producttypes: vendorsarray });
    props.apply(formData.vendorid, formData.categories, vendorsarray);
  };
  const handlecategorychange = (type) => (event, option) => {
    let vendorsarray = [];
    option.forEach((element) => {
      vendorsarray.push(element.name);
    });
    setFormData({ ...formData, categories: vendorsarray });

    props.apply(formData.vendorid, vendorsarray, formData.producttypes);
  };
  const hangeoptionchange = (type) => (event, option) => {
    let vendorsarray = [];
    option.forEach((element) => {
      vendorsarray.push(element.shortCode);
    });
    setFormData({ ...formData, vendorid: vendorsarray });

    props.apply(vendorsarray, formData.categories, formData.producttypes);
  };

  const handleClick = async (event, option) => {
    let response = await sendNetworkRequest(
      "/updatepricelist",
      {},
      formData,
      false
    );
    if (response.status < 400) {
    } else {
      alert("error");
    }
  };
  const handleuploadstatus = async (event, option) => {
    let response = await sendNetworkRequest(
      "/getpriceupdatestatus",
      {},
      formData,
      false
    );
    if (response.status < 400) {
      setUpdatestatus(response.message);
    } else {
    }
  };
  const handleusagelimit = (event, option) => {
    setUsagelimit(option);
  };
  const handleInputChange = (type) => (e) => {
    setVouchercode(e.target.value.toUpperCase());
  };
  const handleminreq = (event, option) => {
    setMinreq(option);
  };
  const handleonceperorder = (event, option) => {
    setIsonce(!isonce);
  };
  const generateCoupon = (event) => {
    // alert(JSON.stringify(voucherCtx))
    setVouchercode(makeid(10));
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="General Information" />
      <Divider />
      <CardContent className={classes.cardcontent}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4}>
            <Autocomplete
              multiple
              id="combo-box-demo"
              disabled={props.isdisabled}
              options={props.vendorlist || []}
              getOptionLabel={(option) => option.display}
              fullWidth
              onChange={hangeoptionchange("vendorcode")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selct Vendor"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <Autocomplete
              multiple
              id="combo-box-demo"
              disabled={props.isdisabled}
              options={props.categorylist || []}
              getOptionLabel={(option) => option.name}
              onChange={handlecategorychange("category")}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Product Category"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <Autocomplete
              multiple
              id="combo-box-demo"
              disabled={props.isdisabled}
              options={props.producttypelist || []}
              getOptionLabel={(option) => option.name}
              onChange={handleproducttypechange("product_type")}
              fullWidth
              margin="dense"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Product type"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="free-solo-2-demo"
              multiple
              disabled={props.isdisabled}
              className={classes.fixedTag}
              value={props.productids}
              options={productids}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    size="small"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    props.productids.length > 0
                      ? "Products (" + props.productids.length + ") "
                      : "Products"
                  }
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  InputProps={{ ...params.InputProps, type: "search" }}
                />
              )}
            />
          </Grid>

          {/* <Grid item xs={6} sm={3} >

        <Button variant="contained" 
          onClick={handleClick}
        color="primary">
        Update Price
      </Button>
      </Grid>
      
      <Grid item xs={6} sm={3} >

        <Button variant="contained" 
          onClick={handleuploadstatus}
        color="primary">
        Update Status
      </Button>
      <Typography variant="subtitle1">
                {updatestatus}
      </Typography>

      </Grid> */}
          {/* <Grid item xs={6} sm={3} >
      <Button variant="contained" 
          onClick={handleuploadstatus}
        color="primary">
        Price Update
      </Button>
       
      </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  );
};

AboutVoucher.propTypes = {
  className: PropTypes.string,
};

export default AboutVoucher;
