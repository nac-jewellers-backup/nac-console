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
    allMasterHashTags {
      nodes {
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
{
  allOrderStatusMasters {
    nodes {
      createdAt
      id
      isActive
      name
      updatedAt
    }
  }
  allPaymentStatusMasters(condition: {isActive: true}) {
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
  }
  allMasterProductTypes {
    nodes {
      name
      shortCode
    }
  }
  allMasterMaterials {
    nodes {
      name
      id
      shortCode
    }
  }
  allMasterMetalsPurities {
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

const REVIEWQUERY = `
  query {
    allCustomerReviews {
      nodes {
        customerName
        id
        isActive
        isPublish
        message
        nodeId
        productSku
        rating
        title
        updatedAt
        userprofileId
        productId
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
      earringBacking
      isactive
      prodDescription
      productMaterialsByProductSku(condition: { isActive: true }) {
        nodes {
          materialName
        }
      }
      productDiamondsByProductSku {
        nodes {
          itemName
          subItemName
          description
          diamondClarity
          diamondColour
          diamondSettings
          diamondShape
          diamondType
          id
          stoneCount
          stoneWeight
          stoneAmount
          stoneRate
        }
      }
      productGemstonesByProductSku {
        nodes {
          itemName
          subItemName
          description
          gemstoneSetting
          gemstoneShape
          gemstoneSize
          gemstoneType
          gemstonsSize
          id
          stoneCount
          stoneWeight
          stoneAmount
          stoneRate
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
      productCollectionsByProductId(condition: { isActive: true }) {
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
      productHashTagsByProductId(condition: { isActive: true }) {
        nodes {
          id
          name: hashTag
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
          showPriceBreakup
          calcType
          transSkuDescriptionsBySkuId {
            nodes {
              skuDescription
              certificate
              ringsizeImage
            }
          }
          maxOrderQty
          minOrderQty
          isOrderable
          orderShippingDays
        }
      }
      productCategory
      sizeVarient
      height
      length
      width

      productVendorCode
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

const ALLBANNERSCOMPLETE = `
query MyQuery {
  allBanners
  {
    nodes {
      id
      mobile
      position
      url
      web
      urlParam 
    }
  }
}
`;

const ALLBANNERS = `
query MyQuery {
  allBanners(condition: {urlParam: "landing"})
  {
    nodes {
      id
      mobile
      position
      url
      web
      urlParam 
    }
  }
}
`;

const CREATEALLBANNERS = `
mutation MyMutation(
  $now: Datetime!
  $url: String
  $web: String
  $mobile: String
  $position: Int
) {
  createBanner(
    input: {
      banner: {
        createdAt: $now
        updatedAt: $now
        mobile: $mobile
        position: $position
        url: $url
        web: $web
        urlParam : "landing"
      }
    }
  ) {
    clientMutationId
     banner {
      id
      mobile
      position
      updatedAt
      url
      web
      createdAt
    }
  }
}
`;

const ALLLISTINGBANNERS = `
query MyQuery {
  allBanners(condition: {urlParam: "listing"})
  {
    nodes {
      id
      mobile
      position
      url
      web
      urlParam 
    }
  }
}
`;

const CREATELISTINGBANNERS = `
mutation MyMutation(
  $now: Datetime!
  $url: String
  $web: String
  $mobile: String
  $position: Int
) {
  createBanner(
    input: {
      banner: {
        createdAt: $now
        updatedAt: $now
        mobile: $mobile
        position: $position
        url: $url
        web: $web
        urlParam : "listing"
      }
    }
  ) {
    clientMutationId
     banner {
      id
      mobile
      position
      updatedAt
      url
      web
      createdAt
    }
  }
}
`;

const ALLSPECIFICLISTINGPAGE = `
query MyQuery {
  allBanners
  (condition: {url: "specificListingPage"}) 
  {
    nodes {
      id
      mobile
      position
      web
      urlParam
    }
  }
}
`;

const CREATESPECIFICLISTINGPAGE = `
mutation MyMutation(
  $now: Datetime!
  $web: String
  $mobile: String
  $urlParam :String
) {
  createBanner(
    input: {
      banner: {
        createdAt: $now
        updatedAt: $now
        mobile: $mobile
        url: "specificListingPage"
        web: $web
        urlParam : $urlParam
      }
    }
  ) {
    clientMutationId
    banner {
      id
      mobile
      position
      updatedAt
      url
      web
      createdAt
    }
  }
}
`;

const DELETEALLBANNER = `
mutation MyMutation($id : Int!) {
  deleteBannerById(input: {id: $id}) {
    banner {
      id
      nodeId
      mobile
      position
      updatedAt
      url
      web
      createdAt
    }
  }
}
`;
const ALLMASTERPRODUCTSIZE = gql`
  query allproductsizes($productType: String) {
    allMasterRingsSizes(condition: { productType: $productType }) {
      nodes {
        name
        nodeId
        id
        size
        updatedAt
        productType
        gender
        sizeValue
      }
    }
  }
`;

const IMAGEDELETE = `
mutation MyMutation($productimageid: UUID!) {
  deleteProductImageById(input: { id: $productimageid }) {
    productListByProductId {
      productId
    }
  }
}

`;

const ALLSTYLORISILVERLISTINGBOTTOMBANNERS = `
query MyQuery {
  allBanners(condition: { urlParam: "bottom" }) {
    nodes {
      id
      mobile
      position
      url
      web
      urlParam
    }
  }
}

`;

const ALLSTYLORISILVERLANDINGBANNERS = `
query MyQuery {
  allBanners(condition: { urlParam: "landing" }) {
    nodes {
      id
      mobile
      position
      url
      web
      urlParam
    }
  }
}

`;

const ALLSTYLORISILVERLISTINGPAGE = `
query MyQuery {
  allBanners(condition: { urlParam: "listingPage" }) {
    nodes {
      id
      mobile
      position
      url
      web
      urlParam
    }
  }
}


`;

const ALLSTYLORISILVERROUTINGPAGE = `
query MyQuery {
  allBanners(condition: {url: "#"}) {
    nodes {
      id
      mobile
      position
      url
      web
      urlParam
    }
  }
}`;

const CREATESILVERLANDINGBANNER = `
mutation MyMutation(
  $now: Datetime!
  $url: String
  $web: String
  $mobile: String
  $position: Int
) {
  createBanner(
    input: {
      banner: {
        createdAt: $now
        updatedAt: $now
        mobile: $mobile
        position: $position
        url: $url
        web: $web
        urlParam :"landing"
      }
    }
  ) {
    clientMutationId
    banner {
      id
      mobile
      position
      updatedAt
      url
      web
      createdAt
    }
  }
}`;

const CREATESILVERLISTINGBOTTOMBANNER = `
mutation MyMutation(
  $now: Datetime!
  $url: String
  $web: String
  $mobile: String
  $position: Int
) {
  createBanner(
    input: {
      banner: {
        createdAt: $now
        updatedAt: $now
        mobile: $mobile
        url: $url
        web: $web
        urlParam: "bottom"
        position: $position
      }
    }
  ) {
    clientMutationId
    banner {
      id
      mobile
      updatedAt
      url
      web
      createdAt
      urlParam
    }
  }
}


`;

const CREATESILVERLISTINGPAGE = `
mutation MyMutation(
  $now: Datetime!
  $url: String
  $web: String
  $mobile: String
  $position: Int
) {
  createBanner(
    input: {
      banner: {
        createdAt: $now
        updatedAt: $now
        mobile: $mobile
        position: $position
        url: $url
        web: $web
        urlParam: "listingPage"
      }
    }
  ) {
    clientMutationId
    banner {
      id
      mobile
      position
      updatedAt
      url
      web
      createdAt
    }
  }
}

`;

const ABANDONEDCART = gql`
  query (
    $first: Int
    $offset: Int
    $orderBy: [ShoppingCartsOrderBy!]
    $condition: ShoppingCartCondition
    $filter: ShoppingCartFilter
  ) {
    allShoppingCarts(
      first: $first
      offset: $offset
      orderBy: $orderBy
      condition: $condition
      filter: $filter
    ) {
      nodes {
        id
        isActive
        netAmount
        status
        taxAmount
        userprofileId
        user: userProfileByUserprofileId {
          id
          firstName
          lastName
          username
          email
          mobile
        }
        cart_items: shoppingCartItemsByShoppingCartId {
          nodes {
            productSku
            qty
            transSkuListByProductSku {
              generatedSku
              skuId
              productListByProductId {
                productName
              }
            }
          }
        }
        grossAmount
        discountedPrice
        discount
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

const CARTBYID = gql`
  query ($id: UUID!) {
    cart: shoppingCartById(id: $id) {
      id
      isActive
      netAmount
      status
      taxAmount
      userprofileId
      grossAmount
      discountedPrice
      discount
      createdAt
      updatedAt
      address: cartAddressesByCartId {
        nodes {
          id
          addressline1
          addressline2
          city
          contactNumber
          country
          countryCode
          createdAt
          firstname
          lastname
          pincode
          salutation
          state
          updatedAt
          addressType
        }
      }
      user: userProfileByUserprofileId {
        id
        firstName
        lastName
        username
        email
        mobile
        isemailverified
        ismobileverified
      }
      cart_items: shoppingCartItemsByShoppingCartId {
        nodes {
          productSku
          qty
          transSkuListByProductSku {
            markupPrice
            markupPriceTax
            discountPrice
            discountPriceTax
            generatedSku
            skuId
            productListByProductId {
              productName
              productImagesByProductId(
                condition: { isdefault: true, imagePosition: 1 }
              ) {
                nodes {
                  productId
                  imageUrl
                }
              }
            }
          }
        }
      }
      follow_ups: communicationLogsByCartId {
        nodes {
          type
          messageType
          senderResponseId
          createdAt
        }
      }
    }
  }
`;

const CREATESTYLORISILVERROUTINGPAGE = `
mutation MyMutation(
  $now: Datetime!
  $web: String
  $mobile: String
  $position: Int
  $urlParam: String
) {
  createBanner(
    input: {
      banner: {
        createdAt: $now
        updatedAt: $now
        mobile: $mobile
        position: $position
        url: "S"
        web: $web
        urlParam: $urlParam
      }
    }
  ) {
    clientMutationId
    banner {
      id
      mobile
      position
      updatedAt
      url
      web
      createdAt
      urlParam
    }
  }
}

`;

const DELETESILVERLANDINGBANNER = `
mutation MyMutation($id: Int!) {
  deleteBannerById(input: { id: $id }) {
    banner {
      id
      nodeId
      mobile
      position
      updatedAt
      url
      web
      createdAt
    }
  }
}

`;

const DELETESILVERLISTINGBOTTOMBANNER = `
mutation MyMutation($id: Int!) {
  deleteBannerById(input: { id: $id }) {
    banner {
      id
      mobile
      position
      url
      web
    }
  }
}
`;
const ALLFEATUREDPRODUCT = `query MyQuery {
  allFeaturedProducts {
    nodes {
      productId
      productListByProductId {
        productName
        productId
        productImagesByProductId(condition: { ishover: true }) {
          nodes {
            imageUrl
          }
        }
        transSkuListsByProductId {
          nodes {
            costPrice
            markupPrice
            skuUrl
            transSkuDescriptionsBySkuId {
              nodes {
                skuDescription
              }
            }
            sellingPrice
          }
        }
      }
      isActive
    }
  }
}

`;

const CREATEFEATUREDPRODUCT = `mutation MyMutation($ProductId: String!, $isActive: Boolean) {
  createFeaturedProduct(
    input: { featuredProduct: { productId: $ProductId, isActive: $isActive } }
  ) {
    featuredProduct {
      productId
      isActive
    }
  }
}
`;
const ISACTIVEFEATUREDPRODUCT = `mutation MyMutation($ProductId: String!, $isActive: Boolean) {
  updateFeaturedProductByProductId(
    input: {
      featuredProductPatch: { isActive: $isActive }
      productId: $ProductId
    }
  ) {
    featuredProduct {
      productId
      isActive
    }
  }
}
`;
const DELETEFEATUREDPRODUCT = `mutation MyMutation($ProductId: String!) {
  deleteFeaturedProductByProductId(input: { productId: $ProductId }) {
    featuredProduct {
      productId
    }
  }
}
`;
const CREATENEWARRIVALPRODUCT = `mutation MyMutation($ProductId: String!, $isActive: Boolean) {
  createNewArrivalProduct(
    input: { newArrivalProduct: { productId: $ProductId, isActive: $isActive } }
  ) {
    newArrivalProduct {
      productId
      isActive
    }
  }
}
`;
const ALLNEWARRIVALPRODUCT = `query MyQuery{
  allNewArrivalProducts {
    nodes {
      productId
      productListByProductId {
        productName
        productId
        productImagesByProductId(condition: {ishover: false}) {
          nodes {
            imageUrl
          }
        }
        transSkuListsByProductId{
          nodes{
            costPrice
            markupPrice
            skuUrl
            transSkuDescriptionsBySkuId{
              nodes{
                skuDescription
              }
            }
            sellingPrice
          }
        }
      }
      isActive
    }
  }
}
`;
const ISACTIVENEWARRIVALPRODUCT = `mutation MyMutation($ProductId: String!, $isActive: Boolean) {
  updateNewArrivalProductByProductId(
    input: {newArrivalProductPatch: {isActive: $isActive}, productId: $ProductId}
  ) {
    newArrivalProduct {
      productId
      isActive
    }
  }
}
`;
const DELETENEWARRIVALPRODUCT = `mutation MyMutation($ProductId: String!) {
  deleteNewArrivalProductByProductId(input: {productId: $ProductId}) {
    clientMutationId
    deletedNewArrivalProductId
  }
}

`;

const MUTATE_STATUS = `
mutation($id: Int!, $status: String) {
  updateAppointmentById(
    input: { id: $id, appointmentPatch: { status: $status } }
  ) {
    clientMutationId
  }
}
`;

const MUTATE_MEETING = `
mutation($id :Int!,$meetingLink: String!) {
  updateAppointmentById(
    input: { id: $id, appointmentPatch: { meetingLink: $meetingLink } }
  ) {
    appointment {
      id
      meetingLink
    }
  }
}
`;

const GETORDERCOMMUNICATIONLOGS = `
query MyQuery($id: UUID!) {
  orderById(id: $id) {
    awbNumber
    cartId
    comments
    createdAt
    id
    paymentId
    paymentMode
    paymentStatus
    updatedAt
    userProfileId
    communicationLogsByOrderId(orderBy: UPDATED_AT_DESC) {
      nodes {
        createdAt
        id
        messageType
        orderId
        senderResponseId
        type
      }
    }
  }
}

`;

const GETAPPLICATIONCOMMUNICATIONLOGS = `
query MyQuery($id: Int!) {
  appointmentById(id: $id) {
    storeLocationByLocationId {
      id
      address
      name
    }
    appointmentCommunicationLogsByAppointmentId {
      nodes {
        id
        appointmentId
        communicationType
        createdAt
        senderResponseId
        type
        updatedAt
      }
    }
  }
}

`;

const ALL_APPOINTMENTS_DATE = `
  query MyQuery {
    allAppointmentDates(
      orderBy: START_DATE_TIME_ASC
    ) {
      nodes {
        createdAt
        createdBy
        endDate
        id
        isActive
        startDate
        startDateTime
        endDateTime
        updatedAt
        updatedBy
      }
    }
  }
`;

const CHECK_APPOINTMENT = `
query($startDate: Date!,$endDate: Date!){
  allAppointmentDates(
    condition: {
      startDate: $startDate,
      endDate: $endDate
    }
  ) {
    nodes {
      createdAt
      createdBy
      endDate
      id
      isActive
      startDate
      startDateTime
      endDateTime
      updatedAt
      updatedBy
    }
  }
}

`;

const FILTER_APPOINTEMENTS = gql`
  query ($startDate: Date!, $endDate: Date!) {
    allAppointmentDates(
      filter: {
        startDate: {
          greaterThanOrEqualTo: $startDate
          lessThanOrEqualTo: $endDate
        }
      }
      orderBy: START_DATE_ASC
    ) {
      nodes {
        createdAt
        createdBy
        endDate
        id
        isActive
        startDate
        startDateTime
        endDateTime
        updatedAt
        updatedBy
      }
    }
  }
`;

const ALL_APPOINTMENTS_TIMESLOT = (appointmentDateId, appointmentTypeId) => gql`
 query{  
   allAppointmentDateTimeSlots(
    condition: {
      appointmentDateId: "${appointmentDateId}"
      appointmentTypeId: ${appointmentTypeId}
    }
  ) {
    nodes {
      id
      appointmentDateId
      appointmentTypeId
      startTime
      endTime
      isActive
    }
  }
 }
`;

const CHECK_TIMESLOT = gql`
  query (
    $startTime: Time
    $endTime: Time
    $appointmentDateId: UUID!
    $appointmentTypeId: Int!
  ) {
    allAppointmentDateTimeSlots(
      filter: {
        startTime: {
          greaterThanOrEqualTo: $startTime
          lessThanOrEqualTo: $endTime
        }
        endTime: {
          greaterThanOrEqualTo: $startTime
          lessThanOrEqualTo: $endTime
        }
      }
      condition: {
        appointmentDateId: $appointmentDateId
        appointmentTypeId: $appointmentTypeId
      }
    ) {
      nodes {
        id
        appointmentDateId
        appointmentTypeId
        startTime
        endTime
        isActive
      }
    }
  }
`;

const APPOINTMENTS_TYPE = `
  query MyQuery {
    allAppointmentTypeMasters {
      nodes {
        id
        name
        isActive
        appointmentsByAppointmentTypeId{
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;

const SHOW_APPOINMENT_DETAILS = gql`
  query (
    $limit: Int
    $offset: Int
    $appointment_filter: AppointmentFilter!
    $order_by: [AppointmentsOrderBy!]
  ) {
    allAppointments(
      first: $limit
      offset: $offset
      filter: $appointment_filter
      orderBy: $order_by
    ) {
      nodes {
        id
        mobile
        mobileCountryCode
        customerName
        email
        isActive
        status
        type: appointmentTypeMasterByAppointmentTypeId {
          name
        }
        appointmentDateTimeSlotBySlotId {
          startTime
          startDateTime
          endDateTime
          createdBy
          appointmentDateId
          endTime
        }
        storeLocationByLocationId {
          address
          name
        }
        locationId
      }
      totalCount
    }
  }
`;

const SHOW_ALL_PPOINMENT_DETAILS = gql`
  query ($id: Int) {
    allAppointments(filter: { id: { equalTo: $id } }) {
      nodes {
        isVerified
        isActive
        email
        customerName
        status
        locationId
        storeLocationByLocationId {
          address
        }
        specialRequests
        productCategory
        meetingLink
        metalType
        mobile
        isOnline
        isItRequired
        id
        areMoreMembersJoining
        appointmentDateTimeSlotBySlotId {
          appointmentTypeId
        }
      }
    }
  }
`;

const PRICE_RUN_LOGS = gql`
  query ($first: Int, $offset: Int) {
    allPriceRunningHistories(
      first: $first
      offset: $offset
      orderBy: UPDATED_AT_DESC
    ) {
      nodes {
        id
        completedProductCount
        pricingComponent
        logs: pricingLogsByPriceRunningHistoryId {
          nodes {
            requestedProducts
            successfullyExecutedProducts
            failedProducts
          }
        }
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

export {
  ALLBANNERS,
  ALLLISTINGBANNERS,
  ALLSPECIFICLISTINGPAGE,
  CREATEALLBANNERS,
  CREATELISTINGBANNERS,
  CREATESPECIFICLISTINGPAGE,
  DELETEALLBANNER,
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
  ALLMASTERPRODUCTSIZE,
  IMAGEDELETE,
  ALLSTYLORISILVERLISTINGBOTTOMBANNERS,
  ALLSTYLORISILVERLANDINGBANNERS,
  ALLSTYLORISILVERLISTINGPAGE,
  ALLSTYLORISILVERROUTINGPAGE,
  CREATESILVERLANDINGBANNER,
  CREATESILVERLISTINGBOTTOMBANNER,
  CREATESILVERLISTINGPAGE,
  CREATESTYLORISILVERROUTINGPAGE,
  DELETESILVERLANDINGBANNER,
  DELETESILVERLISTINGBOTTOMBANNER,
  ALLFEATUREDPRODUCT,
  CREATEFEATUREDPRODUCT,
  ISACTIVEFEATUREDPRODUCT,
  DELETEFEATUREDPRODUCT,
  REVIEWQUERY,
  CREATENEWARRIVALPRODUCT,
  ALLNEWARRIVALPRODUCT,
  ISACTIVENEWARRIVALPRODUCT,
  DELETENEWARRIVALPRODUCT,
  GETORDERCOMMUNICATIONLOGS,
  ABANDONEDCART,
  CARTBYID,
  ALL_APPOINTMENTS_DATE,
  SHOW_APPOINMENT_DETAILS,
  PRICE_RUN_LOGS,
  APPOINTMENTS_TYPE,
  ALL_APPOINTMENTS_TIMESLOT,
  FILTER_APPOINTEMENTS,
  SHOW_ALL_PPOINMENT_DETAILS,
  MUTATE_STATUS,
  GETAPPLICATIONCOMMUNICATIONLOGS,
  CHECK_APPOINTMENT,
  CHECK_TIMESLOT,
  MUTATE_MEETING,
};
