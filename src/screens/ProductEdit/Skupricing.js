import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import TableHead from "@material-ui/core/TableHead";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Typography,
  Button,
  Chip,
  Input,
  CircularProgress,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/CancelOutlined";
import EditPrice from "./Components/EditPrice/EditPrice";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { ProductContext } from "../../context";
import Switch from "@material-ui/core/Switch";
import { NetworkContext } from "../../context/NetworkContext";

const columns = [
  { id: "SKU", label: "SKU" },
  { id: "Cost Price", label: "Cost Price" },
  { id: "Cost Price Tax", label: "Cost Price Tax" },
  { id: "Selling Price", label: "Selling Price" },
  { id: "Selling Price Tax", label: "Selling Price Tax" },
  { id: "Markup Price", label: "Markup Price" },
  { id: "Markup Price Tax", label: "Markup Price Tax" },
  { id: "Discount Price", label: "Discount Price" },
  { id: "Discount Price Tax", label: "Discount Price Tax" },
  { id: "Margin On Sale", label: "Margin On Sale" },
  { id: "Discount", label: "Discount" },

  {
    id: "Disable",
    label: "Price Update",
    align: "center",
    format: (value) => value.toFixed(2),
  },
];

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

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
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
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

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  fixedTag: {
    padding: 0,
    "& .MuiOutlinedInput-root": {
      padding: 0,
    },
  },
  root: {
    marginTop: theme.spacing(2),
  },
  table: {
    // marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(2),
    width: "100%",
  },
  gempapper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: "100%",
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
}));

