import {
  Box,
  Button,
  Container,
  FormHelperText,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import GoBack from "src/component/GoBack";
import { getAPIHandler, putAPIHandler } from "src/ApiConfig/service";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import { useLocation } from "react-router-dom";
import { handleNegativeValue } from "src/utils";

const useStyles = makeStyles((theme) => ({
  muiMainContainer: {
    "& .head": {
      padding: "50px 20px 20px 20px",
      borderBottom: "1px solid #000",
    },
    "& h3": {
      fontWeight: "700",
      fontSize: "32px",
    },
    "& .mainContainer": {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "50px",
      "& .headContiner": {
        display: "flex",
        flexDirection: "column",
        gap: "30px",

        "& .secendMainBox": {
          height: "100px",
          maxWidth: "1000px",
          width: "100%",
          display: "flex",
          gap: "30px",
          "@media(max-width:450px)": { flexDirection: "column" },
        },
      },
    },
  },
}));

const LevelMultiplier = () => {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const [levelData, setLevelData] = useState();
  const [isLevelUpdating, setIsLevelUpdating] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [levelValue, setLevelValue] = useState("");

  const editLevelApi = async (values) => {
    try {
      setIsLevelUpdating(true);
      const response = await putAPIHandler({
        endPoint: "editgame",
        dataToSend: {
          _id: location?.state?.levelId,
          levelPrice: levelValue,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        getLevelApi();
        history("/level-multiplier");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsLevelUpdating(false);
    } catch (error) {
      setIsLevelUpdating(false);
      console.log(error);
      toast.error(error?.response?.data?.responseMessage);
    }
  };
  const getLevelApi = async (source) => {
    try {
      const response = await getAPIHandler({
        endPoint: "viewgame",
        paramsData: {
          _id: location?.state?.levelId,
        },
        source: source,
      });
      if (response.data.responseCode === 200) {
        setLevelData(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (location?.state?.levelId) {
      getLevelApi();
    }
  }, [location?.state?.levelId]);

  useEffect(() => {
    if (levelData) {
      setLevelValue(levelData?.levelPrice?.toString());
    }
  }, [levelData]);

  return (
    <Box className={classes.muiMainContainer}>
      <>
        <Box mb={5}>
          <GoBack title={`${location?.state?.type} Level`} />
        </Box>

        <Box className="mainContainer">
          <Typography variant="h6" style={{ color: "#FFFFFF" }}>
            Admin can modify the Min number of level, which enables user to
            withdraw the reward after completing that level with Equivalent
            Multiplier for that level.
          </Typography>
          <Container maxWidth="sm">
            <Paper elevation={3} className="paperBox">
              <Box className="headContiner">
                <Box mt={3}>
                  <Box mb={1}>
                    <Typography variant="body2">Level</Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    placeholder="Please enter the level."
                    name="level"
                    value={levelValue}
                    disabled={
                      location?.state?.type == "VIEW" || isLevelUpdating
                    }
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
                    onChange={(e) => setLevelValue(e.target.value)}
                  />

                  <FormHelperText error className={classes.helperText}>
                    {isSubmit && levelValue == "" && "Please enter level."}
                    {isSubmit &&
                      levelValue != "" &&
                      Number(levelValue) <= 0 &&
                      "Please enter greater than 0."}
                  </FormHelperText>
                </Box>
                {location?.state?.type !== "VIEW" && (
                  <Box className="displayCenter secendMainBox">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={
                        () => {
                        setIsSubmit(true);
                        if (levelValue !== "" && Number(levelValue) > 0) {
                          setIsSubmit(false);
                          editLevelApi();
                        }
                      }}
                      disabled={isLevelUpdating}
                    >
                      SAVE CHANGES
                      {isLevelUpdating && <ButtonCircularProgress />}
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={isLevelUpdating}
                      onClick={() => {
                        history(-1);
                      }}
                    >
                      GO BACK
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Container>
        </Box>
      </>
    </Box>
  );
};
export default LevelMultiplier;
