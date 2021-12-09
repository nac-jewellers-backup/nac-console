import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import "./table.css";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  conatainerRow: {
    width: "300px",
    color: "#6f6f6f",
    display: "grid",
    padding: "16px 24px",
    maxHeight: " 256px",
    fontSize: "9px",
    overflowX: "visible",
    overflowY: "scroll",
    gridColumnGap: "24px",
    gridTemplateColumns: "repeat(2, 1fr)",

    [theme.breakpoints.up("sm")]: {
      width: "500px",
      color: "#6f6f6f",
      display: "grid",
      padding: "16px 24px",
      maxHeight: " 270px",
      fontSize: "14px",
      overflowX: "visible",
      overflowY: "scroll",
      gridColumnGap: "20px",
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
}));

export default function Columns(props) {
  const classes = useStyles();

  const checkboxrow = props.columns;
  const [columns, setColumns] = React.useState({
    listOfValue: checkboxrow,
  });
  const [showcolumns, setshowColumns] = React.useState();

  function stateChange(id) {
    let listOfValue = columns.listOfValue.map((data, index) => {
      if (id === data.id) {
        data.isActive = data.isActive ? false : true;
      }
      return data;
    });
    setColumns({
      listOfValue,
    });
  }
  function resetButton() {
    let listOfValue = columns.listOfValue.map((data, index) => {
      if (!data.disabled) {
        data.isActive = false;
      }

      return data;
    });
    setColumns({
      listOfValue,
    });
  }
  function saveaction() {
    // let listOfValue = columns.listOfValue.map((data,index)=>{
    //     if(data.isActive){
    //               }
    //               return data;

    // })
    let columnnames = [];
    columns.listOfValue.forEach((element) => {
      if (element.isActive) {
        columnnames.push(element);
      }
    });
    props.selectcolumnfilter(columnnames, props.displytype);
    props.columnclose();
  }
  // const lists = columns.listOfValue.map((head) =>
  //     (
  //         <Grid conatiner>
  //             <Grid item xs={4}><Checkbox
  //                 value="secondary"
  //                 color="primary"
  //                 inputProps={{ 'aria-label': 'secondary checkbox' }}
  //                 checked = {head.isActive}
  //                 onChange = {()=>stateChange(head.id)}

  //             />
  //                 <h3 style={{ display: "inline-block", fontWeight: "500" }}>{head}</h3>
  //             </Grid>
  //         </Grid>
  //     )

  // );

  return (
    <div style={{ maxHeight: "420px" }}>
      {/* <Typography style={{ fontWeight: "400", color: "#6f6f6f", width: "90%", margin: "6px auto" }} className={classes.typography} variant="h5">(number) columns selected out of (total number)</Typography> */}
      <Grid
        style={{
          height: "270px",
          borderBottom: "1px solid #ddd",
          width: "100%",
          margin: "auto",
          paddingTop: "5px",
          paddingBottom: "10px",
        }}
      >
        <Grid conatiner>
          <Grid item className={classes.conatainerRow}>
            {columns.listOfValue.map((head) => (
              <Grid container>
                <Checkbox
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  checked={head.isActive}
                  disabled={head.disabled}
                  onChange={() => stateChange(head.id)}
                />
                <h3 style={{ fontWeight: "500" }}>{head.name}</h3>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px auto",
          width: "90%",
        }}
      >
        <Grid>
          <Button size="large" onClick={() => resetButton()}>
            RESET
          </Button>
        </Grid>
        <Grid style={{ display: "flex", justifyContent: "space-between" }}>
          <Button size="small" onClick={() => props.columnclose()}>
            cancel
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={() => saveaction()}
            backgroundColor="secondary"
            size="large"
            variant="contained"
            className={classes.margin}
          >
            SAVE
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
