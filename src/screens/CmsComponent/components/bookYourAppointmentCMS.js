import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, TextField } from "@material-ui/core"
import { TableComp } from "../../../components"
import TableHeaderComp from "./TableHeadComp"
import { useStyles } from "./styles";
import { UploadImage } from "../../../utils/imageUpload";
import { AlertContext } from "../../../context";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";



const header = [
    "S.No",
    "Title",
    "Image",
    "Content",
    "Action"

];
const tableData = [
    { type: "INCREMENT", name: "" },
    { type: "TEXT", name: "title" },
    { type: "WEB_IMAGE", name: "image" },
    { type: "TEXT", name: "content" },
    { type: "EDIT", name: "" },


];
const initialEdit = {
    isEdit: false,
    editIndex: null,
};
const initialState = {
    title: "",
    image: null,
    content: "",
}

const BookYourAppointmentCMS = (props) => {
    const { data } = props
    const classes = useStyles();

    const alert = React.useContext(AlertContext);
    const [open, setOpen] = React.useState(false);
    const [editData, setEditData] = React.useState(initialEdit);
    const [state, setState] = React.useState(initialState)


    const handleChange = (file, name) => {
        UploadImage(file)
            .then((res) => {
                if (res?.data?.web) {
                    setState({
                        ...state,
                        image: res?.data?.web
                    });
                    alert.setSnack({
                        open: true,
                        severity: "success",
                        msg: "Image Uploaded Successfully",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const onChangeData = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });

    };


    const handleEdit = (e, rowData, rowIndex) => {
        setOpen(true);
        setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
        setState(rowData);
    }


    const handleClose = () => {
        setOpen(false);
    }

    const validate = () => {
        if (
            state.title &&
            state.image &&
            state.content
        ) {
            return true;
        } else {
            return false;
        }
    };
    const onsubmitvalue = async () => {
        if (validate()) {
            if (editData.isEdit) {
                const values = data?.props;
                values.splice(editData.editIndex, 1, state);
                let getData = [];
                getData = {
                    component: props?.data?.component,
                    props: values,
                };
                setOpen(false);
                props.handleSubmit(getData, "AboutBookAppointment", "props");
            } else {
                let getData = [];
                getData = {
                    component: props?.data?.component,
                    props:
                        [...data?.props, state],

                };
                setOpen(false);
                props.handleSubmit(getData, "AboutBookAppointment", "props");
            }
        } else {
            alert.setSnack({
                open: true,
                severity: "error",
                msg: "Please fill all the fields in the form ",
            });
        }
    };
    return (
        <>
            <Paper className={classes.root}>
                <TableHeaderComp
                    name={"Book Your Appointment Component"}
                    noAddNew
                />
                <TableComp
                    header={header}
                    tableData={tableData}
                    data={data?.props}
                    handleEdit={handleEdit}
                />
                <Dialog
                    classes={{ paper: classes.dialogPaperMid }}
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle id="form-dialog-title">
                        Edit Book Your Appointment Component
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
                        <Grid
                            container
                            justifyContent="flex-start"
                            style={{ padding: "16px 0px" }}
                            spacing={3}
                        >
                            <Grid item>
                                <input
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    id="button-file"
                                    multiple
                                    type="file"
                                    onChange={(e) => handleChange(e.target.files[0], "mobile")}
                                />
                                <label htmlFor="button-file">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<CloudUploadIcon />}
                                    // disabled={disableButton.mobile}
                                    >
                                        Image Upload
                                    </Button>
                                </label>
                            </Grid>
                            {state.image && <Grid item>
                                <img
                                    alt="nacimages"
                                    src={state.image}
                                    style={{ width: "100px", height: "auto" }}
                                />
                            </Grid>}
                        </Grid>
                        <TextField
                            margin="dense"
                            id="content"
                            label="Details"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            onChange={onChangeData}
                            value={state.content}
                            name="content"
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
export default BookYourAppointmentCMS