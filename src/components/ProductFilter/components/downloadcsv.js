import React, { useState } from "react";
import { NetworkContext } from "../../../context/NetworkContext";
import { Button, CircularProgress } from "@material-ui/core";
import { CSVLink } from "react-csv";
const DownloadCsv = () => {
  const [loader, setLoader] = useState(false);
  const [showdownload, setShowDownload] = useState(false);
  const [dataCSV, setDataCSV] = useState({ keyCSV: [], valueCSV: [] });
  const { sendNetworkRequest } = React.useContext(NetworkContext);

  const fetchCSVdata = async (event, done) => {
    setLoader(true);
    let responseCSV = await sendNetworkRequest("/productdetails", {}, {});
    let responseData = responseCSV.res_json;

    if (responseCSV.statuscode === 200) {
      let keyData = [];

      for (const [key] of Object.entries(responseData[0])) {
        keyData.push({ label: key, key: key });
      }

      setDataCSV({ ...dataCSV, keyCSV: keyData, valueCSV: responseData });
      setLoader(false);
      setShowDownload(true);
    }
  };

  const clearCsv = () => {
    setDataCSV({ keyCSV: [], valueCSV: [] });
    setShowDownload(false);
  };

  return (
    <>
      {loader ? (
        <Button variant="outlined" disabled color="primary" style={{ marginRight: "8px" }}>
          <CircularProgress size={20} />
        </Button>
      ) : showdownload ? (
        <CSVLink
          header={dataCSV.keyCSV}
          data={dataCSV.valueCSV}
          filename={"product-details.csv"}
          onClick={() => {
            clearCsv();
          }}
          style={{ textDecoration: "none" }}
        >
          <Button variant="outlined" color="primary" style={{ marginRight: "8px" }}>
            Download CSV
          </Button>
        </CSVLink>
      ) : (
        <Button variant="outlined" color="primary" style={{ marginRight: "8px" }} onClick={() => fetchCSVdata()}>
          Load CSV
        </Button>
      )}
    </>
  );
};

export default DownloadCsv;
