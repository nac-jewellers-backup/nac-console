import { TableCell, TableRow, Button, Typography } from "@material-ui/core";
import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import parse from "html-react-parser";
import moment from "moment";

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
    case "HTMLTEXT": {
      return <div>{parse(data.rowData)}</div>;
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
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
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
          <EditIcon onClick={data?.handleEdit} style={{ cursor: "pointer" }} />
          <DeleteIcon onClick={data?.handleDelete} style={{ color: "red", cursor: "pointer" }} />
        </div>
      );
    }
    case "EDIT": {
      return (
        <EditIcon style={{ cursor: "pointer" }} onClick={data?.handleEdit} />
      );
    }
    case "BUTTON_ARRAY": {
      return (
        <div>
          {data.rowData.map((val) => (
            <div style={{ paddingBottom: "4px" }}>
              <div>{val.name}</div>
              {val.url.length > 0 && (
                <div style={{ color: "blue" }}>{val.url}</div>
              )}
            </div>
          ))}
        </div>
      );
    }
    case "DATE_PICKER": {
      return (
        <div>
          <Typography>
            {data.rowData ? moment(data.rowData).format("MMMM DD, YYYY") : "-"}
          </Typography>
        </div>
      );
    }
    case "ARRAYTEXT": {
      return (
        data?.rowData?.map((_) => {
          return <Typography>
            <div>{_.name}</div>
            {_.url.length > 0 && <div style={{ color: "blue" }}>{_.url}</div>}
          </Typography>
        })
      );
    }
  }
};

const TableBodyRow = ({
  tableData = [],
  rowData = {},
  rowIndex = null,
  handleViewStores = () => null,
  handleDelete = () => null,
  handleEdit = () => null,
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
            handleDelete: (e) => {
              handleDelete(e, rowData, rowIndex);
            },
            handleEdit: (e) => {
              handleEdit(e, rowData, rowIndex);
            },
            customWidth: val?.width,
          })}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableBodyRow;
