import gql from "graphql-tag";

const PRODUCTCATEGORY = gql`
  query {
    allMasterProductCategories {
      nodes {
        alias
        name
        id
      }
    }
    allMasterProductTypes {
      nodes {
        alias
        id
        name
        shortCode
      }
    }
    allMasterMaterials {
      nodes {
        alias
        id
        name
      }
    }
    allMasterGenders {
      nodes {
        alias
        id
        name
      }
    }
    allMasterDiamondTypes {
      nodes {
        diamondClarity
        diamondColor
        id
      }
    }
    allMasterMetalsColors {
      nodes {
        alias
        id
        name
        shortCode
      }
    }
    allMasterDiamondsSettings {
      nodes {
        alias
        id
        name
      }
    }
    allMasterDiamondsShapes {
      nodes {
        name
        id
        alias
      }
    }
    allMasterThemes {
      nodes {
        alias
        id
        name
      }
    }

    allMasterStyles {
      nodes {
        alias
        id
        name
      }
    }
    allMasterOccasions {
      nodes {
        alias
        id
        name
      }
    }
    allMasterCollections {
      nodes {
        id
        alias
        name
      }
    }
    allMasterStonesColors {
      nodes {
        alias
        id
        name
      }
    }
    allMasterStones {
      nodes {
        alias
        id
        name
      }
    }
    allMasterMetalsColors {
      nodes {
        alias
        id
        name
        shortCode
      }
    }
    allMasterMetalsPurities {
      nodes {
        alias
        id
        name
        shortCode
      }
    }
    allMasterDiamondsColors {
      nodes {
        alias
        id
        name
        shortCode
      }
    }
    allMasterDiamondClarities {
      nodes {
        alias
        id
        name
      }
    }
    allMasterVendors {
      nodes {
        id
        name
        shortCode
        vendorDelivaryDays
      }
    }
    allProductLists(orderBy: PRODUCT_SERIES_DESC, first: 1) {
      nodes {
        productSeries
        id
      }
    }
    allMasterGemstonesTypes {
      nodes {
        alias
        colorCode
        id
        name
        shortCode
      }
    }
    allMasterGemstonesShapes {
      nodes {
        alias
        id
        name
      }
    }
    allMasterEarringBackings {
      nodes {
        name
        createdAt
        alias
        id
        nodeId
        updatedAt
      }
    }
    allMasterGemstonesSettings {
      nodes {
        alias
        id
        name
      }
    }
  }
`;
const PRODUCTFILTERMASTER = gql`
  query {
    allMasterProductCategories {
      nodes {
        updatedAt
        shortCode
        name
        id
        createdAt
        alias
      }
    }
    allMasterProductTypes {
      nodes {
        updatedAt
        shortCode
        name
        id
        createdAt
        alias
        displayOrder
      }
    }
  }
`;

const ALLPRODUCTLIST = gql`
  query {
    allProductLists(first: 500) {
      nodes {
        id
        nodeId
        productName
        productCategory
        productType
        productId
        createdAt
        isactive
        transSkuListsByProductId(condition: { isdefault: true }) {
          nodes {
            skuUrl
            discount
          }
        }
      }
      totalCount
    }
  }
`;
const PRODUCTLIST = (category) => gql`
  query ($Veiw: Int!, $Offset: Int!) {
    allProductLists(first: $Veiw, offset: $Offset) {
      nodes {
        id
        nodeId
        productName
        productCategory
        productType
        productId
        createdAt
        isactive
        transSkuListsByProductId(condition: { isdefault: true }) {
          nodes {
            skuUrl
            discount
          }
        }
      }
      totalCount
    }
  }
`;
const VENDORLISTS = gql`
  query {
    allMasterVendors(orderBy: CREATED_AT_DESC) {
      nodes {
        vendorDelivaryDays
        updatedAt
        state
        shortCode
        partnerCategory
        name
        organization
        gstNo
        currency
        createdAt
        city
        address
      }
      totalCount
    }
  }
`;

