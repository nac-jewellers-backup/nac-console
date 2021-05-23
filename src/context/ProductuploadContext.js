import React from "react";

const productuploadCtxInitial = {
  productCtx: {
    product_categoy: "",
    steps: ["Step1", "Step2", "Step6"],
    product_type: "",
    productname: "",
    material: "",
    product_type_shortcode: "",
    category: [],
    metalColour: "",
    metalpurities: "",
    isExpand: false,
    selectedgender: "",
    selected_metal_colour: {},
    gender: {},
    product_gender: [],
    vendorcode: "",
    productseries: [],
    size: 0,
    sizes: [],
    selected_sizes: [],
    metal: {
      value: 1,
      label: "Diamond",
    },
    materials: [
      "Diamond",
      "Gold",
      "Gemstone",
      "Solitaire",
      "Silver",
      "Platinum",
    ],
    gemstontypes: "",
    gemstonshapes: "",
    product_code: "",
    isactive: false,
    gemstonelist: [],
    diamondlist: [],
    variants: [],
    oldproductMetalColor: [],
    oldproductMetalPurity: [],
    productMetalColor: [],
    productMetalPurity: [],
    productDiamondColor: [],
    productDiamondClarity: [],
    productDiamondTypes: [],
    productImages: [],
    productDiamondTypesArray: [],
    oldproductDiamondTypesArray: [],
    productmaterials: [],
    createVariantList: [],
    editVariants: [],
    editDiamondLists: [],
    editGemstoneLists: [],
    productVariantSize: [
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    ],
    variant_size: [],
    gemstonetype: "",
    gemstoneshape: "",
    gemstonesettings: "",
    gemstonesize: "",
    gemstonecount: "",
    gemstoneweight: "",
    stonetype: "",

    editleadtime: "",
    editreadytoship: false,
    editisdefault: false,
    editisactive: false,

    editcostprice: 0,
    editsellingprice: 0,
    editmarkupprice: 0,
    editdiscountprice: 0,
    editcostpricetax: 0,
    editsellingpricetax: 0,
    editmarkuppricetax: 0,
    editdiscountpricetax: 0,

    diamondclarity: "",
    diamondcolor: "",
    diamondsettings: "",
    diamondshape: "",
    diamondcount: "",
    diamondweight: "",
    metalindex: -1,
    themes: [],
    prod_styles: [],
    occassions: [],
    collections: [],
    stonecount: [],
    stonecolour: [],
    product_images: {},
    metalcolour: [],
    metal_purity: [],
    metalpurity: [],
    metal_color: 0,
    metal_weight: 0,
    diamond_colour: 0,
    diamond_clarity: 0,
    metal_height: 0,
    metal_width: 0,
    metal_length: 0,
    metal_object: 0,
    diamondtype: 0,
    metals: [],
    error_message: {},
  },
  masterData: {},
  setProductCtx: () => null,
};

export const ProductContext = React.createContext(productuploadCtxInitial);

export const ProductConsumer = ProductContext.Consumer;

const mapDataToCtx = (apiData, mapper, mappertype) => {
  if (Object.keys(apiData).length === 0) return {};

  productuploadCtxInitial.productCtx[mappertype] = mapper(apiData);

  return productuploadCtxInitial.productCtx;
};

export const ProductProvider = (props) => {
  console.info("PROPS", props, props.value.mappertype);
  const [productCtx, setProductCtx] = React.useState(
    mapDataToCtx(props.value.data, props.value.mapper, props.value.mappertype)
  );
  // on Mount get Data from storage
  // on Unmount store data to storage

  React.useEffect(() => {
    console.info("productCtx s", productCtx);
  }, [productCtx.material]);

  return (
    <ProductContext.Provider
      value={{
        productCtx,
        setProductCtx,
        masterData: mapDataToCtx(
          props.value.data,
          props.value.mapper,
          props.value.mappertype
        ),
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};
