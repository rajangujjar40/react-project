import GoBack from "src/component/GoBack";
import { Box, Grid, Paper, Typography, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getAPIHandler } from "src/ApiConfig/service";
const useStyle = makeStyles(() => ({
  mainDashBox: {
    "& .card": {
      padding: "50px 15px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0px 0px 33px -20px rgba(0,0,0,0.75)",
    },
    "& .topPlayerBox": {
      backgroundImage: "url(images/playerbg.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      "& h3": {
        color: "rgba(255, 255, 255, 1)",
        fontWeight: "600",
        textAlign: "center",
        width: "auto",
        maxWidth: "600px",
      },
    },
    "& .mainStepBox": {
      height: "80%",
      padding: "31px",
      background: "rgba(255, 255, 255, 0.04)",
      borderRadius: "20px",
      overflow: "hidden",
      "& h6": {
        color: "#FFFFFF",
        fontSize: "35px",
        textAlign: "center",
        fontWeight: "500",
        lineHeight: "23px",
        marginTop: "22px",
        height: "30px",
      },
      "& p": {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "16px",
        height: "34px",
      },
      "& .buttonBox": {
        "& button": {
          background: "#19051C",
          boxShadow: "0px 0px 10px 0px #580665 inset",
          color: "rgba(255, 255, 255, 1)",
          fontWeight: 700,
        },
      },
    },
  },
}));
export default function Dash() {
  const classes = useStyle();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState({});
  const [isDashboardUpdating, setIsDashboardUpdating] = useState(false);
  const dashbordManagementApi = async (source) => {
    try {
      setDashboardData({});
      setIsDashboardUpdating(true);
      const response = await getAPIHandler({
        endPoint: "dashBoard",
        source: source,
      });

      if (response.data.responseCode === 200) {
        setDashboardData(response.data.result);
        setIsDashboardUpdating(false);
      }
      setIsDashboardUpdating(false);
    } catch (error) {
      setIsDashboardUpdating(false);
    }
  };
  const data = [
    {
      title: "Total Registered User",
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
    },
    {
      title: "Total Annoucement",
      borderTop: "2px solid #DE14FF",
      borderBottom: "2px solid #DE14FF",
    },
    {
      title: "Total Transaction User",
      borderTop: "2px solid #158743",
      borderBottom: "2px solid #158743",
    },
    {
      title: "Total Game",
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
    },
    {
      title: "Total Ticket",
      borderTop: "2px solid #DE14FF",
      borderBottom: "2px solid #DE14FF",
    },
    {
      title: "Total Contact",
      borderTop: "2px solid #158743",
      borderBottom: "2px solid #158743",
    },
    {
      title: "Ticket Pending",
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
    },
  ];
  useEffect(() => {
    const source = axios.CancelToken.source();
    dashbordManagementApi(source);
    return () => {
      source.cancel();
    };
  }, []);
  return (
    <Box className={classes.mainDashBox}>
      <GoBack title={"Dashboard"} />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box mt={2}>
            <Paper elevation={3}>
              <Grid container spacing={2}>
                {data &&
                  data?.map((item, i) => (
                    <Grid item xs={12} sm={6} md={4}>
                      <Box className="topPlayerBox">
                        <Box className="playerContentBox">
                          <Box
                            className="mainStepBox"
                            align="center"
                            style={{
                              borderTop: item && item?.borderTop,
                              borderBottom: item && item?.borderBottom,
                            }}
                          >
                            <Box>
                              <Typography variant="body1">
                                {item?.title}
                              </Typography>
                              <Typography variant="h6">
                                {item?.title === "Total Registered User"
                                  ? dashboardData?.totalUsers
                                    ? dashboardData?.totalUsers
                                    : "0"
                                  : item?.title === "Total Annoucement"
                                  ? dashboardData?.announcement
                                    ? dashboardData?.announcement
                                    : "0"
                                  : item?.title === "Total Transaction User"
                                  ? dashboardData?.transactionCounts
                                    ? dashboardData?.transactionCounts
                                    : "0"
                                  : item?.title === "Total Game"
                                  ? dashboardData?.totalGames
                                    ? dashboardData?.totalGames
                                    : "0"
                                  : item?.title === "Total Ticket"
                                  ? dashboardData?.ticket
                                    ? dashboardData?.ticket
                                    : "0"
                                  : item?.title === "Total Contact"
                                  ? dashboardData?.contactUs
                                    ? dashboardData?.contactUs
                                    : "0"
                                  : dashboardData?.pendingContactUs
                                  ? dashboardData?.pendingContactUs
                                  : "0"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
