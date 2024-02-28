import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  makeStyles,
  Typography,
  Paper,
  FormHelperText,
} from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import JoditEditor from "jodit-react";
import PageLoading from "src/component/PageLoading";
import { putAPIHandler } from "src/ApiConfig/service";
import { toast } from "react-hot-toast";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import GoBack from "src/component/GoBack";

const useStyles = makeStyles((theme) => ({
  muiMainContainer: {
    "& .mainContainer": {
      display: "flex",
      flexDirection: "column",
      gap: "30px",
    },
    "& .head": {
      padding: "50px 20px 20px 20px",
      borderBottom: "1px solid #000",
      marginBottom: "50px",
    },
    "& h3": {
      fontWeight: "700",
      fontSize: "32px",
      lineHeight: "normal",
      fontFamily: "'Arial Bold', 'Arial', sans-serif",
    },
    "& .MuiOutlinedInput-root": {
      width: "100%",
    },
    "& .MuiInputBase-root": { background: "#fff" },

    "& .align": {
      height: "100%",
    },
    "& .btnBox": { gap: "20px", marginTop: "50px" },
    "& h6": {
      fontWeight: "700",
      fontSize: "18px",
      lineHeight: "normal",
      fontFamily: "'Arial Bold', 'Arial', sans-serif",
    },
    "& .displayEnd": {
      [theme.breakpoints.down("sm")]: { justifyContent: "start" },
    },
  },
}));
const PrivacyPolicy = () => {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const editor = useRef(null);
  const [description, setDescription] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const config = {
    readonly: false,
  };

  const editStaticContentApi = async (values) => {
    setIsValid(true);
    if (description !== "" && description !== "<p><br></p>") {
      setIsValid(false);

      try {
        setIsUpdating(true);

        const response = await putAPIHandler({
          endPoint: "editStaticContent",
          dataToSend: {
            _id: location?.state?.data?._id,
            description: description,
          },
        });
        if (response.data.responseCode == 200) {
          toast.success(response.data.responseMessage);
          history("/static-content");
        } else {
          toast.error(response.data.responseMessage);
        }
        setIsUpdating(false);
      } catch (error) {
        setIsUpdating(false);
        console.log(error);
        toast.error(error.response.data.responseMessage);
      }
    }
  };

  useEffect(() => {
    if (location?.state) {
      setDescription(
        location?.state?.data?.description
          ? location?.state?.data?.description
          : ""
      );
    }
  }, [location]);

  return (
    <Box className={classes.muiMainContainer}>
      <Box mb={5}>
        <GoBack
          title={`Edit ${location?.state && location?.state?.data?.title}`}
        />
      </Box>
      <Paper elevation={2}>
        <Box className="mainContainer">
          <Box>
            <Typography variant="h6">Discription</Typography>
          </Box>
          <Box>
            <JoditEditor
              ref={editor}
              value={description}
              config={config}
              tabIndex={1}
              onBlur={(e) => setDescription(e)}
              inputProps={{ maxLength: 500 }}
              variant="outlined"
              fullWidth
              disabled={isUpdating}
              size="small"
            />
            {isValid && description == "<p><br></p>" && (
              <FormHelperText error>
                Please enter valid description
              </FormHelperText>
            )}
            {isValid && description == "" && (
              <FormHelperText error>Description is requied.</FormHelperText>
            )}
          </Box>

          <Box className="displayCenter btnBox">
            <Button
              variant="contained"
              color="primary"
              disabled={isUpdating}
              onClick={() => {
                editStaticContentApi();
              }}
            >
              Update
              {isUpdating && <ButtonCircularProgress />}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={isUpdating}
              onClick={() => {
                history(-1);
              }}
            >
              Back
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
export default PrivacyPolicy;
