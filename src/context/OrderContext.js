import React from "react";

const orderCtxInitial = {
  orderCtx: {},
  orderMaster: {
    orders: [],
  },
  setOrderCtx: () => null,
};

export const OrderContext = React.createContext(orderCtxInitial);

export const OrderConsumer = OrderContext.Consumer;

const mapDataToCtx = (apiData, mapper, mappertype) => {
  if (Object.keys(apiData).length === 0) return {};

  orderCtxInitial.orderCtx[mappertype] = mapper(apiData);

  console.log("resposeobjvalue1" + JSON.stringify(orderCtxInitial.orderCtx));

  return orderCtxInitial.orderCtx;
};

export const OrderProvider = (props) => {
  console.info("PROPS", props, props.value.mappertype);
  const [orderCtx, setorderCtx] = React.useState(mapDataToCtx(props.value.data, props.value.mapper, props.value.mappertype));
  // on Mount get Data from storage
  // on Unmount store data to storage

  React.useEffect(() => {
    console.info("orderCtx s", orderCtx);
  }, [orderCtx.order]);

  return (
    <OrderContext.Provider
      value={{ orderCtx, setorderCtx, masterData: mapDataToCtx(props.value.data, props.value.mapper, props.value.mappertype) }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};
