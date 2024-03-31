import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";

type AnalyticCard = {
  title: string;
  img: string;
  value: number;
  color: string;
};

export const AnalyticsCard: React.FC<AnalyticCard> = ({
  title,
  img,
  value,
  color,
}) => {
  return (
    <Tooltip title="Les Commandes Validées">
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: color,
          height: "100%",
          width: { xs: "100%", md: 260 },
          paddingInline: 2,
        }}
      >
        {/* <CardHeader title={title} /> */}
        <CardMedia
          component="img"
          sx={{
            width: 48,
            height: 48,
          }}
          alt={title}
          image={img}
        />
        <CardContent>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "18px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              borderRadius: 2,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "18px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Tooltip>
  );
};
