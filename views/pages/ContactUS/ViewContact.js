import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  makeStyles,
  Typography,
  Grid,
  Paper,
  Container,
} from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import GoBack from "src/component/GoBack";
import { getAPIHandler } from "src/ApiConfig/service";
import axios from "axios";
const useStyles = makeStyles((theme) => ({
  muiMainContainer: {
    "& .head": {
      padding: "50px 20px 20px 20px",
      borderBottom: "1px solid #000",
      display: "flex",
      gap: "10px",
    },
    "& h3": {
      fontWeight: "700",
      fontSize: "32px",
      lineHeight: "normal",
      fontFamily: "'Arial Bold', 'Arial', sans-serif",
    },
    "& .mainBox": {
      "& .mainContainer": {
        background: "#fff",
        borderRadius: "10px",
        boxShadow:
          " 7px 7px 10px rgba(0,0,0,0.20), -7px -7px 10px rgba(0,0,0,0.20)",
        padding: "30px",
        maxWidth: "700px",
        width: "100%",
        marginTop: "70px",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        [theme.breakpoints.down("xs")]: { gap: "30px", padding: "20px" },
        "& .icon": {
          height: "50px",
          width: "50px",
        },
        "& h6": {
          fontWeight: "700",
          fontSize: "18px",
          lineHeight: "normal",
          fontFamily: "'Arial Bold', 'Arial', sans-serif",
        },
        "& .text": { fontWeight: "400", color: "#333333" },
        "& .btnBox": {
          gap: "20px",
          "& .filterBtn": {
            maxWidth: "135px",
            width: "100%",
          },
        },
        "& .contentBox": {
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        },
      },
    },
  },
}));
const contactData = [
  { label: "First Name" },
  { label: "Last Name" },
  { label: "Email" },
  { label: "Message" },
];
const ViewContact = () => {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const [contactUsData, setContactUsData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const viewContactUsApi = async (source) => {
    try {
      setContactUsData({});
      setIsUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewContactsUs",
        paramsData: {
          id: location?.state?.contactId,
        },
        source: source,
      });
      if (response.data.responseCode === 200) {
        setContactUsData(response.data.result);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    const source = axios?.CancelToken?.source();
    if (location?.state?.contactId) {
      viewContactUsApi(source);
    }
    return () => {
      source.cancel();
    };
  }, [location?.state?.contactId]);
  return (
    <Box className={classes.muiMainContainer}>
      <Box mb={5}>
        <GoBack title={"View Contact Us"} />
      </Box>
      <Container maxWidth="md">
        <Paper elevation={3}>
          <Box className="contentBox">
            {contactData &&
              contactData?.map((data, index) => (
                <Grid key={index} container spacing={3}>
                  <Grid item lg={7} md={7} sm={7} xs={5}>
                    <Box>
                      <Typography variant="h6">{data && data.label}</Typography>
                    </Box>
                  </Grid>
                  <Grid item lg={5} md={5} sm={5} xs={7}>
                    <Box>
                      <Typography variant="h6" className="text">
                        {data.label === "First Name"
                          ? contactUsData.firstName
                          : data.label === "Last Name"
                          ? contactUsData.lastName
                          : data.label === "Email"
                          ? contactUsData.email
                          : data.label === "Message"
                          ? contactUsData.message
                          : ""}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              ))}
          </Box>

          <Box className="displayCenter" py={4}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => history(-1)}
            >
              Back
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ViewContact;
