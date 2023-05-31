import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApiUrl, HttpError, useShow, useOne, useCustom } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { Show, useAutocomplete } from "@refinedev/mui";

import Drawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import Input from "@mui/material/Input";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { IOrder } from "../../interfaces";
import { useParams } from "react-router-dom";
import { API_URL } from "../../constants";
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Divider } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
interface ShowOrderProps {
  id: number | null; 
}
export const ShowOrder: React.FC<
  UseModalFormReturnType<IOrder, HttpError, IOrder> & ShowOrderProps
> = ({ modal: { visible, close }, id }) => {

  //


  const [record, setRecord] = useState<IOrder | null>(null);
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`${API_URL}/api/commandes/${id}?populate=*`);
        const data = await response.json();
        console.log(data?.data.attributes)
        setRecord(data?.data.attributes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecord();
  }, [id]);

  //

  // 
  return (
    <Drawer
      sx={{ zIndex: "1301" }}
      PaperProps={{ sx: { width: { sm: "100%", md: 500 } } }}
      open={visible}
      onClose={close}
      anchor="right"
    >
      <Show
        headerProps={{
          avatar: (
            <IconButton
              onClick={() => close()}
              sx={{
                width: "30px",
                height: "30px",
                mb: "5px",
              }}
            >
              <CloseOutlined />
            </IconButton>
          ),
          action: null,
        }}
        wrapperProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
      >
        <Stack>
          <Box
            paddingX="50px"
            justifyContent="center"
            alignItems="center"
            sx={{
              paddingX: {
                xs: 1,
                md: 6,
              },
            }}
          >
            <Stack direction='row' justifyContent='space-between'>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
             textTransform:"uppercase",
                  textOverflow: "ellipsis",
                }}
              >
                Commande:  {record?.code}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  textOverflow: "ellipsis",
                  color:"#ff9800"
                }}
              >
                {record?.type}
              </Typography>
              
            </Stack>
              <Divider/>
              {/* <Stack>
                {record?.menus?.map((item)=>(
                    <>
                    <Card
                      key={item.id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        height: "100%",
                        width: "100%",
                        padding: 1,
                      }}
                    >
                      <CardHeader
                        sx={{ padding: 0, mt: 1 }}
                        
                        
                      />
                      <Stack direction="row" sx={{ gap: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CardMedia
                            component="img"
                            sx={{
                              width: { xs: 60, sm: 60, lg: 80, xl: 144 },
                              height: { xs: 60, sm: 60, lg: 80, xl: 144 },
                              borderRadius: "50%",
                            }}
                            alt={item.menus.titre}
                            //   image={image?.url}
                            image={`${API_URL}${item.menus.image?.url}`}
                          />
                        </Box>
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                        />
                        <Box>
                          <CardContent
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              flex: 1,
                              padding: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: "16px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.menus.titre} {""}
                              {""}
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  marginLeft: 10,
                                }}
                              >
                                x{item?.quantity}
                              </span>
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "16px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                             
                            </Typography>
                          </CardContent>
                         
                        </Box>
                      </Stack>
                    </Card>
                  </>
                ))}
              </Stack> */}
          </Box>
        </Stack>
      </Show>
    </Drawer>
  );
};
