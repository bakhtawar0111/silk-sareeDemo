import { Card, CardContent, Typography } from "@mui/material";

const AppCard = ({ title, value, icon, highlight = false }) => {
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        minWidth: 0,
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        boxShadow: "0px 3px 10px rgba(15, 23, 42, 0.05)",
        bgcolor: highlight ? "#ecf4ff" : "#ffffff",
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 2, minWidth: 0 }}>
        {icon}
        <div style={{ minWidth: 0 }}>
          <Typography color="text.secondary" sx={{ fontSize: 13, wordBreak: "break-word" }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: { xs: 24, md: 26 }, fontWeight: 700 }}>
            {value}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppCard;