const TaxList_1 = gql`
  query {
    allMasterTaxSettings {
      nodes {
        hsnNumber
        taxName
        taxValue
        updatedAt
        id
      }
      totalCount
    }
  }
`; /*********** configuration query */

const TaxList = `
query  {
  allMasterTaxSettings(orderBy: UPDATED_AT_DESC) {
    nodes {
      hsnNumber
      taxName
      taxValue
      igst
      cgst
      sgst
      productAttributes
      displayAttributes
      updatedAt
      id
    }
    totalCount
  }
}
`;
const TaxSettingList = `
query  {
  allTaxsettings(orderBy: UPDATED_AT_DESC) {
    nodes {
      name
      value
      hsnCode
      id
    }
  }
}
`;

const MASTERMATERIAL = `
query  {
  allMasterMaterials(orderBy: UPDATED_AT_DESC) {
    nodes {
      id
      name
      alias
      isFilter
      isActive
      filterOrder
    }
  }
}
`;
const MASTERMATERIALCOLORS = `
query  {
  allMasterMetalsColors(orderBy: UPDATED_AT_DESC) {
    nodes {
      name
      alias
      shortCode
      id
      isFilter
      isActive
      filterOrder
    }
  }
}
`;

const MASTERPRODUCTPURITIES = `
query  {
  allMasterMetalsPurities(orderBy: UPDATED_AT_DESC) {
    nodes {
      name
      alias
      id
      isFilter
      isActive
      filterOrder
    }
  }
}
`;
const DESIGNMASTER = `
query  {
allMasterDesigns(orderBy: UPDATED_AT_DESC) {
  nodes {
    name
    alias
    isFilter
    isActive
    filterOrder
    id
  }
}
}`;
const COLLECTIONMASTER = `
query  {
  allMasterCollections(orderBy: UPDATED_AT_DESC) {
    nodes {
      name
      alias
      id
      isFilter
      isActive
      filterOrder
    }
  }
}
`;

const OCCASSIONSMASTER = `
query  {
  allMasterOccasions {
    nodes {
      alias
      id
      name
      updatedAt
      isFilter
      isActive
      filterOrder
    }
  }
}
`;
const STYLEMASTER = `
query  {
allMasterStyles {
  nodes {
    alias
    createdAt
    name
    id
    updatedAt
    isFilter
    isActive
    filterOrder
  }
}
}`;
const THEMEMASTER = `
query  {
  allMasterThemes {
    nodes {
      createdAt
      alias
      id
      name
      updatedAt
      isFilter
      isActive
      filterOrder
    }
  }
}`;
const DIAMONDMASTER = `
query  {
allMasterDiamondTypes(orderBy: UPDATED_AT_DESC) {
  nodes {
    diamondClarity
    diamondColor
    id
    isFilter
    isActive
    filterOrder
  }
}
}
`;

const PAYMENTSTATUSMASTER = `
query  {
  allOrderStatusMasters {
    nodes {
      createdAt
      id
      isActive
      name
      updatedAt
    }
  },
  allPaymentStatusMasters {
    nodes {
      name
      createdAt
      id
      isActive
      updatedAt
    }
  }
}
`;
const DIAMONDSETTINGS = `
query  {
allMasterDiamondsSettings(orderBy: UPDATED_AT_DESC) {
  nodes {
    name
    id
    isFilter
    isActive
    filterOrder
  }
}
}
`;
const DIAMONDSHAPES = `
query  {
  allMasterDiamondsShapes(orderBy: UPDATED_AT_DESC) {
    nodes {
      name
      id
      isFilter
      isActive
      filterOrder
    }
  }
}
`;
const MASTERPRODUCTTYPES = `
query  {
allMasterProductTypes(orderBy: UPDATED_AT_DESC) {
  nodes {
    certificate
    name
    id
    alias
    isActive
    isFilter
    shortCode
    displayOrder
  }
}
}`;
const MASTERCATEGORIES = `
query{
  allMasterProductCategories(orderBy: FILTER_ORDER_DESC) {
    nodes {
      alias
      id
      name
      shortCode
      isFilter
      isActive
      filterOrder
    }
  }
}
`;

