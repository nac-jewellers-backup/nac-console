import React, { useEffect, useState , useContext} from "react";
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
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { UploadImage } from "../../../../utils/imageUpload";
import {
  ALLSTYLORISILVERLANDINGBANNERS,
  CREATESILVERLANDINGBANNER,
  DELETESILVERLANDINGBANNER,
} from "../../../../graphql/query";
import { GRAPHQL_DEV_CLIENT, APP_URL } from "../../../../config";
import { AlertContext } from "../../../../context";
const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
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
const SilverLandingPage = (props) => {
  const classes = useStyles2();
  const [open, setOpen] = React.useState(false);
  const alert = useContext(AlertContext);
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

  useEffect(() => {
    styloribannerfetch();
  }, []);
  const styloribannerfetch = async () => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ALLSTYLORISILVERLANDINGBANNERS,
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

  const onsubmitvalue = async () => {
    if (
      createlandingbanner.position &&
      createlandingbanner.link &&
      createlandingbanner.mobile &&
      createlandingbanner.web
    ) {
      let create_banner_data = {
        position: +createlandingbanner.position,
        url: createlandingbanner.link,
        mobile: createlandingbanner.mobile,
        web: createlandingbanner.web,
        now: new Date().toISOString(),
      };

      const url = GRAPHQL_DEV_CLIENT;
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: CREATESILVERLANDINGBANNER,
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
  const handleChange = (file, name) => {
    UploadImage(file)
      .then((res) => {
        if (res?.data?.web) {
          setCreatelandingbanner({
            ...createlandingbanner,
            [name]: res?.data?.web,
          });
          setDisable({ ...disableButton, [name]: true });

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
              NAC - Landing Page - Banners
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
            {" "}
            - Landing Page - Banners :{" "}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="position"
              label="Position"
              variant="outlined"
              fullWidth
              onChange={onChangeData}
              value={createlandingbanner.position}
              name="position"
            />
            <TextField
              margin="dense"
              id="link"
              label="Banner's Redirect Link (Routes Only)"
              variant="outlined"
              fullWidth
              onChange={onChangeData}
              value={createlandingbanner.link}
              name="link"
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
                  onChange={(e) => handleChange(e.target.files[0], "mobile")}
                />
                <label htmlFor="button-file">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    disabled={disableButton.mobile}
                  >
                    Mobile Image
                  </Button>
                </label>
              </Grid>
              <Grid item>
                <input
                  accept="image/*"
                  className={classes.input}
                  style={{ display: "none" }}
                  id="button-files"
                  multiple
                  type="file"
                  onChange={(e) => handleChange(e.target.files[0], "web")}
                />
                <label htmlFor="button-files">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={disableButton.web}
                    startIcon={<CloudUploadIcon />}
                  >
                    Desktop Image
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
                <TableCell>Position</TableCell>
                <TableCell>Link to Check</TableCell>
                <TableCell>Mobile Image</TableCell>
                <TableCell>Desktop Image</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alllandingbanner.map((val, index) => (
                <TableRow key={val.id}>
                  <TableCell>{val.position}</TableCell>
                  <TableCell>
                    <Link
                      href={`${APP_URL}`}
                      target="_blank"
                      className={classes.link_style}
                    >
                      {`${APP_URL}`}
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
};
export default SilverLandingPage;
