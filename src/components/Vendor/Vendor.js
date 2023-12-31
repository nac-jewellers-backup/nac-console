import React, { useEffect, useContext, useState } from 'react';

import clsx from 'clsx';
import {lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Toolbar from '@material-ui/core/Toolbar';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {Paper, TextField} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableHead from '@material-ui/core/TableHead';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link'
import { Query, withApollo } from 'react-apollo';
import {VENDORLISTS,PRODUCTCATEGORY,PRODUCTFILTERMASTER,PRODUCTLISTSTATUSEDIT} from '../../graphql/query';
import { useHistory } from "react-router-dom";
import { Button,Grid, Switch, FormControlLabel } from '@material-ui/core';
import { useMutation,useQuery } from '@apollo/react-hooks';
import Moment from 'react-moment';
import {BASE_URL} from '../../config'
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Filterandsearch from './../../screens/Productlist/filterandsearch';
import { NetworkContext } from '../../context/NetworkContext';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import SaveIcon from '@material-ui/icons/Save';
const columns = [
  { id: 'vendorcode', label: 'Vendor Code' },
  { id: 'name', label: 'Name' },
  { id: 'Address', label: 'Address' },
  { id: 'City', label: 'City' },
  { id: 'gstNo', label: 'gstNo' },
  { id: 'vendorDelivaryDays', label: 'vendorDelivaryDays' },
  { id: 'updatedAt', label: 'updated on' },
  { id: 'actions', label: 'actions' }

];

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));
function createData(name, calories, fat) {
  return { name, calories, fat };
}
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  function handleFirstPageButtonClick(event) {
    onChangePage(event, 0);
  }

  function handleBackButtonClick(event) {
    onChangePage(event, page - 1);
  }

  function handleNextButtonClick(event) {
    onChangePage(event, page + 1);
  }

  function handleLastPageButtonClick(event) {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }

 
  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}


TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
  { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
  { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
  { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
  { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell> */}
        {columns.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? '' : ''}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
          
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));





const useStyles2 = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  contantview: {
   placeItems: "center",
    display: "flex",
    justifyContent: "center"
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
}));

