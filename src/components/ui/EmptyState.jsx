import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import { Box, Typography } from "@mui/material";

const EmptyState = ({ title, description }) => {
  return (
    <Box
      sx={{
        p: 4,
        border: "1px dashed #cbd5e1",
        borderRadius: 3,
        bgcolor: "#ffffff",
        textAlign: "center",
      }}
    >
      <InboxRoundedIcon sx={{ fontSize: 34, color: "#94a3b8", mb: 1 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Box>
  );
};

export default EmptyState;
