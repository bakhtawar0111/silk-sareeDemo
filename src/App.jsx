import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMemo, useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Settings from "./pages/Settings";
import { translations } from "./i18n/translations";

function App() {
  const [page, setPage] = useState("dashboard");
  const [lang, setLang] = useState("en");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [settings, setSettings] = useState({
    firmName: "Silk Saree Tracker",
    establishedOn: "2020-01-01",
    suthPerSareeG: 120,
    jariPerSareeG: 45,
  });
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Shree Textiles",
      phone: "9876543210",
      suthKg: 38,
      jariG: 24000,
      produced: 33,
      materialHistory: [{ date: "2026-04-05", suthKg: 38, jariG: 24000 }],
      productionHistory: [{ date: "2026-04-09", qty: 33 }],
      deliveries: [
        { date: "2026-04-10", qty: 8 },
        { date: "2026-04-18", qty: 7 },
      ],
    },
    {
      id: 2,
      name: "Mahalaxmi Saree Center",
      phone: "9988776655",
      suthKg: 28,
      jariG: 20000,
      produced: 32,
      materialHistory: [{ date: "2026-04-12", suthKg: 28, jariG: 20000 }],
      productionHistory: [{ date: "2026-04-20", qty: 32 }],
      deliveries: [{ date: "2026-04-22", qty: 10 }],
    },
  ]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    if (nextPage !== "clientDetail") {
      setSelectedClientId(null);
    }
  };

  const openClientDetail = (clientId) => {
    setSelectedClientId(clientId);
    setPage("clientDetail");
  };

  const addClientMaterial = (clientId, suthKgQty, jariKgQty) => {
    const today = new Date().toISOString().slice(0, 10);
    const jariGQty = Math.round(jariKgQty * 1000);
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? {
              ...client,
              suthKg: client.suthKg + suthKgQty,
              jariG: client.jariG + jariGQty,
              materialHistory: [
                ...(client.materialHistory || []),
                { date: today, suthKg: suthKgQty, jariG: jariGQty },
              ],
            }
          : client
      )
    );
  };

  const addClientProduction = (clientId, qty) => {
    const today = new Date().toISOString().slice(0, 10);
    const requiredSuthKg = (qty * settings.suthPerSareeG) / 1000;
    const requiredJariG = qty * settings.jariPerSareeG;
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? {
              ...client,
              suthKg: Number(Math.max(0, client.suthKg - requiredSuthKg).toFixed(3)),
              jariG: Math.max(0, client.jariG - requiredJariG),
              produced: client.produced + qty,
              productionHistory: [...(client.productionHistory || []), { date: today, qty }],
            }
          : client
      )
    );
  };

  const addClientDelivery = (clientId, qty) => {
    const today = new Date().toISOString().slice(0, 10);
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? {
              ...client,
              deliveries: [...client.deliveries, { date: today, qty }],
            }
          : client
      )
    );
  };

  const addClient = (name, phone) => {
    setClients((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((client) => client.id)) + 1 : 1;
      return [
        ...prev,
        {
          id: nextId,
          name,
          phone,
          suthKg: 0,
          jariG: 0,
          produced: 0,
          materialHistory: [],
          productionHistory: [],
          deliveries: [],
        },
      ];
    });
  };

  const t = (key) => translations[lang][key];
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: { main: "#1d4ed8" },
          background: { default: "#f5f7fb", paper: "#ffffff" },
          text: { primary: "#111827", secondary: "#6b7280" },
        },
        typography: {
          fontFamily: ["Inter", "Segoe UI", "Roboto", "Arial", "sans-serif"].join(","),
          h5: { fontWeight: 700, fontSize: 26 },
          h6: { fontWeight: 700, fontSize: 19 },
          body1: { fontSize: 16 },
          button: { fontSize: 15 },
        },
        shape: { borderRadius: 8 },
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <AppLayout
        t={t}
        appName={settings.firmName}
        lang={lang}
        setLang={setLang}
        page={page}
        setPage={handlePageChange}
      >
        {page === "dashboard" && (
          <Dashboard t={t} clients={clients} onOpenClient={openClientDetail} />
        )}
        {page === "clients" && (
          <Clients
            t={t}
            clients={clients}
            onOpenClient={openClientDetail}
            onAddClient={addClient}
          />
        )}
        {page === "clientDetail" && (
          <ClientDetail
            t={t}
            client={clients.find((item) => item.id === selectedClientId)}
            settings={settings}
            onBack={() => handlePageChange("clients")}
            onAddMaterial={addClientMaterial}
            onAddProduction={addClientProduction}
            onAddDelivery={addClientDelivery}
          />
        )}
        {page === "settings" && (
          <Settings t={t} settings={settings} onSaveSettings={setSettings} />
        )}
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;