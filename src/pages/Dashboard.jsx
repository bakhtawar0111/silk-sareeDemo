import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import ProductionQuantityLimitsRoundedIcon from "@mui/icons-material/ProductionQuantityLimitsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AppCard from "../components/ui/AppCard";
import EmptyState from "../components/ui/EmptyState";

const getDelivered = (client) =>
  client.deliveries.reduce((sum, item) => sum + item.qty, 0);

const Dashboard = ({ t, clients, onOpenClient }) => {
  const totalProduced = clients.reduce((sum, client) => sum + client.produced, 0);
  const totalDelivered = clients.reduce((sum, client) => sum + getDelivered(client), 0);
  const pending = Math.max(0, totalProduced - totalDelivered);
  const hasData = clients.length > 0;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        {t("dashboard")}
      </Typography>

      {!hasData ? (
        <EmptyState title={t("noDataYet")} description={t("noDataHelp")} />
      ) : (
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <AppCard
              title={t("totalProduced")}
              value={totalProduced}
              icon={<ProductionQuantityLimitsRoundedIcon color="primary" />}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <AppCard
              title={t("totalDelivered")}
              value={totalDelivered}
              icon={<CheckCircleRoundedIcon color="success" />}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <AppCard
              title={t("pendingHighlight")}
              value={pending}
              highlight
              icon={<PendingActionsRoundedIcon sx={{ color: "#0f4db8" }} />}
            />
          </Grid>
        </Grid>
      )}

      <Paper
        elevation={0}
        sx={{ mt: 2, borderRadius: 2, border: "1px solid #e5e7eb", overflow: "hidden" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t("clientList")}
          </Typography>
        </Box>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 680 }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell>{t("clientName")}</TableCell>
                <TableCell>{t("phoneNumber")}</TableCell>
                <TableCell>{t("totalDelivered")}</TableCell>
                <TableCell>{t("pendingNow")}</TableCell>
                <TableCell align="right">{t("nextAction")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => {
                const delivered = getDelivered(client);
                const pendingForClient = Math.max(0, client.produced - delivered);
                return (
                  <TableRow
                    key={client.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => onOpenClient(client.id)}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{client.name}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <Chip label={delivered} color="success" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ color: "#0f4db8", fontWeight: 700 }}>
                      {pendingForClient}
                    </TableCell>
                    <TableCell align="right">
                      <ArrowForwardRoundedIcon fontSize="small" color="action" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;