import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  Button,
  Table,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useStyles } from "./style";
import TableBodyRow from "./TableBodyRow";

const TableComp = ({
  header = [],
  tableData = [],
  data = [],
  handleViewStores = () => null,
  handleDelete = () => null,
  handleEdit = () => null,
}) => {
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
        {data.length > 0 ?
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
          </TableBody> :
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0px",
            }}
          >
            <Typography variant="body1"> No data Found </Typography>
          </div>}
      </Table>
    </div>
  );
};

export default TableComp;
