import React from "react";
import { withRouter } from "react-router-dom";
import { VoucherProvider } from "../../context";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { useQuery } from "react-apollo";
import { materialMaster } from "../../services/mapper";
import Component from "./Salediscountcontent";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  progress: {
    margin: theme.spacing(2),
  },
}));
export const Salediscount = withRouter((props) => {
  const classes = useStyles();

  const { data, loading, error } = useQuery(materialMaster.query);
  if (loading)
    return (
      <div>
        <CircularProgress className={classes.progress} />
      </div>
    );
  if (error) return <div>error</div>;
  return (
    <VoucherProvider
      value={{
        data,
        mapper: materialMaster.mapper,
        mappertype: "voucherMaster",
      }}
    >
      <Component {...props} />
    </VoucherProvider>
  );
});
export default Salediscount;
