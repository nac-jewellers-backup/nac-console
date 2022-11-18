import React, { useContext } from "react";
import { Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Grid } from "@material-ui/core"
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
    "Name",
    "Details",
    "Action"

];
const tableData = [
    { type: "INCREMENT", name: "" },
    { type: "TEXT", name: "title" },
    { type: "WEB_IMAGE", name: "img" },
    { type: "TEXT", name: "sub" },
    { type: "TEXT", name: "sub2" },
    { type: "ACTION", name: "" },


];
const initialEdit = {
    isEdit: false,
    editIndex: null,
};
const initialState = {
    title: "",
    img: null,
    type: "",
    sub: "",
    sub2: "",
}

const AboutCollection = (props) => {
    const { data } = props
    const classes = useStyles();

    const alert = useContext(AlertContext);
    const [open, setOpen] = React.useState(false)
    const [editData, setEditData] = React.useState(initialEdit);
    const [state, setState] = React.useState(initialState)

    const handleChange = (file, name) => {
        UploadImage(file)
            .then((res) => {
                if (res?.data?.web) {
                    setState({
                        ...state,
                        img: res?.data?.web,

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
        handleClickOpen();
        setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
        setState(rowData);
    };


    const handleClickOpen = () => {
        setOpen(true);
        setState(state)
    }


    const handleClose = () => {
        setOpen(false);
    }

    const validate = () => {
        if (
            state.title &&
            state.img &&
            state.type &&
            state.sub &&
            state.sub2
        ) {
            return true;
        } else {
            return false;
        }
    };

    const onsubmitvalue = async () => {
        if (validate()) {
            if (editData.isEdit) {
                const storeData = data?.props?.storeData;
                storeData.splice(editData.editIndex, 1, state);
                let getData = [];
                getData = {
                    component: props?.data?.component,
                    props: {
                        storeData: storeData,
                    },
                };
                setOpen(false);
                props.handleSubmit(getData, "TestimonialTwo", "storeData");
            } else {
                let getData = [];
                getData = {
                    component: props?.data?.component,
                    props: {
                        storeData: [...data?.props?.storeData, state],
                    },
                };
                setOpen(false);
                props.handleSubmit(getData, "TestimonialTwo", "storeData");
            }
        } else {
            alert.setSnack({
                open: true,
                severity: "error",
                msg: "Please fill all the fields in the form ",
            });
        }
    };


    const handleDelete = (e, rowData, rowIndex) => {
        let getData = [];
        const storeData = data?.props?.storeData;
        storeData.splice(rowIndex, 1);
        getData = {
            component: data?.component,
            props: {
                storeData: storeData,
            },
        };

        props.handleSubmit(getData, "Testimonial", "storeData");
    };
    console.log("statetetetetetetetetetetetetetette", state)
    return (
        <>
            <Paper className={classes.root}>
                <TableHeaderComp
                    name={"About Collection Component"}
                    handleAddNew={handleClickOpen}
                />
                <TableComp
                    header={header}
                    tableData={tableData}
                    data={data?.props?.storeData}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                />
                <Dialog
                    classes={{ paper: classes.dialogPaperMid }}
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle id="form-dialog-title">
                        Edit About Collection Component
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
                        < TextField
                            autoFocus
                            margin="dense"
                            id="type"
                            label="Type"
                            variant="outlined"
                            fullWidth
                            onChange={onChangeData}
                            value={state.type}
                            name="type"
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
                            {state.img && <Grid item>
                                <img
                                    alt="nacimages"
                                    src={state.img}
                                    style={{ width: "100px", height: "auto" }}
                                />
                            </Grid>}
                        </Grid>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="sub"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            onChange={onChangeData}
                            value={state.sub}
                            name="sub"
                        />
                        <TextField
                            margin="dense"
                            id="sub2"
                            label="Details"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            onChange={onChangeData}
                            value={state.sub2}
                            name="sub2"
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
export default AboutCollection