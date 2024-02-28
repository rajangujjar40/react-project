import React, { useEffect, useState, useContext, useMemo } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { GiTatteredBanner } from "react-icons/gi";
import {
  FaQuestion,
  FaSquarespace,
  FaUser,
  FaUsers,
  FaWallet,
} from "react-icons/fa";
import PropTypes from "prop-types";
import {
  Box,
  Drawer,
  Hidden,
  List,
  Button,
  ListSubheader,
  makeStyles,
} from "@material-ui/core";
import NavItem from "./NavItem";
import { GrAnnounce } from "react-icons/gr";
import { AiOutlineLogout } from "react-icons/ai";
import { AuthContext } from "src/context/Auth";
import { MdCategory, MdDashboard, MdPermContactCalendar } from "react-icons/md";
import { ImTicket } from "react-icons/im";
import { toast } from "react-hot-toast";
import { IoGameController } from "react-icons/io5";
import { IoMdAnalytics } from "react-icons/io";
import ConfirmationModal from "src/component/ConfirmationModal";
import { getAPIHandler } from "src/ApiConfig/service";

export const sections = [
  {
    items: [
      {
        title: "Dashboard",
        modules: "dashboard",
        icon: MdDashboard,
        href: "/dashboard",
      },
      {
        title: "User Management",
        modules: "dashboard",
        icon: FaUser,
        href: "/user-management",
      },
      {
        title: "Sub Admin",
        modules: "dashboard",
        icon: FaUser,
        href: "/sub-admin-management",
      },
      {
        title: "Banner Management",
        modules: "dashboard",
        icon: GiTatteredBanner,
        href: "/banner-management",
      },
      {
        title: "Category Management",
        modules: "dashboard",
        icon: MdCategory,
        href: "/category-management",
      },
      {
        title: "Faq Management",
        modules: "dashboard",
        icon: FaQuestion,
        href: "/faq-management",
      },
      {
        title: "Ticket Management",
        modules: "dashboard",
        icon: ImTicket,
        href: "/ticket-management",
      },
      {
        title: "Game Management",
        modules: "dashboard",
        icon: IoGameController,
        href: "/game-management",
      },
      {
        title: "Wallet Management",
        modules: "dashboard",
        icon: FaWallet,
        href: "/wallet-Management",
      },
      {
        title: "Level & Multiplier",
        modules: "dashboard",
        icon: FaUsers,
        href: "/level-management",
      },

      {
        title: "Analytics Management",
        modules: "dashboard",
        icon: IoMdAnalytics,
        href: "/analytics",
      },
    ],
  },
];

const subAdminArray = [
  {
    items: [
      {
        title: "Static Management",
        modules: "dashboard",
        icon: MdDashboard,
        href: "/static-content",
      },
      {
        title: "Contact us",
        modules: "dashboard",
        icon: MdPermContactCalendar,
        href: "/contact-management",
      },
      {
        title: "Announcement",
        modules: "dashboard",
        icon: GrAnnounce,
        href: "/announcement-management",
      },
    ],
  },
];

function renderNavItems({ items, pathname, depth = 0 }) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc, item) => reduceChildRoutes({ acc, item, pathname, depth }),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({ acc, pathname, item, depth }) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false,
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items,
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        info={item.info}
        key={key}
        title={item.title}
      />
    );
  }
  return acc;
}
const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 256,
    background: "#251327",
  },
  desktopDrawer: {
    top: "76px",
    width: "250px",
    height: "calc(100% - 79px)",
    background: "#251327",
    boxShadow: "0px 0px 53px rgba(0, 0, 0, 0.25)",
    borderRadius: "0px",
    border: "1px solid rgba(0, 0, 0, 0.15)",
    marginLeft: "0px",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
  socialIcon: {
    cursor: "pointer",
    marginRight: 5,
  },
  button: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    height: "45px",
    paddingLeft: "17px",
    borderRadius: "12px",
    marginTop: "-30px",
    "&:hover": {
      color: "#F5C843",
    },
    "& svg": {
      color: "#F5C843",
      fontSize: "20px",
    },
  },
  btnBox: {
    position: "relative",
    left: "30%",
    bottom: "-250px",
  },
  logoutButton: {
    position: "absolute",
    bottom: "29px",
    left: "10px",
    marginLeft: "16px",
    background: "transparent",
    zIndex: "999",
    "& span": {
      color: "rgb(255, 255, 255)",
      fontSize: "13px",
      fontWeight: 400,
    },
    "& svg": {
      fontSize: "20px",
      marginRight: "16px",
    },
  },
  sideMenuBox: {
    "& .MuiCollapse-wrapperInner": {
      marginLeft: "45px",
    },
  },
  dialougTitle: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    "& h4": {
      color: "#000",
      fontWeight: "700",
      fontFamily: "'Arial Bold', 'Arial', sans-serif",
      textAlign: "center",
      textDecoration: "underline",
    },
    "& h6": {
      fontWeight: "400",
      fontSize: "16px",
      lineHeight: "normal",
      textAlign: "center",
      fontFamily: "'Arial Bold', 'Arial', sans-serif",
    },
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const location = useLocation();
  let connectedExchange = auth.userData?.connectedExchange?.length;
  const history = useNavigate();
  const [isLogout, setIsLogout] = useState(false);
  const logoutFunction = () => {
    toast.success("You have been logout successfully!");
    window.sessionStorage.removeItem("token");
    window.localStorage.removeItem("packman");
    auth.userLogIn(false, null);
    setIsLogout(false);
    history("/");
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const checkArray = useMemo(() => {
    const matchedItems = sections.flatMap((section) =>
      section.items.filter(
        (item) =>
          auth?.userData?.permissions &&
          auth?.userData?.permissions.includes(item.title)
      )
    );
    return auth?.userData?.userType != "ADMIN"
      ? [...[{ items: matchedItems }], ...subAdminArray]
      : [...sections, ...subAdminArray];
  }, [auth]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Box pt={2} pb={2}>
          <Box className="sideMenuBox">
            {checkArray &&
              checkArray?.map((section, i) => {
                return (
                  <List
                    key={`menu${i}`}
                    subheader={
                      <ListSubheader disableGutters disableSticky>
                        {section.subheader}
                      </ListSubheader>
                    }
                  >
                    {renderNavItems({
                      img: section.img,
                      items: section.items,
                      pathname: location.pathname,
                    })}
                  </List>
                );
              })}
          </Box>
        </Box>
      </PerfectScrollbar>
      <Box className={classes.logoutButton}>
        <Box>
          <Button onClick={() => setIsLogout(true)}>
            <AiOutlineLogout color="#DE14FF" />
            <span style={{ color: "#DE14FF" }}>Logout</span>
          </Button>
        </Box>
      </Box>
      {isLogout && (
        <ConfirmationModal
          open={isLogout}
          isLoading={false}
          handleClose={() => {
            setIsLogout(false);
          }}
          title={"Logout"}
          desc={"Are you sure, you want to logout?"}
          handleSubmit={(item) => logoutFunction(item)}
        />
      )}
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          <Box p={2}>{content}</Box>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default NavBar;
