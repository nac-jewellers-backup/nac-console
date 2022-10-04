import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { useApolloClient } from "react-apollo";
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Divider,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Link,
  Grid,
  Typography,
  Chip,Switch, Input,MenuItem,Select
} from "@material-ui/core";
import { GRAPHQL_DEV_CLIENT } from "../../../config";
import { API_URL } from "../../../config";
import { MUTATE_STATUS } from "../../../graphql/query";
import { AlertContext } from "../../../context";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 10,
  },
  actions: {
    flexDirection: "column",
    alignItems: "flex-end",
    "& > * + *": {
      marginLeft: 0,
    },
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
}));

const AppointmentExtra= (props) => {
  const { order, className,id, ...rest } = props;
  const client = useApolloClient();
  const classes = useStyles();
  const [selected,setSelected] = React.useState('')
  const [link,setLink] = React.useState('');
  const snack = React.useContext(AlertContext);

  React.useEffect(()=>{
   setSelected(order?.allAppointments?.nodes[0]?.status)
  },[order?.allAppointments?.nodes[0]?.status])

  const handleSelect = async (value) => {
    setSelected(value)
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: MUTATE_STATUS,
        variables: { id: parseInt(id), status:value },
      }),
    };

    await fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        window.location.reload();
      })
      .catch(console.error);
  };

  const handleLinkchange=(val)=>{
     setLink(val)
  }

  const sendEmail = () => {
    if(link !== ''){
      const url = API_URL + "/appointment/send_invite";
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_id: parseInt(id),
        meeting_link: link }),
      };
      fetch(url, opts)
        .then((res) => res.json())
        .then((fatchvalue) => {
          snack.setSnack({
            open: true,
            msg: "Meeting Link Send Successfully!",
          });
        })
        .catch((err) => {
          snack.setSnack({
            open: true,
            severity: "error",
            msg: "Some error occured!",
          });
        });
    } 
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader/>
      <Divider />
      <CardContent className={classes.content}>
        <Grid container spacing={1}>
           <Grid item xs={6} >
             <Typography>MeetingLink :</Typography>   
             <TextField fullWidth variant="outlined" onChange={(event)=>handleLinkchange(event.target.value)}/>       
           </Grid>
           <Grid item xs={6} >
             <Typography>Status :</Typography>
             <TextField 
        fullWidth
        variant="outlined"
        select
        value={selected}
        onChange={(event)=>handleSelect(event.target.value)}
        >
                          <MenuItem value="In-Progress">In-Progress</MenuItem>
                          <MenuItem value="Approved">Approved</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                          <MenuItem value="Submitted">Submitted</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>      
           </Grid>
        </Grid>
      </CardContent>   
      <CardActions>
        <Button variant="contained" color="primary" onClick={sendEmail}>Save Link</Button>
      </CardActions> 
    </Card>
  );
};

export default AppointmentExtra;