const MASTERPAGES = `
query  {
  allUniquepages(orderBy: UPDATED_AT_DESC) {
    nodes {
      pagename
      displayname
      id
    }
  }
}`;
const GOLDPRICESETUPMASTER = `
query  {
  allMasterVendors {
    nodes {
      name
      id
      shortCode
    }
  },
  allMasterMetalsPurities {
    nodes {
      name
      shortCode
    }
  }
  allMasterMaterials(filter: {or: [{shortCode: {equalTo: "G"}},{shortCode: {equalTo: "S"}},{shortCode: {equalTo: "P"}}]}) {
    nodes {
      name
      shortCode
    }
  }
}`;
const EARRINGBACKING = `
query  {
  allMasterEarringBackings(orderBy: UPDATED_AT_DESC) {
    nodes {
      id
      name
      alias
      updatedAt
      createdAt
      isFilter
      isActive
      filterOrder
    }
  }
}`;

const MASTERSTONES = `
query  {
  allMasterStones(orderBy: UPDATED_AT_DESC) {
    nodes {
      alias
      id
      name
      isFilter
      isActive
      filterOrder
    }
  }
}`;

const MASTERCOUNTRIES = `
query  {
  allMasterCountries(condition: {isActive: true}) {
    nodes {
      name
      id
      iso
    }
  }
}`;
const SHIPPINGCHARGES = `query{
  allShippingCharges {
    nodes {
      id
      name
      isActive
      isCart
      chargeType
      rangeFrom
      rangeTo
      shipmentCharge
      productAttributes
      displayAttributes
      shippingZoneByZoneId {
        name
        id
        isActive
      }
    }
  }
}`;
const ACTIVESHIPPINGZONES = `
query  {
  allShippingZones(condition: {isActive: true}) {
    nodes {
      name
      id
      isActive
    }
  }
}`;
const SHIPPINGZONES = `
query  {
  allShippingZones {
    nodes {
      name
      id
      isActive
      shippingZoneCountriesByZoneId {
        nodes {
          countryId
          createdAt
          id
          masterCountryByCountryId {
            name
            nicename
            id
          }
        }
      }
      shippingChargesByZoneId {
        nodes {
          name
        }
      }
    }
  }
}`;
const MASTERSTONECOLORS = `
query  {
  allMasterStonesColors(orderBy: UPDATED_AT_DESC) {
    nodes {
      alias
      name
      id
      isFilter
      isActive
      filterOrder
    }
  }
}`;
const MASTERWEIGHTS = `
query  {
  allMasterWeights(orderBy: UPDATED_AT_DESC) {
    nodes {
      alias
      createdAt
      name
      id
      updatedAt
      isFilter
      isActive
      filterOrder
    }
  }
}`;

const MASTERSTONESHAPES = `
query  {
  allMasterStonesShapes(orderBy: UPDATED_AT_DESC) {
    nodes {
      id
      name
      createdAt
      alias
      updatedAt
      isFilter
      isActive
      filterOrder
    }
  }
}`;

const MASTERATTRIBUTES = `
query  {
allAttributeMasters {
  nodes {
    name
    isFilter
    id
    isSearch
    isActive
    filterPosition
    isTopMenu
    createdAt
    shortCode
    updatedAt
  }
}
}`;

const MASTERGEMSETTINGS = `
query  {
  allMasterGemstonesSettings(orderBy: UPDATED_AT_DESC) {
    nodes {
      name
      id
      isFilter
      isActive
      filterOrder
    }
  }
}`;

