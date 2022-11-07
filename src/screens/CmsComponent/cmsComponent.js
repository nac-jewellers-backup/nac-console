import React from "react";
import { useStyles } from "./style";
import BannerCMS from "./components/bannerCMS";
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { CDNPAGES } from "../../graphql/cmsQuery";
import StoreLocatorCMS from "./components/storeLocatorCMS";

const CmsComponent = (props) => {
  const classes = useStyles();
  const [state, setState] = useState([]);
  console.log("state", state);

  useEffect(() => {
    fetch(`${API_URL}/graphql`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CDNPAGES("store"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const dataRecieved = JSON.parse(data.data.cdnByPage.data);
        setState(dataRecieved);
      });
  }, []);

  const getTheTable = (val) => {
    switch(val?.component){
      case "BannerComponent" :{
        return (<BannerCMS data={val?.props} />)
      }
      case "Storelocator" :{
        return (<StoreLocatorCMS data={val?.props} />)
      }
      default: {
        return <h1></h1>;
      }
    }
  }

  return (
    <div>
      {state.map((val,i) => {
        return getTheTable(val)
      })}
    </div>
  );
};

export default CmsComponent;
