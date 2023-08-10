import { Settings, SettingsOutlined } from "@mui/icons-material";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { ColorModeContext } from "../../contexts/color-mode";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsManagement } from "./SettingsManagement";

export const SettingsList = () => {
  const { mode } = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [selectedParam, setselectedParam] = useState<string | null>(null);
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
        {data.links.map((r, i) => (
          <Typography
            sx={{ cursor: "pointer", fontSize: 14 }}
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
        {/* <Stack>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              width: "100%",
              backgroundColor:
                mode === "light"
                  ? "rgba(211, 47, 47, 0.08)"
                  : "rgba(239, 83, 80, 0.16)",
            }}
          >
            <Settings sx={{ color: "primary.main", fontSize: 20 }} />
            <Typography
              sx={{
                textTransform: "uppercase",
                color: "primary.main",
                fontSize: 14,
                fontWeight: "bold",
                mt: 0.5,
              }}
            >
              Générale
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              width: "100%",
              my: 2,
              mx: 2,
            }}
          >
            <Divider
              orientation="vertical"
              flexItem
              variant="middle"
              sx={{
                height: "100px",
                borderWidth: "1.5px",
                borderColor:
                  mode === "light"
                    ? "rgba(211, 47, 47, 0.08)"
                    : "rgba(239, 83, 80, 0.16)",
              }}
            />
            <Typography
              sx={{
                textTransform: "capitalize",
                fontSize: 14,
                fontWeight: "bold",
                my: 1.5,
              }}
            >
              Données De Restaurant
            </Typography>
          </Box>
        </Stack> */}
        {selectedParam !== null && (
          <SettingsManagement
            element={selectedParam}
            handleClose={() => setselectedParam(null)}
          />
        )}
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
                setselectedParam("donne_restaurant");
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
            titre: "Categories",
            links: [
              {
                titre: "Voir / Ajouter des categories ",
                action: () => {
                  setselectedParam("categories");
                },
              },
            ],
          })}
          {ParamItem({
            titre: "Gestion Des Tables",
            links: [
              {
                titre: "Voir / Ajouter des Tables",
                action: () => {
                  // navigate("/parameters/generale/mise-en-page");
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
                  // navigate("/parameters/generale/mise-en-page");
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
                // navigate("/parameters/generale/mise-en-page");
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
                // navigate("/parameters/generale/mise-en-page");
              },
            },
          ],
        })}
      </Stack>
    </Paper>
  );
};
