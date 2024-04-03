import {
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";

type PopularMenusCard = {
  title: string;
  img: string;
  value: number;
};

export const PopularMenusCard: React.FC<PopularMenusCard> = ({
  title,
  img,
  value,
}) => {
  return (
    <Tooltip title="Les Commandes Validées">
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          height: "100%",
          width: "100%",
          paddingInline: 2,
        }}
      >
        {/* <CardHeader title={title} /> */}
        <CardMedia
          component="img"
          sx={{
            width: 64,
            height: 64,
          }}
          alt={title}
          image={img}
        />
        <CardContent>
          <Typography
            sx={{
              fontWeight: 600,
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
              fontWeight: 400,
              fontSize: "16px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            Commandes : {value}
          </Typography>
        </CardContent>
      </Card>
    </Tooltip>
  );
};
