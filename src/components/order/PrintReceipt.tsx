import { Box, Dialog } from "@mui/material";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { IMenu } from "../../interfaces";

interface PrintReceiptProps extends UseModalFormReturnType {
  menus?: IMenu[];
}

export const PrintReceipt: React.FC<PrintReceiptProps> = ({
  modal: { visible, close },
  menus,
}) => {
  const componentRef = useRef(null);

  // Function to trigger printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
console.log(menus)
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { minWidth: 500 } }}
      sx={{ zIndex: "1302" }}
    >
      <Box ref={componentRef} sx={{ width: "100%", color: "#000" }}>
        <h1>Print me!</h1>
        <p>This is the content that will be printed.</p>
        {/* Render the menus if available */}
        {menus && (
          <ul>
            {menus.map((menu) => (
              <li key={menu.id}>{menu.quantite}</li>
            ))}
          </ul>
        )}
      </Box>
      {/* <button
        onClick={() => {
          handlePrint();
        }}
      >
        Print
      </button> */}
       <button onClick={handlePrint}>Print</button>
    </Dialog>
  );
};
