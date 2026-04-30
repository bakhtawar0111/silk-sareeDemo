import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Alert,
  Box,
  Chip,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";

const getDeliveredTotal = (deliveries) =>
  deliveries.reduce((sum, item) => sum + item.qty, 0);
const getPending = (client) => Math.max(0, client.produced - getDeliveredTotal(client.deliveries));

const getLastDeliveryDate = (deliveries) =>
  deliveries.length ? deliveries[deliveries.length - 1].date : "-";

const Clients = ({ t, clients, onOpenClient, onAddClient }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showSaved, setShowSaved] = useState(false);

  const handleAddClient = () => {
    if (!name.trim()) {
      setNameError(t("clientNameRequired"));
      return;
    }
    if (phone && !/^\d{10,15}$/.test(phone)) {
      setPhoneError(t("invalidPhone"));
      return;
    }
    setNameError("");
    setPhoneError("");
    onAddClient(name.trim(), phone.trim());
    setName("");
    setPhone("");
    setShowSaved(true);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        {t("clientList")}
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, border: "1px solid #e5e7eb", mb: 1.5 }}
      >
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          {t("addClient")}
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
          <TextField
            label={t("clientName")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) {
                setNameError("");
              }
            }}
            error={Boolean(nameError)}
            helperText={nameError}
            sx={{ width: { xs: "100%", md: 320 } }}
          />
          <TextField
            label={t("phoneNumber")}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (phoneError) {
                setPhoneError("");
              }
            }}
            error={Boolean(phoneError)}
            helperText={phoneError}
            sx={{ width: { xs: "100%", md: 240 } }}
          />
          <PrimaryButton onClick={handleAddClient}>{t("addClient")}</PrimaryButton>
        </Stack>
      </Paper>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}
      >
        <Table sx={{ minWidth: 760 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell>{t("clientName")}</TableCell>
              <TableCell>{t("phoneNumber")}</TableCell>
              <TableCell>{t("totalSareesDelivered")}</TableCell>
              <TableCell>{t("pendingNow")}</TableCell>
              <TableCell>{t("lastDeliveryDate")}</TableCell>
              <TableCell align="right">{t("nextAction")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                hover
                onClick={() => onOpenClient(client.id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell sx={{ fontWeight: 600 }}>{client.name}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={getDeliveredTotal(client.deliveries)}
                    color="success"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ color: "#0f4db8", fontWeight: 700 }}>
                  {getPending(client)}
                </TableCell>
                <TableCell>{getLastDeliveryDate(client.deliveries)}</TableCell>
                <TableCell align="right">
                  <ArrowForwardRoundedIcon fontSize="small" color="action" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={showSaved} autoHideDuration={2500} onClose={() => setShowSaved(false)}>
        <Alert severity="success" variant="filled">
          {t("clientAdded")}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Clients;
