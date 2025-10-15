import React from "react";
import Button from "@mui/material/Button";

const CustomButton = ({ variant = "primary", size = "medium", children, ...props }) => {
  const getVariant = () => {
    switch (variant) {
      case "primary":
        return "contained"
      case "secondary":
        return "outlined";
      case "disabled":
        return "contained";
      default:
        return "contained";
    }
  };

  const getColor = () => {
    switch (variant) {
      case "primary":
        return "primary";
      case "secondary":
        return "secondary";
      default:
        return "primary";
    }
  };


  return (
    <Button
      variant={getVariant()}
      color={getColor()}
      size={size}
      disabled={variant === "disabled"}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
