import {
  Box,
  IconButton,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAPIHandler } from "src/ApiConfig/service";
import { useLocation } from "react-router-dom";
import PageLoading from "src/component/PageLoading";
import GoBack from "src/component/GoBack";

const useStyles = makeStyles((theme) => ({
  main: {},
}));
function ViewStatic() {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const [staticData, setStaticData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const staticManagementApi = async (source, id) => {
    try {
      setStaticData([]);
      setIsUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewStaticContent",
        paramsData: {
          type: location?.state?.type,
        },
        source: source,
      });
      if (response.data.responseCode === 200) {
        setStaticData(response.data.result);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (location?.state?.type) {
      staticManagementApi(source, location?.state?.type);
    }
    return () => {
      source.cancel();
    };
  }, [location?.state?.type]);
  return (
    <Box className={classes.main}>
      {isUpdating ? (
        <PageLoading />
      ) : (
        <>
          <Box mb={5}>
            <GoBack title={`View ${staticData && staticData?.title}`} />
          </Box>
          <Paper elevation={3}>
            <Typography variant="body2">
              <div
                dangerouslySetInnerHTML={{
                  __html: staticData && staticData?.description,
                }}
              ></div>
            </Typography>
          </Paper>
        </>
      )}
    </Box>
  );
}

export default ViewStatic;
