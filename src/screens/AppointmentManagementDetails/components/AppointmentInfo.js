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
  Chip,
  Switch
} from "@material-ui/core";

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

const AppointmentInfo = (props) => {
  const { order, className, ...rest } = props;
  const client = useApolloClient();
  const classes = useStyles();
  

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Appointment Info" />
      <Divider />
      <CardContent className={classes.content}>
        <Grid container spacing={2}>
           <Grid item xs={4} >
             <Typography>Name :</Typography>
             <TextField variant="outlined" disabled value={order?.allAppointments?.nodes[0]?.customerName} size='small' style={{width:"80%"}}></TextField>
           </Grid>
           <Grid item xs={4}>
             <Typography>Email :</Typography>
             <TextField variant="outlined" disabled value={order?.allAppointments?.nodes[0]?.email} size='small' style={{width:"80%"}}></TextField>
           </Grid>
           <Grid item xs={4}>
             <Typography>Mobile :</Typography>
             <TextField variant="outlined" disabled value={order?.allAppointments?.nodes[0]?.mobile} size='small' style={{width:"80%"}}></TextField>
           </Grid>
           <Grid item xs={4}>
             <Typography>Type :</Typography>
             <TextField variant="outlined" disabled size="small" value={order?.allAppointments?.nodes[0]?.appointmentTypeId === 1 ? "Alive" : order?.allAppointments?.nodes[0]?.appointmentTypeId === 2 ? "Lotus" :order?.allAppointments?.nodes[0]?.appointmentTypeId === 3 ? "Piercing" : order?.allAppointments?.nodes[0]?.appointmentTypeId === 4 ? "Stones" : null}></TextField>
           </Grid>
           <Grid item xs={4} style={{display:"flex"}}>
             <Typography>Category :</Typography>
             <div style={{marginTop:"-5px",marginLeft:"10px"}}>
             {order?.allAppointments?.nodes[0]?.productCategory?.map((val)=>(
                <Chip label={val} color="primary" style={{marginLeft:'3px'}}/>
              ))}
             </div>              
           </Grid>
           <Grid item xs={4} style={{display:"flex"}}>
             <Typography>Metal Type :</Typography>
             <div style={{marginTop:"-5px",marginLeft:"10px"}}>
             {order?.allAppointments?.nodes[0]?.metalType?.map((val)=>(
                <Chip label={val} color="primary" style={{marginLeft:'3px'}}/>
              ))}
             </div>     
           </Grid>
           <Grid item xs={4} style={{display:"flex"}}>
             <Typography>isOnline :</Typography>
             <div style={{marginTop:"-10px",marginLeft:"10px"}}>
                <Switch  value={order?.allAppointments?.nodes[0]?.isOnline} checked={order?.allAppointments?.nodes[0]?.isOnline ? true : false}/>
            </div> 
           </Grid>
           <Grid item xs={4} style={{display:"flex"}}>
             <Typography>is IT required :</Typography>
             <div style={{marginTop:"-10px",marginLeft:"10px"}}>
                <Switch value={order?.allAppointments?.nodes[0]?.isItRequired} checked={order?.allAppointments?.nodes[0]?.isItRequired ? true : false}/>
            </div> 
           </Grid>
           <Grid item xs={4}>
             <Typography>Special Requests :</Typography>
             <TextField variant="outlined" disabled value={order?.allAppointments?.nodes[0]?.specialRequests} size='small' style={{width:"80%"}}></TextField>
           </Grid>
           <Grid item xs={4} style={{display:"flex"}}>
             <Typography>Are more Members Joining :</Typography>
             <div style={{marginTop:"-10px",marginLeft:"10px"}}> 
             <Switch value={order?.allAppointments?.nodes[0]?.areMoreMembersJoining} checked={order?.allAppointments?.nodes[0]?.areMoreMembersJoining ? true :false}/>
             </div>
           </Grid>
           <Grid item xs={4}>
             <Typography>Location :</Typography>
             <TextField variant="outlined" disabled value={order?.allAppointments?.nodes[0]?.storeLocationByLocationId?.address}  multiline style={{width:"80%"}}></TextField>
           </Grid>
        </Grid>
      </CardContent>    
    </Card>
  );
};

export default AppointmentInfo;
