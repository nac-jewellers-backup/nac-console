import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Paper, Card, CardHeader, CardContent, Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { NetworkContext } from "../../context/NetworkContext";
import "./upload.css";

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 100,
    marginTop: theme.spacing(3),
  },
 
  tableWrapper: {
    overflowX: "auto",
  },
  fixedTag: {
    padding: 0,
    "& .MuiOutlinedInput-root": {
      padding: 0,
    },
  },
  root: {
    marginTop: theme.spacing(2),
  },
  table: {
    width: "100%",
    // marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(2),
    width: "100%",
  },
  gempapper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: "100%",
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
  styleFile: {
    paddingTop: "10px",
  },
  card: {
    minHeight: "150px",
    textAlign: "left",
    boxShadow: "0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)",
  },
  formContainer: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 20,
    paddingBottom: 30,
  },
}));

export default function Productimages(props) {
  const classes = useStyles2();
  let image_count = 0;
  let product_id = "";

  const [productimages, setProductimages] = React.useState(props.prodimages);
  const { sendNetworkRequest } = React.useContext(NetworkContext);

  React.useEffect(() => {
    setProductimages(props.prodimages);
  }, [props.prodimages]);

  productimages.forEach((imgobj) => {
    console.log();
    image_count = image_count + 1;
    if (imgobj.productId) {
      product_id = imgobj.productId;
    }
  });

  const handlenewAssetChange = (e) => {
    const files = e.target.files;
    Object.keys(files).map((file, index) => {
      var imagecount = 1;
      if (productimages) {
        imagecount = image_count + 1;
      }
      let imagename = product_id + "-" + imagecount;
      const fileParts = files[index].type.split("/");
      const fileType = fileParts[1];

      uploadimagetoserver(files[index], fileType, imagename, product_id, {}, false);
    });
  };

  async function uploadimagetoserver(fileobj, filetype, imagename, prodid, imagecontent, isedit) {
    let responsedata = await sendNetworkRequest(
      "/uploadimage",
      {},
      { image: filetype, filename: imagename, product_id: prodid },
      false
    );

    var returnData = responsedata.data.returnData;
    var signedRequest = returnData.signedRequest;
    var url = returnData.url;
    var filepathname = returnData.filepath;
    filepathname = filepathname.replace("base_images", "product/" + prodid);
    var options = {
      headers: {
        "Content-Type": filetype,
        "Access-Control-Allow-Origin": "*",
      },
    };

    if (!isedit) {
      const imageobj = {
        name: product_id + "_" + (image_count + 1),
        imagePosition: image_count + 1,
        productColor: props.color,
        productId: product_id,
        imageUrl: url,
        url: "https://s3.ap-south-1.amazonaws.com/styloribaseimages/" + filepathname,
      };
      imagecontent = imageobj;
    }

    if (!isedit) {
      var productimgs = [];
      productimages.forEach((img) => {
        productimgs.push(img);
      });
      productimgs.push(imagecontent);
    }

    await axios.put(signedRequest, fileobj, options);
    let responsecontent = await sendNetworkRequest("/updateproductimage", {}, { imageobj: imagecontent, isedit: isedit }, false);

    if (responsecontent.statuscode === 200) {
      window.location.reload();
    }
  }

  return (
    <Paper className={classes.root}>
      <Card className={classes.card}>
        <CardHeader title={props.color && props.isdefault ? props.color + " (Default Colour)" : props.color} />
        <CardContent>
          <Grid container spacing={2} className={classes.styleFile}>
            {productimages.map((url) => (
              <React.Fragment key={url.id}>
                <div style={{ position: "relative" }}>
                  <i
                    className="fa fa-window-edit"
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 11,
                      color: "red",
                      zIndex: "12",
                    }}
                  />

                  <Grid
                    item
                    style={{
                      width: "150px",
                      wordBreak: "break-all",
                      height: "150px",
                      padding: "8px",
                      margin: "0",
                      // cursor: "pointer",
                      position: "relative",
                    }}
                    className="container"
                  >
                    <img
                      src={url.imageUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "4px",
                      }}
                      alt="product images"
                    />
                  </Grid>
                  <Typography style={{ textAlign: "center" }} variant="h5">
                    {" "}
                    {url.imagePosition}{" "}
                  </Typography>

                  <Typography style={{ textAlign: "center" }} variant="h6">
                    {" "}
                    {url.ishover ? "hover" : ""}{" "}
                  </Typography>
                </div>
                {/* ) : null} */}
              </React.Fragment>
            ))}
            <Grid
              item
              style={{
                width: "150px",
                wordBreak: "break-all",
                height: "150px",
                padding: "8px",
                margin: "0",
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
              }}
              className="container"
            >
              {
                <label className="custom-file-upload" style={{ display: "flex" }}>
                  <i
                    className="fa fa-plus"
                    aria-hidden="true"
                    style={{
                      color: "rgba(60,64,67,.15)",
                      fontSize: "45px",
                      margin: "auto",
                    }}
                  ></i>
                  <input type="file" className="custom-file-input" onChange={(e) => handlenewAssetChange(e)}></input>
                </label>
              }
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Paper>
  );
}
