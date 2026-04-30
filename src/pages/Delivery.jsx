import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import FormNumberInput from "../components/ui/FormNumberInput";
import PrimaryButton from "../components/ui/PrimaryButton";

const Delivery = ({ setData, data, t }) => {
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [lastDelivered, setLastDelivered] = useState(0);

  const pending = useMemo(() => data.produced - data.delivered, [data]);

  const handleSave = () => {
    if (Number(qty) <= 0) {
      setError(t("requiredNumber"));
      return;
    }
    if (Number(qty) > pending) {
      setError(t("deliveryExceeds"));
      return;
    }
    setError("");
    const newQty = Number(qty);
    setData({
      ...data,
      delivered: data.delivered + newQty,
    });
    setLastDelivered(newQty);
    setShowSuccess(true);
    setActionModalOpen(true);
    setQty("");
  };

  return (
    <Box sx={{ maxWidth: 860 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {t("deliveryEntry")}
      </Typography>
      <Stack spacing={2.5}>
        <FormNumberInput
          label={t("sareesDelivered")}
        value={qty}
        onChange={(e) => setQty(e.target.value)}
          error={Boolean(error)}
          helperText={error || `${t("pendingNow")}: ${pending}`}
        />
        <PrimaryButton onClick={handleSave}>{t("save")}</PrimaryButton>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {t("invoicePreview")}
        </Typography>
        <Stack spacing={1.5}>
          <Typography>
            <strong>{t("businessName")}:</strong> Silk Saree Manufacturing
          </Typography>
          <Typography>
            <strong>{t("clientName")}:</strong> Shree Textiles
          </Typography>
          <Typography>
            <strong>{t("invoiceDate")}:</strong> {new Date().toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>{t("deliveredToday")}:</strong> {lastDelivered}
          </Typography>
          <Typography>
            <strong>{t("totalDeliveredNow")}:</strong> {data.delivered}
          </Typography>
          <Typography sx={{ color: "#0f4db8", fontWeight: 700 }}>
            <strong>{t("pendingNow")}:</strong> {pending}
          </Typography>
        </Stack>
      </Paper>

      <Dialog open={actionModalOpen} onClose={() => setActionModalOpen(false)}>
        <DialogTitle>{t("postDeliveryTitle")}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">{t("postDeliveryHelp")}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <PrimaryButton onClick={() => setActionModalOpen(false)}>
            {t("generateInvoice")}
          </PrimaryButton>
          <PrimaryButton
            color="success"
            onClick={() => setActionModalOpen(false)}
          >
            {t("sendWhatsapp")}
          </PrimaryButton>
          <PrimaryButton
            color="inherit"
            variant="outlined"
            onClick={() => setActionModalOpen(false)}
          >
            {t("close")}
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2500}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" variant="filled">
          {t("savedSuccess")}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Delivery;