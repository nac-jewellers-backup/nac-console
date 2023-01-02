import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  cardButton: {
    textAlign: "center",
    margin: "8px 0px",
    textTransform: "capitalize",
    cursor: "pointer",
    borderRadius: "8px",
    backgroundColor: "#3f51b5",
    padding: "8px",
    color: "#fff",
  },
  labelAlign: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "4px",
  },
  edit:{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "4px",
  },
  dialogPaperMid: {
    minWidth: "400px",
  },
}));
