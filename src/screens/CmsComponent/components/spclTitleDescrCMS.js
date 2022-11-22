import React from "react";
import { DialogContent, DialogTitle, Paper, TextField, Button, Dialog, DialogActions } from "@material-ui/core"
import { TableComp } from "../../../components"
import TableHeaderComp from "./TableHeadComp"
import { useStyles } from "./styles";


const header = [
    "S.No",
    "Title",
    "Description",
    "Action"
];
const tableData = [
    { type: "INCREMENT", name: "" },
    { type: "TEXT", name: "Title" },
    { type: "TEXT", name: "Description" },
    { type: "EDIT", name: "" },

];
const initialState = {
    Title: "",
    Description: ""
}
const SpclTitleDescr = (props) => {
    const { data } = props
    console.log(data?.props, "propssssss")
    const classes = useStyles();

    const [open, setOpen] = React.useState(false)
    const [spclTitleDescr, setSpclTitleDescr] = React.useState([])
    const [state, setState] = React.useState(initialState)


    React.useEffect(() => {
        setSpclTitleDescr([data?.props?.storeData]);
        setState(data?.props?.storeData);
    }, []);


    const onChangeData = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });

    };

    const handleEdit = (e, rowData, rowIndex) => {
        setState(state)
        handleClickOpen();

    };


    const handleClickOpen = () => {
        setOpen(true);

    }


    const handleClose = () => {
        setOpen(false);
    }

    const validation = () => {
        if (state.Description.length < 1 || state.Title.length < 1) {
            return false;
        } else {
            return true;
        }
    };
    const onsubmitvalue = async () => {
        if (validation()) {
            let getData = [];
            const storeData = data?.props?.storeData;
            getData = {

                component: data?.component,
                props: {
                    storeData: state,
                },
            };
            setSpclTitleDescr([getData.props?.storeData]);

            setOpen(false);
            props.handleSubmit(getData, "SpclTitleDescr", "");
        } else {
            alert.setSnack({
                open: true,
                severity: "error",
                msg: "Please fill all the fields in the form ",
            });
        }
    };


    console.log("spclTitleDescr", spclTitleDescr);
    return (
        <>
            <Paper className={classes.root}>
                <TableHeaderComp
                    name={"Special Title and Description Component"}
                    noAddNew
                />
                <TableComp
                    header={header}
                    tableData={tableData}
                    data={spclTitleDescr}
                    handleEdit={handleEdit}
                />
                <Dialog
                    classes={{ paper: classes.dialogPaperMid }}
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle id="form-dialog-title">
                        Edit Special Title and Description Component
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="Title"
                            label="Title"
                            variant="outlined"
                            fullWidth
                            onChange={onChangeData}
                            value={state?.Title}
                            name="Title"
                        />
                        <TextField
                            margin="dense"
                            id="Description"
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            onChange={onChangeData}
                            value={state?.Description}
                            name="Description"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onsubmitvalue}>Add</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </>
    )
}
export default SpclTitleDescr