const   Vendor=(props)=> {
  let history = useHistory();
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [pageCount,setPageCount] = React.useState(0);
  const [offsetValue,setOffsetValue] = React.useState(0)
  const [productlists,setProductlists] = React.useState([])
  const [allproductlists,setAllProductlists] = React.useState([])
  const [mastercategories,setMastercategories] = React.useState([])
  const [masterproducttypes,setMasterproducttypes] = React.useState([])
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [searchtext,setSearchtext] = React.useState('')
  const [editcontent,setEditcontent] = React.useState({})
  const [add,setAdd] = React.useState(false)
  const [isadd,setIsadd] = React.useState(false)
  const [newvendorcode, setNewvendorcode] = React.useState("")

  const [btnEdit, setBtnEdit] = React.useState({
    action: false,
    id: ''
  })
  async function addnewvendor()
  {

    let response =  await sendNetworkRequest('/getnewvendorcode', {}, {})
    setBtnEdit({ ...btnEdit, id:'', action: false }) 
    setIsadd(true)
    setNewvendorcode(response.newvendorcode)
  }
  function Cancelcreate(refetch) {
    window.location.reload();
    // props.onCancel();
  }
  function Editvendor(vendordata) {
    setEditcontent({
      ...editcontent,
      shortCode : vendordata.shortCode,
      name : vendordata.name,
      address : vendordata.address,
      city : vendordata.city,
      pincode : vendordata.pincode,
      gstNo : vendordata.gstNo,
      vendorDelivaryDays : vendordata.vendorDelivaryDays,
      isedit: true
    })
    setBtnEdit({ ...btnEdit, id:vendordata.shortCode, action: true })

  }
  async function Savevendor(refetch) {
    if(!editcontent.isedit)
    {
      
      editcontent['isedit'] = false
      editcontent['shortCode'] = newvendorcode
    }
   
     let response =  await sendNetworkRequest('/updatevendor', {}, editcontent)
     props.onCancel()
    setBtnEdit({ ...btnEdit, id:'', action: false })
  // refetch()
  if(!editcontent.isedit)
    {
      
  window.location.reload();
    }else{
      refetch()
    }

  }
  function CancelEdit(diamondData) {

    setBtnEdit({ ...btnEdit, id:'', action: false })
  }
  const handleInputChange = type => e => {
    setEditcontent({ ...editcontent, [type]: e.target.value  })
}
  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.contactlist.length - page * rowsPerPage);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('product_id');
  function handleChangePage(event, newPage) {
    setPage(newPage);
    setOffsetValue(newPage*rowsPerPage)
   // getproductlist("","","","",newPage)

  }
  useEffect( () => {

   // getproductlist("","","","","",order,orderBy)
  const query = props.client.query
    query({
      query: PRODUCTFILTERMASTER,
      fetchPolicy: "network-only"
    }).then((data) => {
      if (data) {
      // setProductlists(data.data.allProductLists.nodes)
       setMastercategories(data.data.allMasterProductCategories.nodes)
       setMasterproducttypes( data.data.allMasterProductTypes.nodes )
      }else{
      }
    })
  .catch((error) => {console.log("smbcj")})
  }, [])
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    getproductlist("","","",event.target.value,"")

  }
  function ProductEdit(id){
    // localStorage.setItem('productEditId',id);
    history.push(`product_attributes/${id}`)
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    getproductlist("","","","","",isAsc ? 'desc' : 'asc',property)



  };
  function searchproduct(searchtext, productcategory, producttype)
  {
    let products = allproductlists.filter(l => {
      return l.productId.toLowerCase().match( searchtext.toLowerCase()) || l.productName.toLowerCase().match( searchtext.toLowerCase());
    });
    setProductlists(products)
  }
  async function getproductlist(searchtext,productcategory,producttype,pagesize,offsetvalue,sort,orderby)
{
  let bodydata = {
    size : pagesize ? pagesize : rowsPerPage,
    offset : offsetValue,
    searchtext: searchtext,
    productcategory: productcategory,
    producttype: producttype,
    order: sort ? sort : order,
    orderby : orderby ? orderby : orderBy
  }

  let response =  await sendNetworkRequest('/getproductlist', {}, bodydata)
  setProductlists(response.products.rows)
  setPageCount(response.products.count)
}
function applyfilter(searchtext, categoryname, typename)
{
  getproductlist(searchtext,categoryname,typename)
}
  // function productItemStatusChange(id,isactive){
    // let variable = {
    //   "productId": id
    // };
    // let status = isactive ? variable.isActive = false :variable.isActive = true;
    async function productItemStatusChange(id,isactive,refetch){
      let variables ={
        productId:id,
        isActive:isactive ?false:true
      }
      await props.client.mutate({mutation:PRODUCTLISTSTATUSEDIT,variables}).then(res=>{

        if(res!==null){
          refetch();
        }
      }).catch(console.error)
    
    }
    // const [productItemStatusChange,{ data }] = useMutation(PRODUCTLISTSTATUSEDIT);
  // }
  return (
    <Paper className={classes.root}>
      <Grid container item xs={12} sm={12} className={classes.contantview} >
        <Grid fullwidth item xs={6} sm={6} style={{"text-align":"left", padding:"16px"} } >
          <Typography  component="h4" variant="h4" >
            Vendors
          </Typography>
          </Grid>
          <Grid fullwidth item xs={6} sm={6} style={{"text-align":"right","padding":"8px"} } >
            <Button variant="contained" onClick={() => addnewvendor()}  color="primary" >
              Add New Vendor
            </Button>
        
        </Grid>
    </Grid>
      {/* <Filterandsearch applyfilter={applyfilter} mastercategory={mastercategories} masterproducttype={masterproducttypes} searchproduct={searchproduct} /> */}
      <div className={classes.tableWrapper}>
        <Table className={classes.table} border={1} borderColor={"#ddd"} size="small" stickyHeader>
        {/* <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead> */}
           <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
          <TableBody>
          { <Query
              query={VENDORLISTS}
              onCompleted={data => setPageCount( data.allMasterVendors.totalCount )}
              variables={{ "Veiw": rowsPerPage, "Offset": offsetValue}}>
              {
                  ({ data, loading, error, refetch }) => {
                      if (loading) {
                          // return <Loader />
                      }
                      if (error) {
                        return <div>{error}</div>
                          // return false
                      }
                      if (data) { 
                           return <> 
                              {data.allMasterVendors.nodes.map((row, index) => (
                           <>
                           {index == 0 && isadd ? 
                           <TableRow key={row.name}>
                           <TableCell align="left">
                           <TextField
                              variant="outlined"
                              margin="dense"
                              contentEditable={false}
                              id="vendordeliverydays"
                              name="vendordeliverydays"
                              value={newvendorcode}
                              onChange={handleInputChange('shortCode')}

                              label="Vendor Code"
                             />
                           </TableCell>
                           <TableCell align="left">
                           <TextField
                              variant="outlined"
                              margin="dense"
                              
                              id="vendordeliverydays"
                              name="vendordeliverydays"
                              value={editcontent.taxValue}
                              onChange={handleInputChange('name')}

                              label="Vendor Name"
                             />
                           </TableCell>
                           <TableCell align="left">
                           <TextField
                              variant="outlined"
                              margin="dense"
                              
                              id="vendordeliverydays"
                              name="vendordeliverydays"
                              value={editcontent.taxValue}
                              onChange={handleInputChange('address')}

                              label="Address"
                             />
                           </TableCell>
                           <TableCell align="left">
                           <TextField
                              variant="outlined"
                              margin="dense"
                              
                              id="vendordeliverydays"
                              name="vendordeliverydays"
                              value={editcontent.taxValue}
                              onChange={handleInputChange('city')}

                              label="City"
                             />
                           </TableCell>
                           <TableCell align="left">
                           <TextField
                              variant="outlined"
                              margin="dense"
                              
                              id="vendordeliverydays"
                              name="vendordeliverydays"
                              value={editcontent.hsnNumber}
                              onChange={handleInputChange('gstNo')}

                              label="GST Number"
                             />
                           </TableCell>
                           <TableCell align="left">
                           <TextField
                              variant="outlined"
                              margin="dense"
                              
                              id="vendordeliverydays"
                              name="vendordeliverydays"
                              value={editcontent.hsnNumber}
                              onChange={handleInputChange('vendorDelivaryDays')}

                              label="vendordeliverydays"
                             />
                           </TableCell>
                           <TableCell align="left">
                           <Moment format="DD MMM YYYY hh:mm a">
                                  {new Date()}
                                  </Moment>
                           </TableCell>
                           
                    <TableCell  style = {{width: 20}} align="center">
                      <Button  onClick={(e) => Savevendor(refetch)}><SaveIcon />
                      </Button>
                      <Button onClick={(e) => Cancelcreate(refetch)}><CancelIcon />
                      </Button>
                    </TableCell>
                           </TableRow> : null }
                              
                                
                                <TableRow key={row.name}>
                                  <TableCell component="th" scope="row">
                                    {row.shortCode}
                                  </TableCell>
                {
                  btnEdit.action && btnEdit.id == row.shortCode && !isadd ? 
                  <TableCell align="left">
                  <TextField
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        id="vendorname"
                        name="vendorname"
                        value={editcontent.name}
                        onChange={handleInputChange('name')}
                        label="Vendor Name"
                        /> </TableCell> :  <TableCell align="left">{row.name} 
                           </TableCell> }
                           {
                  btnEdit.action && btnEdit.id == row.shortCode && !isadd ? 
                  <TableCell align="left">
                  <TextField
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        id="vendoraddress"
                        name="vendoraddress"
                        value={editcontent.address}
                        onChange={handleInputChange('address')}                        label="Vendor Address"
                        /> </TableCell> :  <TableCell align="left">{row.address} 
                           </TableCell> }

                           {
                        btnEdit.action && btnEdit.id == row.shortCode && !isadd ? 
                        <TableCell align="left">
                        <TextField
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              id="vendorcity"
                              name="vendorcity"
                              value={editcontent.city}
                              onChange={handleInputChange('city')}

                              label="Vendor City"
                             /> </TableCell> :  <TableCell align="left">{row.city} 
                           </TableCell> }
                                  
                           {
                        btnEdit.action && btnEdit.id == row.shortCode && !isadd ? 
                        <TableCell align="left">
                        <TextField
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              id="gst_no"
                              name="gst_no"
                              value={editcontent.gstNo}
                              onChange={handleInputChange('gstNo')}

                              label="GST Number"
                             /> </TableCell> :  <TableCell align="left">{row.gstNo} 
                           </TableCell> }  

                           {
                        btnEdit.action && btnEdit.id == row.shortCode && !isadd ? 
                        <TableCell align="left">
                        <TextField
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              id="vendordeliverydays"
                              name="vendordeliverydays"
                              value={editcontent.vendorDelivaryDays}
                              onChange={handleInputChange('vendorDelivaryDays')}

                              label="Vendor Delivery Days"
                             /> </TableCell> :  <TableCell align="left">{row.vendorDelivaryDays} 
                           </TableCell> }

                                  <TableCell align="left">            
                                  <Moment format="DD MMM YYYY hh:mm a">
                                  {row.createdAt}
                                  </Moment>
                                  </TableCell>
                                  {
                  btnEdit.action && btnEdit.id == row.shortCode && !isadd ?
                    <TableCell  style = {{width: 20}} align="center">
                      <Button  onClick={(e) => Savevendor(refetch)}><SaveIcon />
                      </Button>
                      <Button onClick={(e) => CancelEdit(row)}><CancelIcon />
                      </Button>
                    </TableCell> :
                    <TableCell align="center" onClick={(e) => Editvendor(row)} style = {{width: 20}}>
                      <Button ><EditIcon />
                      </Button>
                    </TableCell>
                }
                                  
                                </TableRow>
                                </>

                              ))}
                              
                         </> 
                       }
                      else{
                      return <div>{"Fetch Products"}</div>
                     
                 } } }
                </Query>  }
          {/* {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}  */}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[50,100,200,500]}
                count={pageCount}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Paper>
  );
}
export default withApollo(Vendor);
