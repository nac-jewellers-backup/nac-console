import React from "react";
import {
  Grid,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";

import { useQuery } from "react-apollo";

import { PRICE_RUN_LOGS } from "../../graphql/query";

import moment from "moment";

import { NetworkStatus } from "apollo-client";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

export const PriceLogs = (props) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const { loading, data, error, refetch, networkStatus } = useQuery(
    PRICE_RUN_LOGS,
    {
      variables: { first: rowsPerPage, offset: page * rowsPerPage },
    }
  );

  return (
    <Grid container spacing={3}>
      <Grid
        container
        item
        xs={12}
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Typography variant="h4">Price Run History Logs </Typography>
      </Grid>
      <Grid container item xs={12} sm={12} spacing={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align={"center"}>Completed Product</TableCell>
                <TableCell align={"center"}>Pricing Component</TableCell>
                <TableCell align={"center"}>Requested </TableCell>
                <TableCell align={"center"}>Succeed</TableCell>
                <TableCell align={"center"}>Failed</TableCell>
                <TableCell align={"center"}>Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(loading || NetworkStatus.refetch === networkStatus) && (
                <TableRow>
                  <TableCell colSpan={5} align={"center"} padding="none">
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={5} align={"center"}>
                    <Typography>
                      Some Error occured please try again!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {data && data?.allPriceRunningHistories?.nodes.length == 0 && (
                <TableRow>
                  <TableCell colSpan={5} align={"center"}>
                    <Typography>No Price Run Logs found!</Typography>
                  </TableCell>
                </TableRow>
              )}
              {data &&
                data?.allPriceRunningHistories?.nodes.length > 0 &&
                data?.allPriceRunningHistories?.nodes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell align={"center"} padding="4px">
                      {item?.completedProductCount ?? "No Data"}
                    </TableCell>
                    <TableCell align={"center"} padding="4px">
                      {" "}
                      {item?.pricingComponent ?? "No Data"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="4px"
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                      }}
                    >
                      {item?.logs?.nodes[0]?.requestedProducts &&
                      item?.logs?.nodes[0]?.requestedProducts.length
                        ? item?.logs?.nodes[0]?.requestedProducts?.map(
                            (req) => `${req} `
                          )
                        : "No Data"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="4px"
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                      }}
                    >
                      {item?.logs?.nodes[0]?.successfullyExecutedProducts &&
                      item?.logs?.nodes[0]?.successfullyExecutedProducts.length
                        ? item?.logs?.nodes[0]?.successfullyExecutedProducts?.map(
                            (req) => `${req} `
                          )
                        : "No Data"}
                    </TableCell>
                    <TableCell
                      align={"center"}
                      padding="4px"
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                      }}
                    >
                      {item?.logs?.nodes[0]?.failedProducts &&
                      item?.logs?.nodes[0]?.failedProducts.length
                        ? item?.logs?.nodes[0]?.failedProducts?.map(
                            (req) => `${req} `
                          )
                        : "No Data"}
                    </TableCell>
                    <TableCell align={"center"} padding="4px">
                      {moment(item.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={5}
                  align={"right"}
                  rowsPerPageOptions={[10, 25, 100]}
                  count={data?.allPriceRunningHistories?.totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
