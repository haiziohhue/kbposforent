import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";

type BonChefAchatStatusProps = {
  status?: "Validé" | "Annulé";
};

export const BonChefAchatStatus: React.FC<BonChefAchatStatusProps> = ({
  status,
}) => {
  let color: ChipProps["color"];

  switch (status) {
    case "Validé":
      color = "success";
      break;
    case "Annulé":
      color = "primary";
      break;
  }

  return (
    <Chip variant="filled" size="small" color={color} label={`${status}`} />
  );
};
