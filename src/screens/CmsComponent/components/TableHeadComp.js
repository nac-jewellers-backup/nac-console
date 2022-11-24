import { Button, Typography } from "@material-ui/core";
import React from "react";
import { useStyles } from "./styles";

function TableHeaderComp(props) {
    const classes = useStyles();
    const {name,handleAddNew = () => null,noAddNew = false} = props
  return (
    <div className={classes.dialogHeader} style={{ padding: "8px" }}>
      <Typography component="h6" variant="h6" style={{ fontWeight: "bold" }}>
        {name}
      </Typography>
      {!noAddNew && <Button variant="contained" color="primary" onClick={handleAddNew}>
        Add New
      </Button>}
    </div>
  );
}

export default TableHeaderComp;
