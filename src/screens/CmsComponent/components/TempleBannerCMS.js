import React from "react";
import { TableComp } from "../../../components";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    TextField,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { AlertContext } from "../../../context";
import { useContext } from "react";
import { UploadImage } from "../../../utils/imageUpload";



const header = [
    "S.No",
    "Banner Image",
    "Content",
    "Title",
    "Action",
];
const tableData = [
    { type: "INCREMENT", name: "" },
    { type: "WEB_IMAGE", name: "img" },
    { type: "TEXT", name: "content" },
    { type: "TEXT", name: "title" },
    { type: "EDIT", name: "" },
];

const TempleBannerCMS = (props) => {
    const { data } = props

    console.log(data?.props?.banners, "data?.props?.banner")
    const classes = useStyles();
    const initialState = {
        img: "",
        title: "",
        content: "",
    };
    const initialEdit = {
        isEdit: false,
        editIndex: null,
    };
    const alert = useContext(AlertContext);
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState(initialState);
    const [editData, setEditData] = React.useState(initialEdit);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setState(initialState);
        setEditData(initialEdit);
    };

    const onChangeData = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

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


    const handleEdit = (e, rowData, rowIndex) => {
        setOpen(true);
        setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
        setState(rowData);
    };

    const validate = () => {
        if (
            state.img &&
            state.title &&
            state.content
        ) {
            return true;
        } else {
            return false;
        }
    };

    const onsubmitvalue = async () => {
        if (validate) {
            if (editData.isEdit) {
                debugger
                const values = data?.props?.banners;
                values.splice(editData.editIndex, 1, state);
                let getData = [];
                 getData = {
                    component: props?.data?.component,
                    props: {
                        banners: values
                    }
                };
                setOpen(false);
                setState(initialState);
                setEditData(initialEdit);
                props.handleSubmit(getData, "TempleWorkBannerComponent", "banners");
            } else {
                let getData = [];
                getData = {
                    component: props?.data?.component,
                    props: {
                        banners: [...data?.props.banners, state],
                    }
                };
                setOpen(false);
                setState(initialState);
                props.handleSubmit(getData, "TempleWorkBannerComponent", "banners");
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
                    name={"Temple Work Banner Component"}
                    handleAddNew={handleClickOpen}
                    noAddNew
                />
                <TableComp
                    header={header}
                    tableData={tableData}
                    data={data?.props?.banners}
                    handleEdit={handleEdit}
                />
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle id="form-dialog-title">Add New Banner Item</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="title"
                            variant="outlined"
                            fullWidth
                            onChange={onChangeData}
                            value={state.title}
                            name="title"
                            required
                        />
                        <TextField
                            margin="dense"
                            id="content"
                            label="content"
                            variant="outlined"
                            fullWidth
                            onChange={onChangeData}
                            value={state.content}
                            name="content"
                            required
                        />
                        <Grid
                            container
                            justifyContent="space-around"
                            style={{ padding: "16px 0px" }}
                        >
                            <Grid item>
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    style={{ display: "none" }}
                                    id="button-files"
                                    multiple
                                    type="file"
                                    onChange={(e) => handleChange(e.target.files[0], "web")}
                                />
                                <label htmlFor="button-files">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<CloudUploadIcon />}
                                    >Image
                                    </Button>
                                </label>
                            </Grid>
                        </Grid>
                        {state.img.length > 0 && (
                            <Grid style={{ textAlign: "center" }} xs={6} md={6} item>
                                <img
                                    alt="nacimages"
                                    src={state.img}
                                    style={{ width: "100px", height: "auto" }}
                                />
                            </Grid>
                        )}


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onsubmitvalue}>Add</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </>
    );
};
export default TempleBannerCMS;