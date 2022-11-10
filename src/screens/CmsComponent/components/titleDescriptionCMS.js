import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
} from "@material-ui/core";
import React from "react";
import { useContext } from "react";
import { TableComp } from "../../../components";
import { AlertContext } from "../../../context";
import EditorConvertToHTML from "./richTextEditor";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from "draftjs-to-html";

const header = ["S.No", "Title", "Descriptiom", "Action"];
const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "TEXT", name: "title" },
  { type: "TEXT", name: "description" },
  { type: "EDIT", name: "" },
];

const TitleDescriptionCMS = (props) => {
  const classes = useStyles();
  const alert = useContext(AlertContext);
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    title: "",
    description: "",
    richEditor: "",
  });
  const [titleDesc, setTitleDesc] = React.useState([]);
  React.useEffect(() => {
    setTitleDesc([props?.data?.props]);
    setState(props?.data?.props);
  }, []);

  console.log("richEditor",state.richEditor);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onChangeData = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const validation = () => {
    if (state.description.length < 1 || state.title.length < 1) {
      return false;
    } else {
      return true;
    }
  };
  const onsubmitvalue = async () => {
    if (validation()) {
      let getData = [];
      getData = {
        component: props?.data?.component,
        props: state,
      };
      setTitleDesc([getData.props]);
      setOpen(false);
      props.handleSubmit(getData, "TitleAndData", "");
    } else {
      alert.setSnack({
        open: true,
        severity: "error",
        msg: "Please fill all the fields in the form ",
      });
    }
  };

  const handleEdit = (e, rowData, rowIndex) => {
    handleClickOpen();
  };

  const handleChangeState = (data) => {
    setState({
      ...state,richEditor:data
    })
  }
  return (
    <Paper className={classes.root}>
      <TableHeaderComp
        name={"Title and Description Component"}
        noAddNew
        handleAddNew={handleClickOpen}
      />
      <TableComp
        header={header}
        tableData={tableData}
        data={titleDesc}
        handleEdit={handleEdit}
      />

      <Dialog
        classes={{ paper: classes.dialogPaperMid }}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="form-dialog-title">
          Add New Title and Description Item
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            variant="outlined"
            fullWidth
            onChange={onChangeData}
            value={state.title}
            name="title"
          />
          {/* <TextField
            margin="dense"
            id="description"
            label="Description"
            variant="outlined"
            fullWidth
            multiline={true}
            rows={10}
            onChange={onChangeData}
            value={state.description}
            name="description"
          /> */}
          <div style={{border:"1px solid #c0c0c0",padding:"8px", borderRadius:"8px"}}>
            <EditorConvertToHTML handleChangeState={handleChangeState} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onsubmitvalue}>Add</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TitleDescriptionCMS;
