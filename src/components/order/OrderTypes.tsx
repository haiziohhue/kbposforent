import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';

type OrderTypesProps = {
  status?: 'Emporté' | 'Sur place';
};

export const OrderTypes: React.FC<OrderTypesProps> = ({ status }) => {
  let color: ChipProps['color'];

  switch (status) {
    case 'Emporté':
      color = 'warning';
      break;
    case 'Sur place':
      color = 'success';
      break;
  }

  return (
    <Chip variant="outlined" size="small" color={color} label={`${status}`} />
  );
};
