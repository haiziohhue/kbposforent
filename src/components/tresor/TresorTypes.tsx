import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';

type OrderTypesProps = {
  status?: 'Vente' | 'Dépense';
};

export const TresorTypes: React.FC<OrderTypesProps> = ({ status }) => {
  let color: ChipProps['color'];

  switch (status) {
    case 'Vente':
      color = 'secondary';
      break;
    case 'Dépense':
      color = 'info';
      break;
  }

  return (
    <Chip variant="filled" size="small" color={color} label={`${status}`} />
  );
};
