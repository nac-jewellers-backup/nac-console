import React from "react";
import { useApolloClient, useQuery } from "react-apollo";
import { gql } from "apollo-boost";
import { Breadcrumbs } from "../../components";
import Mastercontent from "../../components/Mastercontent/Mastercontent";
import Page from "../../components/Page/Page";
import tableData from "./data.json";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress, Typography } from "@material-ui/core";

let fetchDailyMetalPrices = gql`
  query {
    allDailyMetalPrices {
      nodes {
        id
        metalName
        displayName
        displayPrice
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

let addMutationMasterCountry = gql`
  mutation ($input: DailyMetalPriceInput!) {
    createDailyMetalPrice(input: { dailyMetalPrice: $input }) {
      dailyMetalPrice {
        id
        createdAt
      }
    }
  }
`;

let updateMutationMasterCountry = gql`
  mutation ($id: Int!, $dailyMetalPricePatch: DailyMetalPricePatch!) {
    updateDailyMetalPriceById(
      input: { id: $id, dailyMetalPricePatch: $dailyMetalPricePatch }
    ) {
      dailyMetalPrice {
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

export const DailyMetalRate = (props) => {
  const classes = useStyles();
  const client = useApolloClient();

  const addDailyMetalPrice = (data) => {
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
            displayPrice: Number(rest.displayPrice),
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
          dailyMetalPricePatch: {
            ...rest,
            displayPrice: Number(rest.displayPrice),
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

  const { data, loading, error, refetch } = useQuery(fetchDailyMetalPrices);

  return (
    <Page title={"Daily MetalRate"}>
      <Breadcrumbs></Breadcrumbs>
      {loading && <LinearProgress className={classes.root} />}
      {!loading && (
        <Mastercontent
          button_title="Add New"
          onCreate={addDailyMetalPrice}
          columns={tableData.columns}
          values={data?.allDailyMetalPrices?.nodes}
        />
      )}
      {error && <Typography>Some error occured!</Typography>}
    </Page>
  );
};
