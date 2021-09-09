import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  ALLFEATUREDPRODUCT,
  CREATEFEATUREDPRODUCT,
  ISACTIVEFEATUREDPRODUCT,
  DELETEFEATUREDPRODUCT,
} from "../../../graphql/query";
import { GRAPHQL_DEV_CLIENT, APP_URL } from "../../../config";
import Switch from "@material-ui/core/Switch";
const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  imagecontainer: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  link_style: {
    color: "#000",
  },
}));
const FeaturedProuductComponent = (props) => {
  const classes = useStyles2();
  const [open, setOpen] = React.useState(false);
  const [allFeaturedProudct, setAllFeaturedProduct] = useState([]);
  const [createFeaturedProduct, setCreateFeaturedProduct] = useState({
    productId: "",
    isActive: false,
  });

  useEffect(() => {
    async function styloribannerfetch() {
      const url = GRAPHQL_DEV_CLIENT;
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: ALLFEATUREDPRODUCT,
        }),
      };

      await fetch(url, opts)
        .then((res) => res.json())
        .then((fatchvalue) => {
          let data = fatchvalue.data.allFeaturedProducts.nodes;

          setAllFeaturedProduct(data);
        })
        .catch(console.error);
    }
    styloribannerfetch();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onChangeData = (event) => {
   
    setCreateFeaturedProduct({ ...createFeaturedProduct, [event.target.name]: event.target.value });
  };
  const onChangeChecked = (event) => {
    setCreateFeaturedProduct({ ...createFeaturedProduct, [event.target.name]: event.target.checked });
  };
  const handleChangeIsActive = (productId) => async (event) => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ISACTIVEFEATUREDPRODUCT,
        variables: { ProductId: productId, isActive: event.target.checked },
      }),
    };

    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        window.location.reload();
      })
      .catch(console.error);
  };

  const handleDelete = async (ProductId) => {
   
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: DELETEFEATUREDPRODUCT,
        variables: { ProductId: ProductId },
      }),
    };
  
    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
       
        window.location.reload();
      })
      .catch(console.error);
  };

  const onsubmitvalue = async () => {
    let create_featured_Product = {
      ProductId: createFeaturedProduct.productId,
      isActive: createFeaturedProduct.isActive,
    };
 
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: CREATEFEATUREDPRODUCT,
        variables: create_featured_Product,
      }),
    };

    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
       
        setOpen(false);
        window.location.reload();
      })
      .catch(console.error);
  };

  return (
    <>
      <Paper className={classes.root}>
        <Grid container item xs={12} style={{ padding: "16px" }} sm={12} alignItems={"flex-end"}>
          <Grid fullwidth item xs={9} sm={9}>
            <Typography component="h6" variant="h6" style={{ fontWeight: "bold" }}>
              NAC - Landing Page - Featured Product
            </Typography>
          </Grid>

          <Grid fullwidth item xs={3} sm={3} style={{ "text-align": "right" }}>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
              Add New
            </Button>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="form-dialog-title"> NAC - Landing Page - Featured Product : </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="productId"
              label="Product Id"
              variant="outlined"
              fullWidth
              onChange={onChangeData}
              value={createFeaturedProduct.productId}
              name="productId"
            />
            <FormControlLabel
              value="start"
              control={
                <Switch
                  checked={createFeaturedProduct.isActive}
                  onChange={onChangeChecked}
                  name="isActive"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              }
              label="Product Active"
              labelPlacement="start"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onsubmitvalue}>Submit</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <div className={classes.tableWrapper}>
          <Table className={classes.table} border={1} borderColor={"#ddd"} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Product Id</TableCell>
                <TableCell>Proudct Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allFeaturedProudct.map((val, index) => (
                <TableRow key={index}>
                  <TableCell>{val.productId}</TableCell>
                  <TableCell>{val?.productListByProductId?.productName}</TableCell>
                  <TableCell>
                    <img
                      alt="nacimages"
                      src={val?.productListByProductId?.productImagesByProductId?.nodes[0]?.imageUrl}
                      style={{ width: "50px", height: "auto" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={val.isActive ?? false}
                      onChange={handleChangeIsActive(val.productId)}
                      color="primary"
                      name="isActive"
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDelete(val.productId)}
                      style={{ color: "#fff", backgroundColor: "red", cursor: "pointer !important" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </>
  );
};
export default FeaturedProuductComponent;
