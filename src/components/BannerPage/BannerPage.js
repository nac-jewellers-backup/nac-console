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
import { Something } from "./dummySS";
import { CREATEALLBANNERS, ALLBANNERS } from "../../graphql/query";
import { GRAPHQL_DEV_CLIENT } from "../../config";

const useStyles = makeStyles((theme) => ({
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

function BannerPage(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [allbanner, setallbanner] = useState([]);
  const [createlandingbanner, setCreatelandingbanner] = useState({
    position: "",
    link: "",
    mobile: "",
    web: "",
  });
  useEffect(() => {
    async function allbannerfetch() {
      const url = GRAPHQL_DEV_CLIENT;
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: ALLBANNERS,
        }),
      };

      await fetch(url, opts)
        .then((res) => res.json())
        .then((fatchvalue) => {
          let data = fatchvalue.data.allBanners.nodes;
          data.sort((a, b) => parseFloat(a.position) - parseFloat(b.position));

          setallbanner(data);
        })
        .catch(console.error);
    }
    allbannerfetch();
    console.log("fetch", allbanner);
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

  const onsubmitvalue = async () => {
    let create_banner_data = {
      position: Number(createlandingbanner.position),
      url: createlandingbanner.link,
      mobile: createlandingbanner.mobile,
      web: createlandingbanner.web,
      now: new Date().toISOString(),
    };
    debugger;
    console.log("create_banner_data", create_banner_data);
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: CREATEALLBANNERS,
        variables: create_banner_data,
      }),
    };
    debugger;
    console.log(opts);
    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        debugger;

        setOpen(false);
        window.location.reload();
        console.log("isokay", fatchvalue);
      })
      .catch(console.error);
  };

  return (
    <div>
      <Paper className={classes.root}>
        <Grid container item xs={12} style={{ padding: "16px" }} sm={12} alignItems={"flex-end"}>
          <Grid fullwidth item xs={9} sm={9}>
            <Typography component="h6" variant="h6" style={{ fontWeight: "bold" }}>
              NAC All Banners
            </Typography>
          </Grid>

          <Grid fullwidth item xs={3} sm={3} style={{ "text-align": "right" }}>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
              Add New
            </Button>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle id="form-dialog-title">Stylori Landing Page : </DialogTitle>
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
              label="Link"
              variant="outlined"
              fullWidth
              onChange={onChangeData}
              value={createlandingbanner.link}
              name="link"
            />
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
              label="Web Image"
              variant="outlined"
              fullWidth
              onChange={onChangeData}
              value={createlandingbanner.web}
              name="web"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onsubmitvalue}>Submit</Button>
            <Button onClick={handleClose}> Cancel</Button>
          </DialogActions>
        </Dialog>

        <div className={classes.tableWrapper}>
          <Table className={classes.table} border={1} borderColor={"#ddd"} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Link</TableCell>
                <TableCell>Mobile URL</TableCell>
                <TableCell>Web URL</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allbanner.map((val, index) => (
                <TableRow key={val.id}>
                  <TableCell>{val.position}</TableCell>
                  <TableCell>
                    <Link href={val.url} target="_blank" className={classes.link_style}>
                      {val.url}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={val.mobile} target="_blank" className={classes.link_style}>
                      {val.mobile}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={val.web} target="_blank" className={classes.link_style}>
                      {val.web}
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
      </Paper>
    </div>
  );
}

export default BannerPage;
