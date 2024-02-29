import { Settings } from "@mui/icons-material";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { ColorModeContext } from "../../contexts/color-mode";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import React, { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";

export const SettingsList = () => {
  const { mode } = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [selectedParam, setSelectedParam] = useState<string | null>(null);

  const handleParamClick = (param: string) => {
    setSelectedParam(param);

    // Navigate based on the selected parameter
    if (param === "categorie") {
      navigate("/parametres/categories");
    } else if (param === "table") {
      navigate("/parametres/tables");
    } else if (param === "caisse") {
      navigate("/parametres/caisses");
    } else if (param === "categorie_depense") {
      navigate("/parametres/caregorieDepense");
    }
  };
  const SectionHeader = (titre: string, icon: any) => (
    <Box
      sx={{
        width: "100%",
        backgroundColor:
          mode === "light"
            ? "rgba(211, 47, 47, 0.08)"
            : "rgba(239, 83, 80, 0.16)",
        gap: 1,
        p: 1,
        alignItems: "center",
        display: "flex",
      }}
    >
      {icon}
      <Typography
        sx={{
          textTransform: "uppercase",
          color: "primary.main",
          fontSize: 14,
          fontWeight: "bold",
          mt: 0.5,
        }}
      >
        {titre}
      </Typography>
    </Box>
  );

  const ParamItem = (data: any) => (
    <Box
      sx={{
        borderLeft: "3px solid ",
        borderColor:
          mode === "light"
            ? "rgba(211, 47, 47, 0.08)"
            : "rgba(239, 83, 80, 0.16)",
        height: "75px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        px: 2,
        m: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            textTransform: "capitalize",
            fontSize: 14,
            fontWeight: "bold",
            my: 1.5,
          }}
        >
          {data.titre}
        </Typography>
        <Typography variant="body2" color="secondary">
          {data.description}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <LaunchOutlinedIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
        {/* <Button
          variant="text"
          color="primary"
          onClick={() => handleParamClick(data.selectedParam)}
        >
          {data.titre}
        </Button> */}

        {data.links?.map((r, i) => (
          <Typography
            sx={{ cursor: "pointer" }}
            color="primary"
            onClick={r.action}
          >
            {r.titre} {i < data.links.length - 1 && "/ "}
          </Typography>
        ))}
      </Box>
    </Box>
  );

  return (
    <Paper
      sx={{
        paddingX: { xs: 3, md: 2 },
        paddingY: { xs: 2, md: 3 },
      }}
    >
      <Typography
        sx={{
          textTransform: "uppercase",
          fontSize: 14,
          fontWeight: "bold",
          mb: 4,
        }}
      >
        Paramètres
      </Typography>
      <Stack>
        {/* {renderSelectedComponent()} */}
        {SectionHeader(
          "générale",
          <Settings color="primary" sx={{ mr: 1, fontSize: 20 }} />
        )}
        {ParamItem({
          titre: "Données De Restaurant",
          links: [
            {
              titre: "Ajouter / Voir",
              action: () => {
                navigate("/parametres/generales");
              },
            },
          ],
        })}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {SectionHeader(
            "Menu",
            <Settings color="primary" sx={{ mr: 1, fontSize: 20 }} />
          )}
          {ParamItem({
            // titre: " Classification des ingrédients",
            titre: "categories",
            links: [
              {
                titre: "Voir / Ajouter des categories ",
                action: () => {
                  navigate("/parametres/categories");
                },
              },
            ],
          })}
          {ParamItem({
            titre: "Gestion Des Tables",
            // selectedParam: "table",
            links: [
              {
                titre: "Voir / Ajouter des Tables",
                action: () => {
                  navigate("/parametres/tables");
                },
              },
            ],
          })}
          {ParamItem({
            titre: "Gestion Des Caisses",
            links: [
              {
                titre: "Voir / Ajouter des Caisses",
                action: () => {
                  navigate("/parametres/caisses");
                },
              },
            ],
          })}
        </Box>

        {SectionHeader(
          "stock",
          <Settings color="primary" sx={{ mr: 1, fontSize: 20 }} />
        )}
        {ParamItem({
          titre: " Chefs",
          links: [
            {
              titre: "Voir / Ajouter des Chefs",
              action: () => {
                navigate("/parametres/chefs");
              },
            },
          ],
        })}
        {SectionHeader(
          "Trésorerie",
          <Settings color="primary" sx={{ mr: 1, fontSize: 20 }} />
        )}
        {ParamItem({
          titre: "Catégories Depenses",
          links: [
            {
              titre: "Voir / Ajouter des Catégories Depenses",
              action: () => {
                navigate("/parametres/categorieDepense");
              },
            },
          ],
        })}
        {SectionHeader(
          "Utilisateur",
          <Settings color="primary" sx={{ mr: 1, fontSize: 20 }} />
        )}
        {ParamItem({
          titre: "Utilisateur",
          links: [
            {
              titre: "Voir / Ajouter des utilisateurs",
              action: () => {
                navigate("/parametres/users");
              },
            },
          ],
        })}
      </Stack>
    </Paper>
  );
};
