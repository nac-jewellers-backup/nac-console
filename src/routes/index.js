import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ApolloClient from "apollo-boost";
import route from "./route";
import {
  Dashboard,
  Login,
  Productupload,
  Configuration,
  Manageusers,
  Customerdetails,
  Priceupdate,
  Vendorprice,
  Vendorlist,
  Markupprice,
  Goldpriceupdate,
  Userwishlist,
  Productlist,
  Materiallist,
  Masterorderstatus,
  Shippingzones,
  Manageadminusers,
  Shipmentsettings,
  Addshippingattributes,
  Userconfiguration,
  Masterroles,
  Masterscreens,
  Useraddresses,
  Addtaxattributes,
  OrderManagementDetails,
  Materialmaster,
  CategoryList,
  Mastermetalcolors,
  Masterpurities,
  Masterdesigns,
  Shippingattributes,
  Voucherdiscount,
  Masterstyles,
  Masterthemes,
  Masteroccassions,
  Masterpaymentstatus,
  Salediscount,
  Masterweights,
  Taxsettings,
  Masterstones,
  Masterstonecolors,
  Masterstoneshapes,
  Masterattribute,
  Mastercategories,
  OrderList,
  Mastergemsettings,
  Seopriority,
  Mastergenders,
  Mastergemshapes,
  Mastergemtypes,
  Earringbacking,
  Masterproducttypes,
  Masterdiamondshapes,
  Taxsetup,
  Masterdiamonds,
  Masterdiamondsettings,
  DiscountList,
  VoucherdiscountListing,
  Mastercollections,
  Masterpages,
  HolidayManager,
  Inventory,
  Warehouse,
} from "../screens";
import cmshome from "../screens/cms/cmshome";
import PrivateRoute from "./PrivateRoute";
import { NetworkProvider } from "../context/NetworkContext";
import { GlobalContext } from "../context";
import { ApolloProvider } from "react-apollo";
import { ProductAttributes } from "../screens/ProductEdit/ProductAttributes";
import { CreateVariant } from "../screens/ProductEdit/CreateVariant";
import Silverbanner from "../screens/cms/silverbanner/silverbanner";
import SilverListingbanner from "../screens/cms/silverbanner/silverListingBanner/silverListingBanner";
import { ProductContext, ProductProvider } from "../context/ProductuploadContext";
import newmaterial from "../screens/CategoryList/components/newmaterial/newmaterial";
import Editcategory from "../screens/CategoryList/components/editpage/editcategory";
import FeaturedProduct from "../components/FeaturedProduct/FeaturedProduct.js"
const MainApp = () => {
  const { globalCtx } = React.useContext(GlobalContext);
  const { productCtx } = React.useContext(ProductContext);
  const client = new ApolloClient({ uri: globalCtx.gqlClient });

  return (
    <ApolloProvider client={client}>
      {/* <ProductProvider > */}
      <NetworkProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Login} />
          <Route path={route.login} component={Login} />
          <PrivateRoute path={route.dashboard} component={Dashboard} />
          <PrivateRoute path={route.productupload} component={Productupload} />
          <PrivateRoute path={route.configuration} component={Configuration} />
          <PrivateRoute path={route.vendor} component={Vendorlist} />
          <PrivateRoute path={route.productlist} component={Productlist} />
          <PrivateRoute path={route.materiallist} component={CategoryList} />
          <PrivateRoute path={route.editCategory} component={Editcategory} />
          <PrivateRoute path={route.materiallistpage} component={newmaterial} />
          <PrivateRoute path={route.cmshome} component={cmshome} />
          <PrivateRoute path={route.producttypes} component={Masterproducttypes} />
          <PrivateRoute path={route.voucherdiscount} component={Voucherdiscount} />
          <PrivateRoute path={route.priceupdate} component={Priceupdate} />
          <PrivateRoute path={route.orderlist} component={OrderList} />
          <PrivateRoute path={route.userorders} component={OrderList} />
          <PrivateRoute path={route.address} component={Useraddresses} />

          <PrivateRoute path={route.vendorPrice} component={Vendorprice} />
          <PrivateRoute path={route.markupPrice} component={Markupprice} />
          <PrivateRoute path={route.salediscount} component={Salediscount} />
          <PrivateRoute path={route.taxsetup} component={Taxsetup} />
          <PrivateRoute path={route.taxsettings} component={Taxsettings} />
          <PrivateRoute path={route.category} component={Mastercategories} />
          <PrivateRoute path={route.masterattributes} component={Masterattribute} />
          <PrivateRoute path={route.masterstones} component={Masterstones} />
          <PrivateRoute path={route.masterstonecolors} component={Masterstonecolors} />
          <PrivateRoute path={route.masterstoneshapes} component={Masterstoneshapes} />
          <PrivateRoute path={route.weights} component={Masterweights} />
          <PrivateRoute path={route.masteroccassions} component={Masteroccassions} />
          <PrivateRoute path={route.masterroles} component={Masterroles} />
          <PrivateRoute path={route.masterpages} component={Masterscreens} />
          <PrivateRoute path={route.manageadminusers} component={Manageadminusers} />
          <PrivateRoute path={route.goldpriceupdate} component={Goldpriceupdate} />
          <PrivateRoute path={route.manageusers} component={Manageusers} />
          <PrivateRoute path={route.customerdetails} component={Customerdetails} />
          <PrivateRoute path={route.userwishlist} component={Userwishlist} />
          <PrivateRoute path={route.orderdetails} component={OrderManagementDetails} />

          <PrivateRoute path={route.userconfiguration} component={Userconfiguration} />

          <PrivateRoute path={route.masterstyles} component={Masterstyles} />
          <PrivateRoute path={route.masterthemes} component={Masterthemes} />

          <PrivateRoute path={route.mastermaterial} component={Materialmaster} />
          <PrivateRoute path={route.mastercolors} component={Mastermetalcolors} />
          <PrivateRoute path={route.masterpurities} component={Masterpurities} />
          <PrivateRoute path={route.salediscountlist} component={DiscountList} />
          <PrivateRoute path={route.voucherdiscountlist} component={VoucherdiscountListing} />
          <PrivateRoute path={route.editvoucher} component={Voucherdiscount} />
          <PrivateRoute path={route.mastercollections} component={Mastercollections} />
          <PrivateRoute path={route.masterdesigns} component={Masterdesigns} />
          <PrivateRoute path={route.masterdiamonds} component={Masterdiamonds} />
          <PrivateRoute path={route.diamondsettings} component={Masterdiamondsettings} />
          <PrivateRoute path={route.diamondshapes} component={Masterdiamondshapes} />
          <PrivateRoute path={route.earringbacking} component={Earringbacking} />
          <PrivateRoute path={route.gemsettings} component={Mastergemsettings} />
          <PrivateRoute path={route.gemshapes} component={Mastergemshapes} />
          <PrivateRoute path={route.masterpaymentstatus} component={Masterpaymentstatus} />
          <PrivateRoute path={route.masterorderstatus} component={Masterorderstatus} />
          <PrivateRoute path={route.shippingzones} component={Shippingzones} />
          <PrivateRoute path={route.shippingattributes} component={Shippingattributes} />
          <PrivateRoute path={route.addshippingattributes} component={Addshippingattributes} />
          <PrivateRoute path={route.addtaxattributes} component={Addtaxattributes} />

          <PrivateRoute path={route.gender} component={Mastergenders} />
          <PrivateRoute path={route.seo} component={Seopriority} />

          <PrivateRoute path={route.gemtypes} component={Mastergemtypes} />

          <PrivateRoute exact path={route.editdiscount} component={Salediscount} />

          <PrivateRoute exact path={`${route.productAttributes}/:id`} component={ProductAttributes} />
          <PrivateRoute exact path={`${route.createVariant}`} component={CreateVariant} />
          <PrivateRoute path={route.shipmentsettings} component={Shipmentsettings} />
          <PrivateRoute path={route.holiday_manager} component={HolidayManager} />
          <PrivateRoute path={route.warehouse} component={Warehouse} />
          <PrivateRoute path={route.inventory} component={Inventory} />
          <PrivateRoute path={route.silverbanner} component={Silverbanner} />
          <PrivateRoute path={route.silverlistingbanner} component={SilverListingbanner} />
          <PrivateRoute path={route.FeaturedProduct} component={FeaturedProduct} />
        </Switch>
      </NetworkProvider>
      {/* </ProductProvider> */}
    </ApolloProvider>
  );
};

export default MainApp;
