import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { IGeneraleDta, IMenu } from "../../interfaces";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import { useApiUrl, useCustom } from "@refinedev/core";
interface PrintReceiptProps extends UseModalFormReturnType {
  record?: any;
}

export const PrintReceipt: React.FC<PrintReceiptProps> = ({
  modal: { visible, close },
  record,
}) => {
  const componentRef = useRef(null);
  const [moneyGiven, setMoneyGiven] = useState("");
  const [numCopies, setNumCopies] = useState(1);
  // Function to trigger printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  //

  //

  // Calculate the change (rest)
  const calculateChange = () => {
    const moneyGivenValue = parseFloat(moneyGiven);
    const total = parseFloat(record?.total);
    if (!isNaN(moneyGivenValue) && !isNaN(total)) {
      return moneyGivenValue - total;
    }
    return "";
  };
  //

  const apiUrl = useApiUrl();
  const { data } = useCustom<IGeneraleDta[]>({
    url: `${apiUrl}/data-restaurants`,
    method: "get",
  });
  const restaurantData = data?.data;

  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { minWidth: 700 } }}
      sx={{ zIndex: "1350" }}
    >
      <Box ref={componentRef} sx={{ width: "100%", color: "#000", p: 2 }}>
        {(restaurantData?.data as any)
          ?.map((k: any) => ({ id: k.id, ...k.attributes }))
          ?.map((item: any) => (
            <>
              <DialogTitle
                sx={{ textAlign: "center", fontWeight: 600, fontSize: 16 }}
              >
                {item?.nom}
              </DialogTitle>
              <Typography
                sx={{ textAlign: "center", fontWeight: 400, fontSize: 14 }}
              >
                {item?.adresse}
              </Typography>
              <Typography
                sx={{ textAlign: "center", fontWeight: 400, fontSize: 14 }}
              >
                {item?.phone1} / {item?.phone2}
              </Typography>
            </>
          ))}
        <table
          style={{
            border: "solid",
            borderCollapse: "collapse",
            borderColor: "#000",
            width: "100%",
            marginBottom: 3,
            marginTop: 3,
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  border: "solid",
                  borderColor: "#000",
                }}
              >
                <Typography
                  sx={{ textAlign: "center", fontWeight: 400, fontSize: 14 }}
                >
                  Commande N°
                </Typography>
              </td>
              <td
                style={{
                  border: "solid",
                  borderColor: "#000",
                }}
              >
                <Typography
                  sx={{ textAlign: "center", fontWeight: 400, fontSize: 14 }}
                >
                  {record?.code}
                </Typography>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  border: "solid",
                  borderColor: "#000",
                }}
              >
                <Typography
                  sx={{ textAlign: "center", fontWeight: 400, fontSize: 14 }}
                >
                  {record?.users_permissions_user?.data?.attributes?.username}
                </Typography>
              </td>
              <td
                style={{
                  border: "solid",
                  borderColor: "#000",
                }}
              >
                <Typography
                  sx={{ textAlign: "center", fontWeight: 400, fontSize: 14 }}
                >
                  {moment().format("L")}
                  {""} {moment().format("HH:mm")}
                </Typography>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Render the menus if available */}
        {record && (
          <table
            style={{
              border: "solid",
              borderCollapse: "collapse",
              borderColor: "#000",
              width: "100%",
              marginBottom: 3,
              marginTop: 3,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "solid",
                    borderColor: "#000",
                  }}
                >
                  <Typography>Qté</Typography>
                </th>
                <th
                  style={{
                    border: "solid",
                    borderColor: "#000",
                  }}
                >
                  <Typography>Produit</Typography>
                </th>
                <th
                  style={{
                    border: "solid",
                    borderColor: "#000",
                  }}
                >
                  <Typography>Prix</Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {(record?.menu as any)
                ?.map((k: any) => ({ ...k, menu: k?.menu?.data?.attributes }))
                ?.map(
                  (item: any) => (
                    console.log(item),
                    (
                      <>
                        <tr key={item?.menu?.id}>
                          <td
                            style={{
                              border: "solid",
                              borderColor: "#000",
                            }}
                          >
                            <Typography
                              sx={{
                                textAlign: "center",
                                fontWeight: 400,
                                fontSize: 14,
                              }}
                            >
                              {item?.quantite}
                            </Typography>
                          </td>
                          <td
                            style={{
                              border: "solid",
                              borderColor: "#000",
                            }}
                          >
                            <Typography sx={{ fontWeight: 400, fontSize: 14 }}>
                              {item?.menu?.titre
                                ? item?.menu?.titre
                                : item?.titre}
                            </Typography>
                            <Box>
                              {item?.ingredients?.flatMap((item) => (
                                <Typography key={item?.id}>
                                  ({item?.count} x {item?.nom}) {item?.prix}
                                </Typography>
                              ))}
                            </Box>
                          </td>
                          <td
                            style={{
                              border: "solid",
                              borderColor: "#000",
                            }}
                          >
                            <Typography
                              sx={{
                                textAlign: "center",
                                fontWeight: 400,
                                fontSize: 14,
                              }}
                            >
                              {item?.menu?.prix ? item?.menu?.prix : item?.prix}
                            </Typography>
                          </td>
                        </tr>
                      </>
                    )
                  )
                )}
            </tbody>
          </table>
        )}
        <div
          style={{
            border: "dashed 2px",
            borderColor: "#000",
            width: "100%",
            marginBottom: 6,
            marginTop: 6,
          }}
        />
        <table
          style={{
            border: "solid",
            borderCollapse: "collapse",
            borderColor: "#000",
            width: "100%",
            marginBottom: 3,
            marginTop: 3,
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  border: "solid",
                  borderColor: "#000",
                }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    fontWeight: 400,
                    fontSize: 14,
                  }}
                >
                  Total
                </Typography>
              </td>
              <td
                style={{
                  border: "solid",
                  borderColor: "#000",
                }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    fontWeight: 400,
                    fontSize: 14,
                  }}
                >
                  {record?.total}
                </Typography>
              </td>
            </tr>
          </tbody>
        </table>
      </Box>

      <Box sx={{ width: 400, margin: "auto", mb: 3 }}>
        {/* Money given input */}
        <TextField
          label="Money Given"
          variant="outlined"
          value={moneyGiven}
          onChange={(e) => setMoneyGiven(e.target.value)}
          fullWidth
          type="number"
          sx={{ marginBottom: 3 }}
        />
        {/* Number of copies select */}
        <TextField
          label="Number of Copies"
          variant="outlined"
          value={numCopies}
          onChange={(e) => {
            // Ensure input is numeric and non-negative
            const inputNumCopies = parseInt(e.target.value, 10);
            if (!isNaN(inputNumCopies) && inputNumCopies >= 1) {
              setNumCopies(inputNumCopies);
            }
          }}
          fullWidth
          type="number"
          sx={{ marginBottom: 3 }}
        />
        {/* Change (rest) calculation */}
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: 400,
            fontSize: 14,
            marginBottom: 3,
          }}
        >
          Change (Rest): {calculateChange()}
        </Typography>
        <Button
          onClick={handlePrint}
          variant="outlined"
          startIcon={<PrintIcon color="secondary" />}
          sx={{
            color: "#673ab7",
            borderColor: "#673ab7",
            width: "100%",
          }}
        >
          Imprimer
        </Button>
      </Box>
    </Dialog>
  );
};
