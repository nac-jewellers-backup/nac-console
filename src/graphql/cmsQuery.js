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
      isActive
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

export const CREATE_CMS = `
mutation createNew($cloneData: JSON!, $page: String!){
  createCdn(input: {cdn: {data: $cloneData, page: $page}}) {
    cdn {
      data
      page
    }
  }
}`;

export const UPDATE_STATUS_CMS = `
mutation updateStatus($isActive: Boolean!, $page: String!){
  updateCdnByPage(input: {cdnPatch: {isActive: $isActive}, page: $page}){
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
}`;
