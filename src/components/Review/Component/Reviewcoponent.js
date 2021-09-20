import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import React, { useEffect, useState } from "react";
import { GRAPHQL_DEV_CLIENT } from "../../../config";
import { REVIEWQUERY } from "../../../graphql/query";

const columns = [
  { id: "product_sku", label: "Product Sku" },
  { id: "customerName", label: "customer Name" },
  { id: "rating", label: "Rating" },
  { id: "title", label: "Title" },
  { id: "message", label: "Message" },
  { id: "ispublish", label: "Publish" },
  { id: "isactive", label: "Active" },
];
const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: "auto",
  },
}));
const ISACTIVEREVIEW = `mutation MyMutation($id: UUID!, $isActive: Boolean) {
    updateCustomerReviewById(
      input: { customerReviewPatch: { isActive: $isActive }, id: $id }
    ) {
      customerReview {
        id
        isActive
        message
        productId
        title
        customerName
        productSku
        rating
      }
    }
  }
`;
const ISPUBLISHREVIEW = `mutation MyMutation($id: UUID!, $isPublish: Boolean) {
  updateCustomerReviewById(
    input: { customerReviewPatch: { isPublish: $isPublish }, id: $id }
  ) {
    customerReview {
      id
      isPublish
      message
      productId
      title
      customerName
      productSku
      rating
    }
  }
}
`;
const CustomerReview = (props) => {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [allReview, setAllReview] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: REVIEWQUERY }),
    };
    fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        let data = fatchvalue.data.allCustomerReviews.nodes;
        console.log(data);
        setAllReview(data);
      })
      .catch(console.error);
  }, []);

  const handleChangeIsPublish = (Id) => async (event) => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ISPUBLISHREVIEW,
        variables: { id: Id, isPublish: event.target.checked },
      }),
    };

    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        window.location.reload();
      })
      .catch(console.error);
  };
  const handleChangeIsActive = (Id) => async (event) => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ISACTIVEREVIEW,
        variables: { id: Id, isActive: event.target.checked },
      }),
    };

    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        window.location.reload();
      })
      .catch(console.error);
  };

  return (
    <Paper className={classes.root}>
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
              {columns.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  style={{ whiteSpace: "nowrap" }}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allReview
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell align="left">{row.productSku}</TableCell>
                  <TableCell align="left">{row.customerName}</TableCell>
                  <TableCell align="left">{row.rating}</TableCell>
                  <TableCell align="left">{row.title}</TableCell>
                  <TableCell align="left">{row.message}</TableCell>
                  <TableCell align="left">
                    <Switch
                      checked={row.isPublish ?? false}
                      onChange={handleChangeIsPublish(row.id)}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Switch
                      checked={row.isActive ?? false}
                      onChange={handleChangeIsActive(row.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                count={allReview.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Paper>
  );
};
export default CustomerReview;
