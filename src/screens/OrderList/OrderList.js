import React from 'react';
import { withRouter } from "react-router-dom";
import { OrderProvider } from '../../context';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { useQuery } from 'react-apollo';
import { orderList } from '../../services/mapper';
import Component from './Orderlistcontent';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles(theme => ({
    progress: {
      margin: theme.spacing(2)
    },
  }));
export const OrderList = withRouter(props => {
    const classes = useStyles();

    const { data, loading, error } = useQuery(orderList.query);

    if(loading) return <div><CircularProgress className={classes.progress} />
    </div>
    if(error) return <div>error</div>
    return (
        
        <OrderProvider value={{ data, mapper: orderList.mapper, mappertype:  "orderMaster" }} >
            
    <Component {...props} />
    </OrderProvider>

)});
export default OrderList;