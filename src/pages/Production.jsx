import { Alert, Box, Snackbar, Stack, Typography } from "@mui/material";
import { useState } from "react";
import FormNumberInput from "../components/ui/FormNumberInput";
import PrimaryButton from "../components/ui/PrimaryButton";

const Production = ({ setData, data, t }) => {
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (Number(qty) <= 0) {
      setError(t("requiredNumber"));
      return;
    }
    setError("");
    setData({
      ...data,
      produced: data.produced + Number(qty),
    });
    setQty("");
    setShowSuccess(true);
  };

  return (
    <Box sx={{ maxWidth: 760 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {t("productionEntry")}
      </Typography>
      <Stack spacing={2.5}>
        <FormNumberInput
          label={t("sareesProduced")}
        value={qty}
        onChange={(e) => setQty(e.target.value)}
          error={Boolean(error)}
          helperText={error}
        />

        <PrimaryButton onClick={handleSave}>{t("save")}</PrimaryButton>
      </Stack>
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

export default Production;