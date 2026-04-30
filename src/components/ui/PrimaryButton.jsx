import { Button } from "@mui/material";

const PrimaryButton = ({ children, variant = "contained", sx, ...props }) => {
  const isContained = variant === "contained";

  return (
    <Button
      variant={variant}
      size="medium"
      disableElevation
      sx={[
        {
          borderRadius: 1.25,
          px: 2,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          whiteSpace: "nowrap",
          minWidth: 92,
        },
        isContained
          ? {
              height: 45,
            }
          : {},
        sx,
      ]}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
