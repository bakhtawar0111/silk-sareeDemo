import { Alert, Box, Snackbar, Stack, Typography } from "@mui/material";
import { useState } from "react";
import FormNumberInput from "../components/ui/FormNumberInput";
import PrimaryButton from "../components/ui/PrimaryButton";

const Material = ({ t }) => {
  const [suth, setSuth] = useState("");
  const [jari, setJari] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (Number(suth) <= 0 || Number(jari) <= 0) {
      setError(t("requiredNumber"));
      return;
    }
    setError("");
    setShowSuccess(true);
    setSuth("");
    setJari("");
  };

  return (
    <Box sx={{ maxWidth: 760 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {t("materialEntry")}
      </Typography>
      <Stack spacing={2.5}>
        <FormNumberInput
          label={t("suthLabel")}
        value={suth}
        onChange={(e) => setSuth(e.target.value)}
          error={Boolean(error)}
          helperText={error}
        />
        <FormNumberInput
          label={t("jariLabel")}
        value={jari}
        onChange={(e) => setJari(e.target.value)}
          error={Boolean(error)}
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

export default Material;