import React from 'react';
import { withRouter } from "react-router-dom";
import BannerPage from "../../components/BannerPage"
import Container from '@material-ui/core/Container';
// import {Input} from '../../components/Input.js'

// import "./Dashboard.css"

class Banner_ extends React.Component {
  
   
  render() {
  return (
    <Container maxWidth="false" disableGutters>
     <BannerPage />
  </Container>
         
  );
}
}

export const Banner = withRouter(Banner_);
  export default Banner;