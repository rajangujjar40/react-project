import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import NavBar from "./NavBar";
import TopBar from "./TopBar";
import { Box } from "@material-ui/core";
import Footer from "./Footer";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  root: {
    backgroundColor: "#eef4f8",
    position: "relative",
    height: "100vh",
  },

  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#251328",
    paddingTop: 70,
    minHeight: "calc(100vh - 75px)",
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 252,
    },
    "@media (max-width:767px)": {
      paddingTop: "64px !important",
    },
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
  },
  content: {
    flex: "1 1 auto",
    height: "100%",
    overflow: "hidden",
    position: "relative",
    background: "#251327",
    padding: "28px 25px 25px ",
    [theme.breakpoints.down("md")]: {
      padding: "25px 10px 10px ",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "10px 10px 10px ",
    },
  },
}));

const DashboardLayout = ({ children }) => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  // const themeSeeting = useContext(SettingsContext);

  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <Footer />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content} id="main-scroll">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
