import { Alert, Box, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PrimaryButton from "../components/ui/PrimaryButton";

const Settings = ({ t, settings, onSaveSettings }) => {
  const [form, setForm] = useState(settings);
  const [error, setError] = useState("");
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = () => {
    if (!form.firmName.trim()) {
      setError(t("firmNameRequired"));
      return;
    }
    if (Number(form.suthPerSareeG) <= 0 || Number(form.jariPerSareeG) <= 0) {
      setError(t("requiredNumber"));
      return;
    }
    setError("");
    onSaveSettings({
      ...form,
      firmName: form.firmName.trim(),
      suthPerSareeG: Number(form.suthPerSareeG),
      jariPerSareeG: Number(form.jariPerSareeG),
    });
    setShowSaved(true);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        {t("settingsTitle")}
      </Typography>
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, border: "1px solid #e5e7eb" }}>
        <Stack spacing={1.5}>
          <TextField
            label={t("firmName")}
            value={form.firmName}
            onChange={(e) => setForm((prev) => ({ ...prev, firmName: e.target.value }))}
            error={Boolean(error)}
            helperText={error}
          />
          <TextField
            label={t("establishedOn")}
            type="date"
            value={form.establishedOn}
            onChange={(e) => setForm((prev) => ({ ...prev, establishedOn: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              label={t("suthPerSareeG")}
              type="number"
              value={form.suthPerSareeG}
              onChange={(e) => setForm((prev) => ({ ...prev, suthPerSareeG: e.target.value }))}
              fullWidth
              inputProps={{ min: 0 }}
            />
            <TextField
              label={t("jariPerSareeG")}
              type="number"
              value={form.jariPerSareeG}
              onChange={(e) => setForm((prev) => ({ ...prev, jariPerSareeG: e.target.value }))}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Stack>
          <PrimaryButton onClick={handleSave}>{t("saveSettings")}</PrimaryButton>
        </Stack>
      </Paper>
      <Snackbar open={showSaved} autoHideDuration={2500} onClose={() => setShowSaved(false)}>
        <Alert severity="success" variant="filled">
          {t("settingsSaved")}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
