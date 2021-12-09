import { Button, Paper, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import SaveIcon from '@material-ui/icons/Save';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Query, withApollo } from 'react-apollo';
import { useHistory } from "react-router-dom";
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { NetworkContext } from '../../context/NetworkContext';
import { TaxList } from '../../graphql/query';



// const columns = [
//   { id: 'name', label: 'Name' },
//   { id: 'vendorcode', label: 'Vendor Code' },
//   { id: 'Address', label: 'Address' },
//   { id: 'City', label: 'City' },
//   { id: 'gstNo', label: 'gstNo' },
//   { id: 'vendorDelivaryDays', label: 'vendorDelivaryDays' },
//   { id: 'updatedAt', label: 'updated on' },
//   { id: 'actions', label: 'actions' }

// ];

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
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
}));

const Vendor = (props) => {
  let history = useHistory();
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [pageCount, setPageCount] = React.useState(0);
  const [offsetValue, setOffsetValue] = React.useState(0)
  const [productlists, setProductlists] = React.useState([])
  const [allproductlists, setAllProductlists] = React.useState([])
  const [mastercategories, setMastercategories] = React.useState([])
  const [masterproducttypes, setMasterproducttypes] = React.useState([])
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [searchtext, setSearchtext] = React.useState('')
  const [editcontent, setEditcontent] = React.useState({})
  const [add, setAdd] = React.useState(props.isadd)
  const [isedit, setIsedit] = React.useState(false)

  const [btnEdit, setBtnEdit] = React.useState({
    action: false,
    id: ''
  })

  function Editvendor(vendordata) {
    setEditcontent({
      ...editcontent,
      id: vendordata.id,
      hsnNumber: vendordata.hsnNumber,
      taxName: vendordata.taxName,
      taxValue: vendordata.taxValue,
      updatedAt: vendordata.updatedAt,
      isedit: true
    })

    setBtnEdit({ ...btnEdit, id: vendordata.id, action: true })

  }
  async function Savevendor(refetch) {
    let response = await sendNetworkRequest('/updatetax', {}, editcontent)

    setBtnEdit({ ...btnEdit, id: '', action: false })
    refetch()
  }
  function Cancelcreate() {
    props.onCancel();
    setBtnEdit({ ...btnEdit, id: '', action: false })
  }
  function CancelEdit(diamondData) {

    setBtnEdit({ ...btnEdit, id: '', action: false })
  }
  const handleInputChange = type => e => {
    setEditcontent({ ...editcontent, [type]: e.target.value })
  }
  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.contactlist.length - page * rowsPerPage);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('hsnNumber');
  function handleChangePage(event, newPage) {
    setPage(newPage);
    setOffsetValue(newPage * rowsPerPage)

  }
  useEffect(() => {


  }, [])
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);

  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);



  };
  function searchproduct(searchtext, productcategory, producttype) {
    let products = allproductlists.filter(l => {
      return l.productId.toLowerCase().match(searchtext.toLowerCase()) || l.productName.toLowerCase().match(searchtext.toLowerCase());
    });
    setProductlists(products)
  }
  async function getproductlist(searchtext, productcategory, producttype, pagesize, offsetvalue, sort, orderby) {
    let bodydata = {
      size: pagesize ? pagesize : rowsPerPage,
      offset: offsetValue,
      searchtext: searchtext,
      productcategory: productcategory,
      producttype: producttype,
      order: sort ? sort : order,
      orderby: orderby ? orderby : orderBy
    }

    let response = await sendNetworkRequest('/getproductlist', {}, bodydata)
    setProductlists(response.products.rows)
    // setPageCount(response.products.count)
  }
  function applyfilter(searchtext, categoryname, typename) {
    getproductlist(searchtext, categoryname, typename)
  }

  return (
    <Paper className={classes.root}>
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
            columns={props.columns}
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {<Query
              query={TaxList}
              onCompleted={data => setPageCount(data.allMasterTaxSettings.totalCount)}
            >
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
                      {data.allMasterTaxSettings.nodes.map((row, index) => (
                        <>
                          {index == 0 && props.isadd ? <TableRow key={row.name}>
                            <TableCell align="left">
                              <TextField
                                variant="outlined"
                                margin="dense"

                                id="vendordeliverydays"
                                name="vendordeliverydays"
                                value={editcontent.hsnNumber}
                                onChange={handleInputChange('hsnNumber')}

                                label="HSN Number"
                              />
                            </TableCell>
                            <TableCell align="left">
                              <TextField
                                variant="outlined"
                                margin="dense"

                                id="vendordeliverydays"
                                name="vendordeliverydays"
                                value={editcontent.taxValue}
                                onChange={handleInputChange('taxValue')}

                                label="Tax %"
                              />
                            </TableCell>
                            <TableCell style={{ width: 20 }} align="center">
                              <Button onClick={(e) => Savevendor(refetch)}><SaveIcon />
                              </Button>
                              <Button onClick={(e) => Cancelcreate()}><CancelIcon />
                              </Button>
                            </TableCell>
                          </TableRow> : null}

                          <TableRow key={row.name}>
                            {
                              btnEdit.action && btnEdit.id == row.id && !props.isadd ?
                                <TableCell align="left">
                                  <TextField
                                    variant="outlined"
                                    margin="dense"

                                    id="vendordeliverydays"
                                    name="vendordeliverydays"
                                    value={editcontent.hsnNumber}
                                    onChange={handleInputChange('hsnNumber')}

                                    label="Vendor Delivery Days"
                                  /> </TableCell> : <TableCell align="center" onClick={(e) => Editvendor(row)} style={{ width: 20 }}>
                                  {row.hsnNumber}
                                </TableCell>}
                            {
                              btnEdit.action && btnEdit.id == row.id && !props.isadd ?
                                <TableCell align="left">
                                  <TextField
                                    variant="outlined"
                                    margin="dense"

                                    id="vendordeliverydays"
                                    name="vendordeliverydays"
                                    value={editcontent.taxValue}
                                    onChange={handleInputChange('taxValue')}

                                    label="Vendor Delivery Days"
                                  /> </TableCell> : <TableCell align="center" onClick={(e) => Editvendor(row)} style={{ width: 20 }}>
                                  {row.taxValue}
                                </TableCell>}
                            {
                              btnEdit.action && btnEdit.id == row.id && !props.isadd ?
                                <TableCell style={{ width: 20 }} align="center">
                                  <Button onClick={(e) => Savevendor(refetch)}><SaveIcon />
                                  </Button>
                                  <Button onClick={(e) => CancelEdit(row)}><CancelIcon />
                                  </Button>
                                </TableCell> :
                                <TableCell align="center" onClick={(e) => Editvendor(row)} style={{ width: 20 }}>
                                  <Button ><EditIcon />
                                  </Button>
                                </TableCell>
                            }


                          </TableRow>
                        </>
                      ))}
                    </>
                  }
                  else {
                    return <div>{"Fetch Products"}</div>

                  }
                }}
            </Query>}
            {/* {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}  */}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[50, 100, 200, 500]}
                colSpan={5}
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
