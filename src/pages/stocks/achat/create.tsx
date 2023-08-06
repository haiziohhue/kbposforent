import { Dialog, Typography } from "@mui/material";
import { HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { IAchat } from "interfaces";
import React from "react";

export const CreateAchat: React.FC<
  UseModalFormReturnType<IAchat, HttpError, IAchat>
> = ({
  saveButtonProps,
  control,
  modal: { visible, close },
  register,
  setValue,
  refineCore: { onFinish },
  handleSubmit,
  formState: { errors },
}) => {
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { width: "100%", height: "800px" } }}
    >
      <Typography>Abla</Typography>
    </Dialog>
  );
};
