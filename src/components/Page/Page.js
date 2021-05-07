import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
// import { Helmet } from 'react-helmet';
import PropTypes from "prop-types";

const NODE_ENV = process.env.NODE_ENV;
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

const useStyles = makeStyles({
  media: {
    height: 140,
  },
});

export default function Page(props) {
  const classes = useStyles();
  const { title, children, ...rest } = props;

  // useEffect(() => {
  //   if (NODE_ENV !== 'production') {
  //     return;
  //   }

  //   if (window.gtag) {
  //     window.gtag('config', GA_MEASUREMENT_ID, {
  //       page_path: router.location.pathname,
  //       page_name: title
  //     });
  //   }
  // }, [title, router]);
  return (
    <div {...rest}>
      {/* <Helmet>
        <title>{title}</title>
      </Helmet> */}
      {children}
    </div>
  );
}
