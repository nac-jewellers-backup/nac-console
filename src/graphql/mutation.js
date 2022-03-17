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

let UPDATE_ORDER = gql`
  mutation MyMutation(
    $id: UUID!
    $awbNumber: String
    $comments: String
    $orderStatus: String
    $paymentStatus: String
  ) {
    updateOrderById(
      input: {
        orderPatch: {
          awbNumber: $awbNumber
          comments: $comments
          orderStatus: $orderStatus
          paymentStatus: $paymentStatus
        }
        id: $id
      }
    ) {
      order {
        id
        paymentStatus
        awbNumber
        paymentMode
      }
    }
  }
`;

let CREATE_APPOINTMENT_DATE = gql`
  mutation MyMutation(
    $id: UUID!
    $createdAt: Datetime!
    $updatedAt: Datetime!
    $isActive: Boolean
    $date: Datetime
  ) {
    createAppointmentDate(
      input: {
        appointmentDate: {
          id: $id
          createdAt: $createdAt
          updatedAt: $updatedAt
          startDateTime: $date
          endDateTime: $date
          isActive: $isActive
        }
      }
    ) {
      appointmentDate {
        createdAt
        createdBy
        isActive
        updatedBy
        startDateTime
        id
        endDateTime
        isUnavailable
        nodeId
        updatedAt
        userId
      }
    }
  }
`;

let CREATE_APPOINTMENT_TIME = gql`
  mutation MyMutation(
    $id: UUID!
    $createdAt: Datetime!
    $startDateTime: Datetime
    $endDateTime: Datetime
    $appointmentDateId: UUID
    $updatedAt: Datetime!
  ) {
    createAppointmentDateTimeSlot(
      input: {
        appointmentDateTimeSlot: {
          id: $id
          createdAt: $createdAt
          updatedAt: $updatedAt
          endDateTime: $endDateTime
          startDateTime: $startDateTime
          isActive: true
          appointmentDateId: $appointmentDateId
        }
      }
    ) {
      appointmentDateByAppointmentDateId {
        id
        isActive
        startDateTime
        endDateTime
      }
    }
  }
`;

const DELETE_APPOINTMENT_TIME = gql`
  mutation MyMutation($id: UUID!) {
    deleteAppointmentDateTimeSlotById(input: { id: $id }) {
      appointmentDateByAppointmentDateId {
        id
        isActive
        startDate
        endDate
      }
    }
  }
`;
const DELETE_APPOINTMENT_DATE = gql`
  mutation MyMutation($id: UUID!) {
    deleteAppointmentDateById(input: { id: $id }) {
      appointmentDate {
        id
        isActive
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
  UPDATE_ORDER,
  CREATE_APPOINTMENT_DATE,
  CREATE_APPOINTMENT_TIME,
  DELETE_APPOINTMENT_TIME,
  DELETE_APPOINTMENT_DATE,
};
