import {
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React from "react";
import { useApolloClient, useQuery } from "react-apollo";
import { AlertContext } from "../../context";
import {
  CREATE_WAREHOUSE,
  DELETE_WAREHOUSE,
  UPDATE_WAREHOUSE,
} from "../../graphql/mutation";
import { WAREHOUSELIST } from "../../graphql/query";
import SheduleModal from "./shedulemodal";
import SheduleModalShow from "./shedulemodalshow";

export const ManageShedule = (props) => {
  const { loading, data, error, refetch } = useQuery(WAREHOUSELIST);
  const [open, setOpen] = React.useState(false);
  const [openmodal, setOpenmodal] = React.useState({});
  const [type, setType] = React.useState();
  const [item, setItem] = React.useState({ name: "", shippingInDays: "" });

  const editItem = (event) => {
    var { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const client = useApolloClient();

  const snack = React.useContext(AlertContext);
  const useStyles = makeStyles((theme) => ({
    datecard: {
      backgroundColor: "white",
      padding: "12px",
      cursor: "pointer",
      borderTop: "4px solid #3F51B5",
      "&:hover": {
        borderTop: "5px solid #3F51B5",
        boxShadow: "0px 3px 6px #c1c1c1",
      },
    },
    date: {
      fontSize: "22px",
      padding: "10px 0px",
    },
    day: {
      fontSize: "14px",
    },
  }));

  const onClose = () => {
    setOpen(false);
    setType(null);
    setItem({ name: "", shippingInDays: "" });
  };

  const handleSave = () => {
    item["shippingInDays"] = parseInt(item.shippingInDays);
    if (type === "Edit") {
      var id = item.id;
      delete item.id;
      delete item.createdAt;
      delete item.updatedAt;
      delete item.__typename;
      item["updatedAt"] = new Date();
      client
        .mutate({
          mutation: UPDATE_WAREHOUSE,
          variables: {
            id,
            item,
          },
        })
        .then((res) => {
          if (res) {
            onClose();
            snack.setSnack({
              open: true,
              msg: "Successfully Updated!",
            });
            refetch();
          }
        })
        .catch((err) => {
          console.log(err);
          onClose();
          snack.setSnack({
            open: true,
            severity: "error",
            msg: "Some error occured!",
          });
        });
    }
    if (type === "Add") {
      client
        .mutate({
          mutation: CREATE_WAREHOUSE,
          variables: {
            item,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
        .then((res) => {
          if (res) {
            onClose();
            snack.setSnack({
              open: true,
              msg: "Successfully Added!",
            });
            refetch();
          }
        })
        .catch((err) => {
          console.log(err);
          setOpen(false);
          snack.setSnack({
            open: true,
            severity: "error",
            msg: "Some error occured!",
          });
        });
    }
    if (type === "Delete") {
      client
        .mutate({
          mutation: DELETE_WAREHOUSE,
          variables: {
            id: item.id,
          },
        })
        .then((res) => {
          if (res) {
            onClose();
            snack.setSnack({
              open: true,
              msg: "Successfully Deleted!",
            });
            refetch();
          }
        })
        .catch((err) => {
          console.log(err);
          onClose();
          snack.setSnack({
            open: true,
            severity: "error",
            msg: "Some error occured!",
          });
        });
    }
  };

  const handleSwitch = (id, isActive) => {
    client
      .mutate({
        mutation: UPDATE_WAREHOUSE,
        variables: {
          id,
          item: { isActive: !isActive, updatedAt: new Date() },
        },
      })
      .then((res) => {
        if (res) {
          onClose();
          snack.setSnack({
            open: true,
            msg: "Successfully Updated!",
          });
          refetch();
        }
      })
      .catch((err) => {
        console.log(err);
        onClose();
        snack.setSnack({
          open: true,
          severity: "error",
          msg: "Some error occured!",
        });
      });
  };
  const dummydata = [
    {
      id: 1,
      date: "22",
      month: "Jun",
      year: "2021",
      day: "Mon",
      time: [
        "22/12/2021 09:41:05",
        "22/12/2021 09:41:05",
        "22/12/2021 09:41:05",
      ],
    },
    {
      id: 2,
      date: "19",
      month: "Jun",
      year: "2021",
      day: "Thu",
      time: [
        "22/12/2021 09:41:05",
        "22/12/2021 09:41:05",
        "22/12/2021 09:41:05",
      ],
    },
    {
      id: 3,
      date: "10",
      month: "Jun",
      year: "2021",
      day: "Fri",
      time: [
        "22/12/2021 09:41:05",
        "22/12/2021 09:41:05",
        "22/12/2021 09:41:05",
      ],
    },
  ];
  const handlemodalshow = (lab) => {
    let key = lab.toString();

    setOpenmodal({
      ...openmodal,
      [key]: !openmodal[key],
    });
  };

  const classes = useStyles();
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
        <Typography variant="h4">Manage Shedule</Typography>
        <IconButton
          style={{ color: "#000" }}
          onClick={() => {
            setOpen(true);
            setType("Add");
          }}
        >
          <Tooltip title="Add Warehouse">
            <AddCircleIcon />
          </Tooltip>
        </IconButton>
      </Grid>
      <Grid container spacing={2}>
        {dummydata.map((val) => {
          return (
            <Grid item xs={1}>
              <div
                className={classes.datecard}
                onClick={() => {
                  handlemodalshow(val.id);
                }}
              >
                <Typography className={classes.day}>{val.day}</Typography>
                <Typography className={classes.date}>{val.date}</Typography>
                <Typography className={classes.day}>{val.year}</Typography>
              </div>
              <SheduleModalShow
                open={openmodal[val.id]}
                data={val}
                close={() => handlemodalshow(val.id)}
              />
            </Grid>
          );
        })}
      </Grid>
      <SheduleModal
        open={open}
        type={type}
        item={item}
        editItem={editItem}
        handleSave={handleSave}
        onClose={onClose}
      />
    </Grid>
  );
};
