import React, { useContext, useEffect, useState } from "react";
import { Box, Button, makeStyles, Typography, Grid } from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import { getAPIHandler, postAPIHandler } from "src/ApiConfig/service";
import axios from "axios";
import { toast } from "react-hot-toast";
import moment from "moment";
import ConfirmationModal from "src/component/ConfirmationModal";
import GoBack from "src/component/GoBack";
import { sortAddress } from "src/utils";
import { AuthContext } from "src/context/Auth";
import { RPC } from "src/constants";
import { Buffer } from "buffer";
import * as solanaWeb3 from "@solana/web3.js";
import { Connection, SystemProgram, PublicKey } from "@solana/web3.js";

const useStyles = makeStyles((theme) => ({
  muiMainContainer: {
    "& .head": {
      padding: "50px 20px 20px 20px",
      borderBottom: "1px solid #000",
    },
    "& .mainBox": {
      padding: "30px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      "& p": {
        color: "#FFFFFF",
      },
    },
    "& .secendMainBox": {
      height: "300px",
      maxWidth: "1000px",
      width: "100%",
      "& .filterBtn": {
        height: "55px",
        maxWidth: "180px",
        width: "100%",
      },
    },
  },
}));

const DepositTransuctionDetail = () => {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);
  const [isUserUpdating, setIsUserUpdating] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isApproveRejectUpdating, setIsApproveRejectUpdating] = useState(false);
  const [userData, setUserData] = useState({});
  const [filtersData, setFiltersData] = useState({
    status: "",
    reason: "",
  });

  const userManagementApi = async (source) => {
    try {
      setUserData({});
      setIsUserUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewTransactionHistory",
        paramsData: {
          transactionId: location?.state?.transactionId,
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
        setUserData(response.data.result);

        setIsUserUpdating(false);
      }
      setIsUserUpdating(false);
    } catch (error) {
      setIsUserUpdating(false);
    }
  };

  const transferSol = async () => {
    try {
      if (Number(auth?.solbalance) > Number(userData?.amount)) {
        setIsApproveRejectUpdating(true);
        if (!window.solana) {
          throw new Error("Solana wallet extension not found.");
        }
        const connection = new solanaWeb3.Connection(RPC, "confirmed");
        const recipientWallet = new solanaWeb3.PublicKey(
          userData?.walletAddress
        );
        const transaction = new solanaWeb3.Transaction();
        transaction.feePayer = window.solana.publicKey; // Set fee payer
        const blockhashObj = await connection.getRecentBlockhash(); // Get recent blockhash
        transaction.recentBlockhash = blockhashObj.blockhash; // Set recent blockhash
        transaction.add(
          solanaWeb3.SystemProgram.transfer({
            fromPubkey: window.solana.publicKey,
            toPubkey: recipientWallet,
            lamports: parseFloat(userData?.amount) * Math.pow(10, 9),
          })
        );
        const signedTransaction = await window.solana.signTransaction(
          transaction,
          connection
        );
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          { skipPreflight: true }
        );
        const bConfirmed = await connection.confirmTransaction(signature);

        approveRejectApi(signature);
      } else {
        toast.error("Your balance is too low.");
      }
    } catch (error) {
      setIsApproveRejectUpdating(false);
      console.error("Error transferring SOL:", error);
      if (error.message === "User rejected the request") {
        toast.error("User rejected the request");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const approveRejectApi = async (hash) => {
    try {
      setIsApproveRejectUpdating(true);

      const response = await postAPIHandler({
        endPoint: "approveRejectWithdrawal",
        dataToSend: {
          transactionId: userData?._id,
          status: filtersData?.status,
          reason: filtersData?.status !== "" ? filtersData?.status : undefined,
          hash: hash ? hash : undefined,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/wallet-Management");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsApproveRejectUpdating(false);
    } catch (error) {
      setIsApproveRejectUpdating(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    userManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [location?.state?.userId]);

  return (
    <Box className={classes.muiMainContainer}>
      <GoBack title={`${userData?.status}  Transaction Details`} />
      <Box className="mainBox">
        <Grid container spacing={2}>
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Username:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">{`${userData?.userId?.firstName} ${userData?.userId?.lasName}`}</Typography>
          </Grid>

          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Email Id:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">
              {userData && userData?.userId?.email
                ? userData?.userId?.email
                : "--"}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Transaction Hash:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">
              {userData && userData?.hash ? sortAddress(userData?.hash) : "--"}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Amount (In USDT):</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">
              {userData && userData?.amount ? userData?.amount : "--"}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Created Date & Time:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">
              {" "}
              {moment(userData?.createdAt).utc().format("DD-MM-YYYY")
                ? moment(userData?.createdAt).utc().format("DD-MM-YYYY")
                : "--"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box className="displayCenter">
        {userData?.status === "PENDING" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenApproveModal(true);
            }}
          >
            APPROVE
          </Button>
        )}

        <Box ml={1}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              history(-1);
            }}
          >
            BACK
          </Button>
        </Box>
      </Box>
      {openApproveModal && (
        <ConfirmationModal
          open={openApproveModal}
          isLoading={isApproveRejectUpdating}
          handleClose={() => {
            setOpenApproveModal(false);
          }}
          filter={filtersData}
          setFilter={(data) => {
            setFiltersData(data);
          }}
          type="reason"
          title={"Approve"}
          desc={"Are you sure, you want to Approve this Withdrawal Request ?"}
          handleSubmit={(item) => {
            filtersData?.status == "APPROVE"
              ? transferSol(item)
              : approveRejectApi(item);
          }}
          auth={auth}
        />
      )}
    </Box>
  );
};

export default DepositTransuctionDetail;
