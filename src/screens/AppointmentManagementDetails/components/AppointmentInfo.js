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
  Switch,
  FormControlLabel,
  Radio
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
             <p>{order?.allAppointments?.nodes[0]?.customerName ?? 'no data'}</p>
           </Grid>
           <Grid item xs={4}>
             <Typography>Email :</Typography>
             <p>{order?.allAppointments?.nodes[0]?.email ?? 'no data'}</p>
           </Grid>
           <Grid item xs={4}>
             <Typography>Mobile :</Typography>
             <p>{order?.allAppointments?.nodes[0]?.mobile ?? 'no data'}</p>
           </Grid>
           <Grid item xs={4}>
             <Typography>Type :</Typography>
             <p>{order?.allAppointments?.nodes[0]?.appointmentDateTimeSlotBySlotId?.appointmentTypeId === 1 ? "Alive" : order?.allAppointments?.nodes[0]?.appointmentTypeId === 2 ? "Lotus" :order?.allAppointments?.nodes[0]?.appointmentTypeId === 3 ? "Piercing" : order?.allAppointments?.nodes[0]?.appointmentTypeId === 4 ? "Stones" : order?.allAppointments?.nodes[0]?.appointmentDateTimeSlotBySlotId?.appointmentTypeId === 5 ? "Enquiry" :"no Data" }</p>
           </Grid>
           <Grid item xs={4}>
             <Typography>Category :</Typography>
             <div style={{marginTop:"5px"}}>
              {order?.allAppointments?.nodes[0]?.productCategory?.length > 0  ? order?.allAppointments?.nodes[0]?.productCategory?.map((val)=>(
                <Chip label={val} color="primary" style={{marginLeft:'3px',textTransform:'capitalize'}}/>
              )) : 'no data'}
             </div>              
           </Grid>
           <Grid item xs={4}>
             <Typography>Metal Type :</Typography>
             <div style={{marginTop:"5px"}}>
             {order?.allAppointments?.nodes[0]?.metalType?.length > 0 ? order?.allAppointments?.nodes[0]?.metalType?.map((val)=>(
                <Chip label={val} color="primary" style={{marginLeft:'3px',textTransform:'capitalize'}}/>
              )) : 'no data'}
             </div>     
           </Grid>
           <Grid item xs={4} >
             <Typography>isOnline :</Typography>
             <div style={{marginTop:"5px",marginLeft:"10px"}}>
             <FormControlLabel value="end" control={<Radio color="primary"  checked={order?.allAppointments?.nodes[0]?.isOnline ? true : null}/>} label="Yes" />
             <FormControlLabel value="end" control={<Radio color="primary"  checked={order?.allAppointments?.nodes[0]?.isOnline ? null : true}/>} label="No" />
            </div> 
           </Grid>
           <Grid item xs={4}>
             <Typography>is IT required :</Typography>
             <div style={{marginTop:"5px",marginLeft:"10px"}}>
             <FormControlLabel value="end" control={<Radio color="primary"  checked={order?.allAppointments?.nodes[0]?.isItRequired ? true : null}/>} label="Yes" />
             <FormControlLabel value="end" control={<Radio color="primary"  checked={order?.allAppointments?.nodes[0]?.isItRequired ? null : true}/>} label="No" />
            </div> 
           </Grid>
           <Grid item xs={4} >
             <Typography>Are more Members Joining :</Typography>
             <div style={{marginTop:"5px",marginLeft:"10px"}}> 
             <FormControlLabel value="end" control={<Radio color="primary"  checked={order?.allAppointments?.nodes[0]?.areMoreMembersJoining ? true : null}/>} label="Yes" />
             <FormControlLabel value="end" control={<Radio color="primary"  checked={order?.allAppointments?.nodes[0]?.areMoreMembersJoining ? null : true}/>} label="No" />
             </div>
           </Grid>
           <Grid item xs={4}>
             <Typography>Special Requests :</Typography>
             <p style={{width:"80%",overflowWrap:'break-word'}}>{order?.allAppointments?.nodes[0]?.specialRequests ?? 'no data'}</p>
           </Grid>
        </Grid>
      </CardContent>    
    </Card>
  );
};

export default AppointmentInfo;
