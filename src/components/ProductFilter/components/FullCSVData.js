import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  CircularProgress,
  Grid,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useApolloClient } from "react-apollo";
import { gql } from "apollo-boost";
import { AlertContext } from "../../../context/AlertContext";
import { NetworkContext } from "../../../context/NetworkContext";
import exportFromJSON from "export-from-json";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const FullCSVData = (props) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [productType, setProductType] = React.useState("");
  const [include, setInclude] = React.useState(false);
  const client = useApolloClient();
  const snack = React.useContext(AlertContext);
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    client
      .query({
        query: gql`
          query {
            type: allMasterProductTypes(orderBy: NAME_ASC) {
              nodes {
                name
              }
            }
          }
        `,
      })
      .then((res) => {
        setOptions(
          res.data.type.nodes.filter((i) => i.name).map((i) => i.name)
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onDownload = () => {
    if (productType == null) {
      return snack.setSnack({
        open: true,
        severity: "warning",
        msg: "Please choose a product type!",
      });
    }
    setLoader(true);
    sendNetworkRequest("/getcsvdata", {}, { type: productType, include })
      .then((data) => {
        exportFromJSON({
          data,
          fileName: `${productType}`,
          exportType: "xls",
        });
        setOpen(false);
        setLoader(false);
        setProductType(null);
      })
      .catch((err) => {
        console.error(err);
        setOpen(false);
        setLoader(false);
        return snack.setSnack({
          open: true,
          severity: "error",
          msg: "Some error occurred while downloading, Please try again!",
        });
      });
  };

  return (
    <Grid>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        style={{ marginRight: "8px" }}
      >
        Full Data Download
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Choose Product Type to download data?"}
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            id="type"
            options={options}
            value={productType}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            onChange={(e, value) => {
              setProductType(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Product Type" variant="outlined" />
            )}
          />
          <FormControlLabel
            control={
              <Switch
                checked={include}
                onChange={() => {
                  setInclude(!include);
                }}
                color="primary"
                name="include"
              />
            }
            label={"Include disabled products"}
          />
        </DialogContent>
        <DialogActions>
          {loader && <CircularProgress size={28} />}
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onDownload} color="primary">
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default FullCSVData;