const MASTERGEMSHAPES = `
query  {
  allMasterGemstonesShapes(orderBy: UPDATED_AT_DESC) {
    nodes {
      id
      name
      alias
      isFilter
      isActive
      filterOrder
    }
  }
}`;
const MASTERGEMTYPES = `
query  {
  allMasterGemstonesTypes(orderBy: UPDATED_AT_DESC) {
    nodes {
      id
      name
      colorCode
      isFilter
      isActive
      filterOrder
    }
  }
}`;
const MASTERGENDER = `
query  {
  allMasterGenders(orderBy: UPDATED_AT_DESC) {
    nodes {
      name
      alias
      id
      isFilter
      isActive
      filterOrder
    }
  }
}`;
const SEOPRIORITIES = `
query  {
  allSeoUrlPriorities(orderBy: UPDATED_AT_DESC) {
    nodes {
      priority
      seoText
      seoUrl
      imageUrl
        mobileImageUrl
      id
      attributeName
      attributeValue
    }
  }
}`;
/**************** */

// const PRODUCTLIST  = (category) =>  gql`
// query  {
//   allProductLists ${category ? `(${category ? 'filter: {productCategory: {equalTo: "Jewellery"}}' : ''})` : ""} {
//     nodes {
//       id
//       nodeId
//       productName,
//       productCategory,
//       productType
//       productId,
//       createdAt
//       isactive,
//       transSkuListsByProductId(condition: {isdefault: true}) {
//         nodes {
//           skuUrl
//           discount
//         }
//       }
//     }
//     totalCount
//   }
// }
// `;

const GOLDPRICELIST = gql`
  query MyQuery($vendorCode: String!) {
    allGoldPriceSettings(condition: { vendorCode: $vendorCode }) {
      nodes {
        purity
        vendorCode
        updatedAt
        sellingPriceType
        sellingPrice
        material
        id
        createdAt
        costPrice
      }
      totalCount
    }
  }
`;

const DIAMONDMARKUP = gql`
  query MyQuery($vendorCode: String!) {
    allPricingMarkups(
      condition: { material: $vendorCode }
      orderBy: UPDATED_AT_DESC
    ) {
      nodes {
        updatedAt
        sellingPriceMin
        sellingPriceMax
        material
        category
        productType
        markupValue
        markupType
        id
        createdAt
      }
      totalCount
    }
  }
`;

const DIAMONDPRICELIST = gql`
  query MyQuery($vendorCode: String!) {
    allDiamondPriceSettings(condition: { vendorCode: $vendorCode }) {
      nodes {
        costPrice
        createdAt
        diamondClarity
        diamondColour
        id
        sellingPrice
        sellingPriceType
        updatedAt
        vendorCode
      }
      totalCount
    }
  }
`;
// const CATGORYLIST = gql`
// query {
//   allMasterMaterials {
//     nodes {
//       name
//       shortCode
//     }
// }`;

const CATGORYLIST = gql`
  query {
    allMasterProductCategories {
      nodes {
        alias
        name
        shortCode
        id
      }
      totalCount
    }
  }
`;
const PRODUCTTYPEMASTER = gql`
  query {
    allMasterProductTypes {
      nodes {
        name
        id
        alias
        shortCode
      }
      totalCount
    }
  }
`;

const MATERIALMASTER = gql`
  query {
    allMasterMaterials {
      nodes {
        alias
        name
        shortCode
      }
      totalCount
    }
  }
`;

const MASTERCOLORS = gql`
  query {
    allMasterMetalsColors {
      nodes {
        name
        alias
        shortCode
      }
      totalCount
    }
  }
`;

const SALEDISCOUNTS = gql`
  query {
    allSaleDiscounts {
      nodes {
        id
        discountName
        discountType
        discountValue
        components
        attributes
        isActive
        productAttributes
        productAttributesText
      }

      totalCount
    }
  }
`;

const VOUCHERDISCOUNTS = gql`
  query {
    allVouchers {
      nodes {
        id
        name
        code
        uses
        maxUses
        isActive
        voucherCodes
        description
      }

      totalCount
    }
  }
`;

