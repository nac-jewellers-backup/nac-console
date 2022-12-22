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

  blogInnerImage: {
    marginBottom: "20px",
    "& img": {
      width: "30%",
    },
  },

  border: {
    width: "100%",
    marginBottom: "20px",
  },

  imageText: {
    marginBottom: "15px",
    "& p": {
      fontSize: "14px",
      fontWeight: 600,
      [theme.breakpoints.down("md")]: {
        fontSize: "14px",
      },

      [theme.breakpoints.down("xs")]: {
        fontSize: "14px",
      },
    },
  },

  alignText: {
    width: "100%",
    height: "100%",
    marginBottom: "15px",
    "& p": {
      fontSize: "14px",
      fontWeight: 600,
      [theme.breakpoints.down("md")]: {
        fontSize: "14px",
      },

      [theme.breakpoints.down("xs")]: {
        fontSize: "14px",
      },
    },
  },

  contentText: {
    marginBottom: "20px",
    "& p": {
      fontSize: "14px",
      [theme.breakpoints.down("md")]: {
        fontSize: "14px",
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: "14px",
      },
    },
  },

  datePicker: {
    "& .react-datepicker-wrapper": {
      "& .react-datepicker__input-container": {
        "& input": {
          width: "100% !important",
          padding: "8.5px 12px !important",
        },
      },
    },
  },

  textFields: {
    "& .rdw-editor-main": {
      borderRadius: "4px",
    },
    "& .public-DraftStyleDefault-ltr": {
      padding: "0px 12px",
    },
  },

  headerBottom: {
    marginTop: "15px",
    "& p": {
      fontSize: "12px",
      fontWeight: 500,
    },
  },
}));
