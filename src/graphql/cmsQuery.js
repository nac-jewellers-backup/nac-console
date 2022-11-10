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


let UPDATE_HOLIDAY = gql`
  mutation ($id: Int!, $item: HolidayManagerPatch!) {
    updateHolidayManagerById(input: { id: $id, holidayManagerPatch: $item }) {
      holidayManager {
        id
      }
    }
  }
`;
