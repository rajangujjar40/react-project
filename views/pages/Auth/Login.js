import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  FormHelperText,
  Divider,
  Container,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiOutlineMail } from "react-icons/hi";
import { Form, Formik } from "formik";
import * as yep from "yup";
import { CgKey } from "react-icons/cg";
import { toast } from "react-hot-toast";
import { postAPIHandler } from "src/ApiConfig/service";
import { AuthContext } from "src/context/Auth";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";

const useStyles = makeStyles((theme) => ({
  loginMainBox: {
    position: "relative",
    width: "100%",
    zIndex: "999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",

    "& h2": {
      color: "#FFFFFF",
      textAlign: "center",
    },
    "& .paperBox": {
      padding: "50px 40px ",
      [theme.breakpoints.down("xs")]: {
        padding: "15px",
      },
    },
    "& .MuiTypography-body2": {
      width: "fit-content",
    },
    "& .MuiFormControlLabel-root": {
      marginLeft: 0,
    },
  },
  loginBox: {
    height: "initial",
    margin: "15px auto",
    maxHeight: "100%",
    maxWidth: "475px",
    width: "100%",
    "& .buttonBox": {
      padding: "35px 0",
      display: "flex",
      justifyContent: "center",
    },
  },
  iconClass1: {
    color: "#ADADAD",
    fontSize: "20px",
  },
}));

export default function Login() {
  const classes = useStyles();
  const history = useNavigate();
  const auth = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  let rememberMe = window.localStorage.getItem("packman");
  const [isRemember, setIsRemember] = useState(rememberMe ? true : false);
  let RememberData = isRemember && rememberMe ? JSON.parse(rememberMe) : "";
  const initialValues = {
    email: isRemember ? RememberData.email : "",
    password: isRemember ? RememberData.password : "",
  };
  const formValidationSchema = yep.object().shape({
    email: yep
      .string()
      .test("emailPhoneUsername", "Invalid input.", (value) => {
        const phoneRegex = /^[0-9]{10}$/; // Adjust to your specific phone number format
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Adjust min and max length as needed
        return (
          !!value &&
          (yep.string().email().isValidSync(value) ||
            (phoneRegex.test(value) &&
              !/(\d)\1{6,}/.test(value.replace(/[^0-9]/g, "")) &&
              value.length >= 7 &&
              value.length <= 13) ||
            usernameRegex.test(value))
        );
      })
      .required("Please enter email."),
    password: yep
      .string()
      .required("Password is required.")
      .max(16, "Password should not exceeds 16 characters.")
      .min(8, "Password must be minimum of 8 characters."),
  });

  const handleFormSubmit = async (values) => {
    try {
      setIsUpdating(true);
      const response = await postAPIHandler({
        endPoint: "login",
        dataToSend: {
          email: values.email,
          password: values.password,
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        window.sessionStorage.setItem("token", response.data.result.token);
        if (isRemember) {
          window.localStorage.setItem(
            "packman",
            JSON.stringify({ email: values.email, password: values.password })
          );
        } else {
          window.localStorage.removeItem("packman");
        }
        auth.userLogIn(true, response.data.result.token);
        history("/dashboard");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  const [tabs, setTabs] = useState("email");
  return (
    <Box className={classes.loginMainBox}>
      <Container>
        <Box className={classes.loginBox}>
          <Paper elevation={3} className="paperBox">
            <Box className="displayCenter">
              <img src="images/logo.svg" alt="logo" />
            </Box>
            <Typography variant="h2">Login</Typography>

            <Formik
              initialValues={initialValues}
              validationSchema={formValidationSchema}
              onSubmit={(values) => handleFormSubmit(values)}
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
                  <Box mt={3}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Email"
                      name="email"
                      value={values.email}
                      error={Boolean(touched.email && errors.email)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className="textfiledicons"
                          >
                            <IconButton>
                              <HiOutlineMail />
                            </IconButton>
                            <Divider
                              orientation="vertical"
                              style={{ height: "27px" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error className={classes.helperText}>
                      {touched.email && errors.email}
                    </FormHelperText>
                  </Box>
                  <Box mt={2} mb={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      error={Boolean(touched.password && errors.password)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className="textfiledicons"
                          >
                            <IconButton>
                              <CgKey />
                            </IconButton>
                            <Divider
                              orientation="vertical"
                              style={{ height: "27px" }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              <Box>
                                {showPassword ? (
                                  <HiEye className={classes.iconClass1} />
                                ) : (
                                  <HiEyeOff className={classes.iconClass1} />
                                )}
                              </Box>
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error className={classes.helperText}>
                      {touched.password && errors.password}
                    </FormHelperText>
                  </Box>
                  <Box className="displaySpacebetween">
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="remember"
                          onChange={(e) => {
                            setIsRemember(e.target.checked);
                          }}
                          checked={isRemember}
                        />
                      }
                      label="Remember Me"
                    />
                    <Typography
                      variant="body2"
                      style={{
                        color: "#DE14FF",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                      onClick={() => history("/forget-password")}
                    >
                      Forgot Password?
                    </Typography>
                  </Box>
                  <Box className="buttonBox">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isUpdating}
                    >
                      LOGIN
                      {isUpdating && <ButtonCircularProgress />}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
