import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  DialogActions,
} from "@material-ui/core";
import React, { useContext } from "react";
import { useState } from "react";
import { TableComp } from "../../../components";
import { useStyles } from "./styles";
import CloseIcon from "@material-ui/icons/Close";
import TableHeaderComp from "./TableHeadComp";
import { UploadImage } from "../../../utils/imageUpload";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { AlertContext } from "../../../context";
import { Autocomplete } from "@material-ui/lab";
import EditorConvertToHTML from "./richTextEditor";
import { DatePickerComp } from "../../../components";
import moment from "moment";

const header = [
  "S.No",
  "Image",
  "Header",
  "Header Bottom",
  "Heading Text",
  "Content",
  "Date",
  "Button Text",
  "View More",
  "Action",
];
const tableData = [
  { type: "INCREMENT", name: "S.No" },
  { type: "WEB_IMAGE", name: "image" },
  { type: "TEXT", name: "header" },
  { type: "TEXT", name: "header_Bottom" },
  { type: "TEXT", name: "heading" },
  { type: "TEXT", name: "content" },
  { type: "DATE_PICKER", name: "date" },
  { type: "TEXT", name: "bottomText" },
  { type: "VIEW_STORES", name: "blogs" },
  { type: "ACTION", name: "" },
];

const options = ["Left", "Right"];

const initialBlogDetails = {
  image: "",
  header: "",
  header_Bottom: "",
  heading: "",
  content: "",
  date: new Date(),
  bottomText: "",
  description_1: "",
  description_2: "",
  description_3: "",
  end_Text: "",
  third_Image: {
    align: "",
    image: "",
  },
  second_Image: {
    banners: [],
  },
};

const initialEdit = {
  isEdit: false,
  editIndex: null,
};

