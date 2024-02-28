import { Box, Grid, Paper, Typography, makeStyles } from "@material-ui/core";
import React, { useContext } from "react";
import { AuthContext } from "src/context/Auth";
import AnalyticsGraph from "src/component/AnalyticsGraph";
import GameActivityGraph from "src/component/GameActivityGraph";
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
      height: "85%",
      padding: "20px",
      borderRadius: "20px",
      background: "rgba(255, 255, 255, 0.04)",
      "& h6": {
        fontWeight: 700,
        color: "#FFFFFF",
      },
      "& p": {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "14px",
        margin: "10px 0px",
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
export default function Analytics() {
  const classes = useStyle();
  const auth = useContext(AuthContext);
  const data = [
    {
      title: "Total Played",
      count: "1234",
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
    },
    {
      title: "Total Game",
      count: "345",
      borderTop: "2px solid #DE14FF",
      borderBottom: "2px solid #DE14FF",
    },
    {
      title: "Total Deposit",
      count: "23",
      borderTop: "2px solid #158743",
      borderBottom: "2px solid #158743",
    },
    {
      title: "Total Withdrawl",
      count: "46",
      borderTop: "2px solid #2D73DD",
      borderBottom: "2px solid #2D73DD",
    },
  ];
  return (
    <Box className={classes.mainDashBox}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mt={2}>
            <Paper elevation={3}>
              <Grid container spacing={2}>
                {data &&
                  data?.map((item, i) => (
                    <Grid item xs={12} sm={6} md={3}>
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
                            <Box mt={2}>
                              <Typography variant="h6">
                                {item?.title}
                              </Typography>
                              <Typography variant="body1">
                                {item?.title === "Total Withdrawl"
                                  ? auth?.dashboardData?.totalWithdrawl
                                    ? auth?.dashboardData?.totalWithdrawl
                                    : "0"
                                  : item?.title === "Total Game"
                                  ? auth?.dashboardData?.totalGames
                                    ? auth?.dashboardData?.totalGames
                                    : "0"
                                  : item?.title === "Total Deposit"
                                  ? auth?.dashboardData?.totalDeposit
                                    ? auth?.dashboardData?.totalDeposit
                                    : "0"
                                  : "0"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
              <Box mt={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={6}>
                    <AnalyticsGraph />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <GameActivityGraph />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
