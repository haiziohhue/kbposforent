import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';

type OrderStatusProps = {
  status?: 'Validé' | 'En cours' | 'Annulé';
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  let color: ChipProps['color'];

  switch (status) {
    case 'En cours':
      color = 'warning';
      break;
    case 'Validé':
      color = 'success';
      break;
    case 'Annulé':
      color = 'primary';
      break;
  }

  return (
    <Chip variant="filled" size="small" color={color} label={`${status}`} />
  );
};
