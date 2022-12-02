import React from "react";
import { useStyles } from "./style";
import BannerCMS from "./components/bannerCMS";
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { CDNPAGES, CMS_UPDATE, CREATE_CMS } from "../../graphql/cmsQuery";
import StoreLocatorCMS from "./components/storeLocatorCMS";
import { useLocation } from "react-router-dom";
import { AlertContext } from "../../context";
import TitleDescriptionCMS from "./components/titleDescriptionCMS";
import QueryFormCMS from "./components/queryFormCMS";
import SlidingImageCardCMS from "./components/slidingImageCardCMS";
import CustomCareerBannerCMS from "./components/customCareerBannerCMS";
import CustomCareerCardCMS from "./components/customCareerCardCMS";
import CustomCollectionHeaderCMS from "./components/customCollectionHeaderCMS";
import CustomCollectionCardsCMS from "./components/customCollectionCardsCMS";
import CustomNewsCMS from "./components/customNewsCMS";
import SpclTitleDescr from "./components/spclTitleDescrCMS";
import BookYourAppointmentCMS from "./components/bookYourAppointmentCMS";
import TestimonialCMS from "./components/testimonialCMS";
import AboutCollection from "./components/aboutCollectionCMS";
import TitleComp from "./components/titleCompCMS";
import TitleWithDescription from "./components/titleWithDescription";
import CustomAdvertisementCMS from "./components/customAdvertisementCMS";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@material-ui/core";
import ExperienceBannerCMS from "./components/experienceBannerCMS";
import ExperienceCardCMS from "./components/experienceCardCMS";
import ExperienceTableCardCMS from "./components/experienceTableCards";
import StoreLocatorDetailsCMS from "./components/storeLocatorDetailsCMS";

const CmsComponent = (props) => {
  const classes = useStyles();
  const snack = React.useContext(AlertContext);
  const location = useLocation();
  const [state, setState] = useState([]);
  const [cloneDialog, setCloneDialog] = useState(false);
  const [cloneState, setCloneState] = useState({
    page: null,
  });
  console.log("state", state);
  console.log("cloneState", cloneState);

  useEffect(() => {
    fetchCall();
  }, []);

  const handleClone = () => {
    console.log("handleClone", state);
    setCloneDialog(true);
  };

  const handleCloneSumbit = () => {
    if (cloneState.page) {
      const cloneData = JSON.stringify(state);
      const pageName = cloneState.page;
      fetch(`${API_URL}/graphql`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: CREATE_CMS,
          variables: {
            cloneData: cloneData,
            page: pageName,
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          handleCloneDialogClose()
          snack.setSnack({
            open: true,
            msg: "Page Created Successfully",
          });
        });
    }else{
      snack.setSnack({
        open: true,
        msg: "Please enter the page Route",
      });
    }
  };

  const handleCloneDialogClose = () => {
    setCloneDialog(false);
  };

  const onChangeData = (event) => {
    setCloneState({
      ...cloneState,
      [event.target.name]: event.target.value,
    });
  };

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
        variables: {
          stringifyState: stringifyState,
          page: location.state.name,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        snack.setSnack({
          open: true,
          msg: "Successfully Updated!",
        });
        const newStateSet = JSON.parse(JSON.stringify(newState));
        setState(newStateSet);
        fetchCall();
      });
  };

  const getTheTable = (val) => {
    console.log("val000", val);
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
      case "SlideImgMediaCard": {
        return <SlidingImageCardCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "CustomBanner": {
        return <CustomCareerBannerCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "CareerCard": {
        return <CustomCareerCardCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "CollectionHeader": {
        return (
          <CustomCollectionHeaderCMS data={val} handleSubmit={handleSubmit} />
        );
      }
      case "CollectionCards": {
        return (
          <CustomCollectionCardsCMS data={val} handleSubmit={handleSubmit} />
        );
      }
      case "CustomNews": {
        return <CustomNewsCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "SpclTitleDescr": {
        return <SpclTitleDescr data={val} handleSubmit={handleSubmit} />;
      }
      case "AboutBookAppointment": {
        return (
          <BookYourAppointmentCMS data={val} handleSubmit={handleSubmit} />
        );
      }
      case "titleComp": {
        return <TitleComp data={val} handleSubmit={handleSubmit} />;
      }
      case "Testimonial": {
        return <TestimonialCMS data={val} handleSubmit={handleSubmit} />;
      }
      case "TestimonialTwo": {
        return <AboutCollection data={val} handleSubmit={handleSubmit} />;
      }
      case "TitleAndDescription": {
        return <TitleWithDescription data={val} handleSubmit={handleSubmit} />;
      }
      case "CustomAdvertising": {
        return (
          <CustomAdvertisementCMS data={val} handleSubmit={handleSubmit} />
        );
      }
      case "ExperienceCard": {
        return <ExperienceCardCMS data={val} handleSubmit={handleSubmit} />;
      }

      case "experienceBanner": {
        return <ExperienceBannerCMS data={val} handleSubmit={handleSubmit} />;
      }

      case "experienceCard": {
        return <ExperienceTableCardCMS data={val} handleSubmit={handleSubmit} />;
      }

      case "StoreDetailsComponent":{
        return(
          <StoreLocatorDetailsCMS data={val} handleSubmit={handleSubmit}/>
        )
      }
      default: {
        return <h1></h1>;
      }
    }
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Grid>
          <Button variant="contained" onClick={handleClone} color="primary">
            Clone
          </Button>
        </Grid>
      </Grid>

      {state.map((val, i) => {
        return getTheTable(val);
      })}
      <Dialog
        classes={{ paper: classes.dialogPaperMid }}
        open={cloneDialog}
        onClose={handleCloneDialogClose}
      >
        <DialogTitle id="form-dialog-title">Clone the current page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="page"
            label="Page Route"
            variant="outlined"
            fullWidth
            onChange={onChangeData}
            value={cloneState.page}
            name="page"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloneSumbit}>Clone Data</Button>
          <Button onClick={handleCloneDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CmsComponent;
