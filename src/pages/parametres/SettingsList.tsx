import { Settings } from "@mui/icons-material";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { ColorModeContext } from "../../contexts/color-mode";
import React, { useContext } from "react";

export const SettingsList = () => {
  const { mode } = useContext(ColorModeContext);
  return (
    <Paper
      sx={{
        paddingX: { xs: 3, md: 2 },
        paddingY: { xs: 2, md: 3 },
      }}
    >
      <Stack>
        <Stack>
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
        </Stack>
        <Stack>Gestion de Menu</Stack>
        <Stack>Gestion de Stock</Stack>
        <Stack>Trésorerie</Stack>
      </Stack>
    </Paper>
  );
};