const MASTERPURITIES = gql`
  query {
    allMasterMetalsPurities {
      nodes {
        name
        alias
        shortCode
      }
      totalCount
    }
  }
`;
const VENDORLIST = `
query {
  allMasterVendors {
    nodes {
      vendorDelivaryDays
      updatedAt
      state
      shortCode
      partnerCategory
      name
      organization
      gstNo
      currency
      createdAt
      city
      address
    }
  }
}`;

const METALMASTER = `
query {
  allMasterMaterials {
    nodes {
      name
      shortCode
    }
  },
  allMasterMetalsPurities {
    nodes {
      name
      shortCode
    }
  }
}`;

const MASTERCATEGORY = `
query {
  allMasterProductCategories {
    nodes {
      name
      shortCode
    }
  },
  allMasterProductTypes {
    nodes {
      name
      shortCode
    }
  }
}`;

const GEMSTONEMASTER = `
query {
  allMasterGemstonesTypes {
    nodes {
      name
      shortCode
      colorCode
    }
  }  
}`;

const MAKINGCHARGEPRICELIST = gql`
  query MyQuery($vendorCode: String!, $ratetype: Int!) {
    allMakingChargeSettings(
      condition: { vendorCode: $vendorCode, rateType: $ratetype }
    ) {
      nodes {
        weightStart
        weightEnd
        vendorCode
        updatedAt
        sellingPriceType
        rateType
        purity
        priceType
        price
        material
        id
        createdAt
      }
      totalCount
    }
  }
`;
const GEMPRICELIST = gql`
  query MyQuery($vendorCode: String!) {
    allGemstonePriceSettings(condition: { vendorCode: $vendorCode }) {
      nodes {
        price
        rateType
        priceType
        sellingPriceType
        vendorCode
        weightEnd
        weightStart
        updatedAt
        id
        createdAt
        gemstoneType
      }
      totalCount
    }
  }
`;
const PRODUCTLISTSTATUSEDIT = gql`
  mutation MyMutation($productId: String!, $isActive: Boolean!) {
    __typename
    updateProductListByProductId(
      input: {
        productId: $productId
        productListPatch: { isactive: $isActive }
      }
    ) {
      clientMutationId
      productList {
        isactive
      }
    }
  }
`;

const CREATETAXSETUP = gql`
  mutation MyMutation(
    $id: UUID!
    $updatedAt: Date!
    $createdAt: Date!
    $taxValue: Double!
    $taxName: String!
    $hsnNumber: String!
  ) {
    __typename
    createMasterTaxSetting(
      input: {
        masterTaxSetting: {
          id: $id
          updatedAt: $updatedAt
          createdAt: $createdAt
          taxValue: $taxValue
          taxName: $taxName
          hsnNumber: $hsnNumber
        }
      }
    ) {
      clientMutationId
    }
  }
`;

const VOUCHERSTATUSEDIT = gql`
  mutation MyMutation($voucherId: UUID!, $isActive: Boolean!) {
    __typename
    updateVoucherById(
      input: { id: $voucherId, voucherPatch: { isActive: $isActive } }
    ) {
      clientMutationId
      voucher {
        isActive
      }
    }
  }
`;

const DISCOUNTSTATUSEDIT = gql`
  mutation MyMutation($discountId: UUID!, $isActive: Boolean!) {
    __typename
    updateSaleDiscountById(
      input: { id: $discountId, saleDiscountPatch: { isActive: $isActive } }
    ) {
      clientMutationId
      saleDiscount {
        isActive
      }
    }
  }
`;

const DELETEMARKUPPRICE = gql`
  mutation MyMutation($elementId: UUID!) {
    __typename
    deletePricingMarkupById(input: { id: $elementId }) {
      clientMutationId
    }
  }
`;

const DELETEGOLDPRICE = gql`
  mutation MyMutation($elementId: UUID!) {
    __typename
    deleteGoldPriceSettingById(input: { id: $elementId }) {
      clientMutationId
    }
  }
`;
const DELETESALEDISCOUNT = gql`
  mutation MyMutation($elementId: UUID!) {
    __typename
    deleteSaleDiscountById(input: { id: $elementId }) {
      clientMutationId
    }
  }
`;

