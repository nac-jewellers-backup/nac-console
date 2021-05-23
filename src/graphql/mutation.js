import gql from "graphql-tag";

let CREATE_HOLIDAY = gql`
  mutation ($item: HolidayManagerInput!) {
    createHolidayManager(input: { holidayManager: $item }) {
      holidayManager {
        id
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

let DELETE_HOLIDAY = gql`
  mutation ($id: Int!) {
    deleteHolidayManagerById(input: { id: $id }) {
      clientMutationId
    }
  }
`;

let CREATE_WAREHOUSE = gql`
  mutation ($item: WarehouseInput!) {
    createWarehouse(input: { warehouse: $item }) {
      warehouse {
        id
      }
    }
  }
`;

let UPDATE_WAREHOUSE = gql`
  mutation ($id: Int!, $item: WarehousePatch!) {
    updateWarehouseById(input: { id: $id, warehousePatch: $item }) {
      warehouse {
        id
      }
    }
  }
`;

let DELETE_WAREHOUSE = gql`
  mutation ($id: Int!) {
    deleteWarehouseById(input: { id: $id }) {
      warehouse {
        id
      }
    }
  }
`;

let CREATE_INVENTORY = gql`
  mutation ($item: InventoryInput!) {
    createInventory(input: { inventory: $item }) {
      inventory {
        id
      }
    }
  }
`;

let UPDATE_INVENTORY = gql`
  mutation ($id: UUID!, $item: InventoryPatch!) {
    updateInventoryById(input: { id: $id, inventoryPatch: $item }) {
      inventory {
        id
      }
    }
  }
`;

let DELETE_INVENTORY = gql`
  mutation ($id: UUID!) {
    deleteInventoryById(input: { id: $id }) {
      inventory {
        id
      }
    }
  }
`;

export {
  CREATE_HOLIDAY,
  UPDATE_HOLIDAY,
  DELETE_HOLIDAY,
  CREATE_WAREHOUSE,
  UPDATE_WAREHOUSE,
  DELETE_WAREHOUSE,
  CREATE_INVENTORY,
  UPDATE_INVENTORY,
  DELETE_INVENTORY,
};
