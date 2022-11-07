import { TableCell, TableRow, Button } from "@material-ui/core";
import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const getComponent = (data) => {
  switch (data.type) {
    case "TEXT": {
      return (
        <div
          style={{
            width: data?.customWidth ? data?.customWidth : "",
            lineBreak: data?.customWidth ? "anywhere" : "unset",
          }}
        >
          {data.rowData}
        </div>
      );
    }
    case "INCREMENT": {
      return <div>{data.rowIndex + 1}</div>;
    }
    case "TOTAL_STORES": {
      return <div>{data?.rowData?.length}</div>;
    }
    case "VIEW_STORES": {
      return (
        <div
          style={{ color: "blue", cursor: "pointer",textDecoration:"underline" }}
          onClick={data?.handleViewStores}
        >
          View Stores
        </div>
      );
    }
    case "MBL_IMAGE": {
      return (
        <img
          alt="nacimages"
          src={data.rowData}
          style={{ width: "150px", height: "auto" }}
        />
      );
    }
    case "MBL_IMAGE": {
      return (
        <img
          alt="nacimages"
          src={data.rowData}
          style={{ width: "150px", height: "auto" }}
        />
      );
    }
    case "WEB_IMAGE": {
      return (
        <img
          alt="nacimages"
          src={data.rowData}
          style={{ width: "150px", height: "auto" }}
        />
      );
    }
    case "ACTION": {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <EditIcon />
          <DeleteIcon style={{color:"red"}} />
        </div>
      );
    }
  }
};

const TableBodyRow = ({
  tableData = [],
  rowData = {},
  rowIndex = null,
  handleViewStores = () => null,
}) => {
  return (
    <TableRow>
      {tableData.map((val, i) => (
        <TableCell>
          {getComponent({
            type: val.type,
            rowData: rowData[val.name],
            rowIndex: rowIndex,
            handleViewStores: (e) => {
              handleViewStores(e, rowData, rowIndex);
            },
            customWidth: val?.width,
          })}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableBodyRow;
