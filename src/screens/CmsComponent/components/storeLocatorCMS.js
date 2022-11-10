import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
} from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { TableComp } from "../../../components";
import { useStyles } from "./styles";
import CloseIcon from "@material-ui/icons/Close";
import TableHeaderComp from "./TableHeadComp";

const header = ["S.No", "City", "Total Stores", "View Stores", "Action"];
const tableData = [
  { type: "INCREMENT", name: "S.No" },
  { type: "TEXT", name: "city" },
  { type: "TOTAL_STORES", name: "stores" },
  { type: "VIEW_STORES", name: "stores" },
  { type: "ACTION", name: "" },
];

const storeHeader = ["S.No", "Title", "Para", "Location", "Image", "Button"];
const tableStoreData = [
  { type: "INCREMENT", name: "S.No" },
  { type: "TEXT", name: "title" },
  { type: "TEXT", name: "para" },
  { type: "TEXT", name: "location", width: "200px" },
  { type: "TEXT", name: "img", width: "200px" },
  { type: "TEXT", name: "button" },
];

function StoreLocatorCMS(props) {
  const classes = useStyles();
  const [openStores, setOpenStores] = useState(false);
  const [stores, setStores] = useState([]);
  const handleViewStores = (e, data, index) => {
    console.log("dataClicked", data);
    setOpenStores(true);
    setStores(data);
  };

  const handleCloseStores = () => {
    setOpenStores(false);
  };
  return (
    <Paper className={classes.root}>
      <TableHeaderComp name={"Store Locator Component"} />

      <TableComp
        header={header}
        tableData={tableData}
        data={props?.data?.storeData}
        handleViewStores={handleViewStores}
      />
      
      {/* View the Stores */}
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullWidth
        open={openStores}
        onClose={handleCloseStores}
      >
        <DialogTitle id="form-dialog-title">
          <div className={classes.dialogHeader}>
            <div>Stores in {stores?.city}</div>
            <div style={{ cursor: "pointer" }} onClick={handleCloseStores}>
              <CloseIcon />
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <TableComp
            header={storeHeader}
            tableData={tableStoreData}
            data={stores?.stores}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

export default StoreLocatorCMS;
