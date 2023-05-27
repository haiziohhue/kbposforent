import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';

type OrderStatusProps = {
  status?: 'validé' | 'en cours' | 'annulé';
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  let color: ChipProps['color'];

  switch (status) {
    case 'en cours':
      color = 'warning';
      break;
    case 'validé':
      color = 'success';
      break;
    case 'annulé':
      color = 'error';
      break;
  }

  return (
    <Chip variant="outlined" size="small" color={color} label={`${status}`} />
  );
};
