import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ScatterPlotRoundedIcon from "@mui/icons-material/ScatterPlotRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { jsPDF } from "jspdf";
import { useMemo, useState } from "react";
import AppCard from "../components/ui/AppCard";
import FormNumberInput from "../components/ui/FormNumberInput";
import PrimaryButton from "../components/ui/PrimaryButton";

const ClientDetail = ({
  t,
  client,
  settings,
  onBack,
  onAddMaterial,
  onAddProduction,
  onAddDelivery,
}) => {
  const [deliveryQty, setDeliveryQty] = useState("");
  const [productionQty, setProductionQty] = useState("");
  const [suthQty, setSuthQty] = useState("");
  const [jariQty, setJariQty] = useState("");
  const [materialError, setMaterialError] = useState("");
  const [productionError, setProductionError] = useState("");
  const [deliveryError, setDeliveryError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showSaved, setShowSaved] = useState(false);

  const totalDelivered = useMemo(
    () => (client ? client.deliveries.reduce((sum, item) => sum + item.qty, 0) : 0),
    [client]
  );

  if (!client) {
    return (
      <Box>
        <PrimaryButton variant="text" startIcon={<ArrowBackRoundedIcon />} onClick={onBack}>
          {t("backToClients")}
        </PrimaryButton>
      </Box>
    );
  }

  const pending = Math.max(0, client.produced - totalDelivered);
  const suthPossible = settings.suthPerSareeG > 0 ? Math.floor((client.suthKg * 1000) / settings.suthPerSareeG) : 0;
  const jariPossible = settings.jariPerSareeG > 0 ? Math.floor(client.jariG / settings.jariPerSareeG) : 0;
  const possibleFromMaterial = Math.min(suthPossible, jariPossible);
  const today = new Date().toISOString().slice(0, 10);

  const handleAddMaterial = () => {
    const parsedSuthKg = Number(suthQty);
    const parsedJariKg = Number(jariQty);
    if (parsedSuthKg <= 0 || parsedJariKg <= 0) {
      setMaterialError(t("requiredNumber"));
      return;
    }
    setMaterialError("");
    onAddMaterial(client.id, parsedSuthKg, parsedJariKg);
    setSuthQty("");
    setJariQty("");
    setToastMessage(t("savedSuccess"));
    setShowSaved(true);
  };

  const handleAddProduction = () => {
    const parsedQty = Number(productionQty);
    if (parsedQty <= 0) {
      setProductionError(t("requiredNumber"));
      return;
    }
    const requiredSuthKg = (parsedQty * settings.suthPerSareeG) / 1000;
    const requiredJariG = parsedQty * settings.jariPerSareeG;
    if (requiredSuthKg > client.suthKg || requiredJariG > client.jariG) {
      setProductionError(t("insufficientMaterial"));
      return;
    }
    setProductionError("");
    onAddProduction(client.id, parsedQty);
    setProductionQty("");
    setToastMessage(t("savedSuccess"));
    setShowSaved(true);
  };

  const buildDeliveryPdf = (entry) => {
    const doc = new jsPDF();
    doc.setFontSize(17);
    doc.text(settings.firmName, 14, 18);
    doc.setFontSize(13);
    doc.text(t("invoicePreview"), 14, 28);
    doc.line(14, 33, 196, 33);
    const lines = [
      `${t("clientName")}: ${client.name}`,
      `${t("phoneNumber")}: ${client.phone}`,
      `${t("invoiceDate")}: ${entry.date}`,
      `${t("deliveredToday")}: ${entry.qty}`,
      `${t("totalDeliveredNow")}: ${entry.runningTotal}`,
      `${t("pendingNow")}: ${entry.pendingAtRow}`,
    ];
    doc.setFontSize(12);
    lines.forEach((line, index) => doc.text(line, 14, 45 + index * 9));
    return doc;
  };

  const getDeliveryFileName = (entry) =>
    `${client.name.replace(/\s+/g, "-").toLowerCase()}-delivery-${entry.date}.pdf`;

  const downloadDeliveryPdf = (entry) => {
    buildDeliveryPdf(entry).save(getDeliveryFileName(entry));
    setToastMessage(t("pdfReady"));
    setShowSaved(true);
  };

  const shareDeliveryPdf = (entry) => {
    downloadDeliveryPdf(entry);
    const whatsappMessage = [
      `${settings.firmName} - ${t("deliveryEntry")}`,
      `${t("clientName")}: ${client.name}`,
      `${t("invoiceDate")}: ${entry.date}`,
      `${t("sareesDelivered")}: ${entry.qty}`,
      `${t("pendingNow")}: ${entry.pendingAtRow}`,
      "",
      "Invoice PDF downloaded. Please attach the file from Downloads.",
    ].join("\n");
    window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`, "_blank", "noopener,noreferrer");
    setToastMessage(t("whatsappOpened"));
    setShowSaved(true);
  };

  const handleAddDelivery = () => {
    const parsedQty = Number(deliveryQty);
    if (parsedQty <= 0) {
      setDeliveryError(t("requiredNumber"));
      return;
    }
    setDeliveryError("");
    onAddDelivery(client.id, parsedQty);
    const updatedRunningTotal = totalDelivered + parsedQty;
    const newEntry = {
      date: today,
      qty: parsedQty,
      runningTotal: updatedRunningTotal,
      pendingAtRow: Math.max(0, client.produced - updatedRunningTotal),
    };
    downloadDeliveryPdf(newEntry);
    setDeliveryQty("");
  };

  let runningTotal = 0;
  const deliveryRows = client.deliveries.map((item) => {
    runningTotal += item.qty;
    return { ...item, runningTotal, pendingAtRow: Math.max(0, client.produced - runningTotal) };
  });
  const productionRows = (client.productionHistory || []).map((item) => ({
    ...item,
    suthUsedKg: (item.qty * settings.suthPerSareeG) / 1000,
    jariUsedG: item.qty * settings.jariPerSareeG,
  }));
  let runningProduction = 0;
  const productionHistoryRows = productionRows.map((item) => {
    runningProduction += item.qty;
    return { ...item, runningTotal: runningProduction };
  });
  const sortedProductionForMaterial = [...productionRows].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  let productionCursor = 0;
  let cumulativeSuthAddedKg = 0;
  let cumulativeJariAddedG = 0;
  let cumulativeSuthUsedKg = 0;
  let cumulativeJariUsedG = 0;
  const materialRows = (client.materialHistory || []).map((item) => {
    cumulativeSuthAddedKg += item.suthKg;
    cumulativeJariAddedG += item.jariG;
    while (
      productionCursor < sortedProductionForMaterial.length &&
      sortedProductionForMaterial[productionCursor].date <= item.date
    ) {
      cumulativeSuthUsedKg += sortedProductionForMaterial[productionCursor].suthUsedKg;
      cumulativeJariUsedG += sortedProductionForMaterial[productionCursor].jariUsedG;
      productionCursor += 1;
    }
    return {
      ...item,
      availableSuthKg: Math.max(0, cumulativeSuthAddedKg - cumulativeSuthUsedKg),
      availableJariG: Math.max(0, cumulativeJariAddedG - cumulativeJariUsedG),
    };
  });

  return (
    <Box>
      <PrimaryButton variant="text" color="inherit" sx={{ mb: 2 }} startIcon={<ArrowBackRoundedIcon />} onClick={onBack}>
        {t("backToClients")}
      </PrimaryButton>

      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, border: "1px solid #e5e7eb", mb: 0.75 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{client.name}</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1.25, flexWrap: "wrap", rowGap: 1 }}>
          <Chip label={`${t("phoneNumber")}: ${client.phone}`} sx={{ maxWidth: { xs: "100%", sm: "none" }, "& .MuiChip-label": { whiteSpace: "normal" } }} />
          <Chip label={`${t("availableSuthKg")}: ${client.suthKg.toFixed(3)}`} sx={{ maxWidth: { xs: "100%", sm: "none" }, "& .MuiChip-label": { whiteSpace: "normal" } }} />
          <Chip label={`${t("availableJariG")}: ${client.jariG}`} sx={{ maxWidth: { xs: "100%", sm: "none" }, "& .MuiChip-label": { whiteSpace: "normal" } }} />
          <Chip label={`${t("possibleSareesFromMaterial")}: ${possibleFromMaterial}`} sx={{ maxWidth: { xs: "100%", sm: "none" }, "& .MuiChip-label": { whiteSpace: "normal" } }} />
          <Chip label={`${t("pendingNow")}: ${pending}`} color="primary" sx={{ maxWidth: { xs: "100%", sm: "none" }, "& .MuiChip-label": { whiteSpace: "normal" } }} />
        </Stack>
      </Paper>

      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <AppCard title={t("totalDelivered")} value={totalDelivered} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <AppCard title={t("pendingHighlight")} value={pending} highlight />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <AppCard
            title={t("availableSuthKg")}
            value={client.suthKg.toFixed(3)}
            icon={<Inventory2RoundedIcon color="primary" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <AppCard
            title={t("availableJariG")}
            value={client.jariG}
            icon={<ScatterPlotRoundedIcon color="primary" />}
          />
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, border: "1px solid #e5e7eb", mb: 0.75 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{t("materialEntry")}</Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
          <Box sx={{ width: { xs: "100%", md: 260 } }}>
            <FormNumberInput label={t("suthReceivedKg")} value={suthQty} onChange={(e) => setSuthQty(e.target.value)} error={Boolean(materialError)} helperText={materialError} />
          </Box>
          <Box sx={{ width: { xs: "100%", md: 260 } }}>
            <FormNumberInput label={t("jariReceivedKg")} value={jariQty} onChange={(e) => setJariQty(e.target.value)} error={Boolean(materialError)} />
          </Box>
          <PrimaryButton onClick={handleAddMaterial}>{t("save")}</PrimaryButton>
        </Stack>
      </Paper>
      <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid #e5e7eb", mb: 1.5 }}>
        <Box sx={{ px: 2, py: 1.5 }}><Typography variant="h6">{t("materialHistory")}</Typography></Box>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 640 }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell>{t("date")}</TableCell><TableCell>{t("suthReceivedKg")}</TableCell><TableCell>{t("jariReceivedKg")}</TableCell><TableCell>{t("availableSuthKg")}</TableCell><TableCell>{t("availableJariG")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materialRows.length ? materialRows.map((row, index) => (
                <TableRow key={`${row.date}-mat-${index}`}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.suthKg.toFixed(3)}</TableCell>
                  <TableCell>{(row.jariG / 1000).toFixed(3)}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{row.availableSuthKg.toFixed(3)}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{Math.round(row.availableJariG)}</TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}><Typography color="text.secondary">{t("noDataYet")}</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, border: "1px solid #e5e7eb", mb: 0.75 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{t("productionEntry")}</Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
          <Box sx={{ width: { xs: "100%", md: 320 } }}>
            <FormNumberInput label={t("sareesProduced")} value={productionQty} onChange={(e) => setProductionQty(e.target.value)} error={Boolean(productionError)} helperText={productionError} />
          </Box>
          <PrimaryButton onClick={handleAddProduction}>{t("save")}</PrimaryButton>
        </Stack>
      </Paper>
      <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid #e5e7eb", mb: 1.5 }}>
        <Box sx={{ px: 2, py: 1.5 }}><Typography variant="h6">{t("productionHistory")}</Typography></Box>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 560 }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow><TableCell>{t("date")}</TableCell><TableCell>{t("sareesProduced")}</TableCell><TableCell>{t("runningTotal")}</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {productionHistoryRows.length ? productionHistoryRows.map((row, index) => (
                <TableRow key={`${row.date}-prod-${index}`}><TableCell>{row.date}</TableCell><TableCell>{row.qty}</TableCell><TableCell sx={{ fontWeight: 700 }}>{row.runningTotal}</TableCell></TableRow>
              )) : (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3 }}><Typography color="text.secondary">{t("noDataYet")}</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, border: "1px solid #e5e7eb", mb: 1.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{t("addDeliveryForClient")}</Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
          <Box sx={{ width: { xs: "100%", md: 320 } }}>
            <FormNumberInput label={t("sareesDelivered")} value={deliveryQty} onChange={(e) => setDeliveryQty(e.target.value)} error={Boolean(deliveryError)} helperText={deliveryError || `${t("pendingNow")}: ${pending}`} />
          </Box>
          <PrimaryButton onClick={handleAddDelivery}>{t("save")}</PrimaryButton>
        </Stack>
      </Paper>
      <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
        <Box sx={{ px: 2, py: 1.5 }}><Typography variant="h6">{t("deliveryHistory")}</Typography></Box>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 740 }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow><TableCell>{t("date")}</TableCell><TableCell>{t("sareesDelivered")}</TableCell><TableCell>{t("runningTotal")}</TableCell><TableCell>{t("pendingNow")}</TableCell><TableCell>{t("actions")}</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {deliveryRows.length ? deliveryRows.map((row, index) => (
                <TableRow key={`${row.date}-${index}`}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                  <TableCell>{row.runningTotal}</TableCell>
                  <TableCell sx={{ color: "#0f4db8", fontWeight: 700 }}>{row.pendingAtRow}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.75}>
                      <Button size="small" variant="outlined" startIcon={<DownloadRoundedIcon fontSize="small" />} onClick={() => downloadDeliveryPdf(row)}>{t("downloadPdf")}</Button>
                      <Button size="small" variant="outlined" startIcon={<ShareRoundedIcon fontSize="small" />} onClick={() => shareDeliveryPdf(row)}>{t("sharePdf")}</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}><Typography color="text.secondary">{t("noDeliveriesYet")}</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Snackbar open={showSaved} autoHideDuration={2500} onClose={() => setShowSaved(false)}>
        <Alert severity="success" variant="filled">{toastMessage || t("savedSuccess")}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientDetail;
