import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import React from 'react';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';
// Register the plugins
import { ProductContext } from '../../context';
import { NetworkContext } from '../../context/NetworkContext';




registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageValidateSize, FilePondPluginFileRename);


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
  },
  img: {
    height: '100%',
    width: '100%',
    objectFit: 'contain'
  },
  control: {
    padding: theme.spacing(2),
  },
  input: {
    display: 'none',
  },
}));




export default function Review() {
  let count = 0;
  const classes = useStyles();
  const { productCtx, setProductCtx } = React.useContext(ProductContext);
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [metalcolour, setMetalcolour] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [images, setImages] = React.useState({});
  React.useEffect(() => {
    let metalcolour = []
    let product_images = [];

    productCtx.metalcolour.forEach(element => {
      if (element.name === productCtx.default_metal_colour) {
        product_images[element.name] = []
        if (metalcolour.length > 0) {
          metalcolour.unshift(element);
        } else {
          metalcolour.push(element)
        }

      } else {
        metalcolour.push(element)
        product_images[element.name] = []
      }
    })
    setMetalcolour(metalcolour)

  }, []);
  async function uploadimagetoserver(bodaydata, imageposition, imagecolor, uploadtype) {

    //alert(JSON.stringify(bodaydata))

    let prodimages = productCtx.product_images;
    if (prodimages) {
      var prodid = "S" + productCtx.product_type.shortCode + (productCtx.masterData.productseries[0].value + 1)
      let imagecolourobj = productCtx.product_images[imagecolor];
      var imagecount = 1;
      if (imagecolourobj) {
        imagecount = imagecolourobj.length + 1;
      }

      let imagename = (prodid + "-" + (imagecount) + imagecolor.charAt(0));
      let responsedata = await sendNetworkRequest('/uploadimage', {}, { image: bodaydata.fileExtension, filename: imagename, product_id: prodid }, false)
      var returnData = responsedata.data.returnData;
      var signedRequest = returnData.signedRequest;
      var url = returnData.url;
      console.log("responseurl" + url);
      var filepathname = returnData.filepath
      filepathname = filepathname.replace("base_images", "product/" + prodid);
      var options = {
        headers: {
          'Content-Type': bodaydata.fileExtension,
          'Access-Control-Allow-Origin': '*'
        }
      };

      if (imagecolourobj) {
        const imageobj = {
          "name": (prodid + "_" + (imagecolourobj.length + 1) + imagecolor.charAt(0)),
          "position": (imagecolourobj.length + 1),
          "color": imagecolor,
          "image_url": filepathname,
          "url": 'https://s3.ap-south-1.amazonaws.com/styloribaseimages/' + filepathname
        }
        if (uploadtype === 'edit') {
          imagecolourobj[imageposition] = imageobj;

        } else {
          imagecolourobj.push(imageobj)

        }
        prodimages[imagecolor] = imagecolourobj;

      } else {
        const imageobj = {
          "name": (prodid + "_1" + imagecolor.charAt(0)),
          "position": imageposition,
          "color": imagecolor,
          "image_url": filepathname,
          "url": 'https://s3.ap-south-1.amazonaws.com/styloribaseimages/' + filepathname
        }
        imagecolourobj = [];
        imagecolourobj.push(imageobj)
      }
      prodimages[imagecolor] = imagecolourobj;

      setProductCtx({ ...productCtx, product_images: prodimages })
      // setFiles([])
    }
    await axios.put(signedRequest, bodaydata.file, options)



  }

  function removefiles(imageposition, imagecolor) {


    let prodimages = productCtx.product_images;

    if (prodimages) {
      let imagecolourobj = prodimages[imagecolor];

      if (imagecolourobj) {
        if (imagecolourobj.length > imageposition) {
          let removedfile = imagecolourobj[imageposition]

          imagecolourobj[imageposition] = { ...removedfile, url: "" }

        }

      }
      prodimages[imagecolor] = imagecolourobj;
      setProductCtx({ ...productCtx, product_images: prodimages })
      //alert(JSON.stringify(productCtx.product_images))
    }
  }

  const handleInit = () => {
    // alert("initialized")
  }
  return (
    <React.Fragment>
      <Grid container className={classes.root} spacing={2}>

        <Grid item direction="row" xs={12}>
          <Grid container justify="left" spacing={2}>

            {metalcolour === undefined ? null : metalcolour.map((value, index) => (
              <Grid xs={12} container spacing={1} item>
                <Grid xs={12} item>

                  <Typography component="h6" variant="h6" align="left">
                    {value.name}
                  </Typography>
                </Grid>
                {/* {productCtx.product_images[value.name] === undefined ? null : productCtx.product_images[value.name].map((row,imageindex) => (

            <Grid  xs={3} alignItems="center" item>
                 <Typography component="h6" variant="h6" align="left">
            {row.url}
             </Typography> 
           {row.url.length === 0 ? <FilePond 
                          labelIdle="Image For"
                          allowMultiple={true}
                          maxFiles={3}  
                          files = {files}
                          onupdatefiles={fileItem => {
                              // Set currently active file objects to this.state
                            
                          }}
                          onaddfile={(error, fileItem)=> {
                            uploadimagetoserver(fileItem, imageindex, value.name, "edit")
                          }}
                          onremovefile={(error, fileItem)=>{

                          }}>
                </FilePond> :  <FilePond 
                          labelIdle="Image For"
                          files={[{
                            source: row.url,
                            options: {
                                type: 'local'
                            }
                        }]}
                          server={{
                            load: (source, load) => {
                                // simulates loading a file from the server
                                fetch(source).then(res => 
                                  
                                  res.blob()).then(load);
                            }
                        }} 
                          onupdatefiles={fileItems => {
                              // Set currently active file objects to this.state
                            
                          }}
                          onaddfile={(error, fileItems)=> {
                            
                          }}
                          onremovefile={(error, fileItem)=>{
                            removefiles(imageindex, value.name)
                          }}>
                </FilePond>
               
                
                         } </Grid>
             ))} */}
                <Grid xs={12} sm={12} md={12} item>
                  <FilePond
                    allowImageValidateSize
                    imageValidateSizeMinWidth="2400"
                    imageValidateSizeMinHeight="2400"
                    imageValidateSizeMeasure={(file) => new Promise((resolve, reject) => {
                      console.log(file);
                      console.log('filepond property');

                    })}
                    labelIdle="Upload Image"
                    allowMultiple={true}
                    //files = {files}
                    onupdatefiles={fileItem => {
                      // Set currently active file objectsfiles to this.state

                    }}
                    onaddfile={(error, fileItem) => {
                      uploadimagetoserver(fileItem, index, value.name, "add")
                    }}
                    onremovefile={(error, fileItem) => {

                    }}
                    fileRenameFunction={
                      (file) => new Promise(resolve => {
                        var prodid = "S" + productCtx.product_type.shortCode + (productCtx.masterData.productseries[0].value + 1)
                        let imagecolourobj = productCtx.product_images[value.name];
                        var imagecount = 1;
                        if (imagecolourobj) {
                          imagecount = imagecolourobj.length + 1;
                        }
                        let imagename = (prodid + "_" + (imagecount) + value.name.charAt(0)) + file.extension;
                        resolve(imagename)

                      })
                    }
                  >
                  </FilePond>
                  {/* <Grid container xs={12} alignItems="center" spacing={1} item>
                <Grid  xs={8} item>

                <TextField
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      value={"S"+productCtx.product_type_shortcode+(productCtx.masterData.productseries[0].value+1)+"_1"+ value.name.charAt(0)}
                      id="imagename"
                      name="imagename"
                      label="imagename"
                      />  
                                        </Grid>          

                <Grid  xs={4}  item>

                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.button}
                  >Upload</Button> 
                                    </Grid>          
  
                  </Grid>           */}
                </Grid>

              </Grid>
            ))}
          </Grid>
        </Grid>

      </Grid>

    </React.Fragment>
  );
}