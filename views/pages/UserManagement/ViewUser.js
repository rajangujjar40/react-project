import { getAPIHandler, putAPIHandler } from "src/ApiConfig/service";
import {
  Avatar,
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
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GoBack from "src/component/GoBack";
import { validateAccountAddress } from "src/utils";
import * as yep from "yup";
import { toast } from "react-hot-toast";
import { Form, Formik } from "formik";
import PageLoading from "src/component/PageLoading";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
const useStyles = makeStyles((theme) => ({
  main: {
    height: "100%",
    "& .detailsBG": {
      maxWidth: "900px",
      width: "100%",
      height: "auto",
      padding: "30px",
      borderRadius: "15px",
      background: "#fff",
      flexDirection: "column",
      boxShadow: "0px 0px 33px -20px rgba(0,0,0,0.75)",
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
        background: "rgba(0, 0, 0, 0.87)",
        [theme.breakpoints.down("sm")]: {
          left: "382px",
        },
      },
    },
  },
}));
function ViewUser() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const [userData, setUserData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const formInitialSchema = {
    firstName: userData?.firstName ? userData?.firstName : "",
    lastName: userData?.lastName ? userData?.lastName : "",
    email: userData?.email ? userData?.email : "",
    walletAddress: userData?.wallet ? userData?.wallet : "",
  };

  const formValidationSchema = yep.object().shape({
    firstName: yep
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(256, "You can enter only 256 characters.")
      .required("First name is required.")
      .matches(
        /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/g,
        "Please enter your first name."
      ),
    lastName: yep
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(256, "You can enter only 256 characters.")
      .required("Last name is required.")
      .matches(
        /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/g,
        "Please enter your last name."
      ),
    email: yep
      .string()
      .trim()
      .email("Please enter valid email.")
      .max(256, "Should not exceeds 256 characters.")
      .matches("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"),

    walletAddress: yep
      .string()
      .trim()
      .min(43, "Please enter a valid Solana wallet address.") // Minimum length for a Solana address is 43 characters
      .max(43, "Please enter a valid Solana wallet address.")
      .required("Address is required.")
      .test(
        "validate-address",
        "Please enter a valid Solana wallet address.",
        async function (value) {
          return await validateAccountAddress(value); // Validate the address using the external function
        }
      ),
  });
  const editUserApi = async (values) => {
    try {
      setIsUpdating(true);

      const response = await putAPIHandler({
        endPoint: "editUserProfile",
        dataToSend: {
          userId: location?.state.userId,
          wallet: values.walletAddress ? values.walletAddress : undefined,
          firstName: values.firstName,
          lastName: values.lastName,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/user-management");
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

  const getUserDataApi = async (source) => {
    try {
      setUserData({});
      setIsUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewUser",
        paramsData: {
          userId: location?.state.userId,
        },
        source: source,
      });
      if (response.data.responseCode === 200) {
        setUserData(response.data.result);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    getUserDataApi();
  }, [location?.state.userId]);

  return (
    <Box className={classes.main}>
      {isUpdating ? (
        <PageLoading />
      ) : (
        <>
          <Box mb={5}>
            <GoBack title="User Detail" />
          </Box>
          <Container maxWidth="md">
            <Formik
              initialValues={formInitialSchema}
              validationSchema={formValidationSchema}
              onSubmit={(values) => editUserApi(values)}
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
                              userData?.profilePic
                                ? userData?.profilePic
                                : "/images/profile_img.png"
                            }
                            style={{
                              height: "150px",
                              width: "150px",
                            }}
                          />
                        </Box>
                      </Box>
                      <Box mt={1}>
                        <Typography variant="body2">User Image</Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">First Name</Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            variant="outlined"
                            type="text"
                            placeholder="Please enter first name."
                            name="firstName"
                            value={values.firstName}
                            error={Boolean(
                              touched.firstName && errors.firstName
                            )}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={location?.state?.type === "VIEW"}
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.firstName && errors.firstName}
                        </FormHelperText>
                      </Grid>

                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Last Name</Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            fullWidth
                            type="text"
                            variant="outlined"
                            placeholder="Please enter last name."
                            name="lastName"
                            value={values.lastName}
                            error={Boolean(touched.lastName && errors.lastName)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={location?.state?.type === "VIEW"}
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.lastName && errors.lastName}
                        </FormHelperText>
                      </Grid>

                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Email</Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            type="email"
                            variant="outlined"
                            placeholder="Please enter email address."
                            name="email"
                            value={values.email}
                            error={Boolean(touched.email && errors.email)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.email && errors.email}
                        </FormHelperText>
                      </Grid>
                      {userData?.wallet && (
                        <Grid item xs={12}>
                          <Box mb={1}>
                            <Typography variant="body2">Address</Typography>
                          </Box>
                          <FormControl fullWidth>
                            <TextField
                              fullWidth
                              type="text"
                              variant="outlined"
                              placeholder="Please enter wallet address."
                              name="walletAddress"
                              value={values.walletAddress}
                              error={Boolean(
                                touched.walletAddress && errors.walletAddress
                              )}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              disabled={location?.state?.type === "VIEW"}
                            />
                          </FormControl>
                          <FormHelperText error className={classes.helperText}>
                            {touched.walletAddress && errors.walletAddress}
                          </FormHelperText>
                        </Grid>
                      )}

                      <Grid
                        container
                        xs={12}
                        alignItems="center"
                        justifyContent="center"
                        style={{ marginTop: "10px" }}
                      >
                        <Grid item xs={3} align="center">
                          <Box className="displayCenter" py={4}>
                            {location?.state?.type !== "VIEW" && (
                              <Box>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  type="submit"
                                  disabled={isUpdating}
                                >
                                  Save
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
                        </Grid>
                      </Grid>
                    </Grid>
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

export default ViewUser;
