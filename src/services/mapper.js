import { PRODUCTCATEGORY } from "../graphql/query";
import {
  MATERIALMASTER,
  ORDERS,
  USERORDERS,
  VOUCHERMASTER,
} from "../services/queries";
import apidata from "../screens/Productupload/data.json";

export const productCategory = {
  query: PRODUCTCATEGORY,
  mapper: (response) => {
    const category = response.allMasterProductCategories.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
    }));
    const product_type = response.allMasterProductTypes.nodes.map((_) => ({
      ..._,
      value: _.shortCode,
      label: _.name,
      title: _.name,
    }));
    const material = response.allMasterMaterials.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
    }));
    const gender = response.allMasterGenders.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
    }));
    const vendorcode = response.allMasterVendors.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
      display: _.name + " (" + _.shortCode + " )",
    }));

    const diamondsettings = response.allMasterDiamondsSettings.nodes.map(
      (_) => ({
        ..._,
        value: _.id,
        label: _.name,
      })
    );
    const diamondshapes = response.allMasterDiamondsShapes.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
    }));
    const themes = response.allMasterThemes.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
      themeName: _.name,
    }));
    const styles = response.allMasterStyles.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
      styleName: _.name,
    }));

    const occasions = response.allMasterOccasions.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
      occassionName: _.name,
    }));
    const collections = response.allMasterCollections.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
      collectionName: _.name,
    }));
    const gemstonecolor = response.allMasterStonesColors.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
      stonecolor: _.name,
    }));
    const stones = response.allMasterStones.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
      stonecount: _.name,
    }));
    const metalcolour = response.allMasterMetalsColors.nodes.map((_) => ({
      ..._,
      productColor: _.name,
      value: _.id,
      label: _.name,
    }));
    const metalpurity = response.allMasterMetalsPurities.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
      purity: _.name,
    }));
    const diamondcolors = response.allMasterDiamondsColors.nodes.map((_) => ({
      ..._,
      value: _.id,
      label: _.name,
    }));

    const diamondclarities = response.allMasterDiamondClarities.nodes.map(
      (_) => ({
        ..._,
        value: _.id,
        label: _.name,
      })
    );
    const productseries = response.allProductLists.nodes.map((_) => ({
      ..._,
      value: _.productSeries,
    }));
    const gemstontypes = response.allMasterGemstonesTypes.nodes.map((_) => ({
      ..._,
      value: _.shortCode,
      label: _.name,
    }));

    const gemstonshapes = response.allMasterGemstonesShapes.nodes.map((_) => ({
      ..._,
      value: _.alias,
      label: _.name,
    }));
    const gemstonesettings = response.allMasterGemstonesSettings.nodes.map(
      (_) => ({
        ..._,
        value: _.alias,
        label: _.name,
      })
    );
    const earringbacking = response.allMasterEarringBackings.nodes.map((_) => ({
      ..._,
      value: _.alias,
      label: _.name,
    }));

    const diamondtypes = response.allMasterDiamondTypes.nodes.map((_) => ({
      ..._,
      value: _.diamondColor + _.diamondClarity,
      label: _.diamondColor + _.diamondClarity,
    }));
    const hashtags = response.allMasterHashTags.nodes.map((_) => ({
      ..._,
      value: _.name,
      label: _.name,
    }));
    // const metalSizeMinToMax = response.masterRingsSize.nodes.map(_ => ({
    //     ..._,
    //     name: _.name,
    //     size:_.size,
    //     productType : _.productType ,
    // }))

    const metals = apidata.metals;

    return {
      category,
      product_type,
      material,
      gender,
      vendorcode,
      metalcolour,
      metals,
      diamondsettings,
      diamondshapes,
      themes,
      styles,
      occasions,
      collections,
      gemstonecolor,
      stones,
      metalpurity,
      diamondcolors,
      diamondtypes,
      diamondclarities,
      productseries,
      gemstontypes,
      gemstonshapes,
      gemstonesettings,
      earringbacking,
      // metalSizeMinToMax
      hashtags,
    };
  },
};

export const orderList = {
  query: ORDERS,
  mapper: (response) => {
    const orders = response.allOrders.nodes.map((_) => ({
      ..._,
    }));

    return {
      orders,
    };
  },
};
export const userOders = {
  query: USERORDERS,
  mapper: (response) => {
    const orders = response.allOrders.nodes.map((_) => ({
      ..._,
    }));

    return {
      orders,
    };
  },
};
export const materialMaster = {
  query: VOUCHERMASTER,
  mapper: (response) => {
    const materials = response.allMasterMaterials.nodes.map((_) => ({
      ..._,
    }));
    const vendors = response.allMasterVendors.nodes.map((_) => ({
      ..._,
    }));

    const product_categories = response.allMasterProductCategories.nodes.map(
      (_) => ({
        ..._,
      })
    );
    const product_types = response.allMasterProductTypes.nodes.map((_) => ({
      ..._,
    }));
    const pricing_components = response.allMasterPricingComponents.nodes.map(
      (_) => ({
        ..._,
      })
    );
    const collections = response.allMasterCollections.nodes.map((_) => ({
      ..._,
    }));
    const purities = response.allMasterMetalsPurities.nodes.map((_) => ({
      ..._,
    }));
    const styles = response.allMasterStyles.nodes.map((_) => ({
      ..._,
    }));

    const themes = response.allMasterThemes.nodes.map((_) => ({
      ..._,
    }));
    const occations = response.allMasterOccasions.nodes.map((_) => ({
      ..._,
    }));
    const diamondtypes = response.allMasterDiamondTypes.nodes.map((_) => ({
      ..._,
      alias: _.shortCode,
      diamondtype: _.diamondColor + _.diamondClarity,
    }));

    // const metalSizeMinToMax = response.masterRingsSize.nodes.map(_ => ({
    //     ..._
    // }))

    // alert(JSON.stringify(product_types))
    return {
      vendors,
      product_categories,
      product_types,
      materials,
      pricing_components,
      collections,
      purities,
      styles,
      themes,
      occations,
      diamondtypes,
      // metalSizeMinToMax
    };
  },
};
