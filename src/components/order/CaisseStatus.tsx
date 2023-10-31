import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";

type CaisseStatusProps = {
  status?: "Ouverte" | "Fermé";
};

export const CaisseStatus: React.FC<CaisseStatusProps> = ({ status }) => {
  let color: ChipProps["color"];

  switch (status) {
    case "Ouverte":
      color = "success";
      break;
    case "Fermé":
      color = "primary";
      break;
  }

  return (
    <Chip variant="filled" size="small" color={color} label={`${status}`} />
  );
};
