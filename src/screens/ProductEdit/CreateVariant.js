import React, { useState } from "react";
import {
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { ProductContext, ProductProvider } from "../../context";
import axios from "axios";
import CardMedia from "@material-ui/core/CardMedia";
import { API_URL } from "../../config";
import { isString } from "util";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
import FilePondPluginFileRename from "filepond-plugin-file-rename";
import { NetworkContext } from "../../context/NetworkContext";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { Chip } from "@material-ui/core";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageValidateSize,
  FilePondPluginFileRename
);
const useStyle = makeStyles((theme) => ({
  helperinput: {
    "& .MuiFormHelperText-root": {
      color: "#e53935",
    },
  },
  variantFontSize: {
    fontSize: ".9rem",
  },
  variantMarginTop: {
    marginTop: "20px",
  },
}));
export function CreateVariant(props) {
  const classes = useStyle();
  let prod_id = props.productId;
  let colors = [];
  let purities = [];
  let diamondtypes = [];
  let oldpurity = [];

  const TOKEN = "token";
  const { productCtx, setProductCtx } = React.useContext(ProductContext);
  const [metalcolor, setMetalcolor] = useState(productCtx.productMetalColor);
  productCtx.oldproductMetalColor.forEach((colorobj) => {
    colors.push(colorobj.productColor);
  });
  productCtx.oldproductMetalPurity.forEach((colorobj) => {
    purities.push(colorobj.purity);
    oldpurity.push(colorobj);
  });

  productCtx.oldproductDiamondTypesArray.forEach((diamondobj) => {
    diamondtypes.push(diamondobj.diamondType);
  });

  const [variant, setVariant] = useState({
    metal_color: [],
    metal_purity: [],
    diamond_color: [],
    diamond_clarity: [],
    variant_diamond_type: [],
    product_images: {},
    size: [],
  });

  function handleMetalColor(status_data) {
    let color = variant.metal_color;
    color.some((color_data) => color_data.id === status_data.id)
      ? (color = color.filter((color_fil) => color_fil.id !== status_data.id))
      : color.push(status_data);
    setVariant({
      ...variant,
      metal_color: color,
    });
  }
  const handleoptionChange = (type) => (event, value) => {
    let color_arr = [];
    value.map((color, index) => {
      if (
        productCtx.productMetalColor.some(
          (item) => item.productColor === color.productColor
        )
      ) {
      } else {
        let color_obj = {
          ...color,
          metal_color: color.productColor,
        };
        color_arr.push(color_obj);
      }
    });
    setVariant({
      ...variant,
      metal_color: color_arr,
    });

    setProductCtx({
      ...productCtx,
      [type]: value,
    });
  };
  const sendNetworkRequest = async (url, params, data, auth = false) => {
    alert(url);
    url = API_URL + url;
    console.info("URL", url, data);
    const method = data ? "POST" : "GET",
      headers = {
        "Content-Type": "application/json",
      };
    let resdata = null;
    if (auth) {
      const token = localStorage.getItem(TOKEN);
      if (token) headers["auth"] = token;
      else window.location = "/";
    }
    const response = await fetch(url, {
      method,
      body: isString(data) ? data : JSON.stringify(data),
      headers,
    });

    if (response.status < 400) {
      resdata = await response.json();
    } else {
      alert(
        `${response.status}:${response.statusText} - Unable to complete your request to \n${url}`
      );
    }
    return resdata;
  };

  const handleMetalPurity = (type) => (event, value) => {
    let purity_arr = [];
    setProductCtx({
      ...productCtx,
      [type]: value,
    });
    value.map((color, index) => {
      let color_obj = {
        ...color,
        purity: color.purity,
      };
      purity_arr.push(color_obj);
    });
    setVariant({
      ...variant,
      metal_purity: purity_arr,
    });
  };
  // function handleMetalPurity(status_data) {
  //     status_data.metal_weight = "";
  //     status_data.error_message = false;
  //     // alert(JSON.stringify(status_data));
  //     let purity = variant.metal_purity;
  //     purity.some(purity_data => purity_data.id === status_data.id) ? purity = purity.filter(purity_fil => purity_fil.id !== status_data.id) : purity.push(status_data)
  //     setVariant({
  //         ...variant,
  //         metal_purity: purity
  //     })
  // }
  const diamondTypeChange = (type) => (event, value) => {
    let diamondtype_arr = [];
    value.map((color, index) => {
      if (color.label) {
        let color_obj = {
          ...color,
          diamondType: color.label,
        };
        diamondtype_arr.push(color_obj);
      } else {
        let color_obj = {
          ...color,
          diamondType: color.diamondType,
        };
        diamondtype_arr.push(color_obj);
      }

      //   if(productCtx.productDiamondTypes.some(item => item.label === color.label)){
      //    }else{ let color_obj = {
      //         ...color,
      //         diamondType: color.label
      //     }
      //     diamondtype_arr.push(color_obj)
      //   }
    });
    setVariant({
      ...variant,
      variant_diamond_type: diamondtype_arr,
    });
    alert(JSON.stringify(value));
    setProductCtx({
      ...productCtx,
      [type]: diamondtype_arr,
    });
  };

  // function diamondTypeChange(status_data){
  //     let diamond__type = variant.variant_diamond_type;
  //     diamond__type.some(diamond_type_data => diamond_type_data.id === status_data.id) ? diamond__type = diamond__type.filter(diamond_type_fil => diamond_type_fil.id !== status_data.id) : diamond__type.push(status_data)
  //     setVariant({
  //         ...variant,
  //         variant_diamond_type: diamond__type
  //     })
  // }

  const sizeChange = (type) => (event, value) => {
    let size_arr = [];
    value.map((color, index) => {
      if (productCtx.productDiamondTypes.some((item) => item === color)) {
      } else {
        let color_obj = {
          ...color,
          label: color,
        };
        size_arr.push(color_obj);
      }
    });
    setVariant({
      ...variant,
      size: size_arr,
    });
  };
  // function sizeChange(status_data) {
  //     let variantSize = variant.size;
  //     variantSize.some(variant_size_data => variant_size_data === status_data) ? variantSize = variantSize.filter(variant_size_fil => variant_size_fil !== status_data) : variantSize.push(status_data)
  //     setVariant({
  //         ...variant,
  //         size: variantSize
  //     })

  // }

  function setMetalWeightInput(e, metalPurityId) {
    // alert(e.target.value)
    let metalWeight = variant.metal_purity;
    metalWeight =
      metalWeight &&
      metalWeight.map((metal_weight, index) => {
        if (metalPurityId === metal_weight.id) {
          metal_weight.metal_weight = e.target.value;
        }
        return metal_weight;
      });
    setVariant({
      ...variant,
      metal_purity: metalWeight,
    });
  }
  function saveCreateVariant() {
    let createVariant = {
      productId: prod_id,
      productMetalcoloursByProductId: variant.metal_color,
      productPuritiesByProductId: variant.metal_purity,
      productDiamondTypes: variant.variant_diamond_type,
      productSize: variant.size,
      product_images: variant.product_images,
      // productImage:variant.product_images
    };

    let metal_color_image_length = Object.entries(variant.product_images);
    let metal_purity_weight = false;
    let metal_purity =
      variant.metal_purity &&
      variant.metal_purity.map((metal_weight_check) => {
        if (metal_weight_check.metal_weight === "") {
          metal_weight_check.error_message = true;
          metal_purity_weight = true;
        }
        return metal_weight_check;
      });
    variant["metal_purity"] = metal_purity;
    setVariant({
      ...variant,
      variant,
    });
    if (metal_color_image_length.length !== variant.metal_color.length) {
      alert("Select Metal Color Images");
    }
    if (
      (variant.metal_color.length > 0 &&
        variant.metal_color.length === metal_color_image_length.length) ||
      (variant.metal_purity.length > 0 && metal_purity_weight === false) ||
      variant.size.length > 0 ||
      variant.variant_diamond_type.length > 0
    ) {
      let createVariants = productCtx.createVariantList;
      let editVariants = productCtx.editVariants;
      let variants = productCtx.variants;
      let productImages = productCtx.productImages;
      productImages = [...productImages, variant.product_images];
      createVariants.push(createVariant);
      let params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createVariant),
      };
    } else {
      alert("please fill the Create variant");
    }
  }
  function backToProductAttribute() {
    props.changeVariant();
  }
  async function uploadimagetoserver(
    bodaydata,
    imageposition,
    imagecolor,
    uploadtype
  ) {
    let prodimages = variant.product_images;
    // if(true)
    // {
    var prodid = prod_id;
    let imagecolourobj = variant.product_images[imagecolor];
    var imagecount = 1;
    if (imagecolourobj) {
      imagecount = imagecolourobj.length + 1;
    }

    let imagename = prodid + "_" + imagecount + imagecolor.charAt(0);
    let responsedata = await sendNetworkRequest(
      "/uploadimage",
      {},
      {
        image: bodaydata.fileExtension,
        filename: imagename,
        product_id: prodid,
      },
      false
    );
    var returnData =
      responsedata && responsedata.data && responsedata.data.returnData;
    var signedRequest = returnData && returnData.signedRequest;
    var url = returnData && returnData.url;
    console.log("responseurl" + url);
    var filepathname = returnData && returnData.filepath;
    var options = {
      headers: {
        "Content-Type": bodaydata.fileExtension,
        "Access-Control-Allow-Origin": "*",
      },
    };

    if (imagecolourobj) {
      const imageobj = {
        name: prodid + "_" + (imagecolourobj.length + 1) + imagecolor.charAt(0),
        position: imageposition,
        color: imagecolor,
        image_url: filepathname,
        url:
          "https://s3.ap-south-1.amazonaws.com/styloribaseimages/" +
          filepathname,
      };
      if (uploadtype === "edit") {
        imagecolourobj[imageposition] = imageobj;
      } else {
        imagecolourobj.push(imageobj);
      }
      prodimages[imagecolor] = imagecolourobj;
    } else {
      const imageobj = {
        name: prodid + "_1" + imagecolor.charAt(0),
        position: imageposition,
        color: imagecolor,
        image_url: filepathname,
        url:
          "https://s3.ap-south-1.amazonaws.com/styloribaseimages/" +
          filepathname,
      };
      imagecolourobj = [];
      imagecolourobj.push(imageobj);
    }
    prodimages[imagecolor] = imagecolourobj;
    setVariant({ ...variant, product_images: prodimages });
    // setFiles([])
    // }

    await axios.put(signedRequest, bodaydata.file, options);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={6} md={6} lg={6}>
        <Autocomplete
          multiple
          id="free-solo-2-demo"
          fullWidth
          margin="dense"
          className={classes.fixedTag}
          getOptionLabel={(option) => option.productColor}
          getOptionDisabled={(option) =>
            colors.indexOf(option.productColor) > -1
          }
          defaultValue={productCtx.oldproductMetalColor}
          options={productCtx.masterData.metalcolour}
          value={productCtx.productMetalColor}
          onChange={handleoptionChange("productMetalColor")}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                size="small"
                label={option.productColor}
                {...getTagProps({ index })}
                disabled={colors.indexOf(option.productColor) > -1}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Metal Colours"
              margin="dense"
              variant="outlined"
              fullWidth
              InputProps={{ ...params.InputProps, type: "search" }}
            />
          )}
        />
      </Grid>

      <Grid item xs={6} sm={6} md={6} lg={6}>
        {/* <Grid item>
                            <FormGroup row>
                                {
                                    productCtx.masterData && productCtx.masterData.metalpurity.map((data, index) => (

                                        productCtx.productMetalColor && productCtx.productMetalPurity.some((prod_metal_purity) => prod_metal_purity.purity === data.name) ?
                                            <FormControlLabel
                                                disabled
                                                control={
                                                    <Checkbox checked={true} value="checkedA" />
                                                }
                                                label={data.name}
                                            /> :
                                            <FormControlLabel
                                                control={
                                                    <Checkbox checked={variant.metal_purity && variant.metal_purity.some(met_purity => met_purity.id == data.id) ? true : false} onChange={() => handleMetalPurity(data)} value="checkedA" />
                                                }
                                                label={data.name}
                                            />

                                    ))
                                }
                            </FormGroup>
                            {
                                variant.metal_purity && variant.metal_purity.map(metal_purity => (
                                    <TextField
                                        className={classes.helperinput}
                                        style={{ width: "124px" }}
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth
                                        type="number"
                                        value={metal_purity.metal_weight}
                                        id="metal_weight"
                                        error={metal_purity && metal_purity.error_message }
                                        name="metal_weight"
                                        label={`Metal Weight${metal_purity.name}`}
                                        onChange={(e) => setMetalWeightInput(e, metal_purity.id)}
                                    />
                                ))
                            }
                        </Grid>
                     */}

        <Autocomplete
          multiple
          id="free-solo-2-demo"
          className={classes.fixedTag}
          margin="dense"
          getOptionLabel={(option) => option.name}
          getOptionDisabled={(option) => purities.indexOf(option.name) > -1}
          defaultValue={productCtx.oldproductMetalPurity}
          options={productCtx.masterData.metalpurity}
          value={productCtx.productMetalPurity}
          onChange={handleMetalPurity("productMetalPurity")}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                size="small"
                label={option.purity}
                {...getTagProps({ index })}
                disabled={purities.indexOf(option.purity) > -1}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Metal Purity"
              margin="dense"
              variant="outlined"
              fullWidth
              InputProps={{ ...params.InputProps, type: "search" }}
            />
          )}
        />

        {productCtx.productMetalPurity &&
          productCtx.productMetalPurity.map((metal_purity) => (
            <TextField
              key={metal_purity.id}
              className={classes.helperinput}
              style={{ width: "100px", marginLeft: "8px" }}
              variant="outlined"
              margin="dense"
              fullWidth
              type="number"
              value={metal_purity.metal_weight}
              id="metal_weight"
              error={metal_purity && metal_purity.error_message}
              name="metal_weight"
              label={`Weight ${metal_purity.purity}`}
              onChange={(e) => setMetalWeightInput(e, metal_purity.id)}
            />
          ))}
      </Grid>

      <Grid item xs={6} sm={6} md={6} lg={6}>
        <Autocomplete
          multiple
          id="free-solo-2-demo"
          className={classes.fixedTag}
          getOptionLabel={(option) => option.label}
          getOptionDisabled={(option) =>
            diamondtypes.indexOf(option.label) > -1
          }
          defaultValue={productCtx.oldproductDiamondTypesArray}
          options={productCtx.masterData.diamondtypes}
          value={
            productCtx.productDiamondTypesArray
              ? productCtx.productDiamondTypesArray
              : []
          }
          onChange={diamondTypeChange("productDiamondTypesArray")}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                size="small"
                label={option.diamondType}
                {...getTagProps({ index })}
                disabled={diamondtypes.indexOf(option.diamondType) > -1}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Diamond Types"
              margin="dense"
              variant="outlined"
              fullWidth
              InputProps={{ ...params.InputProps, type: "search" }}
            />
          )}
        />
      </Grid>

      <Grid item xs={6} sm={6} md={6} lg={6}>
        {productCtx.variant_size && productCtx.variant_size.length > 0 ? (
          <Autocomplete
            multiple
            id="free-solo-2-demo"
            className={classes.fixedTag}
            fullWidth
            getOptionLabel={(option) => option}
            options={productCtx.productVariantSize}
            value={productCtx.variant_size}
            onChange={sizeChange("productSizes")}
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
                label="Sizes"
                margin="dense"
                variant="outlined"
                fullWidth
                InputProps={{ ...params.InputProps, type: "search" }}
              />
            )}
          />
        ) : null}
      </Grid>

      {/* {
                    productCtx.diamondlist && productCtx.diamondlist.length>0 ?<Grid container className={classes.variantMarginTop}>
                    <Grid item>
                       
                        <Grid item>
                            <FormGroup row>
                            <Autocomplete
                    multiple
                    id="free-solo-2-demo"
                    className={classes.fixedTag}
                    getOptionLabel={option => option.label}
                    options={productCtx.masterData.diamondtypes}
                    defaultValue={productCtx.productDiamondTypes}
                    onChange={handleoptionChange('productMetalColor')}
                    renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                    <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })}  disabled={index < productCtx.productMetalColor.length}/>
                    ))
                    }
                    renderInput={params => (
                    <TextField
                    {...params}
                    label="Diamond Types"
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    InputProps={{ ...params.InputProps, type: 'search' }}
                    />
                    )}
                    />

                              
                            </FormGroup>
                        </Grid>
                    </Grid>
                </Grid> : ''
                } */}

      <Grid container>
        {variant.metal_color === undefined
          ? null
          : variant.metal_color.map((value, index) => (
              <Grid xs={12} container spacing={1} item>
                <Grid xs={12} item>
                  <Typography component="h6" variant="h6" align="left">
                    {value.productColor}
                  </Typography>
                </Grid>
                <Grid xs={12} sm={12} md={12} item>
                  <FilePond
                    allowImageValidateSize
                    imageValidateSizeMinWidth="2400"
                    imageValidateSizeMinHeight="2400"
                    imageValidateSizeMeasure={(file) =>
                      new Promise((resolve, reject) => {})
                    }
                    labelIdle="Upload Image"
                    allowMultiple={true}
                    //files = {files}
                    onupdatefiles={(fileItem) => {
                      // Set currently active file objectsfiles to this.state
                    }}
                    onaddfile={(error, fileItem) => {
                      uploadimagetoserver(fileItem, index, value.name, "add");
                    }}
                    onremovefile={(error, fileItem) => {}}
                    fileRenameFunction={(file) =>
                      new Promise((resolve) => {
                        var prodid = prod_id;
                        let imagecolourobj = variant.product_images[value.name];
                        var imagecount = 1;
                        if (imagecolourobj) {
                          imagecount = imagecolourobj.length + 1;
                        }
                        let imagename =
                          prodid +
                          "_" +
                          imagecount +
                          value.name.charAt(0) +
                          file.extension;
                        resolve(imagename);
                      })
                    }
                  ></FilePond>
                </Grid>
              </Grid>
            ))}
      </Grid>
      {
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={(e) => saveCreateVariant()}
            >
              Save
            </Button>
          </Grid>
          <Grid item>
            {/* <Button  style={{background: "#ffffff",marginLeft:"16px"}} variant="contained" onClick={(e) => backToProductAttribute()}>
                Back
                </Button> */}
          </Grid>
        </Grid>
      }
    </Grid>
  );
}
export default CreateVariant;
