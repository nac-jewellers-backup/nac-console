import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  dialogPaper: {
    minWidth: "1200px",
  },
  dialogPaperMid: {
    minWidth: "800px",
  },
  dialogHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}));