const DELETEVOUCHERDISCOUNT = gql`
  mutation MyMutation($elementId: UUID!) {
    __typename
    deleteVoucherById(input: { id: $elementId }) {
      clientMutationId
    }
  }
`;

const DELETEMAKINGCHARGE = gql`
  mutation MyMutation($elementId: UUID!) {
    __typename
    deleteMakingChargeSettingById(input: { id: $elementId }) {
      clientMutationId
    }
  }
`;

const DELETEGEMCHARGE = gql`
  mutation MyMutation($elementId: UUID!) {
    __typename
    deleteGemstonePriceSettingById(input: { id: $elementId }) {
      clientMutationId
    }
  }
`;
const DELETEDIAMONDCHARGE = gql`
  mutation MyMutation($elementId: UUID!) {
    __typename
    deleteDiamondPriceSettingById(input: { id: $elementId }) {
      clientMutationId
    }
  }
`;

const PRODUCTDIAMONDTYPES = `
query{
  allMasterDiamondTypes {
    nodes {
      diamondClarity
      diamondColor
      id
    }
  }
}
`;
const PRODUCTEDIT = gql`
  query MyQuery($productId: String!) {
    productListByProductId(productId: $productId) {
      productMetalcoloursByProductId {
        nodes {
          productColor
          id
        }
      }
      productName
      productType
      vendorCode
      gender
      isactive
      productMaterialsByProductSku {
        nodes {
          materialName
        }
      }
      productDiamondsByProductSku {
        nodes {
          diamondClarity
          diamondColour
          diamondSettings
          diamondShape
          diamondType
          id
          stoneCount
          stoneWeight
        }
      }
      productGemstonesByProductSku {
        nodes {
          gemstoneSetting
          gemstoneShape
          gemstoneSize
          gemstoneType
          gemstonsSize
          id
          stoneCount
          stoneWeight
        }
      }
      productImagesByProductId(orderBy: IMAGE_POSITION_ASC) {
        nodes {
          id
          imagePosition
          productId
          imageUrl
          ishover
          isdefault
          productColor
        }
      }
      productPuritiesByProductId {
        nodes {
          purity
          id
        }
      }
      productThemesByProductId(condition: { isActive: true }) {
        nodes {
          themeName
          id
        }
      }
      productStonecolorsByProductId {
        nodes {
          id
          stonecolor
        }
      }
      productStylesByProductId(condition: { isActive: true }) {
        nodes {
          styleName
          id
        }
      }
      productCollectionsByProductId {
        nodes {
          collectionName
          id
        }
      }
      productOccassionsByProductId(condition: { isActive: true }) {
        nodes {
          occassionName
          id
        }
      }
      productStonecountsByProductId {
        nodes {
          id
          stonecount
        }
      }
      transSkuListsByProductId {
        nodes {
          skuSize
          diamondType
          metalColor
          purity
          productId
          skuWeight
          generatedSku
          costPrice
          costPriceTax
          discountPrice
          discountPriceTax
          markupPrice
          marginOnSalePercentage
          markupPriceTax
          marginOnSalePercentage
          sellingPrice
          discountDesc
          sellingPriceTax
          isReadyToShip
          discount
          isActive
          isdefault
          vendorDeliveryTime
          id
          isActive
          transSkuDescriptionsBySkuId {
            nodes {
              skuDescription
              certificate
              ringsizeImage
            }
          }
        }
      }
      productCategory
      sizeVarient
    }
  }
`;

const ALLMASTERRINGSIZE = `
  query {
    allMasterRingsSizes {
      nodes {
        gender
        productType
        name
        size
        sizeValue
      }
    }
  }
`;

