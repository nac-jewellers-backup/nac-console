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
import EditorConvertToHTML from "./richTextEditor";
import { AlertContext } from "../../../context";
import { useContext } from "react";
import { UploadImage } from "../../../utils/imageUpload";

const header = ["S.No", "Images", "Description", "View", "Action"];
const tableData = [
  { type: "INCREMENT", name: "" },
  { type: "ARR_IMAGE", name: "images" },
  { type: "DETAILED_ARR", name: "content" },
  { type: "VIEW_STORES", name: "" },
  { type: "EDIT", name: "" },
];

const initialState = {
  images: [],
  content: [
    {
      title: "",
      subtitle: "",
      weigh: "",
      ContentOne: "",
      about: "",
      contentTwo: "",
    },
  ],
};

const initialEdit = {
  isEdit: false,
  editIndex: null,
  isView: false,
};

const TempleCardDetailComp = (props) => {
  const { data } = props;

  const classes = useStyles();
  const alert = useContext(AlertContext);
  const [open, setOpen] = React.useState(false);
  const [editData, setEditData] = React.useState(initialEdit);
  const [viewData, setviewData] = React.useState([]);
  const [constructedData, setConstructedData] = React.useState(initialState);

  // React.useEffect(() => {
  //   let setData = { ...constructedData };
  //   setData.content = data?.props?.detailData?.content;
  //   setData.images = data?.props?.detailData?.images;

  //   setConstructedData(setData);

  //   setviewData([setData]);
  // }, [data.props]);

  const handleChangeTitle = (data) => {
    onChangeData("title", data, "content");
  };
  const handleChangeAbout = (data) => {
    onChangeData("about", data, "content");
  };

  const onChangeData = (key, val, parentKey) => {
    let tempState = constructedData;
    tempState[parentKey][0][key] = val;
    console.log(tempState);
    setConstructedData({ ...tempState });
  };

  const handleChange = (file, name) => {
    UploadImage(file)
      .then((res) => {
        if (res?.data?.web) {
          setConstructedData({
            ...constructedData,
            images: [...constructedData?.images, res?.data?.web],
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(initialEdit);
    setConstructedData(initialState);
  };

  const handleEdit = (e, rowData, rowIndex) => {
    setOpen(true);
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setConstructedData(rowData);
  };
  const handleViewStores = (e, data, rowIndex) => {
    setOpen(true);
    setEditData({ ...editData, isEdit: false, isView: true });
    setviewData(data);
  };

  const validate = () => {
    if (constructedData.content && constructedData.images) {
      return true;
    } else {
      return false;
    }
  };

  const onsubmitvalue = async () => {
    if (validate) {
      // let getData = [];

      let getData = {
        component: props?.data?.component,
        props: {
          detailData: constructedData,
        },
      };
      setOpen(false);
      setEditData(initialEdit);
      setConstructedData(initialState);
      props.handleSubmit(getData, "TempleCardDetailsComponent", "detailData");
    } else {
      alert.setSnack({
        open: true,
        severity: "error",
        msg: "Please fill all the fields in the form ",
      });
    }
  };

  // const handleDeleteItem = (val, i, data1) => {
  //     const delRow = [...constructedData?.images]
  //     delRow.splice(i, 1);
  //     setConstructedData({ ...constructedData, images: delRow })

  // }
  console.log(Array.isArray(viewData), "viewData");

  return (
    <>
      <Paper className={classes.root}>
        <TableHeaderComp
          name={"Card Details Component"}
          handleAddNew={handleClickOpen}
          noAddNew
        />
        <TableComp
          header={header}
          tableData={tableData}
          data={[data?.props?.detailData]}
          handleEdit={handleEdit}
          handleViewStores={handleViewStores}
        />
        <>
          {editData?.isView && (
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle id="form-dialog-title"> Card Details</DialogTitle>
              <DialogContent>
                <>
                  {[viewData]?.map((val) => {
                    return (
                      <>
                        {val?.images?.map((e) => {
                          return (
                            <Grid
                              style={{ textAlign: "center" }}
                              xs={6}
                              md={6}
                              item
                            >
                              <img
                                alt="nacimages"
                                src={e}
                                style={{ width: "100px", height: "auto" }}
                              />
                            </Grid>
                          );
                        })}
                        {val?.content?.map((e) => {
                          return (
                            <>
                              <Typography>{e?.title}</Typography>
                              <Typography>{e?.subtitle}</Typography>
                              <Typography>{e?.weigh}</Typography>
                              <Typography>{e?.ContentOne}</Typography>
                              <Typography>{e?.about}</Typography>
                              <Typography>{e?.contentTwo}</Typography>
                            </>
                          );
                        })}
                      </>
                    );
                  })}
                </>
              </DialogContent>
            </Dialog>
          )}
          {editData?.isEdit && (
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle id="form-dialog-title">
                Add New Card Item
              </DialogTitle>
              <DialogContent>
                {constructedData.content.map((e) => {
                  return (
                    <>
                      <EditorConvertToHTML
                        handleChangeState={handleChangeTitle}
                        parentState={e.title}
                      />
                      <TextField
                        margin="dense"
                        id="weigh"
                        label="Weight"
                        variant="outlined"
                        fullWidth
                        onChange={(val) =>
                          onChangeData("weigh", val.target.value, "content")
                        }
                        value={e.weigh}
                        name="weigh"
                        required
                      />
                      <TextField
                        margin="dense"
                        id="subtitle"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        onChange={(val) =>
                          onChangeData("subtitle", val.target.value, "content")
                        }
                        value={e.subtitle}
                        name="subtitle"
                        required
                      />
                      <TextField
                        margin="dense"
                        id="ContentOne"
                        label="Content One"
                        variant="outlined"
                        fullWidth
                        onChange={(val) =>
                          onChangeData(
                            "ContentOne",
                            val.target.value,
                            "content"
                          )
                        }
                        value={e.ContentOne}
                        name="ContentOne"
                        required
                      />
                      <EditorConvertToHTML
                        handleChangeState={handleChangeAbout}
                        parentState={e.about}
                      />
                      <TextField
                        margin="dense"
                        id="contentTwo"
                        label="Content Two"
                        variant="outlined"
                        fullWidth
                        onChange={(val) =>
                          onChangeData(
                            "contentTwo",
                            val.target.value,
                            "content"
                          )
                        }
                        value={e.contentTwo}
                        name="contentTwo"
                        required
                      />
                    </>
                  );
                })}
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
                      >
                        Image
                      </Button>
                    </label>
                  </Grid>
                </Grid>
                {constructedData.images.length > 0 &&
                  constructedData.images.map((e, i) => {
                    return (
                      <>
                        <Grid
                          style={{ textAlign: "center" }}
                          xs={6}
                          md={6}
                          item
                        >
                          <img
                            alt="nacimages"
                            src={e}
                            style={{ width: "100px", height: "auto" }}
                          />
                        </Grid>
                        {/* <Grid Item xs={1}
                                                style={{ display: "flex", justifyContent: "center" }}>
                                                <DeleteIcon onClick={(val) => handleDeleteItem(val, i, state)}
                                                    style={{ color: "red", cursor: "pointer" }} />
                                            </Grid> */}
                      </>
                    );
                  })}
              </DialogContent>
              <DialogActions>
                <Button onClick={onsubmitvalue}>Add</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
          )}
        </>
      </Paper>
    </>
  );
};
export default TempleCardDetailComp;
