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
    "Name",
    "Image",
    "Address",
    "Feed",
    "Action"

];
const tableData = [
    { type: "INCREMENT", name: "" },
    { type: "TEXT", name: "name" },
    { type: "WEB_IMAGE", name: "img" },
    { type: "TEXT", name: "address" },
    { type: "TEXT", name: "feed" },
    { type: "ACTION", name: "" },


];
const initialEdit = {
    isEdit: false,
    editIndex: null,
};
const initialState = {
    name: "",
    img: null,
    address: "",
    feed: "",
}
const TestimonialCMS = (props) => {
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
        setState(initialState)
        setOpen(true);

    }


    const handleClose = () => {
        setOpen(false);
        setState(initialState);
        setEditData(initialEdit);
    }


    const validate = () => {
        if (
            state.name &&
            state.img &&
            state.address &&
            state.feed
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
                props.handleSubmit(getData, "Testimonial", "storeData");
            } else {
                let getData = [];
                getData = {
                    component: props?.data?.component,
                    props: {
                        storeData: [...props?.data?.props?.storeData, state],
                    },
                };
                setOpen(false);
                props.handleSubmit(getData, "Testimonial", "storeData");
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

    return (
        <>
            <Paper className={classes.root}>
                <TableHeaderComp
                    name={"Testimonial Component"}
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
                        Testimonial Component
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            onChange={onChangeData}
                            value={state.name}
                            name="name"
                        />
                        <Grid
                            container
                            justifyContent="flex-start"
                            style={{ padding: "16px 0px" }}
                            spacing={3}
                        >
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
                                        >
                                            Image Upload
                                        </Button>
                                    </label>
                                </Grid>
                                {state?.img && <Grid item>
                                    <img
                                        alt="nacimages"
                                        src={state?.img}
                                        style={{ width: "100px", height: "auto" }}
                                    />
                                </Grid>}
                            </Grid>
                        </Grid>
                        <TextField
                            margin="dense"
                            id="feed"
                            label="Feed"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            onChange={onChangeData}
                            value={state.feed}
                            name="feed"
                        />
                        <TextField
                            margin="dense"
                            id="description"
                            label="Address"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            onChange={onChangeData}
                            value={state.address}
                            name="address"
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
export default TestimonialCMS