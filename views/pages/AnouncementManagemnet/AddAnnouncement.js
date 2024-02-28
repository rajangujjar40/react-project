import {
  getAPIHandler,
  postAPIHandler,
  putAPIHandler,
} from "src/ApiConfig/service";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import * as yep from "yup";
import GoBack from "src/component/GoBack";
import axios from "axios";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import PageLoading from "src/component/PageLoading";
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

function AddAnnouncement() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const [categoryData, setCategoryData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const formInitialSchema = {
    announcementTitle: categoryData?.title ? categoryData?.title : "",
    announcementMessage: categoryData?.description
      ? categoryData?.description
      : "",
    scheduleDate: categoryData?.sendDate ? categoryData?.sendDate : null,
  };

  const formValidationSchema = yep.object().shape({
    announcementTitle: yep
      .string()
      .max(60, "Should not exceeds 60 characters.")
      .required("Announcement title is required."),
    announcementMessage: yep
      .string()
      .max(600, "Should not exceeds 600 characters.")
      .required("Announcement message is required."),
    scheduleDate: yep.string().required("Schedule date is required."),
  });

  const addAnnouncementApi = async (values) => {
    try {
      setIsUpdating(true);

      const response = await postAPIHandler({
        endPoint: "addAnnouncement",
        dataToSend: {
          title: values.announcementTitle,
          message: values.announcementMessage,
          sendDate: values.scheduleDate,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/announcement-management");
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

  const editAnnouncementApi = async (values) => {
    try {
      setIsUpdating(true);

      const response = await putAPIHandler({
        endPoint: "updateAnnouncement",
        dataToSend: {
          annouId: location?.state?.announcementId,
          title: values.announcementTitle,
          message: values.announcementMessage,
          sendDate: values.scheduleDate,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/announcement-management");
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
        endPoint: "viewAnnouncement",
        paramsData: {
          annouId: location?.state?.announcementId,
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
        setCategoryData(response.data.result);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    getCategoryApi();
    return () => {
      source.cancel();
    };
  }, [location?.state?.announcementId]);
  return (
    <Box className={classes.main}>
      {isUpdating ? (
        <PageLoading />
      ) : (
        <>
          <Box mb={5}>
            <GoBack title="Add Announcement" />
          </Box>
          <Container maxWidth="md">
            <Formik
              enableReinitialize={true}
              initialValues={formInitialSchema}
              validationSchema={formValidationSchema}
              onSubmit={
                location?.state?.type === "EDIT"
                  ? (values) => editAnnouncementApi(values)
                  : (values) => addAnnouncementApi(values)
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
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">
                            Announcement Title
                          </Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            variant="outlined"
                            placeholder="Announcement Title"
                            name="announcementTitle"
                            inputProps={{ maxLength: 50 }}
                            value={values.announcementTitle}
                            error={Boolean(
                              touched.announcementTitle &&
                                errors.announcementTitle
                            )}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={location?.state?.type === "VIEW"}
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.announcementTitle &&
                            errors.announcementTitle}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">
                            Schedule Date and Time
                          </Typography>
                        </Box>
                        <FormControl fullWidth>
                          <KeyboardDateTimePicker
                            inputVariant="outlined"
                            id="datetime-picker"
                            format="MM/DD/YYYY HH:mm"
                            placeholder="MM/DD/YYYY HH:mm"
                            className="keyboardPicker"
                            name="scheduleDate"
                            keyboardButtonProps={{
                              "aria-label": "change date and time",
                            }}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            value={values.scheduleDate}
                            disableFuture
                            onChange={(date) => {
                              setFieldValue("scheduleDate", new Date(date));
                            }}
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.scheduleDate && errors.scheduleDate}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">
                            Announcement Message
                          </Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            variant="outlined"
                            placeholder="Announcement Message"
                            name="announcementMessage"
                            multiline
                            rows={5}
                            value={values.announcementMessage}
                            error={Boolean(
                              touched.announcementMessage &&
                                errors.announcementMessage
                            )}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={location?.state?.type === "VIEW"}
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.announcementMessage &&
                            errors.announcementMessage}
                        </FormHelperText>
                      </Grid>
                    </Grid>

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
        </>
      )}
    </Box>
  );
}

export default AddAnnouncement;
