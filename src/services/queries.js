import { gql } from 'apollo-boost';

export const PRODUCTCATEGORY = gql`query {
    allMasterProductCategories{
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
  },
  allMasterStonesColors {
    nodes {
      alias
      id
      name
    }
  },
  allMasterStones {
    nodes {
      alias
      id
      name
    }
  }
  }`

  export const USERORDERS = gql`query($userid: UUID!) {
    allOrders(filter: {userProfileByUserProfileId: {id: {equalTo: $userid}}}) {
      nodes {
        paymentMode
        paymentStatus
        updatedAt
        createdAt
        awbNumber
        cartId
        orderStatus
        comments
        id
        shoppingCartByCartId {
          shoppingCartItemsByShoppingCartId {
            nodes {
              transSkuListByProductSku {
                generatedSku
                productListByProductId {
                  productCategory
                  productType
                  productCollectionsByProductId {
                    nodes {
                      collectionName
                    }
                  }
                }
              }
            }
          }
          giftwrapsByCartId {
            nodes {
              message
              giftFrom
              giftTo
            }
          }
          
          cartAddressesByCartId {
            nodes {
              firstname
              contactNumber
              addressline1
              addressline2
              city
              pincode
              state
            }
          }
          userProfileByUserprofileId {
            firstName
            mobile
            email
          }
        }
        paymentDetailsByOrderId {
          nodes {
            paymentResponse
          }
        }
      }
    }
  
  }`


  export const ORDERS = gql`
  query (
    $order_filter: OrderFilter!
    $limit: Int
    $offset: Int
    $order_by: [OrdersOrderBy!]
  ) {
    allOrders(
      filter: $order_filter
      first: $limit
      offset: $offset
      orderBy: $order_by
    ) {
      nodes {
        paymentMode
        paymentStatus
        updatedAt
        createdAt
        awbNumber
        cartId
        orderStatus
        comments
        id
        
        shoppingCartByCartId {
          shoppingCartItemsByShoppingCartId {
            nodes {
              transSkuListByProductSku {
                generatedSku
                productListByProductId {
                  productCategory
                  productType
                  productCollectionsByProductId {
                    nodes {
                      collectionName
                    }
                  }
                }
              }
            }
          }
          giftwrapsByCartId {
            nodes {
              message
              giftFrom
              giftTo
            }
          }

          cartAddressesByCartId {
            nodes {
              firstname
              contactNumber
              addressline1
              addressline2
              city
              pincode
              state
            }
          }
          userProfileByUserprofileId {
            firstName
            mobile
            email
            userAddressesByUserProfileId {
              nodes {
                contactNumber
              }
            }
          }
        }
        paymentDetailsByOrderId {
          nodes {
            paymentResponse
          }
        }
      }
      totalCount
    }
  }
`;


export const MATERIALMASTER = gql`query {
  allMasterVendors {
    nodes {
      name
      id
    }
  },
  allMasterPricingComponents(condition: {isActive: true}) {
    nodes {
      name
      id
    }
  }
  allMasterProductCategories {
    nodes {
      name
      id
    }
  },
  allMasterProductTypes {
    nodes {
      name
      id
    }
  },
  allMasterMetalsPurities {
    nodes {
      name
      id
    }
  },
   allMasterMaterials {
    nodes {
      alias
      id
      name
    }
  }
}`

export const VOUCHERMASTER = gql`query {
  allMasterVendors {
    nodes {
      name
      id
      
      
    }
  },
  allMasterPricingComponents(condition: {isActive: true}) {
    nodes {
      name
      id
    }
  }
  allMasterProductCategories {
    nodes {
      name
      id
      alias
    }
  },
  allMasterProductTypes {
    nodes {
      name
      id
      alias
    }
  },
  allMasterMetalsPurities {
    nodes {
      name
      id
      alias
    }
  },
   allMasterMaterials {
    nodes {
      alias
      id
      name
    }
  },
  allMasterCollections {
    nodes {
      name
      id
      alias
    }
  }
  allMasterMetalsPurities{
    nodes {
      name
      id
    }
  }

  allMasterMetalsPurities{
    nodes {
      name
      id
    }
  }

  allMasterStyles {
    nodes {
      name
      id
      alias
    }
  }

  allMasterThemes {
    nodes {
      name
      id
      alias
    }
  }
  allMasterDiamondTypes {
    nodes {
      shortCode
      diamondColor
      diamondClarity
      id
    }
  }
  allMasterOccasions {
    nodes {
      name
      alias
      id
    }
  }
}`



export const SHIPPINGMASTER = `query {
  allMasterProductCategories {
    nodes {
      name
      id
      alias
    }
  },
  allMasterProductTypes {
    nodes {
      name
      id
      alias
    }
  },
  allMasterMetalsPurities {
    nodes {
      name
      id
      alias
    }
  },
   allMasterMaterials {
    nodes {
      alias
      id
      name
    }
  },
  allMasterCollections {
    nodes {
      name
      id
      alias
    }
  }
  allMasterMetalsPurities{
    nodes {
      name
      id
    }
  }

  allMasterMetalsPurities{
    nodes {
      name
      id
    }
  }
  allShippingCharges(condition: {isActive: true}) {
    nodes {
      name
      id
      productAttributes
    }
  }
  allMasterStyles {
    nodes {
      name
      id
      alias
    }
  }

  allMasterThemes {
    nodes {
      name
      id
      alias
    }
  }
  allMasterDiamondTypes {
    nodes {
      shortCode
      diamondColor
      diamondClarity
      id
    }
  }
  allMasterOccasions {
    nodes {
      name
      alias
      id
    }
  }
}`




export const TAXMASTER = `query {
  allMasterProductCategories {
    nodes {
      name
      id
      alias
    }
  },
  allMasterProductTypes {
    nodes {
      name
      id
      alias
    }
  },
  allMasterMetalsPurities {
    nodes {
      name
      id
      alias
    }
  },
   allMasterMaterials {
    nodes {
      alias
      id
      name
    }
  },
  allMasterCollections {
    nodes {
      name
      id
      alias
    }
  }
  allMasterMetalsPurities{
    nodes {
      name
      id
    }
  }

  allMasterMetalsPurities{
    nodes {
      name
      id
    }
  }
  allMasterTaxSettings {
    nodes {
      hsnNumber
      id
      productAttributes
    }
  }
  allMasterStyles {
    nodes {
      name
      id
      alias
    }
  }

  allMasterThemes {
    nodes {
      name
      id
      alias
    }
  }
  allMasterDiamondTypes {
    nodes {
      shortCode
      diamondColor
      diamondClarity
      id
    }
  }
  allMasterOccasions {
    nodes {
      name
      alias
      id
    }
  }
}`

