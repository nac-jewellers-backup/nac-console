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
    Typography,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { AlertContext } from "../../../context";
import { useContext } from "react";
import { UploadImage } from "../../../utils/imageUpload";


const header = [
    "S.No",
    "Products",
    "Action"
];
const tableData = [
    { type: "INCREMENT", name: "" },
    { type: "ARRAY_IMAGES", name: "img" },
    { type: "EDIT", name: "" },
];

const TempleProducts = (props) => {
    const { data } = props

    const classes = useStyles();
    const alert = useContext(AlertContext);
    const [open, setOpen] = React.useState(false);
    return (
        <Paper className={classes.root}>

            <TableHeaderComp
                name={"Temple Products Component"}
                // handleAddNew={handleClickOpen}
                noAddNew
            />

            <TableComp
                header={header}
                tableData={tableData}
                data={data?.props?.listingItems}
            // handleEdit={handleEdit}
            />
        </Paper>
    )
}
export default TempleProducts;