import {
  getAPIHandler,
  postAPIHandler,
  putAPIHandler,
} from "src/ApiConfig/service";
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import * as yep from "yup";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import GoBack from "src/component/GoBack";
const useStyles = makeStyles((theme) => ({
  main: {
    "& h3": {
      marginBottom: "30px",
    },
    "& .dropDownBoxProfile": {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      overflow: "hidden",
      position: "relative",

      "& img": {
        height: "150px",
        width: "100%",
        maxWidth: "150px",
        height: "150px",
        backgroundSize: "cover !important",
        backgroundRepeat: "no-repeat !important",
        objectFit: "cover !important",
        borderRadius: "50%",
      },

      "& .editIcon": {
        height: "35px",
        width: "35px",
        borderRadius: "50%",
        color: "#000",
        position: "absolute",
        left: "478px",
        bottom: "10px",
        color: "#fff",
        background: "rgba(0, 0, 0, 0.4)",
        [theme.breakpoints.down("sm")]: {
          left: "382px",
        },
      },
    },
  },
}));

function AddGame() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const [categoryDataList, setCategoryDataList] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const formInitialSchema = {
    gameTitle: categoryData?.gameTitle ? categoryData?.gameTitle : "",
    profilePic: categoryData?.gamePic ? categoryData?.gamePic : "",
    profilePicUpload: "",
    gameDetails: categoryData?.gameDetails ? categoryData?.gameDetails : "",
    selectCategory: categoryData?.category ? categoryData?.category : "",
  };

  const formValidationSchema = yep.object().shape({
    gameTitle: yep
      .string()
      .max(56, "Should not exceeds 56 characters.")
      .required("Game title is required."),
    gameDetails: yep
      .string()
      .max(600, "Should not exceeds 600 characters.")
      .required("Game detail is required."),
    selectCategory: yep.string().required("Category is required."),
    selectCategory: yep.string().required("Category is required."),
    profilePic: yep.string().required("Game image is required"),
  });

  const addCategoryApi = async (values) => {
    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("gameTitle", values.gameTitle);
      formData.append("gamePic", values.profilePic);
      formData.append("gameDetails", values.gameDetails);
      formData.append("category", values.selectCategory);
      const response = await postAPIHandler({
        endPoint: "addGame",
        dataToSend: formData,
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/game-management");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };

  const editCategoryApi = async (values) => {
    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("gameTitle", values.gameTitle);
      formData.append("gamePic", values.profilePic);
      formData.append("gameDetails", values.gameDetails);
      formData.append("category", values.selectCategory);
      formData.append("_id", location?.state?.gameId);

      const response = await putAPIHandler({
        endPoint: "editgame",
        dataToSend: formData,
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/game-management");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };
  const getCategoryApi = async (source) => {
    try {
      setCategoryData({});
      setIsUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewgame",
        paramsData: {
          _id: location?.state?.gameId,
        },
        source: source,
      });
      console.log("responseresponse--->>>", response);
      if (response?.data?.responseCode === 200) {
        setCategoryData(response?.data?.result);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  const gameManagementApi = async (source) => {
    try {
      setCategoryDataList([]);
      setIsCategoryUpdating(true);
      const response = await getAPIHandler({
        endPoint: "listCategory",
        source: source,
      });

      if (response.data.responseCode === 200) {
        setCategoryDataList(response.data.result.docs);
        setIsCategoryUpdating(false);
      }
      setIsCategoryUpdating(false);
    } catch (error) {
      setIsCategoryUpdating(false);
    }
  };
  useEffect(() => {
    getCategoryApi();
  }, [location?.state?.gameId]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    gameManagementApi(source);
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack title={`${location?.state?.type} Game`} />
      </Box>

      <Container maxWidth="md">
        <Formik
          enableReinitialize={true}
          initialValues={formInitialSchema}
          validationSchema={formValidationSchema}
          onSubmit={
            location?.state?.type === "EDIT"
              ? (values) => editCategoryApi(values)
              : (values) => addCategoryApi(values)
          }
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values,
            setFieldValue,
          }) => (
            <Form>
              <Paper elevation={3}>
                <Box className="displayColumn" mb={4}>
                  <Box className="dropDownBoxProfile" mt={3}>
                    <Box>
                      <Avatar
                        src={
                          values.profilePicUpload
                            ? URL.createObjectURL(values.profilePicUpload)
                            : values.profilePic || "/images/profile_img.png"
                        }
                        style={{
                          height: "150px",
                          width: "150px",
                        }}
                      />
                      {location?.state?.type === "VIEW" ? (
                        ""
                      ) : (
                        <IconButton className="editIcon displayCenter">
                          <label htmlFor="raised-button-file-profile">
                            <MdEdit style={{ cursor: "pointer" }} />
                          </label>
                        </IconButton>
                      )}
                    </Box>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="raised-button-file-profile"
                      name="profilePic"
                      type="file"
                      disabled={isUpdating}
                      onChange={(e) => {
                        setFieldValue("profilePic", e.target.files[0]);
                        setFieldValue("profilePicUpload", e.target.files[0]);
                      }}
                    />
                  </Box>
                  <Box mt={1} textAlign="center">
                    <FormHelperText error className={classes.helperText}>
                      {touched.profilePic && errors.profilePic}
                    </FormHelperText>
                    <Typography variant="body2">Game Image</Typography>
                  </Box>
                </Box>
                <Box p={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={12} md={6}>
                      <Typography variant="body2">Game Title</Typography>
                    </Grid>
                    <Grid item xs={12} sx={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Game Title"
                          name="gameTitle"
                          value={values.gameTitle}
                          error={Boolean(touched.gameTitle && errors.gameTitle)}
                          inputProps={{ maxLength: 56 }}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={isUpdating}
                          disabled={
                            location?.state?.type === "VIEW" || isUpdating
                          }
                        />
                      </FormControl>
                      <FormHelperText error className={classes.helperText}>
                        {touched.gameTitle && errors.gameTitle}
                      </FormHelperText>
                    </Grid>

                    <Grid item xs={12} sx={12} md={6}>
                      <Typography variant="body2">Game Details</Typography>
                    </Grid>
                    <Grid item xs={12} sx={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Game Details"
                          name="gameDetails"
                          inputProps={{ maxLength: 600 }}
                          multiline
                          rows={5}
                          value={values.gameDetails}
                          error={Boolean(
                            touched.gameDetails && errors.gameDetails
                          )}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={
                            location?.state?.type === "VIEW" || isUpdating
                          }
                        />
                      </FormControl>
                      <Box className="displaySpacebetween">
                        <FormHelperText error className={classes.helperText}>
                          {touched.gameDetails && errors.gameDetails}
                        </FormHelperText>
                        <Typography variant="body1" textAlign="end">
                          {values.gameDetails?.length}/600
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sx={12} md={6}>
                      <Typography variant="body2">Category</Typography>
                    </Grid>
                    <Grid item xs={12} sx={12} md={6}>
                      <FormControl fullWidth>
                        <Autocomplete
                          fullWidth
                          disableClearable={true}
                          value={values.selectCategory}
                          onChange={(e, newValue) => {
                            setFieldValue(
                              "selectCategory",
                              newValue ? newValue : "Enter Game"
                            );
                          }}
                          options={
                            (categoryDataList &&
                              categoryDataList?.map(
                                (data, index) => data.categoryTitle
                              )) ||
                            []
                          }
                          disabled={
                            location?.state?.type === "VIEW" || isUpdating
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Status"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />
                      </FormControl>
                      <FormHelperText error className={classes.helperText}>
                        {touched.selectCategory && errors.selectCategory}
                      </FormHelperText>
                    </Grid>
                  </Grid>
                </Box>

                <Box className="displayCenter" py={4}>
                  {location?.state?.type !== "VIEW" && (
                    <Box>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isUpdating}
                      >
                        {location?.state?.type === "ADD" ? "Add" : "Save"}
                        {isUpdating && <ButtonCircularProgress />}
                      </Button>
                    </Box>
                  )}

                  <Box style={{ marginLeft: "16px" }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => history(-1)}
                      disabled={isUpdating}
                    >
                      Back
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
}

export default AddGame;
