import React from 'react';
import { withRouter } from "react-router-dom";
import BannerPage from "../../components/BannerPage";
import BannerListingPage from "../../components/BannerPage/BannerListingPage";
import BannerSpecificPage from "../../components/BannerPage/BannerSpecificPage";
import Container from '@material-ui/core/Container';

class Banner_ extends React.Component {
  
  render() {
  return (
    <Container maxWidth="false" disableGutters>
     <BannerPage />
     <BannerListingPage />
     <BannerSpecificPage />
  </Container>
         
  );
}
}

export const Banner = withRouter(Banner_);
  export default Banner;