import gql from "graphql-tag";

export const CDNPAGES = `
    query ($page: String!){
        cdnByPage(page: $page) {
          data
          id
          page
        }
      }
    `;

export const ALLCDNPAGES = `query MyQuery {
  allCdns {
    nodes {
      page
      data
    }
  }
}
`;

export const CMS_UPDATE = `
mutation updateStore( $stringifyState: JSON!,$page: String!) {
  updateCdnByPage(input: { cdnPatch: { data: $stringifyState }, page: $page }) {
    cdn {
      createdAt
      data
      id
      isActive
      nodeId
      page
      updatedAt
    }
  }
}
`;
