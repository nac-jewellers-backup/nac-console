import React, { useEffect, useState } from "react";
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

import {
  ALLSTYLORISILVERLISTINGBOTTOMBANNERS,
  CREATESILVERLISTINGBOTTOMBANNER,
  DELETESILVERLISTINGBOTTOMBANNER,
} from "../../../../graphql/query";
import { GRAPHQL_DEV_CLIENT, APP_URL } from "../../../../config";
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
const SilverListingBottom = (props) => {
  const classes = useStyles2();
  const [open, setOpen] = React.useState(false);
  const [alllandingbanner, setalllandingbanner] = useState([]);
  const [createlandingbanner, setCreatelandingbanner] = useState({
    position: "",
    link: "",
    mobile: "",
    web: "",
  });

  useEffect(() => {
    async function styloribannerfetch() {
      const url = GRAPHQL_DEV_CLIENT;
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: ALLSTYLORISILVERLISTINGBOTTOMBANNERS,
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
    }
    styloribannerfetch();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onChangeData = (event) => {
    setCreatelandingbanner({ ...createlandingbanner, [event.target.name]: event.target.value });
  };
  const handleDelete = async (id) => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: DELETESILVERLISTINGBOTTOMBANNER,
        variables: { id: id },
      }),
    };
    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        window.location.reload();
      })
      .catch(console.error);
  };

  const onsubmitvalue = async () => {
    let create_banner_data = {
      position: +"1",
      url: "#",
      mobile: createlandingbanner.mobile,
      web: createlandingbanner.web,
      now: new Date().toISOString(),
    };

    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: CREATESILVERLISTINGBOTTOMBANNER,
        variables: create_banner_data,
      }),
    };
  
    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        setOpen(false);
        window.location.reload();
      })
      .catch(console.error);
  };

  return (
    <>
      <Paper className={classes.root}>
        <Grid container item xs={12} style={{ padding: "16px" }} sm={12} alignItems={"flex-end"}>
          <Grid fullwidth item xs={9} sm={9}>
            <Typography component="h6" variant="h6" style={{ fontWeight: "bold" }}>
              NAC - Listing Page - Bottom Banners
            </Typography>
          </Grid>

          <Grid fullwidth item xs={3} sm={3} style={{ "text-align": "right" }}>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
              Add New
            </Button>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="form-dialog-title">NAC - Listing Page - Bottom Banners : </DialogTitle>
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
            {/* <TextField
              margin="dense"
              id="link"
              label="Link"
              variant="outlined"
              fullWidth
              onChange={onChangeData}
              value={createlandingbanner.link}
              name="link"
            /> */}
            <TextField
              margin="dense"
              id="mobile"
              label="Mobile Image"
              variant="outlined"
              fullWidth
              onChange={onChangeData}
              value={createlandingbanner.mobile}
              name="mobile"
            />
            <TextField
              margin="dense"
              id="web"
              label="Desktop Image"
              variant="outlined"
              fullWidth
              onChange={onChangeData}
              value={createlandingbanner.web}
              name="web"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onsubmitvalue}>Submit</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <div className={classes.tableWrapper}>
          <Table className={classes.table} border={1} borderColor={"#ddd"} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Link to Check</TableCell>
                <TableCell>Banner Image</TableCell>
                {/* <TableCell>Desktop Image</TableCell> */}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alllandingbanner.map((val, index) => (
                <TableRow key={val.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link href={`${APP_URL}/silver-jewellery`} target="_blank" className={classes.link_style}>
                      {`${APP_URL}/silver-jewellery`}
                    </Link>
                  </TableCell>
                  {/* <TableCell>
                    <Link href={val.mobile} target="_blank" className={classes.link_style}>
                    <img src={val.mobile} style={{ width: "150px", height: "auto" }} />
                    </Link>
                  </TableCell> */}
                  <TableCell>
                    <Link href={val.web} target="_blank" className={classes.link_style}>
                      <img alt="nacimages" src={val.web} style={{ width: "150px", height: "auto" }} />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(val.id)} style={{ color: "#fff", backgroundColor: "red" }}>
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
export default SilverListingBottom;
