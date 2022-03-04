import React from "react";
import { useApolloClient, useQuery } from "react-apollo";
import { gql } from "apollo-boost";
import { Breadcrumbs } from "../../components";
import Mastercontent from "../../components/Mastercontent/Mastercontent";
import Page from "../../components/Page/Page";
import tableData from "./data.json";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress, Typography } from "@material-ui/core";

let fetchMasterCountries = gql`
  query {
    allMasterCountries {
      nodes {
        id
        name
        nicename
        numcode
        phonecode
        currency
        currencyAlias
        currencySymbol
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

  const addMasterCountry = (data) => {
    console.log(data);
    let { alias, isedit, __typename, ...rest } = data;
    let currentTimeStamp = new Date();
    let body = {};
    if (!isedit) {
      body = {
        mutation: addMutationMasterCountry,
        variables: {
          input: {
            ...rest,
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

  const { data, loading, error, refetch } = useQuery(fetchMasterCountries);

  return (
    <Page title={"Country List"}>
      <Breadcrumbs></Breadcrumbs>
      {loading && <LinearProgress className={classes.root} />}
      {!loading && (
        <Mastercontent
          button_title="Add New"
          onCreate={addMasterCountry}
          columns={tableData.columns}
          values={data?.allMasterCountries?.nodes}
        />
      )}
      {error && <Typography>Some error occured!</Typography>}
    </Page>
  );
};