const HOLIDAYLIST = gql`
  query ($first: Int, $offset: Int, $filter: HolidayManagerFilter) {
    allHolidayManagers(
      first: $first
      offset: $offset
      filter: $filter
      orderBy: DATE_ASC
    ) {
      nodes {
        id
        holiday
        date
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

const WAREHOUSELIST = gql`
  query {
    allWarehouses(orderBy: ID_ASC) {
      nodes {
        id
        name
        shippingInDays
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

const INVENTORYLIST = gql`
  query ($first: Int, $offset: Int, $filter: InventoryFilter) {
    allInventories(first: $first, offset: $offset, filter: $filter) {
      nodes {
        id
        generatedSku
        numberOfItems
        createdAt
        updatedAt
        warehouse: warehouseByWarehouseId {
          id
          name
        }
      }
      totalCount
    }
  }
`;

const VALIDATEGENERATEDSKU = gql`
  query ($generatedSku: String!) {
    allTransSkuLists(condition: { generatedSku: $generatedSku }) {
      nodes {
        id
      }
    }
  }
`;

const STOCKSTATUS = gql`
  query {
    allWarehouses {
      nodes {
        name
        isActive
        inventoriesByWarehouseId {
          aggregates {
            sum {
              numberOfItems
            }
          }
        }
      }
    }
  }
`;

const VERIFYTAGNO = gql`
  query ($tagno: String!) {
    list: allTransSkuLists(condition: { generatedSku: $tagno }) {
      nodes {
        id
      }
    }
  }
`;

export {
  PRODUCTCATEGORY,
  PRODUCTLIST,
  PRODUCTEDIT,
  PRODUCTLISTSTATUSEDIT,
  PRODUCTDIAMONDTYPES,
  GOLDPRICELIST,
  DIAMONDPRICELIST,
  GEMPRICELIST,
  MAKINGCHARGEPRICELIST,
  VENDORLIST,
  ALLPRODUCTLIST,
  DIAMONDMARKUP,
  PRODUCTFILTERMASTER,
  METALMASTER,
  GEMSTONEMASTER,
  MASTERCATEGORY,
  DELETEMARKUPPRICE,
  DELETEMAKINGCHARGE,
  DELETEGEMCHARGE,
  DELETEGOLDPRICE,
  DELETESALEDISCOUNT,
  CATGORYLIST,
  DELETEDIAMONDCHARGE,
  VENDORLISTS,
  TaxList,
  PRODUCTTYPEMASTER,
  MATERIALMASTER,
  MASTERCOLORS,
  MASTERPURITIES,
  SALEDISCOUNTS,
  VOUCHERDISCOUNTS,
  DELETEVOUCHERDISCOUNT,
  VOUCHERSTATUSEDIT,
  DISCOUNTSTATUSEDIT,
  MASTERMATERIAL,
  MASTERMATERIALCOLORS,
  MASTERPRODUCTPURITIES,
  COLLECTIONMASTER,
  DESIGNMASTER,
  DIAMONDMASTER,
  DIAMONDSETTINGS,
  DIAMONDSHAPES,
  MASTERPRODUCTTYPES,
  MASTERGEMSETTINGS,
  MASTERGEMSHAPES,
  MASTERGEMTYPES,
  MASTERGENDER,
  SEOPRIORITIES,
  CREATETAXSETUP,
  TaxSettingList,
  MASTERCATEGORIES,
  EARRINGBACKING,
  MASTERATTRIBUTES,
  MASTERSTONESHAPES,
  MASTERSTONECOLORS,
  MASTERSTONES,
  MASTERWEIGHTS,
  THEMEMASTER,
  STYLEMASTER,
  OCCASSIONSMASTER,
  PAYMENTSTATUSMASTER,
  SHIPPINGZONES,
  MASTERCOUNTRIES,
  SHIPPINGCHARGES,
  ACTIVESHIPPINGZONES,
  MASTERPAGES,
  GOLDPRICESETUPMASTER,
  ALLMASTERRINGSIZE,
  HOLIDAYLIST,
  WAREHOUSELIST,
  INVENTORYLIST,
  VALIDATEGENERATEDSKU,
  STOCKSTATUS,
  VERIFYTAGNO,
};
