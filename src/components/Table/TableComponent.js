import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  Button,
  Table,
} from "@material-ui/core";
import React from "react";
import { useStyles } from "./style";
import TableBodyRow from "./TableBodyRow";

const TableComp = (
  {
    header = [],
    tableData = [],
    data = [],
    handleViewStores = () => null,
    handleDelete = () => null,
    handleEdit = () => null
  },
) => {
  const classes = useStyles();
  return (
    <div className={classes.tableWrapper}>
      <Table
        className={classes.table}
        border={1}
        borderColor={"#ddd"}
        size="small"
        stickyHeader
      >
        <TableHead>
          <TableRow>
            {header?.map((val) => (
              <TableCell>{val}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((val, index) => (
            <TableBodyRow
              tableData={tableData}
              rowData={val}
              rowIndex={index}
              handleViewStores={handleViewStores}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComp;
