
import { Paper } from "@material-ui/core";
import React from "react";
import { TableComp } from "../../../components";
import { useStyles } from "./styles";
import TableHeaderComp from "./TableHeadComp";


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
    { type: "ACTION", name: "" },
];

const TempleBannerCMS = (props) => {
    const { data } = props

    console.log(data?.props?.banners, "data?.props?.banner")
    const classes = useStyles();

    const handleClickOpen = () => {

    }

    const handleEdit = () => {

    }

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
            </Paper>
        </>
    );
};
export default TempleBannerCMS;