import React from "react";
import { useStyles } from "./style";
import BannerCMS from "./components/bannerCMS";
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { CDNPAGES, CMS_UPDATE } from "../../graphql/cmsQuery";
import StoreLocatorCMS from "./components/storeLocatorCMS";
import { useLocation } from "react-router-dom";
import { AlertContext } from "../../context";
import TitleDescriptionCMS from "./components/titleDescriptionCMS";
import QueryFormCMS from "./components/queryFormCMS";
import SlidingImageCardCMS from "./components/slidingImageCardCMS";
import SpclTitleDescr from "./components/spclTitleDescrCMS";
import BookYourAppointmentCMS from "./components/bookYourAppointmentCMS";
import TestimonialCMS from "./components/testimonialCMS";
import AboutCollection from "./components/aboutCollectionCMS";
import TitleComp from "./components/titleCompCMS";


const CmsComponent = (props) => {
  const classes = useStyles();
  const snack = React.useContext(AlertContext);
  const location = useLocation();
  const [state, setState] = useState([]);
  console.log("state", state);

  useEffect(() => {
    fetchCall();
  }, []);

  const fetchCall = () => {
    const pageName = location.state.name;
    fetch(`${API_URL}/graphql`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CDNPAGES,
        variables: { page: pageName },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const dataRecieved = JSON.parse(data.data.cdnByPage.data);
        setState(dataRecieved);
      });
  };

  const handleSubmit = async (data, component, propsKey) => {
    const replaceIndex = state.findIndex((val) => val.component === component);
    const newState = state;
    newState.splice(replaceIndex, 1, data);
    const stringifyState = JSON.stringify(newState);
    fetch(`${API_URL}/graphql`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CMS_UPDATE,
        variables: { stringifyState: stringifyState, page: location.state.name },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        snack.setSnack({
          open: true,
          msg: "Successfully Updated!",
        });
        const newStateSet = JSON.parse(JSON.stringify(newState))
        setState(newStateSet)
        fetchCall();
      });
  };

  const getTheTable = (val) => {
    switch (val?.component) {
      case "BannerComponent": {
        return <BannerCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "Storelocator": {
        return <StoreLocatorCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "TitleAndData": {
        return <TitleDescriptionCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "QueryForm": {
        return <QueryFormCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "SpclTitleDescr": {
        return <SpclTitleDescr data={val} handleSubmit={handleSubmit} />;
      }
      case "AboutBookAppointment": {
        return <BookYourAppointmentCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "titleComp": {
        return <TitleComp data={val} handleSubmit={handleSubmit} />;
      }
      case "SlideImgMediaCard": {
        return <SlidingImageCardCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "Testimonial": {
        return <TestimonialCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "TestimonialTwo": {
        return <AboutCollection data={val} handleSubmit={handleSubmit} />;
      }

      default: {
        return <h1></h1>;
      }
    }
  };

  return (
    <div>
      {state.map((val, i) => {
        return getTheTable(val);
      })}
    </div>
  );
};

export default CmsComponent;
