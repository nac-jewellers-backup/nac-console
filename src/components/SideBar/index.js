import React from 'react';
import clsx from 'clsx';
import {  useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
  import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { withRouter } from 'react-router-dom';
import { useStyles } from './styles';
import Collapse from '@material-ui/core/Collapse';
import StarBorder from '@material-ui/icons/StarBorder';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { ProductContext } from '../../context';
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link'
import { GlobalContext } from '../../context';
import {  Paper, Avatar, Typography } from '@material-ui/core';


function SideBar() {
  const classes = useStyles();
  const theme = useTheme();
  const { globalCtx, setGlobalCtx } = React.useContext(GlobalContext);
  const { productCtx, setProductCtx } = React.useContext(ProductContext);

  const handleDrawer = () => {
    setGlobalCtx({ ...globalCtx, sideBarOpen: !globalCtx.sideBarOpen })
  }
  const handleClick = type => e => {
    setGlobalCtx({ ...globalCtx, "optionname": type , isExpand: !globalCtx.isExpand})

  }
  // const handleClick  = type => e => {
      
  //     setGlobalCtx({ ...globalCtx,optionname: isExpand: !globalCtx.isExpand })

  // }
  function handleListItemClick(event, index)
  {
    setGlobalCtx({ ...globalCtx, selectedIndex: index,isExpand: !globalCtx.isExpand})

  }

  return (
      <>
     
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: globalCtx.sideBarOpen,
          [classes.drawerClose]: !globalCtx.sideBarOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: globalCtx.sideBarOpen,
            [classes.drawerClose]: !globalCtx.sideBarOpen,
          }),
        }}
        open={globalCtx.sideBarOpen}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawer}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
       
        <List>
          
          <Link underline='none' component={RouterLink} to={'/productlist'}>

            <ListItem button key={"Product List"}  >
            <ListItemIcon><InboxIcon /> </ListItemIcon>

              <ListItemText primary={"Product List"} />
            </ListItem>
            </Link>
            <ListItem button onClick={handleClick('Pricing')}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Pricing" />
              {globalCtx.isExpand && globalCtx.optionname === 'Pricing' ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={globalCtx.isExpand  && globalCtx.optionname === 'Pricing'} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        <Link underline='none' component={RouterLink} to={'/vendorpricesetup'}>

          <ListItem button className={classes.nested} selected={globalCtx.selectedIndex === 1} onClick={event => handleListItemClick(event, 1)}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Vendor Price Setup" />
          </ListItem>
          </Link>
          <Link underline='none' component={RouterLink} to={'/markuppricesetup'}>

          <ListItem button className={classes.nested} selected={globalCtx.selectedIndex === 2} onClick={event => handleListItemClick(event, 2)}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Selling Price Markup Setup" />
          </ListItem>
          </Link>
          <Link underline='none' component={RouterLink} to={'/voucherdiscount'}>

          <ListItem button className={classes.nested} selected={globalCtx.selectedIndex === 3} onClick={event => handleListItemClick(event, 3)}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Discount Setup" />
          </ListItem>
          </Link>
          <Link underline='none' component={RouterLink} to={'/priceupdate'}>

          <ListItem button className={classes.nested} selected={globalCtx.selectedIndex === 4} onClick={event => handleListItemClick(event, 4)}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Price Run" />
          </ListItem>
          </Link>
        </List>
      </Collapse>
          <Link underline='none' component={RouterLink} to={'/vendorlist'}>
            <ListItem button key={"Vendorlist"}  >
            <ListItemIcon><InboxIcon /> </ListItemIcon>

              <ListItemText primary={"Vendorlist"} />
            </ListItem>
            </Link>
            <Link underline='none' component={RouterLink} to={'/orderlist'}>

            <ListItem button key={"Order List"}  >
            <ListItemIcon><InboxIcon /> </ListItemIcon>

              <ListItemText primary={"Order List"} />
            </ListItem>
            </Link>
          <Link underline='none' component={RouterLink} to={'/configuration'}>

            <ListItem button key={"Configuration"}  >
            <ListItemIcon><InboxIcon /> </ListItemIcon>

              <ListItemText primary={"Configuration"} />
            </ListItem>
            </Link>

       <ListItem button onClick={handleClick('Discounts')}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Discounts" />
        {globalCtx.isExpand && globalCtx.optionname === 'Discounts' ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={globalCtx.isExpand && globalCtx.optionname === 'Discounts'} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        <Link underline='none' component={RouterLink} to={'/voucherdiscount'}>

          <ListItem button className={classes.nested} selected={globalCtx.selectedIndex === 1} onClick={event => handleListItemClick(event, 1)}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Sales Discount" />
          </ListItem>
          </Link>
          <Link underline='none' component={RouterLink} to={'/voucherdiscount'}>

          <ListItem button className={classes.nested} selected={globalCtx.selectedIndex === 2} onClick={event => handleListItemClick(event, 2)}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Voucher Discount" />
          </ListItem>
          </Link>
        </List>
      </Collapse>


        </List>
      </Drawer>
    </>
  );
}

export default withRouter(SideBar);