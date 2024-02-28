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
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import * as yep from "yup";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import GoBack from "src/component/GoBack";
import { Autocomplete } from "@material-ui/lab";
import { handleNegativeValue } from "src/utils";

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

export const getBase64 = (file, cb) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (err) {
    console.log("Error: ", err);
  };
};

function AddTicket() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const [ticketData, setTicketData] = useState({});
  const [gameData, setGameData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const formInitialSchema = {
    gameTitle: ticketData?.gameId?.gameTitle
      ? ticketData?.gameId?.gameTitle
      : "",
    amountInToken: ticketData?.amountInToken ? ticketData?.amountInToken : "",
  };

  const formValidationSchema = yep.object().shape({
    gameTitle: yep.string().required("Game title is required."),
    amountInToken: yep
      .string()
      .required("Token amount is required.")
      .test(
        "non-zero",
        "Token amount must be greater than 0.",
        function (value) {
          return parseFloat(value) > 0;
        }
      ),
  });

  const addTicketApi = async (values) => {
    try {
      setIsUpdating(true);

      const response = await postAPIHandler({
        endPoint: "createTicket",
        dataToSend: {
          gameName: values.gameTitle,
          amountInToken: values.amountInToken,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/ticket-management");
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

  const editTicketApi = async (values) => {
    try {
      setIsUpdating(true);
      const response = await putAPIHandler({
        endPoint: "updateTicket",
        dataToSend: {
          ticketId: location?.state?.ticketId,
          gameName: values.gameTitle,
          amountInToken: values.amountInToken,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/ticket-management");
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
  const viewTicketApi = async (source) => {
    try {
      setTicketData({});
      setIsUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewTicket",
        paramsData: {
          _id: location?.state?.ticketId,
        },
        source: source,
      });
      if (response?.data?.responseCode === 200) {
        setTicketData(response?.data?.result);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  const getGameApi = async (source) => {
    try {
      setGameData([]);
      setIsUpdating(true);
      const response = await getAPIHandler({
        endPoint: "listgame",
        source: source,
      });
      if (response?.data?.responseCode === 200) {
        setGameData(response?.data?.result?.docs);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    viewTicketApi();
  }, [location?.state?.ticketId]);
  useEffect(() => {
    getGameApi();
  }, []);
  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack title={`${location?.state?.type} Ticket`} />
      </Box>
      <Container maxWidth="md">
        <Formik
          enableReinitialize={true}
          initialValues={formInitialSchema}
          validationSchema={formValidationSchema}
          onSubmit={
            location?.state?.type === "EDIT"
              ? (values) => editTicketApi(values)
              : (values) => addTicketApi(values)
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
                <Box p={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={12} md={6}>
                      <Typography variant="body2">Game Title</Typography>
                    </Grid>
                    <Grid item xs={12} sx={12} md={6}>
                      <FormControl fullWidth>
                        <Autocomplete
                          fullWidth
                          name="gameTitle"
                          disableClearable={true}
                          value={values.gameTitle}
                          onChange={(e, newValue) => {
                            setFieldValue(
                              "gameTitle",
                              newValue ? newValue : "Enter Game Title"
                            );
                          }}
                          options={
                            (gameData &&
                              gameData?.map((data, index) => data.gameTitle)) ||
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
                        {touched.gameTitle && errors.gameTitle}
                      </FormHelperText>
                    </Grid>

                    <Grid item xs={12} sx={12} md={6}>
                      <Typography variant="body2">Token Amount</Typography>
                    </Grid>
                    <Grid item xs={12} sx={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Ticket Quantity"
                          name="amountInToken"
                          type="number"
                          value={values.amountInToken}
                          error={Boolean(
                            touched.amountInToken && errors.amountInToken
                          )}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          onKeyDown={(event) => handleNegativeValue(event)}
                          onKeyPress={(event) => {
                            if (
                              event?.key === "-" ||
                              event?.key === "+" ||
                              event?.key === "*" ||
                              event?.key === "/"
                            ) {
                              event.preventDefault();
                            }
                          }}
                          disabled={location?.state?.type === "VIEW"}
                        />
                      </FormControl>
                      <FormHelperText error className={classes.helperText}>
                        {touched.amountInToken && errors.amountInToken}
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

export default AddTicket;
