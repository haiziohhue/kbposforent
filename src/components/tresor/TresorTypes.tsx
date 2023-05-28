import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';

type OrderTypesProps = {
  status?: 'vente' | 'Dépense';
};

export const TresorTypes: React.FC<OrderTypesProps> = ({ status }) => {
  let color: ChipProps['color'];

  switch (status) {
    case 'vente':
      color = 'warning';
      break;
    case 'Dépense':
      color = 'success';
      break;
  }

  return (
    <Chip variant="filled" size="small" color={color} label={`${status}`} />
  );
};
