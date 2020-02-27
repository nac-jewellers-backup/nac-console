import React, { useEffect, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, TextField, Button, Fab } from '@material-ui/core';
import { Input } from '../../components/Input.js'
import { ProductContext, ProductProvider } from '../../context';
import { withRouter } from "react-router-dom";
import DiamondDetails from './DiamondDetails';
import GemstoneDetails from './GemstoneDetails';
import Variants from './Variants';
import Skupricing from './Skupricing';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import { productCategory } from '../../services/mapper';
import { useQuery } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import "../Productupload/Productupload.css";
import AddIcon from '@material-ui/icons/Add';
import { PRODUCTEDIT, PRODUCTDIAMONDTYPES } from '../../graphql/query';
import CreateVariant from './CreateVariant';
import { API_URL, GRAPHQL_DEV_CLIENT } from '../../config';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { NetworkContext } from '../../context/NetworkContext';

import {
  Card,
  CardHeader,
  Chip,
  CardContent,
  Divider,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyle = makeStyles(theme => ({
  helperinput: {
    '& .MuiFormHelperText-root': {
      color: "#e53935",
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))

export function Component(props) {
  const [open, setOpen] = React.useState(false);
  const [expand, setExpand] = React.useState(false);
  const { sendNetworkRequest } = React.useContext(NetworkContext);

  const [snackMessage,setSnackMessage] = React.useState({
    message:"",
    severity:""
  });
  const handleClick = () => {
    setOpen(true);
  };
  
  const handleChange = panel => (event, isExpanded) => {
    createVariant()
    setExpand(isExpanded ? true : false);
    
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const { productCtx, setProductCtx } = useContext(ProductContext);
  const [state, setstate] = useState({
    create_variant: false,
    duplicate_productName: ""
  })
  let prod_id = props.location.pathname.split('/')[2];
  const classes = useStyle();
  function keyPress(evt) {
    const productname = (evt.target.validity.valid) ? evt.target.value : productCtx.productname;
    setProductCtx({ ...productCtx, productname })
  }
  function changeVariant() {
    setstate({ ...state, create_variant: false })
  }
  const handleoptionChange = type => (event, value) => {
      setProductCtx({ ...productCtx, [type]: value})
}

const handleinputChange =type => e => {
  const re = /^[a-zA-Z \b]+$/;
  if (e.target.value === '' || re.test(e.target.value)) {
    setProductCtx({ ...productCtx, [type]: e.target.value})
  }
}
// const handleinputChange = type => (event, value) => {
//   alert(event.target.value)
//       setProductCtx({ ...productCtx, [type]: value})
// }
  function createVariant() {
    let diamondTypesArray = [];
    // let diamondClaritySku = [];
    productCtx.diamondlist && productCtx.diamondlist.map(diamond_type => {
      let diamond_data = {
        id: diamond_type.id,
        diamondType: diamond_type.diamondType
      }
      let status = diamondTypesArray.some(store_dia => store_dia.diamondType == diamond_type.diamondType) ? '' : diamondTypesArray.push(diamond_data);
      return diamond_type;
    })
    productCtx['productDiamondTypesArray'] = diamondTypesArray
    setProductCtx({
      ...productCtx,
      productCtx
    })
    let params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: PRODUCTDIAMONDTYPES })
    }
    fetch(GRAPHQL_DEV_CLIENT, params)
      .then(res => res.json())
      .then(diamondtypesData => {
        console.log(diamondtypesData.data.allMasterDiamondTypes.nodes, 'diamondtypesdata');
        setProductCtx({
          ...productCtx,
          productDiamondTypes: diamondtypesData.data.allMasterDiamondTypes.nodes
        })
      })
      .catch(console.error)

    //setstate({ ...state, create_variant: true })
  }
  function saveProductEditItem() {
    let productEditItem = {
      productId: prod_id,
      productName: productCtx.productname,
      themes: productCtx.themes,
      styles: productCtx.prod_styles,
      occassions : productCtx.occassions,
      collections : productCtx.collections,
      stonecount : productCtx.stonecount,
      stonecolour : productCtx.stonecolour,
      gender : productCtx.product_gender
      // productDiamondsByProductSku: productCtx.editDiamondLists,
      // productGemstonesByProductSku: productCtx.editGemstoneLists,
      // transSkuListsByProductId: productCtx.editVariants,
      // productImages:productCtx.productImages,
      // createVariants: productCtx.createVariantList
    }
    sendNetworkRequest('/editproduct', {}, productEditItem)

    console.log("************")
    console.log(JSON.stringify(productEditItem))
    if (productCtx.editDiamondLists.length > 0 && productCtx.name !== "" || productCtx.editGemstoneLists.length > 0 && productCtx.name !== "" || productCtx.editVariants.length > 0 && productCtx.name !== "" || productCtx.createVariantList.length > 0 && productCtx.name !== "" || state.duplicate_productName !== productCtx.productname) {
      setSnackMessage({
        ...snackMessage,
        message:"This is successfully saved",
        severity:"success"
      })
     // handleClick();
      console.log(JSON.stringify(productEditItem))
      // setTimeout(()=>{  window.location='/productlist'},1000)
    } else {
      setSnackMessage({
        ...snackMessage,
        message:"You are not edit product",
        severity:"info"
      })
      handleClick();
    }
    // const opts = {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(productEditItem)
    // }
    // fetch(GRAPHQL_DEV_CLIENT,opts)
    // .then(res=>res.json())
    // .then(fetchValue=>{

    // })
    // .catch(console.error)
    console.log(JSON.stringify(productEditItem))
    // props.history.push('/productlist')
  }
  function Skupricesync(diamondData) {
    let bodydata = {
      req_product_id: diamondData
    }
    sendNetworkRequest('/productpriceupdate',{},bodydata)

  }
  function backProductList() {
    window.location='/productlist';
  }
  useEffect(() => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: PRODUCTEDIT, variables: { "productId": prod_id } })
    };
    // console.log("helo",setProductCtx)
    fetch(url, opts)
      .then(res => res.json())
      .then(fatchvalue => {
        var genders = fatchvalue.data.productListByProductId.gender
        genders = genders.split(',')
        let gender_arr = []
        genders.forEach(element => {
          let gender_obj = {
            label: element
          }
          gender_arr.push(gender_obj)
        });
        setProductCtx({
          ...productCtx,
          productname: fatchvalue.data.productListByProductId.productName,
          product_type: fatchvalue.data.productListByProductId.productType,
          product_categoy: fatchvalue.data.productListByProductId.productCategory,
          gemstonelist: fatchvalue.data.productListByProductId.productGemstonesByProductSku.nodes,
          diamondlist: fatchvalue.data.productListByProductId.productDiamondsByProductSku.nodes,
          variants: fatchvalue.data.productListByProductId.transSkuListsByProductId.nodes,
          product_images: fatchvalue.data.productListByProductId.productImagesByProductId.nodes,
          productMetalColor: fatchvalue.data.productListByProductId.productMetalcoloursByProductId.nodes,
          productMetalPurity: fatchvalue.data.productListByProductId.productPuritiesByProductId.nodes,
          variant_size: fatchvalue.data.productListByProductId.sizeVarient,
          vendorcode:fatchvalue.data.productListByProductId.vendorCode,
          product_gender:gender_arr,
          themes: fatchvalue.data.productListByProductId.productThemesByProductId.nodes,
          prod_styles: fatchvalue.data.productListByProductId.productStylesByProductId.nodes,// productDiamondColor:diamondTypesArray,
          occassions:fatchvalue.data.productListByProductId.productOccassionsByProductId.nodes,
          collections:fatchvalue.data.productListByProductId.productCollectionsByProductId.nodes,
          stonecount:fatchvalue.data.productListByProductId.productStonecountsByProductId.nodes,
          stonecolour:fatchvalue.data.productListByProductId.productStonecolorsByProductId.nodes
          // productDiamondClarity:diamondClaritySku,
        })
        setstate({
          ...state,
          duplicate_productName: JSON.parse(JSON.stringify(fatchvalue.data.productListByProductId.productName))
        })

      })
      .catch(console.error)
  }, [])
  return (
    state.create_variant ? <CreateVariant productMetalColor={productCtx.productMetalColor} productMetalPurity={productCtx.productMetalPurity} changeVariant={changeVariant} productId={prod_id} /> :
      <Grid container>
             <React.Fragment>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackMessage.severity}>
          {snackMessage.message}
        </Alert>
      </Snackbar>
        </React.Fragment>
          <Grid item container spacing={1} >
          <Grid item xs={12} sm={12} md={3} lg={3} spacing={2} style={{padding:"15px",  backgroundColor: "#FFFFFF" }}>
              
              
              <TextField
                    className={classes.helperinput}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    pattern="[a-zA-Z]*"
                    value={productCtx.productname}
                    id="productname"
                    error={productCtx && productCtx.error_message && productCtx.error_message.productname}
                    name="productname"
                    label="Product Name"
                    //onInput={keyPress.bind(this)}
                    onChange={handleinputChange('productname')}

                   //onChange={(e)=>handleinputChange(e,'productname')}
                  />
                <TextField
                  className={classes.helperinput}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  value={productCtx.product_categoy}
                  id="product_category"
                  InputProps={{
                    readOnly: true,
                  }}
                  error={productCtx && productCtx.error_message && productCtx.error_message.product_categoy}
                  name="product_category"
                  label="Product Category"
  
                />
                <TextField
                  className={classes.helperinput}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  value={productCtx.product_type}
                  id="product_type"
                  error={productCtx && productCtx.error_message && productCtx.error_message.product_type}
                  InputProps={{
                    readOnly: true,
                  }}
                  name="product_type"
                  label="Product Type"
  
                />
                  <Input
                        variant="outlined"
                        margin="dense"
                        label="Vendor Name"
                        fullWidth
                        className={classes.helperinput}
                        value={productCtx.vendorcode}
                        id="productvendorcode"
                        InputProps={{
                          readOnly: true,
                        }}
                        name="Vendor Name"
                        />
  
                 <TextField
                  className={classes.helperinput}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  defaultValue={productCtx.productname}
                  id="seo_text"
                  error={productCtx && productCtx.error_message && productCtx.error_message.productname}
                  
                  name="seo_text"
                  label="Minimum Order Quantity"
  
                /> 
               <TextField
                  className={classes.helperinput}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  defaultValue={productCtx.productname}
                  id="url"
                  error={productCtx && productCtx.error_message && productCtx.error_message.productname}
                  
                  name="url"
                  label="Maximum Order Quantity"
                /> 
                    <Autocomplete
                      multiple
                      id="free-solo-2-demo"
                      disabled
                      className={classes.fixedTag}
                      value={[{label: "Silver",name:"Silver"},{label: "Gold",name:"Gold"}]}
                      renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
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
                 <Autocomplete
                      multiple
                      id="free-solo-2-demo"
                      disabled
                      className={classes.fixedTag}
                      value={productCtx.productMetalColor}
                      renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" size="small" label={option.productColor} {...getTagProps({ index })} />
                      ))
                      }
                      renderInput={params => (
                      <TextField
                      {...params}
                      label="Metal Colour"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      InputProps={{ ...params.InputProps, type: 'search' }}
                      />
                      )}
                      />
                      <Autocomplete
                      multiple
                      id="free-solo-2-demo"
                      disabled
                      className={classes.fixedTag}
                      value={productCtx.productMetalPurity}
                      renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" size="small" label={option.purity} {...getTagProps({ index })} />
                      ))
                      }
                      renderInput={params => (
                      <TextField
                      {...params}
                      label="Metal Purity"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      InputProps={{ ...params.InputProps, type: 'search' }}
                      />
                      )}
                      />
  
                    <Autocomplete
                      multiple
                      id="free-solo-2-demo"
                      className={classes.fixedTag}
                      value={productCtx.product_gender}
                      getOptionLabel={option => option.label}
                      onChange={handleoptionChange('product_gender')}
                      options={productCtx.masterData.gender}
                      renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" size="small" label={option.label} {...getTagProps({ index })} />
                      ))
                      }
                      renderInput={params => (
                      <TextField
                      {...params}
                      label="Gender"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      InputProps={{ ...params.InputProps, type: 'search' }}
                      />
                      )}
                      />
  
                <Autocomplete
                      multiple
                      id="free-solo-2-demo"
                      className={classes.fixedTag}
                      getOptionLabel={option => option.label}
                      defaultValue={productCtx.themes}
                      options={productCtx.masterData.themes}
                      value={productCtx.themes}
                      onChange={handleoptionChange('themes')}
                      renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" size="small" label={option.themeName} {...getTagProps({ index })} />
                      ))
                      }
                      renderInput={params => (
                      <TextField
                      {...params}
                      label="Themes"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      InputProps={{ ...params.InputProps, type: 'search' }}
                      />
                      )}
                      />
                      <Autocomplete
                      multiple
                      id="free-solo-2-demo"
                      className={classes.fixedTag}
                      getOptionLabel={option => option.label}
                      defaultValue={productCtx.prod_styles}
                      options={productCtx.masterData.styles}
                      onChange={handleoptionChange('prod_styles')}
                      value={productCtx.prod_styles}
                      renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" size="small" label={option.styleName} {...getTagProps({ index })} />
                      ))
                      }
                      renderInput={params => (
                      <TextField
                      {...params}
                      label="Styles"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      InputProps={{ ...params.InputProps, type: 'search' }}
                      />
                      )}
                      />
  
                    <Autocomplete
                      multiple
                      id="free-solo-2-demo"
                      className={classes.fixedTag}
                      value={productCtx.occassions}
                      getOptionLabel={option => option.label}
                      defaultValue={productCtx.occassions}
                      options={productCtx.masterData.occasions}
                      onChange={handleoptionChange('occassions')}
                      renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" size="small" label={option.occassionName} {...getTagProps({ index })} />
                      ))
                      }
                      renderInput={params => (
                      <TextField
                      {...params}
                      label="Occasions"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      InputProps={{ ...params.InputProps, type: 'search' }}
                      />
                      )}
                      />
              <Autocomplete
                      multiple
                      id="free-solo-2-demo"
                      className={classes.fixedTag}
                      value={productCtx.collections}
                      getOptionLabel={option => option.label}
                      defaultValue={productCtx.collections}
                      options={productCtx.masterData.collections}
                      onChange={handleoptionChange('collections')}
                      renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" size="small" label={option.collectionName} {...getTagProps({ index })} />
                      ))
                      }
                      renderInput={params => (
                      <TextField
                      {...params}
                      label="Collections"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      InputProps={{ ...params.InputProps, type: 'search' }}
                      />
                      )}
                      />
                  <Autocomplete
                      multiple
                      id="free-solo-2-demo"
                      className={classes.fixedTag}
                      value={productCtx.stonecount}
                      getOptionLabel={option => option.label}
                      defaultValue={productCtx.stonecount}
                      options={productCtx.masterData.stones}
                      onChange={handleoptionChange('stonecount')}
                      renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" size="small" label={option.stonecount} {...getTagProps({ index })} />
                      ))
                      }
                      renderInput={params => (
                      <TextField
                      {...params}
                      label="No of Stones"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      InputProps={{ ...params.InputProps, type: 'search' }}
                      />
                      )}
                      />
  
                  <Autocomplete
                      multiple
                      id="free-solo-2-demo"
                      className={classes.fixedTag}
                      value={productCtx.stonecolour}
                      getOptionLabel={option => option.label}
                      defaultValue={productCtx.stonecolour}
                      options={productCtx.masterData.gemstonecolor}
                      onChange={handleoptionChange('stonecolour')}
                      renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                      <Chip variant="outlined" size="small" label={option.stonecolor} {...getTagProps({ index })} />
                      ))
                      }
                      renderInput={params => (
                      <TextField
                      {...params}
                      label="Stone Colour"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      InputProps={{ ...params.InputProps, type: 'search' }}
                      />
                      )}
                      />
              
              
              
              
              <Grid item container style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "16px"
            }}>
              <Grid item>
                <Button color="primary" variant="contained" onClick={(e) => saveProductEditItem()}>
                  Save
             </Button>
                <Button color="default" style={{  marginLeft:"16px" }} variant="contained" onClick={(e) => backProductList()}>
                  Back
              </Button>
              </Grid>
            </Grid>
              
              </Grid>
             
            <Grid item xs={12} sm={12} md={9} lg={9}  spacing={2} style={{ padding: "15px" }}>
              <Grid container item md={6}>
                
              </Grid>
              <Grid style={{ fontSize: ".9rem", padding: "8px" }}>Diamond Table</Grid>
              <DiamondDetails diamond={productCtx.diamondlist} />
              {productCtx.gemstonelist.length > 0 ? <> <Grid style={{ fontSize: ".9rem", padding: "8px", marginTop: "28px" }}>Gemstone Table</Grid>
              <GemstoneDetails gemstone={productCtx.gemstonelist} /> </> : null }
              <Grid style={{ fontSize: ".9rem", padding: "8px" , marginTop: "16px" }}>Variant Creation</Grid>

              <Grid style={{
                
              }}>
                {/* <Grid style={{ fontSize: ".9rem", display: "flex", alignItems: "center" }}>Create Variant</Grid> */}
               
                  <ExpansionPanel expanded={expand} onChange={handleChange()}>
                    <ExpansionPanelSummary
                      expandIcon={<AddIcon />}
                      aria-controls="panel1c-content"
                      id="panel1c-header"
                    >
                      <div className={classes.column}>
                        <Typography className={classes.heading}>Add New variant</Typography>
                      </div>
                    
                    </ExpansionPanelSummary>
                    <Divider />
                    <ExpansionPanelDetails className={classes.details}>
                    <CreateVariant productMetalColor={productCtx.productMetalColor} productMetalPurity={productCtx.productMetalPurity} changeVariant={changeVariant} productId={prod_id} />  
                    </ExpansionPanelDetails>
                    <Divider />
                    {/* <ExpansionPanelActions>
                      <Button size="small">Cancel</Button>
                      <Button size="small" color="primary">
                        Save
                      </Button>
                    </ExpansionPanelActions> */}
                    </ExpansionPanel>
                    
                
                </Grid>
              <Grid style={{ fontSize: ".9rem", padding: "8px" , marginTop: "16px" }}>Variant Table  </Grid>

              <Variants variants={productCtx.variants} />
              <Grid style={{ fontSize: ".9rem", padding: "8px" , marginTop: "16px" }}>Pricing Table  
              <Button onClick={(e) => Skupricesync(prod_id)} size="small" variant="outlined" color="primary">
                        Price Run For This Product
                      </Button></Grid>

              <Skupricing variants={productCtx.variants} />

            </Grid>
            
          </Grid>
        </Grid>

  )
}



const useStyles2 = makeStyles(theme => ({
  progress: {
    margin: 'auto'
  },
}));

export const ProductAttributes = withRouter(props => {

  const classes = useStyles2();

  const { data, loading, error } = useQuery(productCategory.query);

  if (loading) return <div className="loaderdiv"><CircularProgress className={classes.progress} />
  </div>
  if (error) return <div>error</div>

  const _content = <ProductProvider value={{ data, mapper: productCategory.mapper, mappertype: "masterData" }} >
    <Component {...props} />
  </ProductProvider>
  return _content
});
export default withRouter(ProductAttributes);