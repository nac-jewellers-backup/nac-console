import React from "react";
import { useApolloClient, useQuery } from "react-apollo";
import { gql } from "apollo-boost";
import { Breadcrumbs } from "../../components";
import Mastercontent from "../../components/Mastercontent/Mastercontent";
import Page from "../../components/Page/Page";
import tableData from "./data.json";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress, Typography } from "@material-ui/core";
import { NetworkContext } from "../../context/NetworkContext";
import { AlertContext } from "../../context";

let fetchMasterCountries = gql`
  query ($name: String) {
    allMasterCountries(filter: { name: { includesInsensitive: $name } }) {
      nodes {
        id
        name
        nicename
        numcode
        phonecode
        currency
        currencyAlias
        currencySymbol
        fxConversionRate
        isActive
      }
    }
  }
`;

let addMutationMasterCountry = gql`
  mutation ($input: MasterCountryInput!) {
    createMasterCountry(input: { masterCountry: $input }) {
      masterCountry {
        id
        createdAt
      }
    }
  }
`;

let updateMutationMasterCountry = gql`
  mutation ($id: Int!, $masterCountryPatch: MasterCountryPatch!) {
    updateMasterCountryById(
      input: { id: $id, masterCountryPatch: $masterCountryPatch }
    ) {
      masterCountry {
        updatedAt
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
}));

export const MasterCountry = (props) => {
  const classes = useStyles();
  const client = useApolloClient();
  const [search, setSearch] = React.useState(null);
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const snack = React.useContext(AlertContext);

  const addMasterCountry = (data) => {
    let { alias, isedit, __typename, ...rest } = data;
    let currentTimeStamp = new Date();
    let body = {};
    if (!isedit) {
      body = {
        mutation: addMutationMasterCountry,
        variables: {
          input: {
            ...rest,
            fxConversionRate: Number(rest.fxConversionRate),
            createdAt: currentTimeStamp,
            updatedAt: currentTimeStamp,
          },
        },
      };
    } else {
      body = {
        mutation: updateMutationMasterCountry,
        variables: {
          id: rest.id,
          masterCountryPatch: {
            ...rest,
            fxConversionRate: Number(rest.fxConversionRate),
            updatedAt: currentTimeStamp,
          },
        },
      };
    }
    client
      .mutate({ ...body })
      .then(() => {
        refetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const syncFXAPI = () => {
    sendNetworkRequest("/fxSynclatest", null, {})
      .then((res) => {
        snack.setSnack({ open: true, msg: res.message });
        refetch();
      })
      .catch((err) => {
        snack.setSnack({
          open: true,
          msg: "Some Error occured, Please try again!",
        });
      });
  };

  const { data, loading, error, refetch } = useQuery(fetchMasterCountries, {
    variables: {
      name: search,
    },
    fetchPolicy: "network-only",
  });

  return (
    <Page title={"Country List"}>
      <Breadcrumbs></Breadcrumbs>
      {loading && <LinearProgress className={classes.root} />}
      {!loading && (
        <Mastercontent
          title={"Country & Fx Rate"}
          button_title="Add New"
          fxSyncAPI={syncFXAPI}
          onCreate={addMasterCountry}
          onSearch={setSearch}
          columns={tableData.columns}
          values={data?.allMasterCountries?.nodes}
        />
      )}
      {error && <Typography>Some error occured!</Typography>}
    </Page>
  );
};
