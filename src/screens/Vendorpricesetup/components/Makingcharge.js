import { Button, Card, Grid, Input } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
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
import Moment from 'react-moment';
import { useHistory } from "react-router-dom";
import ConformationAlert from '../../../components/ConformationAlert';
import { GRAPHQL_DEV_CLIENT } from '../../../config';
import { NetworkContext } from '../../../context/NetworkContext';
import { DELETEMAKINGCHARGE, MAKINGCHARGEPRICELIST, METALMASTER, PRODUCTLISTSTATUSEDIT } from '../../../graphql/query';
import Addmakingchargeprice from './Addmakingchargeprice';


const columns = [
  { id: 'Metal', label: 'Metal' },
  { id: 'Purity', label: 'Purity' },
  { id: 'From Weight', label: 'From Weight' },
  { id: 'To weight', label: 'To weight' },
  { id: 'Cost Price', label: 'Cost Price' },

  { id: 'updated On', label: 'updated On' },
  { id: 'Edit / Delete', label: 'Edit / Delete', align: 'center' }

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

        {columns.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {/* <TableSortLabel
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
            </TableSortLabel> */}
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
  },
  cardroot: {
    flexGrow: 1,
  },
  cardcontent: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
}));

const AddContact = (props) => {
  let history = useHistory();
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [pageCount, setPageCount] = React.useState(0);
  const [offsetValue, setOffsetValue] = React.useState(0)
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [vendorid, setVendorid] = React.useState(props.vendor);
  const [editmc, setEditmc] = React.useState({})
  const [puritymaster, setPuritymaster] = React.useState([])

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.contactlist.length - page * rowsPerPage);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Product Id');
  const [editdiamond, setEditdiamond] = React.useState({})
  const [mchargelist, setMchargelist] = React.useState([])
  const [deleteid, setDeleteid] = React.useState('')
  const [metalmaster, setMetalmaster] = React.useState([])

  const [btnEdit, setBtnEdit] = React.useState({
    action: false,
    id: '',
    add: false
  })
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const [isconformation, setIsconformation] = React.useState(false);
  const showdeleteconformation = () => {
    setIsconformation(true);
  };

  const hidedeleteconformation = () => {
    setIsconformation(false);
  };
  async function handledelete(datacontent) {
    let variables = {
      elementId: deleteid
    }
    await props.client.mutate({ mutation: DELETEMAKINGCHARGE, variables }).then(res => {

      if (res !== null) {
        //refetch();
        // refetchval()
      }
    }).catch(err => {

    })
    setIsconformation(false);

  }
  function handleDelete(diamondData) {
    setDeleteid(diamondData.id)
    setIsconformation(true);
  }
  function CancelEdit(diamondData) {
    setBtnEdit({ ...btnEdit, id: '', action: false, add: true })

  }
  async function handleAdd(makingcontent) {
    let bodydata = {}
    bodydata['material'] = makingcontent.metal.name;
    bodydata['weight_start'] = makingcontent.weightstart;
    bodydata['weight_end'] = makingcontent.weightend;
    bodydata['price_type'] = makingcontent.pricetype.label;
    bodydata['vendor_code'] = props.vendor;
    bodydata['purity'] = makingcontent.purity.shortCode;
    bodydata['cost_price'] = makingcontent.costPrice;
    bodydata['selling_price'] = makingcontent.sellingprice;
    bodydata['isadd'] = true

    await sendNetworkRequest('/updatemakingcharge', {}, bodydata)

    setBtnEdit({ ...btnEdit, id: "", action: false })
    setOpen(false)
    getmclist()

  }
  function handleEdit(diamondData) {
    setEditmc({
      ...editmc,
      price: diamondData.price,
      updatedAt: new Date()


    })
    // setProductCtx({
    //   ...productCtx,
    //   editleadtime:diamondData.vendorDeliveryTime,
    //   editreadytoship: diamondData.isReadyToShip,
    //   editisdefault:diamondData.isdefault,
    //   editisactive:diamondData.isActive
    // })
    setBtnEdit({ ...btnEdit, id: diamondData.id, action: true })

  }
  async function getmclist() {
    let bodydata = {
      vendorid: props.vendor
    }

    let response = await sendNetworkRequest('/getvendormakingprice', {}, bodydata)
    setMchargelist(response.gems)

  }
  useEffect(() => {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: METALMASTER, variables: {} })
    };
    // console.log("helo",setProductCtx)
    fetch(url, opts)
      .then(res => res.json())
      .then(fatchvalue => {

        setMetalmaster(fatchvalue.data.allMasterMaterials.nodes)
        setPuritymaster(fatchvalue.data.allMasterMetalsPurities.nodes)

      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    getmclist()
  }, [vendorid])
  async function handleSave(id) {
    var bodydata = {}


    await sendNetworkRequest('/updatemakingcharge', {}, editmc)

    setBtnEdit({ ...btnEdit, id: "", action: false })
    getmclist()
  }
  function handleChangePage(event, newPage) {
    setPage(newPage);
    setOffsetValue(newPage * rowsPerPage)
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }
  function ProductEdit(id) {
    // localStorage.setItem('productEditId',id);
    history.push(`product_attributes/${id}`)
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleinputChange = type => e => {
    setEditmc({
      ...editmc,
      [type]: e.target.value
    })
    // setProductCtx({ ...productCtx, [type]: e.target.value})

  }
  // function productItemStatusChange(id,isactive){
  // let variable = {
  //   "productId": id
  // };
  // let status = isactive ? variable.isActive = false :variable.isActive = true;
  async function productItemStatusChange(id, isactive, refetch) {
    let variables = {
      productId: id,
      isActive: isactive ? false : true
    }
    await props.client.mutate({ mutation: PRODUCTLISTSTATUSEDIT, variables }).then(res => {

      if (res !== null) {
        refetch();
      }
    }).catch(console.error)

  }
  // const [productItemStatusChange,{ data }] = useMutation(PRODUCTLISTSTATUSEDIT);
  // }
  return (
    <>
      <ConformationAlert
        title={"Are you sure to delete?"}
        positivebtn={"Yes"}
        negativebtn={"No"}
        message={""}
        data={deleteid}
        onSuccess={handledelete}
        onCancel={hidedeleteconformation}
        isshow={isconformation} />
      <Card className={classes.cardcontent} >
        <Grid container justify="left" alignItems="center" className={classes.cardroot} spacing={4}>
          <Grid item xs={6}>
            <Typography variant="h6">
              {props.title}
            </Typography>
          </Grid>
          {/* <Grid item > 
      <TextField
          variant="outlined"
          margin="dense"
          label="Search By Purity"
          className={classes.helperinput}
          onChange={handleinputChange('weight_start')}
          id="productvendorcode"
          name="Cost Price"
      />
      </Grid> */}
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <Button color="primary" variant="contained" size="small" style={{ paddingRight: 16, paddingLeft: 16 }} onClick={handleClickOpen}>
              Add New
        </Button>
          </Grid>

        </Grid>
      </Card>
      <Paper className={classes.root}>




        <div className={classes.tableWrapper}>

          <Table className={classes.table} border={1} borderColor={"#ddd"} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label === 'Cost Price' ? props.ratetype == 1 ? "Cost Price" : "Selling Price" : column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <Query
                query={MAKINGCHARGEPRICELIST}
                onCompleted={data => setPageCount(data.allMakingChargeSettings.totalCount)}
                variables={{ "vendorCode": props.vendor, "ratetype": props.ratetype }}>
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
                        {data.allMakingChargeSettings.nodes.map((row, index) => (
                          <TableRow key={row.material}>
                            <TableCell component="th" scope="row">
                              {row.material}

                            </TableCell>
                            <TableCell align="left">{row.purity}</TableCell>

                            <TableCell align="left">
                              {/* {
                                    btnEdit.action && btnEdit.id == row.id ? <Input
                                    variant="outlined"
                                    margin="dense"
                                    label="Cost Price"
                                    fullWidth
                                    className={classes.helperinput}
                                    value= {editmc.weight_start}
                                    onChange={handleinputChange('weight_start')}
                                    id="productvendorcode"
                                    name="Cost Price"
                                    /> :  */}
                              <Typography className={classes.heading}>
                                {row.weightStart}
                              </Typography>
                            </TableCell>

                            <TableCell align="left">
                              {/* {
                                    btnEdit.action && btnEdit.id == row.id ? <Input
                                    variant="outlined"
                                    margin="dense"
                                    label={props.ratetype == 1 ? "Cost Price" : "Selling Price"}
                                    fullWidth
                                    className={classes.helperinput}
                                    value= {editmc.weight_end}
                                    onChange={handleinputChange('weight_end')}
                                    id="productvendorcode"
                                    name="Cost Price"
                                    /> :  */}
                              <Typography className={classes.heading}>
                                {row.weightEnd}
                              </Typography>
                            </TableCell>




                            <TableCell align="left">
                              {
                                btnEdit.action && btnEdit.id == row.id ? <Input
                                  variant="outlined"
                                  margin="dense"
                                  label="Cost Price"
                                  fullWidth
                                  className={classes.helperinput}
                                  value={editmc.price}
                                  onChange={handleinputChange('selling_price')}
                                  id="productvendorcode"
                                  name="Cost Price"
                                /> :
                                  <Typography className={classes.heading}>
                                    {row.price}
                                  </Typography>}
                            </TableCell>

                            {/* <TableCell align="left">
                                  {
                                    btnEdit.action && btnEdit.id == row.id ?  <Autocomplete
                                      id="free-solo-2-demo"
                                      fullWidth
                                      disableClearable
                                      className={classes.fixedTag}
                                      getOptionLabel={option => option.name}
                                      options={[{label: 1,name:"Flat"},{label:2,name:"Percentage"}]}
                                      renderTags={(value, getTagProps) =>
                                      value.map((option, index) => (
                                      <Chip variant="outlined" size="small" label={option.name} {...getTagProps({ index })} />
                                      ))
                                      }
                                      renderInput={params => (
                                      <TextField
                                      {...params}
                                      label="Price Type"
                                      margin="dense"
                                      variant="outlined"
                                      fullWidth
                                      InputProps={{ ...params.InputProps, readOnly: true, type: 'search' }}
                                      />
                                      )}
                                      /> : <Typography className={classes.heading}> 
                                      {row.selling_price_type === 0 ? 'Flat' : 'Percentage'} </Typography>  }

                                    </TableCell> */}


                            <TableCell align="left">
                              <Moment format="DD MMM YYYY hh:mm a">
                                {row.updatedAt}
                              </Moment>
                            </TableCell>
                            {
                              btnEdit.action && btnEdit.id == row.id ?
                                <TableCell style={{ width: 170 }} align="left">
                                  <Button onClick={(e) => handleSave(row.id)}><SaveIcon />
                                  </Button>
                                  <Button onClick={(e) => CancelEdit(row)}><CancelIcon />
                                  </Button>
                                </TableCell> :
                                <TableCell align="left" style={{ width: 170 }}>
                                  <Button onClick={(e) => handleEdit(row)}><EditIcon />
                                  </Button>
                                  <Button onClick={(e) => handleDelete(row)}><DeleteIcon />
                                  </Button>
                                </TableCell>
                            }
                          </TableRow>
                        ))}
                      </>
                    }
                    else {
                      return <div>{"Fetch Products"}</div>
                    }
                  }}
              </Query>
              {/* {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
            </TableBody>
            {/* <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10,100,200,500]}
                
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
          </TableFooter> */}
          </Table>
        </div>
        {open ? <Addmakingchargeprice metals={metalmaster} purities={puritymaster} isadd={open} title={"Add Making Charge Setup"} actionSave={handleAdd} actionclose={handleClose} /> : null}

      </Paper>
    </>
  );
}
export default withApollo(AddContact);
