
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
    "Image",
    "Title",
    "Details",
    "Action",
];
const tableData = [
    { type: "INCREMENT", name: "" },
    { type: "WEB_IMAGE", name: "img" },
    { type: "TEXT", name: "title" },
    { type: "TEXT", name: "content" },
    { type: "ACTION", name: "" },
];

const TempleCardComponent = (props) => {
    const { data } = props

    console.log(data?.props?.detailData, "data?.props?.CardData")
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
                const values = data?.props?.CardData;
                values.splice(editData.editIndex, 1, state);
                let getData = [];
                getData = {
                    component: props?.data?.component,
                    props: {
                        CardData: values
                    }
                };
                setState(initialState);
                setEditData(initialEdit);
                props.handleSubmit(getData, "TempleCardComponent", "CardData");
                setOpen(false);
            } else {
                let getData = [];
                getData = {
                    component: props?.data?.component,
                    props: {
                        CardData: [...data?.props.CardData, state],
                    }
                };
                setOpen(false);
                setState(initialState);
                props.handleSubmit(getData, "TempleCardComponent", "CardData");
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
        debugger
        let getData = [];
        const content = data?.props?.CardData;
        content.splice(rowIndex, 1);
        getData = {
            component: props?.data?.component,
            props: {
                CardData: content,
            },
        };
        props.handleSubmit(getData, "TempleCardComponent", "CardData");
    };


    return (
        <>
            <Paper className={classes.root}>
                <TableHeaderComp
                    name={"Temple Card Component"}
                    handleAddNew={handleClickOpen}
                />
                <TableComp
                    header={header}
                    tableData={tableData}
                    data={data?.props?.CardData}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle id="form-dialog-title">Add New Card Item</DialogTitle>
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
export default TempleCardComponent;