export default function Variants(props) {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { productCtx, setProductCtx } = React.useContext(ProductContext);
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [openedit, setOpenedit] = React.useState(false);
  const [editcontent, setEditcontent] = React.useState(null);
  const [btnEdit, setBtnEdit] = React.useState({
    action: false,
    pricerun: false,
    id: "",
  });
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });
  const handleApplicationOpen = () => {
    setOpenedit(true);
  };

  const handleApplicationClose = () => {
    setEditcontent(null);
    setOpenedit(false);
  };
  function handleChange(variantId) {
    let variantslist = productCtx.variants;
    variantslist =
      productCtx.variants &&
      productCtx.variants.map((variant, index) => {
        if (variant.id === variantId) {
          let status = variant.isActive
            ? (variant.isActive = false)
            : (variant.isActive = true);
        }
        return variant;
      });
    let filterVariant =
      variantslist &&
      variantslist.filter(
        (filter_data, index) => filter_data.id === variantId
      )[0];
    let editVaraint = {
      id: filterVariant.id,
      isActive: filterVariant.isActive,
    };
    let editVariants = productCtx.editVariants;
    let editStatus =
      editVariants &&
      editVariants.some(
        (check_variant, index) => check_variant.id === variantId
      )
        ? (editVariants =
            editVariants &&
            editVariants.filter(
              (edit_variant_filter, index) =>
                edit_variant_filter.id !== variantId
            ))
        : editVariants.push(editVaraint);
    setProductCtx({
      ...productCtx,
      variants: variantslist,
      editVariants,
    });
  }
  const emptyRows =
    rowsPerPage -
    Math.min(
      rowsPerPage,
      props.variants && props.variants.length - page * rowsPerPage
    );
  // function VariantEdit(id) {
  //   alert(id)
  //   setBtnEdit({ ...btnEdit, id, action: true })
  // }
  function handleChangePage(event, newPage) {
    setPage(newPage);
  }
  const handleinputChange = (type) => (e) => {
    // const re = /^[a-zA-Z \b]+$/;
    // if (e.target.value === '' || re.test(e.target.value)) {
    setProductCtx({ ...productCtx, [type]: e.target.value });
    // }
  };
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }
  function CancelEdit(diamondData) {
    setBtnEdit({ ...btnEdit, id: "", action: false });
  }
  async function Skupricesync(diamondData) {
    setBtnEdit({ ...btnEdit, id: diamondData.generatedSku, pricerun: true });

    let bodydata = {
      req_product_id: diamondData.productId,
      generatedSku: diamondData.generatedSku,
    };
    console.log(JSON.stringify(bodydata));
    await sendNetworkRequest("/productpriceupdate", {}, bodydata);
    setBtnEdit({ ...btnEdit, id: "", pricerun: false });
  }
  function DiamondEdit(diamondData) {
    setProductCtx({
      ...productCtx,
      editcostprice: diamondData.costPrice,
      editcostpricetax: diamondData.costPriceTax,
      editsellingprice: diamondData.sellingPrice,
      editsellingpricetax: diamondData.sellingPriceTax,
      editmarkupprice: diamondData.markupPrice,
      editmarkuppricetax: diamondData.markupPriceTax,
      editdiscountprice: diamondData.discountPrice,
      editdiscountpricetax: diamondData.discountPriceTax,
    });
    setEditcontent({
      id: diamondData.generatedSku,
      editcostprice: diamondData.costPrice,
      editcostpricetax: diamondData.costPriceTax,
      editsellingprice: diamondData.sellingPrice,
      editsellingpricetax: diamondData.sellingPriceTax,
      editmarkupprice: diamondData.markupPrice,
      editmarkuppricetax: diamondData.markupPriceTax,
      editdiscountprice: diamondData.discountPrice,
      editdiscountpricetax: diamondData.discountPriceTax,
    });
    //setBtnEdit({ ...btnEdit, id:diamondData.id, action: true })
    // setOpenedit(true)
    setBtnEdit({ ...btnEdit, id: diamondData.generatedSku, action: true });
  }
  function DiamondSave(priceobj) {
    var bodydata = {};
    let list_data = props.variants;
    let Skuchangedata = list_data.map((skulistdata, index) => {
      if (priceobj.id === skulistdata.generatedSku) {
        skulistdata.costPrice = priceobj.editcostprice;
        skulistdata.costPriceTax = priceobj.editcostpricetax;
        skulistdata.sellingPrice = priceobj.editsellingprice;
        skulistdata.sellingPriceTax = priceobj.editsellingpricetax;
        skulistdata.markupPrice = priceobj.editmarkupprice;
        skulistdata.markupPriceTax = priceobj.editmarkuppricetax;
        skulistdata.discountPrice = priceobj.editdiscountprice;
        skulistdata.discountPriceTax = priceobj.editdiscountpricetax;

        bodydata["costPrice"] = parseFloat(priceobj.editcostprice);
        bodydata["costPriceTax"] = parseFloat(priceobj.editcostpricetax);
        bodydata["sellingPrice"] = parseFloat(priceobj.editsellingprice);
        bodydata["sellingPriceTax"] = parseFloat(priceobj.editsellingpricetax);
        bodydata["markupPrice"] = parseFloat(priceobj.editmarkupprice);
        bodydata["markupPriceTax"] = parseFloat(priceobj.editmarkuppricetax);
        bodydata["discountPrice"] = parseFloat(priceobj.editdiscountprice);
        bodydata["discountPriceTax"] = parseFloat(
          priceobj.editdiscountpricetax
        );
        bodydata["marginOnSalePercentage"] = parseFloat(
          priceobj.marginOnSalePercentage
        );

        bodydata["generatedSku"] = priceobj.id;
        return skulistdata;
      }
      return skulistdata;
    });
    alert(JSON.stringify(bodydata));
    // sendNetworkRequest('/updateskupriceinfo', {}, bodydata)

    setBtnEdit({ ...btnEdit, id: "", action: false });
    // setEditcontent(null)
    // setOpenedit(false)
  }
  //   const handleoptionChange = type => (event, value) => {

  //     setProductCtx({ ...productCtx, [type]: value})

  // }
  // const handleInputChange = type => e => {
  //   setProductCtx({ ...productCtx, [type]: e.target.value  })
  // }
  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table
          className={classes.table}
          border={1}
          borderColor={"#ddd"}
          size="small"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              {props.columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {props.variants &&
              props.variants
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.generatedSku}
                    </TableCell>
                    {props.displycolumns.indexOf("Cost Price") > -1 ? (
                      <TableCell component="th" scope="row">
                        {btnEdit.action && btnEdit.id == row.generatedSku ? (
                          <Input
                            className={classes.helperinput}
                            variant="outlined"
                            margin="dense"
                            style={{ width: 40 }}
                            value={productCtx.editcostprice}
                            id="productname"
                            error={
                              productCtx &&
                              productCtx.error_message &&
                              productCtx.error_message.productname
                            }
                            name="productname"
                            label="Cost Price"
                            onChange={handleinputChange("editcostprice")}

                            //onInput={keyPress.bind(this)}
                            // onChange={handleinputChange('productname')}

                            //onChange={(e)=>handleinputChange(e,'productname')}
                          />
                        ) : (
                          <Typography className={classes.heading}>
                            {" "}
                            {row.costPrice}
                          </Typography>
                        )}{" "}
                      </TableCell>
                    ) : null}
                    {props.displycolumns.indexOf("Cost Price Tax") > -1 ? (
                      <TableCell component="th" scope="row">
                        {btnEdit.action && btnEdit.id == row.generatedSku ? (
                          <Input
                            className={classes.helperinput}
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            value={productCtx.editcostpricetax}
                            id="productname"
                            error={
                              productCtx &&
                              productCtx.error_message &&
                              productCtx.error_message.productname
                            }
                            name="productname"
                            label="Cost Price Tax"
                            onChange={handleinputChange("editcostpricetax")}

                            //onInput={keyPress.bind(this)}
                            // onChange={handleinputChange('productname')}

                            //onChange={(e)=>handleinputChange(e,'productname')}
                          />
                        ) : (
                          <Typography className={classes.heading}>
                            {" "}
                            {row.costPriceTax}{" "}
                          </Typography>
                        )}{" "}
                      </TableCell>
                    ) : null}
                    {props.displycolumns.indexOf("Selling Price") > -1 ? (
                      <TableCell component="th" scope="row">
                        {btnEdit.action && btnEdit.id == row.generatedSku ? (
                          <Input
                            className={classes.helperinput}
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            value={productCtx.editsellingprice}
                            id="productname"
                            error={
                              productCtx &&
                              productCtx.error_message &&
                              productCtx.error_message.productname
                            }
                            name="productname"
                            label="Selling Price"
                            onChange={handleinputChange("editsellingprice")}

                            //onInput={keyPress.bind(this)}
                            // onChange={handleinputChange('productname')}

                            //onChange={(e)=>handleinputChange(e,'productname')}
                          />
                        ) : (
                          <Typography className={classes.heading}>
                            {row.sellingPrice}{" "}
                          </Typography>
                        )}{" "}
                      </TableCell>
                    ) : null}

                    {props.displycolumns.indexOf("Selling Price Tax") > -1 ? (
                      <TableCell component="th" scope="row">
                        {btnEdit.action && btnEdit.id == row.generatedSku ? (
                          <Input
                            className={classes.helperinput}
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            value={productCtx.editsellingpricetax}
                            id="productname"
                            error={
                              productCtx &&
                              productCtx.error_message &&
                              productCtx.error_message.productname
                            }
                            name="productname"
                            label="Selling Price Tax"
                            onChange={handleinputChange("editsellingpricetax")}

                            //onInput={keyPress.bind(this)}
                            //onChange={handleinputChange('productname')}

                            //onChange={(e)=>handleinputChange(e,'productname')}
                          />
                        ) : (
                          <Typography className={classes.heading}>
                            {row.sellingPriceTax}{" "}
                          </Typography>
                        )}{" "}
                      </TableCell>
                    ) : null}

                    {props.displycolumns.indexOf("Markup Price") > -1 ? (
                      <TableCell component="th" scope="row">
                        {btnEdit.action && btnEdit.id == row.generatedSku ? (
                          <Input
                            className={classes.helperinput}
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            value={productCtx.editmarkupprice}
                            id="productname"
                            error={
                              productCtx &&
                              productCtx.error_message &&
                              productCtx.error_message.productname
                            }
                            name="productname"
                            label="Markup Price"
                            onChange={handleinputChange("editmarkupprice")}

                            //onInput={keyPress.bind(this)}
                            // onChange={handleinputChange('productname')}

                            //onChange={(e)=>handleinputChange(e,'productname')}
                          />
                        ) : (
                          <Typography className={classes.heading}>
                            {row.markupPrice}{" "}
                          </Typography>
                        )}{" "}
                      </TableCell>
                    ) : null}

                    {props.displycolumns.indexOf("Markup Price Tax") > -1 ? (
                      <TableCell component="th" scope="row">
                        {btnEdit.action && btnEdit.id == row.generatedSku ? (
                          <Input
                            className={classes.helperinput}
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            value={productCtx.editmarkuppricetax}
                            id="productname"
                            error={
                              productCtx &&
                              productCtx.error_message &&
                              productCtx.error_message.productname
                            }
                            name="productname"
                            label="Markup Price Tax"
                            onChange={handleinputChange("editmarkuppricetax")}

                            //onInput={keyPress.bind(this)}
                            // onChange={handleinputChange('productname')}

                            //onChange={(e)=>handleinputChange(e,'productname')}
                          />
                        ) : (
                          <Typography className={classes.heading}>
                            {row.markupPriceTax}{" "}
                          </Typography>
                        )}{" "}
                      </TableCell>
                    ) : null}

                    {props.displycolumns.indexOf("Discount Price") > -1 ? (
                      <TableCell component="th" scope="row">
                        {btnEdit.action && btnEdit.id == row.generatedSku ? (
                          <Input
                            className={classes.helperinput}
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            value={productCtx.editdiscountprice}
                            id="productname"
                            onChange={handleinputChange("editdiscountprice")}
                            error={
                              productCtx &&
                              productCtx.error_message &&
                              productCtx.error_message.productname
                            }
                            name="productname"
                            label="Discount Price"
                            //onInput={keyPress.bind(this)}
                            // onChange={handleinputChange('productname')}

                            //onChange={(e)=>handleinputChange(e,'productname')}
                          />
                        ) : (
                          <Typography className={classes.heading}>
                            {row.discountPrice}{" "}
                          </Typography>
                        )}{" "}
                      </TableCell>
                    ) : null}
                    {props.displycolumns.indexOf("Discount Price Tax") > -1 ? (
                      <TableCell component="th" scope="row">
                        {btnEdit.action && btnEdit.id == row.generatedSku ? (
                          <Input
                            className={classes.helperinput}
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            value={productCtx.editdiscountpricetax}
                            onChange={handleinputChange("editdiscountpricetax")}
                            id="productname"
                            error={
                              productCtx &&
                              productCtx.error_message &&
                              productCtx.error_message.productname
                            }
                            name="productname"
                            label="Discount Price Tax"
                            //onInput={keyPress.bind(this)}
                            // onChange={handleinputChange('productname')}

                            //onChange={(e)=>handleinputChange(e,'productname')}
                          />
                        ) : (
                          <Typography className={classes.heading}>
                            {row.discountPriceTax}{" "}
                          </Typography>
                        )}{" "}
                      </TableCell>
                    ) : null}

                    {props.displycolumns.indexOf("Margin on Sale") > -1 ? (
                      <TableCell
                        style={{ width: 40 }}
                        component="th"
                        scope="row"
                      >
                        {row.marginOnSalePercentage}
                      </TableCell>
                    ) : null}
                    {props.displycolumns.indexOf("Discount") > -1 ? (
                      <TableCell
                        style={{ width: 40 }}
                        component="th"
                        scope="row"
                      >
                        {row.discount}
                      </TableCell>
                    ) : null}
                    {props.displycolumns.indexOf("View") > -1 ? (
                      <TableCell
                        style={{ width: 40 }}
                        component="th"
                        scope="row"
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={(e) => props.onShow(row.generatedSku)}
                        >
                          Summary
                        </Button>{" "}
                      </TableCell>
                    ) : null}
                    {btnEdit.action && btnEdit.id == row.generatedSku ? (
                      <TableCell style={{ width: 40 }} align="center">
                        <Button
                          onClick={(e) => Skupricesync(row)}
                          size="small"
                          variant="outlined"
                          color="primary"
                        >
                          ₹ Run
                        </Button>
                        <Button onClick={(e) => DiamondSave(row.generatedSku)}>
                          <SaveIcon />
                        </Button>
                        <Button onClick={(e) => CancelEdit(row)}>
                          <CancelIcon />
                        </Button>
                      </TableCell>
                    ) : (
                      <TableCell style={{ width: 40 }} align="center">
                        {btnEdit.pricerun && btnEdit.id == row.generatedSku ? (
                          <CircularProgress size={15} />
                        ) : (
                          <Button
                            onClick={(e) => Skupricesync(row)}
                            size="small"
                            variant="outlined"
                            color="primary"
                          >
                            ₹ Run
                          </Button>
                        )}
                        <Button onClick={(e) => DiamondEdit(row)}>
                          <EditIcon />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            {emptyRows == 0 && (
              <TableRow style={{ height: 1 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={props.variants && props.variants.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
        {editcontent && (
          <EditPrice
            diamond={editcontent}
            onApply={DiamondSave}
            onClose={handleApplicationClose}
            open={openedit}
          />
        )}
      </div>
    </Paper>
  );
}
