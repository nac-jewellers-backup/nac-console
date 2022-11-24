import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
import { GRAPHQL_DEV_CLIENT, APP_URL } from "../../../../config";
import {
  CREATESPECIFICLISTINGPAGE,
  ALLSPECIFICLISTINGPAGE,
  DELETESILVERLANDINGBANNER,
} from "../../../../graphql/query";
import { UploadImage } from "../../../../utils/imageUpload";
import { AlertContext } from "../../../../context";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "60px",
  },
  imagecontainer: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  link_style: {
    color: "#000",
  },
}));

function SpecificListPages(props) {
  const classes = useStyles2();
  const [open, setOpen] = React.useState(false);
  const [alllandingbanner, setalllandingbanner] = useState([]);
  const [createlandingbanner, setCreatelandingbanner] = useState({
    position: "",
    link: "",
    mobile: "",
    web: "",
  });
  const [disableButton, setDisable] = useState({
    web: false,
    mobile: false,
  });
  const alert = useContext(AlertContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChangeData = (event) => {
    setCreatelandingbanner({
      ...createlandingbanner,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    styloribannerfetch();
  }, []);
  const styloribannerfetch = async () => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ALLSPECIFICLISTINGPAGE,
      }),
    };

    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        let data = fatchvalue.data.allBanners.nodes;
        data.sort((a, b) => parseFloat(a.position) - parseFloat(b.position));

        setalllandingbanner(data);
      })
      .catch(console.error);
  };
  const onsubmitvalue = async () => {
    if (
      createlandingbanner.urlParam &&
      createlandingbanner.mobile &&
      createlandingbanner.web
    ) {
      let create_banner_data = {
        urlParam: createlandingbanner.urlParam,
        mobile: createlandingbanner.mobile,
        web: createlandingbanner.web,
        now: new Date().toISOString(),
      };
      const url = GRAPHQL_DEV_CLIENT;
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: CREATESPECIFICLISTINGPAGE,
          variables: create_banner_data,
        }),
      };

      await fetch(url, opts)
        .then((res) => res.json())
        .then((fatchvalue) => {
          ClearState();
          styloribannerfetch();
          setOpen(false);
        })
        .catch(console.error);
    } else {
      alert.setSnack({
        open: true,
        severity: "warning",
        msg: "Data is Missing!",
      });
    }
  };

  const handleDelete = async (id) => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: DELETESILVERLANDINGBANNER,
        variables: { id: id },
      }),
    };

    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        styloribannerfetch();
      })
      .catch(console.error);
  };
  const handleChange = (file, name) => {
    UploadImage(file)
      .then((res) => {
        if (res?.data?.web) {
          setCreatelandingbanner({
            ...createlandingbanner,
            mobile: res?.data?.web,
            web: res?.data?.web,
          });
          setDisable({ ...disableButton, mobile: true, web: true });

          alert.setSnack({
            open: true,
            severity: "success",
            msg: "Image Uploaded Successfully",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ClearState = () => {
    setCreatelandingbanner({
      position: "",
      link: "",
      mobile: "",
      web: "",
    });
    setDisable({
      web: false,
      mobile: false,
    });
  };
  return (
    <>
      <Paper className={classes.root}>
        <Grid
          container
          item
          xs={12}
          style={{ padding: "16px" }}
          sm={12}
          alignItems={"flex-end"}
        >
          <Grid fullwidth item xs={9} sm={9}>
            <Typography
              component="h6"
              variant="h6"
              style={{ fontWeight: "bold" }}
            >
              NAC - Specific Listing Page - Banners
            </Typography>
          </Grid>

          <Grid fullwidth item xs={3} sm={3} style={{ "text-align": "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              Add New
            </Button>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="form-dialog-title">
            NAC - Specific Listing Page - Banners :{" "}
          </DialogTitle>
          <DialogContent>
            {/* <TextField
              autoFocus
              margin="dense"
              id="position"
              label="Position"
              variant="outlined"
              fullWidth
              onChange={onChangeData}
              value={createlandingbanner.position}
              name="position"
            /> */}
            <TextField
              margin="dense"
              id="urlParam"
              label="Banner's Page Link (Routes Only)"
              variant="outlined"
              fullWidth
              onChange={onChangeData}
              value={createlandingbanner.urlParam}
              name="urlParam"
            />
                   <Grid
              container
              justifyContent="space-around"
              style={{ padding: "16px 0px" }}
            >
              <Grid item>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="button-file"
                  multiple
                  type="file"
                  onChange={(e) => handleChange(e.target.files[0], "web")}
                />
                <label htmlFor="button-file">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    disabled={disableButton.mobile}
                  >
                    Upload Banner
                  </Button>
                </label>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onsubmitvalue}>Submit</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

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
                <TableCell>S.No</TableCell>
                <TableCell>Link to Check</TableCell>
                {/* <TableCell>Mobile Image</TableCell> */}
                <TableCell>Banner Image</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alllandingbanner.map((val, index) => (
                <TableRow key={val.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      href={`${APP_URL + val.urlParam}`}
                      target="_blank"
                      className={classes.link_style}
                    >
                      {`${APP_URL + val.urlParam}`}
                    </Link>
                  </TableCell>
                  {/* <TableCell>
                    <Link href={val.mobile} target="_blank" className={classes.link_style}>
                      <img src={val.mobile} style={{ width: "150px", height: "auto" }} />
                    </Link>
                  </TableCell> */}
                  <TableCell>
                    <Link
                      href={val.web}
                      target="_blank"
                      className={classes.link_style}
                    >
                      <img
                        alt="nacimages"
                        src={val.web}
                        style={{ width: "150px", height: "auto" }}
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDelete(val.id)}
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
      </Paper>
    </>
  );
}

export default SpecificListPages;
