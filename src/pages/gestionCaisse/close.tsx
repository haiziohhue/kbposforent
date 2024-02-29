import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useCallback, useEffect, useState } from "react";

import { HttpError, useList, useLogout } from "@refinedev/core";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Create } from "@refinedev/mui";

import { ICaisseLogs } from "../../interfaces";
import { API_URL, TOKEN_KEY } from "../../constants";
import axios from "axios";
import dayjs from "dayjs";

export const CloseCaisse: React.FC<
  UseModalFormReturnType<ICaisseLogs, HttpError, ICaisseLogs>
> = ({ saveButtonProps, modal: { visible, close }, formState: { errors } }) => {
  const [selectedCaisseLog, setSelectedCaisseLog] = useState<
    ICaisseLogs | undefined
  >(undefined);
  const [fetchedData, setFetchedData] = useState<any>();
  const { mutate: logout } = useLogout();
  //
  const { data: caissesLogs } = useList<ICaisseLogs>({
    resource: "logs-caisses",
    meta: { populate: "deep" },
  });
  //
  useEffect(() => {
    const caisseId = localStorage.getItem("selectedCaisseId");
    if (caisseId) {
      const parsedCaisseId = parseInt(caisseId, 10);
      const foundCaisse = caissesLogs?.data?.find(
        (caisse) =>
          caisse?.caisse?.id === parsedCaisseId && caisse?.etat === "Ouverte"
      );
      setSelectedCaisseLog(foundCaisse || undefined);
    } else {
      setSelectedCaisseLog(undefined);
    }
  }, [caissesLogs?.data]);

  //

  //Get data
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/logs-caisses/${selectedCaisseLog?.id}?populate=deep`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
          },
        }
      );
      const data = await res.json();
      setFetchedData(data?.data?.attributes);
    } catch (err) {
      console.log(err);
    }
  }, [selectedCaisseLog?.id]);
  //
  const formatter = new Intl.NumberFormat("en-DZ", {
    style: "currency",
    currency: "DZD",
  });
  //
  const data = [
    "Caisse :",
    "Date d'Ouverture :",
    "Solde d'Ouverture :",
    "Les Depenses :",
    "Les Ventes :",
  ];
  const fetcheddata = [
    fetchedData?.caisse?.data?.attributes?.nom,
    dayjs(fetchedData?.createdAt)?.format("MMMM DD, YYYY, hh:mm:ss A"),
    formatter.format(fetchedData?.solde_ouverture || 0),
    formatter.format(fetchedData?.depenses || 0),
    formatter.format(fetchedData?.ventes || 0),
  ];
  //
  function calculateTotal(data) {
    if (data && data.ventes !== undefined && data.depenses !== undefined) {
      const total = data.ventes + data.solde_ouverture - data.depenses;
      return total;
    }
    return null;
  }
  const total = calculateTotal(fetchedData);
  const formattedTotal = formatter.format(total || 0);
  //

  const onFinishHandler = async () => {
    const payload = {
      solde_cloture: total,
      etat: "Fermé",
      date_cloture: dayjs(),
    };
    try {
      const response = await axios.put(
        `${API_URL}/api/logs-caisses/${selectedCaisseLog?.id}`,
        {
          data: payload,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
          },
        }
      );
      console.log("Request succeeded:", response.status);
      logout();
      // localStorage.setItem("selectedCaisseEtat", "Fermé");
      localStorage.removeItem("selectedCaisseId");
      localStorage.removeItem("selectedCaisseEtat");
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  //
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  //

  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{
        sx: { width: "100%", height: "700px", maxWidth: "1200px" },
      }}
    >
      <Create
        saveButtonProps={saveButtonProps}
        breadcrumb={<div style={{ display: "none" }} />}
        headerProps={{
          action: null,
          sx: {
            display: "none",
          },
        }}
        footerButtonProps={{
          sx: {
            display: "none",
          },
        }}
        wrapperProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
      >
        <Box
          component="form"
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column" }}
          paddingX={12}
          margin={3}
          gap={4}
        >
          <DialogContent>
            <DialogTitle>
              <Typography
                fontSize={24}
                textAlign="center"
                padding={2}
                marginBottom={3}
              >
                Clôture de Caisse
              </Typography>
            </DialogTitle>
            <Stack gap={4}>
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
                  {data.map((item) => (
                    <Typography fontSize={18}>{item}</Typography>
                  ))}
                </Box>
                <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
                  {fetcheddata?.map((data) => (
                    <Typography fontSize={18}>{data}</Typography>
                  ))}
                </Box>
              </Stack>

              <Divider />
              <Stack flexDirection="row" alignItems="center" gap={50}>
                <Typography fontSize={20}>
                  Total Chiffre d'Affaires :
                </Typography>
                <Typography fontSize={20}>{formattedTotal}</Typography>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Button
              {...saveButtonProps}
              variant="contained"
              onClick={() => {
                onFinishHandler();
              }}
              sx={{ fontWeight: 500, paddingX: "26px", paddingY: "4px" }}
            >
              Confirmer
            </Button>
            <Button onClick={() => close()}>Annuler</Button>
          </DialogActions>
        </Box>
      </Create>
    </Dialog>
  );
};
