import { useState, useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useList } from "@refinedev/core";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { ICaisse } from "../../interfaces";

// type ProductItemProps = {};

export const CaisseFilter: React.FC = () => {
  const [selctedCaisse, setSelectedCaisse] = useState<string>();

  const { data: caisses, isLoading } = useList<ICaisse>({
    resource: "caisses",
  });

  return (
    <Stack>
      <Grid container columns={6} marginTop="10px">
        {caisses?.data.map((caisse: ICaisse) => (
          <Grid item key={caisse.id} p={0.5}>
            <LoadingButton
              variant={selctedCaisse?.length === 0 ? "contained" : "outlined"}
              size="small"
              loading={isLoading}
              sx={{
                borderRadius: "30px",
              }}
              onClick={() => setSelectedCaisse("")}
            >
              {caisse.nom}
            </LoadingButton>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
