import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Vendor from "../../components/Vendor/Vendor";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Mastercontent from "../../components/Mastercontent/Mastercontent";
import { API_URL, GRAPHQL_DEV_CLIENT } from "../../config";
import { MASTERPAGES, PRODUCTDIAMONDTYPES } from "../../graphql/query";
import data from "./data.json";
import Page from "../../components/Page";
import { NetworkContext } from "../../context/NetworkContext";
import { Breadcrumbs } from "../../components";
import Addpermissions from "../../components/Addpermissions/Addpermissions";

const useStyles = makeStyles((theme) => ({
  root: {
    //  padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3),
  },
}));

export const Masterroles = withRouter((props) => {
  const [isadd, setIsadd] = React.useState(false);
  const [searchtext, setSearchtext] = useState("");
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [mastervalue, setMastervalue] = React.useState([]);
  const [isshowpermissions, setIsshowpermissions] = React.useState(false);
  const [masterpages, setMasterpages] = React.useState([]);
  const [editroleid, setEditroleid] = React.useState("");
  const [editpermissons, setEditpermissions] = React.useState({});

  const classes = useStyles();

  const [filtervalue, setFiltervalue] = React.useState([]);

  async function createtax(taxcontent) {
    let response = await sendNetworkRequest("/manageroles", {}, taxcontent);
    getmaster();
  }
  async function getmaster() {
    const url = GRAPHQL_DEV_CLIENT;
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: MASTERPAGES }),
    };
    // console.log("helo",setProductCtx)
    fetch(url, opts)
      .then((res) => res.json())
      .then((fatchvalue) => {
        setMasterpages(fatchvalue.data.allUniquepages.nodes);
      })
      .catch(console.error);

    let response = await sendNetworkRequest("/getmasterroles", {}, {});
    setMastervalue(response.roles);
    setFiltervalue(response.roles);
  }
  useEffect(() => {
    getmaster();
  }, []);

  function applysearch(searchcontent) {
    setSearchtext(searchcontent);
  }
  function addcategory() {
    setIsadd(true);
  }
  function cancelcreation() {
    setIsadd(false);
  }
  async function showpermissions(rowcontent) {
    let response = await sendNetworkRequest(
      "/getrolepermissions",
      {},
      { role_id: rowcontent.id }
    );
    setEditpermissions(response.permissions);
    setEditroleid(rowcontent.id);
    setIsshowpermissions(true);
    // alert(JSON.stringify(rowcontent))
  }
  async function updatepermissions(rowcontent) {
    let bodydata = {
      permissions: rowcontent,
      role_id: editroleid,
    };
    console.log(JSON.stringify(bodydata));
    setIsshowpermissions(false);
    let response = await sendNetworkRequest("/managepermissions", {}, bodydata);
    getmaster();
  }
  function cancelpermissions(rowcontent) {
    setIsshowpermissions(false);
    // alert(JSON.stringify(rowcontent))
  }
  async function search(taxcontent) {
    const filteredHomes = mastervalue.filter((x) =>
      x.name.toLowerCase()
        ? x.name.toLowerCase().match(taxcontent + ".*")
        : null
    );
    setFiltervalue(filteredHomes);
  }
  return (
    <>
      <Page className={classes.root} title="Orders Management List">
        <Breadcrumbs
          url="userconfiguration"
          name="User Configuration"
        ></Breadcrumbs>

        {/* <Header onSearch={applysearch} onAdd={addcategory}/> */}
        {/* <Results
       className={classes.results}
      searchtext={searchtext}
      isadd={isadd}
      onCancel={cancelcreation}
    /> */}
        {isshowpermissions ? (
          <Addpermissions
            role_id={editroleid}
            isopen={isshowpermissions}
            permissions={editpermissons}
            pages={masterpages}
            onClose={cancelpermissions}
            onSave={updatepermissions}
          />
        ) : null}
        <Mastercontent
          title={"Master Category"}
          button_title="Add New"
          onPermissionadd={showpermissions}
          onCreate={createtax}
          onSearch={search}
          columns={data.columns}
          values={filtervalue}
        />
      </Page>
    </>
  );
});

export default Masterroles;
