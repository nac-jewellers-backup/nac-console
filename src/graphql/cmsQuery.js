export const CDNPAGES = (page) => {
    return `
    query MyQuery{
        cdnByPage(page: "${page}") {
          data
          id
          page
        }
      }
    `;
} 