function BlogPageCMS(props) {
  const classes = useStyles();
  const alert = useContext(AlertContext);

  const [openBlog, setOpenBlog] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [addBlogsOpens, setAddBlogs] = useState(false);
  const [state, setState] = useState({
    blogs: [],
  });

  const [value, setValue] = React.useState({ ...initialBlogDetails });
  const [blogState, setBlogState] = useState({ ...initialBlogDetails });
  const [editData, setEditData] = useState(initialEdit);

  const handleViewMore = (e, data, index) => {
    setOpenBlog(true);
    setBlogs(data);
  };

  const handleCloseStores = () => {
    setOpenBlog(false);
  };

  const handleAddNew = () => {
    setAddBlogs(true);
  };

  const handleAddNewStoresClose = () => {
    setAddBlogs(false);
    setEditData(initialEdit);
    setBlogState(initialBlogDetails);
  };

  const onChangeStoreData = (event) => {
    setBlogState({
      ...blogState,
      [event.target.name]: event.target.value,
    });
  };

  const handleChange = (file, name) => {
    UploadImage(file)
      .then((res) => {
        console.log(res?.data, "ll");
        if (res?.data?.web) {
          if (name === "banners") {
            setBlogState({
              ...blogState,
              second_Image: {
                banners: [
                  ...blogState?.second_Image?.banners,
                  {
                    position: blogState?.second_Image?.banners.length,
                    url: "",
                    urlParam: "",
                    web: res?.data?.web,
                    mobile: res?.data?.web,
                  },
                ],
              },
            });
          } else if (name === "third_Image") {
            setBlogState({
              ...blogState,
              third_Image: {
                ...blogState?.third_Image,
                image: res?.data?.web,
              },
            });
          } else {
            setBlogState({
              ...blogState,
              [name]: res?.data?.web,
            });
          }
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

  console.log(blogState, "blogState");

  const onsubmitvalue = () => {
    if (
      blogState.image &&
      blogState.header &&
      blogState.header_Bottom &&
      blogState.heading &&
      blogState.content &&
      blogState.date &&
      blogState.bottomText &&
      blogState.description_1 &&
      blogState.description_2 &&
      blogState.description_3 &&
      blogState.end_Text &&
      blogState.third_Image.align &&
      blogState.third_Image.image.length > 0 &&
      blogState.second_Image.banners.length > 0
    ) {
      if (editData.isEdit) {
        const storeDataEdit = props?.data?.props?.cardContent;
        storeDataEdit.splice(editData.editIndex, 1, {
          bottomText: blogState?.bottomText,
          content: blogState?.content,
          date: moment(blogState?.date).format("MM/DD/YYYY"),
          description_1: blogState?.description_1,
          description_2: blogState?.description_2,
          description_3: blogState?.description_3,
          end_Text: blogState?.end_Text,
          header: blogState?.header,
          header_Bottom: blogState?.header_Bottom,
          heading: blogState?.heading,
          image: blogState?.image,
          second_Image: {
            banners: blogState?.second_Image?.banners?.map((val, index) => {
              return {
                position: index,
                url: "",
                urlParam: "",
                web: val.web,
              };
            }),
          },
          third_Image: {
            align: blogState?.third_Image?.align,
            image: blogState?.third_Image?.image,
          },
        });
        const getData = {
          component: props?.data?.component,
          props: {
            cardContent: storeDataEdit,
          },
        };
        handleAddNewStoresClose();
        props.handleSubmit(getData, "blogPageCard", "cardContent");
      } else {
        let getData = [];
        getData = {
          component: props?.data?.component,
          props: {
            cardContent: [
              ...props?.data?.props?.cardContent,
              {
                bottomText: blogState?.bottomText,
                content: blogState?.content,
                date: new Date(blogState?.date),
                description_1: blogState?.description_1,
                description_2: blogState?.description_2,
                description_3: blogState?.description_3,
                end_Text: blogState?.end_Text,
                header: blogState?.header,
                header_Bottom: blogState?.header_Bottom,
                heading: blogState?.heading,
                image: blogState?.image,
                second_Image: blogState.second_Image,
                third_Image: {
                  align: blogState?.third_Image?.align,
                  image: blogState?.third_Image?.image,
                },
              },
            ],
          },
        };
        setAddBlogs(false);
        props.handleSubmit(getData, "blogPageCard", "cardContent");
      }
      setEditData(initialEdit);
      setBlogState(initialBlogDetails);
    } else {
      alert.setSnack({
        open: true,
        severity: "error",
        msg: "Please fill all the fields",
      });
    }
  };

  const handleEdit = (e, rowData, rowIndex) => {
    handleAddNew();
    setEditData({ ...editData, isEdit: true, editIndex: rowIndex });
    setBlogState(rowData);
  };

  const handleDelete = (e, rowData, rowIndex) => {
    let getData = [];
    const content = props?.data?.props?.cardContent;
    content.splice(rowIndex, 1);
    getData = {
      component: props?.data?.component,
      props: {
        cardContent: content,
      },
    };
    props.handleSubmit(getData, "blogPageCard", "cardContent");
  };

  const handleChangeheaderBottom = (data) => {
    setBlogState({
      ...blogState,
      header_Bottom: data,
    });
  };

  const handleChangeDescription_1 = (data) => {
    setBlogState({
      ...blogState,
      description_1: data,
    });
  };

  const handleChangeDescription_2 = (data) => {
    setBlogState({
      ...blogState,
      description_2: data,
    });
  };

  const handleChangeDescription_3 = (data) => {
    setBlogState({
      ...blogState,
      description_3: data,
    });
  };
  const handleDate = (value) => {
    setBlogState({ ...blogState, date: value });
  };
  return (
    <Paper className={classes.root}>
      <TableHeaderComp
        name={"Blog Page Component"}
        handleAddNew={handleAddNew}
      />

      <TableComp
        header={header}
        tableData={tableData}
        data={props?.data?.props?.cardContent}
        handleViewStores={handleViewMore}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      {/* View the Stores */}
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullWidth
        open={openBlog}
        onClose={handleCloseStores}
      >
        <DialogTitle id="form-dialog-title">
          <div className={classes.dialogHeader}>
            <div>Blogs Inner Page</div>
            <div style={{ cursor: "pointer" }} onClick={handleCloseStores}>
              <CloseIcon />
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className={classes.innerDialog}>
            <Grid container>
              {blogs?.second_Image?.banners?.map((val) => {
                return (
                  <div className={classes.border}>
                    <Grid>
                      <div className={classes.imageText}>
                        <Typography>Second Image</Typography>
                      </div>
                    </Grid>
                    <Grid>
                      <div className={classes.blogInnerImage}>
                        <img src={val?.web} alt="Second Image" />
                      </div>
                    </Grid>
                  </div>
                );
              })}
              <div className={classes.border}>
                <Grid>
                  <div className={classes.imageText}>
                    <Typography>Third Image</Typography>
                  </div>
                </Grid>
                <Grid>
                  <div className={classes.blogInnerImage}>
                    <img src={blogs?.third_Image?.image} alt="Third Image" />
                  </div>
                </Grid>
              </div>
              <div className={classes.border}>
                <Grid>
                  <div className={classes.imageText}>
                    <Typography>Description_1</Typography>
                  </div>
                </Grid>
                <Grid>
                  <div className={classes.contentText}>
                    <Typography>{blogs?.description_1}</Typography>
                  </div>
                </Grid>
              </div>
              <div className={classes.border}>
                <Grid>
                  <div className={classes.imageText}>
                    <Typography>Description_2</Typography>
                  </div>
                </Grid>
                <Grid>
                  <div className={classes.contentText}>
                    <Typography>{blogs?.description_2}</Typography>
                  </div>
                </Grid>
              </div>
              <div className={classes.border}>
                <Grid>
                  <div className={classes.imageText}>
                    <Typography>Description_3</Typography>
                  </div>
                </Grid>
                <Grid>
                  <div className={classes.contentText}>
                    <Typography>{blogs?.description_3}</Typography>
                  </div>
                </Grid>
              </div>
              <div className={classes.border}>
                <Grid>
                  <div className={classes.imageText}>
                    <Typography>End Text</Typography>
                  </div>
                </Grid>
                <Grid>
                  <div className={classes.contentText}>
                    <Typography>{blogs?.end_Text}</Typography>
                  </div>
                </Grid>
              </div>
              <div className={classes.border}>
                <Grid>
                  <div className={classes.alignText}>
                    <Typography>Align</Typography>
                  </div>
                </Grid>
                <Grid>
                  <div className={classes.contentText}>
                    <Typography>{blogs?.third_Image?.align}</Typography>
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add the Data */}
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullWidth
        open={addBlogsOpens}
        onClose={handleAddNewStoresClose}
      >
        <DialogTitle id="form-dialog-title" style={{ paddingBottom: "0px" }}>
          <div className={classes.dialogHeader}>
            <div>Add Blog Page Details</div>
            <div
              style={{ cursor: "pointer" }}
              onClick={handleAddNewStoresClose}
            >
              <CloseIcon />
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div
            className={classes.dialogHeader}
            style={{
              borderBottom: "1px solid #e0e0e0",
              marginBottom: "6px",
              paddingBottom: "6px",
            }}
          ></div>
          <div className={classes.textFields}>
            <TextField
              margin="dense"
              id="header"
              label="Header"
              variant="outlined"
              fullWidth
              onChange={onChangeStoreData}
              value={blogState?.header}
              name="header"
              required
            />
            <div>
              <div className={classes.headerBottom}>
                <Typography>Header Bottom Text :</Typography>
              </div>
              <EditorConvertToHTML
                handleChangeState={handleChangeheaderBottom}
                parentState={blogState.header_Bottom}
              />
            </div>
            <TextField
              margin="normal"
              id="outlined-multiline-flexible"
              label="Heading Text"
              variant="outlined"
              fullWidth
              onChange={onChangeStoreData}
              value={blogState.heading}
              name="heading"
              required
            />
            <TextField
              margin="normal"
              id="content"
              label="Content"
              variant="outlined"
              fullWidth
              onChange={onChangeStoreData}
              value={blogState?.content}
              name="content"
              multiline
              rows={4}
              required
            />
            <div>
              <div className={classes.headerBottom}>
                <Typography>Date Picker :</Typography>
              </div>
              <div className={classes.datePicker}>
                <DatePickerComp onChange={handleDate} value={blogState?.date} />
                {console.log(blogState?.date, "ll")}
              </div>
            </div>
            <TextField
              margin="normal"
              id="bottomText"
              label="Button Text"
              variant="outlined"
              fullWidth
              onChange={onChangeStoreData}
              value={blogState?.bottomText}
              name="bottomText"
              required
            />
            <div>
              <div className={classes.headerBottom}>
                <Typography>Description_1 Text :</Typography>
              </div>
              <EditorConvertToHTML
                handleChangeState={handleChangeDescription_1}
                parentState={blogState.description_1}
              />
            </div>
            <div>
              <div className={classes.headerBottom}>
                <Typography>Description_2 Text :</Typography>
              </div>
              <EditorConvertToHTML
                handleChangeState={handleChangeDescription_2}
                parentState={blogState.description_2}
              />
            </div>
            <div>
              <div className={classes.headerBottom}>
                <Typography>Description_3 Text :</Typography>
              </div>
              <EditorConvertToHTML
                handleChangeState={handleChangeDescription_3}
                parentState={blogState.description_3}
              />
            </div>
            <TextField
              margin="normal"
              id="end_Text"
              label="End Text"
              variant="outlined"
              fullWidth
              onChange={onChangeStoreData}
              value={blogState?.end_Text}
              name="end_Text"
              multiline
              rows={4}
              required
            />
            <Autocomplete
              value={blogState?.third_Image?.align}
              onChange={(event, newValue) => {
                setBlogState({
                  ...blogState,
                  third_Image: { ...blogState.third_Image, align: newValue },
                });
              }}
              id="controllable-states-demo"
              options={options}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Third Image Align Position"
                  required
                  margin="dense"
                />
              )}
            />
            <Grid container spacing={8} style={{ paddingTop: "8px" }}>
              <Grid item>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="button-file"
                  multiple
                  type="file"
                  onChange={(e) => handleChange(e.target.files[0], "image")}
                />
                <label htmlFor="button-file">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    First Image
                  </Button>
                </label>
              </Grid>
              {blogState.image.length > 0 && (
                <Grid item>
                  <img
                    alt="nacimages"
                    src={blogState.image}
                    style={{ width: "100px", height: "auto" }}
                  />
                </Grid>
              )}
            </Grid>
            <Grid container spacing={5} style={{ paddingTop: "8px" }}>
              <Grid item>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="button-file2"
                  multiple
                  type="file"
                  onChange={(e) => handleChange(e.target.files[0], "banners")}
                />
                <label htmlFor="button-file2">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Second Banner Image
                  </Button>
                </label>
              </Grid>
              {blogState?.second_Image?.banners.length > 0 && (
                <Grid item>
                  {blogState?.second_Image?.banners?.map((img) => {
                    return (
                      <img
                        alt="nacimages"
                        src={img?.web}
                        style={{ width: "100px", height: "auto" }}
                      />
                    );
                  })}
                </Grid>
              )}
            </Grid>
            <Grid container spacing={8} style={{ paddingTop: "8px" }}>
              <Grid item>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="button-file3"
                  multiple
                  type="file"
                  onChange={(e) =>
                    handleChange(e.target.files[0], "third_Image")
                  }
                />
                <label htmlFor="button-file3">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Third Image
                  </Button>
                </label>
              </Grid>
              {blogState?.third_Image?.image.length > 0 && (
                <Grid item>
                  <img
                    alt="nacimages"
                    src={blogState?.third_Image?.image}
                    style={{ width: "100px", height: "auto" }}
                  />
                </Grid>
              )}
            </Grid>
            <div
              className={classes.dialogHeader}
              style={{ justifyContent: "center" }}
              // onClick={addStoreDetails}
            >
              {/* <Button variant="contained" color="primary">
                  Add Blog Details
                </Button> */}
            </div>
          </div>
          {/* )} */}
          {/* <Typography variant="h6" style={{ margin: "10px 0px" }}>
            Blogs Page Added
          </Typography>
          <TableComp
            header={blogHeader}
            // tableData={tableStoreData}
            // data={state?.blogs}
            // handleEdit={handleStoresEdit}
            // handleDelete={handleDeleteStore}
          /> */}

          <DialogActions style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={onsubmitvalue}>
              Submit
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddNewStoresClose}
            >
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

export default BlogPageCMS;
