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
import { MASTERCATEGORIES, PRODUCTDIAMONDTYPES } from "../../graphql/query";
import data from "./data.json";
import Page from "../../components/Page";
import { NetworkContext } from "../../context/NetworkContext";
import { Breadcrumbs } from "../../components";

const useStyles = makeStyles((theme) => ({
  root: {
    //  padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3),
  },
}));

export const Manageadminusers = withRouter((props) => {
  const [isadd, setIsadd] = React.useState(false);
  const [searchtext, setSearchtext] = useState("");
  const { sendNetworkRequest } = React.useContext(NetworkContext);
  const [mastervalue, setMastervalue] = React.useState([]);
  const [masterroles, setMasterroles] = React.useState([]);
  const classes = useStyles();

  const [filtervalue, setFiltervalue] = React.useState([]);

  async function createtax(taxcontent) {
    let roles = [];
    taxcontent.roles.forEach((element) => {
      roles.push(element.name);
    });
    let bodydata = {
      username: taxcontent.username,
      password: "123456789",
      email: taxcontent.email,
      roles: roles,
    };

    let response = await sendNetworkRequest("/api/auth/signup", {}, bodydata);
    getmaster();
  }
  async function getmasterroles() {
    let response = await sendNetworkRequest("/getmasterroles", {}, {});

    setMasterroles(response.roles);

    getmaster();
  }
  async function getmaster() {
    let response = await sendNetworkRequest("/getadminusers", {}, {});
    let adminusers = response.users;
    let users = [];
    adminusers.forEach((element) => {
      let userobj = {};
      userobj["id"] = element.id;
      userobj["username"] = element.username;
      userobj["password"] = element.password;
      userobj["email"] = element.email;
      userobj["mobile"] = element.mobile;
      userobj["status"] = element.status === "Active" ? true : false;
      let roles = [];
      let rolesnames = [];

      let userroles = element.user_roles;
      userroles.forEach((userroleobj) => {
        let roleobj = {};
        roleobj["id"] = userroleobj.master_role.id;
        roleobj["name"] = userroleobj.master_role.name;
        roles.push(roleobj);
        rolesnames.push(userroleobj.master_role.name);
      });
      userobj["roles"] = roles;
      userobj["rolenames"] = rolesnames.join(" , ");
      users.push(userobj);
    });

    setFiltervalue(users);
    setMastervalue(users);
    //getmaster()
  }
  useEffect(() => {
    getmasterroles();
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
        <Mastercontent
          title={"Admin Users"}
          button_title="Add New"
          onCreate={createtax}
          onSearch={search}
          columns={data.columns}
          masters={masterroles}
          values={filtervalue}
        />
      </Page>
    </>
  );
});

export default Manageadminusers;
