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
  const { order, className, ...rest } = props;
  const client = useApolloClient();
  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader/>
      <Divider />
      <CardContent className={classes.content}>
        <Grid container>
           <Grid item xs={1} style={{display:"flex"}}>
             <Typography>MeetingLink :</Typography>          
           </Grid>
           <Grid item xs={5}>
           <Input fullWidth/>
           </Grid>
           <Grid item xs={1} style={{display:"flex"}}>
             <Typography>Status :</Typography>      
           </Grid>
           <Grid item xs={5}>
           <Select fullWidth>
                          <MenuItem>In-Progress</MenuItem>
                          <MenuItem>Approved</MenuItem>
                          <MenuItem>Completed</MenuItem>
                          <MenuItem>Submitted</MenuItem>
                          <MenuItem>Cancelled</MenuItem>
            </Select>
           </Grid>
        </Grid>
      </CardContent>    
    </Card>
  );
};

export default AppointmentExtra;
