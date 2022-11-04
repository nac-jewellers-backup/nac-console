import React from "react";
import { useStyles } from "./style";
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
import { bannerDummy } from "./dummyData";

const CmsComponent = (props) => {
    const classes = useStyles();
  return (
    <div>
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
              <TableCell>Position</TableCell>
              <TableCell>Link to Check</TableCell>
              <TableCell>Mobile Image</TableCell>
              <TableCell>Desktop Image</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bannerDummy.map((val, index) => (
              <TableRow key={val.id}>
                <TableCell>{val.position}</TableCell>
                <TableCell>
                  <Link
                    // href={`${APP_URL}`}
                    target="_blank"
                    className={classes.link_style}
                  >
                    {""}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={val.mobile}
                    target="_blank"
                    className={classes.link_style}
                  >
                    {/* {val.mobile} */}
                    <img
                      alt="nacimages"
                      src={val.mobile}
                      style={{ width: "150px", height: "auto" }}
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={val.web}
                    target="_blank"
                    className={classes.link_style}
                  >
                    {/* {val.web} */}
                    <img
                      alt="nacimages"
                      src={val.web}
                      style={{ width: "150px", height: "auto" }}
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    // onClick={() => handleDelete(val.id)}
                    style={{ color: "#fff", backgroundColor: "red" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CmsComponent;
