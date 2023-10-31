import React, { useState } from "react";
import { IMenu } from "../../interfaces";
import { BaseKey, useDelete } from "@refinedev/core";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import { API_URL } from "../../constants";
type MenuItem = {
  //   updateStock?: (changedValue: number, clickedProduct: IMenu) => void;
  menu: IMenu;
  show: (id: BaseKey) => void;
};
export const MenuItem: React.FC<MenuItem> = ({ menu, show }) => {
  const { mutate: mutateDelete } = useDelete();
  const { id, titre, description, image, prix } = menu;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",
      }}
    >
      <CardHeader
        action={
          <Box component="div">
            <IconButton
              aria-describedby={popoverId}
              onClick={handleClick}
              sx={{ marginRight: "10px", marginTop: "4px" }}
              aria-label="settings"
            >
              <MoreVert />
            </IconButton>
            <Popover
              id={popoverId}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Button
                onClick={() => {
                  show(id);
                  setAnchorEl(null);
                }}
                size="small"
                startIcon={<Edit />}
                sx={{
                  padding: "5px 10px",
                  color: "#4caf50",
                }}
              >
                Modifier menu
              </Button>
              <Button
                onClick={() => {
                  mutateDelete({
                    resource: "menus",
                    id: id,
                    mutationMode: "undoable",
                    undoableTimeout: 10000,
                  });
                }}
                size="small"
                startIcon={<Delete />}
                sx={{
                  padding: "5px 10px",
                }}
              >
                Supprimer menu
              </Button>
            </Popover>
          </Box>
        }
        sx={{ padding: 0 }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: { xs: 60, sm: 84, lg: 124, xl: 144 },
            height: { xs: 60, sm: 84, lg: 124, xl: 144 },
            borderRadius: "50%",
          }}
          alt={titre}
          //   image={image?.url}
          image={`${API_URL}${image?.url}`}
        />
      </Box>
      <CardContent
        sx={{
          paddingX: "36px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Divider />
        <Tooltip title={titre}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "18px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {titre}
          </Typography>
        </Tooltip>
        <Tooltip title={description}>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              overflowWrap: "break-word",
              color: "text.secondary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
              flex: 1,
            }}
          >
            {description}
          </Typography>
        </Tooltip>

        <Tooltip title={`${prix} DA`} placement="top">
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "24px",
              overflowWrap: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
            }}
          >{`${prix} DA`}</Typography>
        </Tooltip>
        {/* {updateStock && (
          <TextField
            type="number"
            margin="dense"
            size="small"
            value={product.stock || 0}
            onChange={(e) => {
              e.preventDefault();
              updateStock(parseInt(e.target.value, 10), product);
            }}
          />
        )} */}
      </CardContent>
    </Card>
  );
};
