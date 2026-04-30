import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
  AppBar,
  Box,
  IconButton,
  CssBaseline,
  FormControl,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import SidebarNav from "./SidebarNav";

const drawerWidth = 260;

const AppLayout = ({ t, appName, lang, setLang, page, setPage, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (nextPage) => {
    setPage(nextPage);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fb", overflowX: "hidden" }}>
      <CssBaseline />
      <SidebarNav
        t={t}
        appName={appName}
        page={page}
        setPage={handleNavigate}
        drawerWidth={drawerWidth}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "#ffffff",
            color: "#1f2937",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Toolbar sx={{ minHeight: 68 }}>
            {isMobile ? (
              <IconButton
                edge="start"
                sx={{ mr: 1.5 }}
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <MenuRoundedIcon />
              </IconButton>
            ) : null}
            <Box sx={{ flexGrow: 1, minWidth: 0, pr: 1 }}>
              <Typography
                variant="h6"
                noWrap
                sx={{ fontWeight: 700, fontSize: { xs: 18, md: 20 }, textOverflow: "ellipsis" }}
              >
                {appName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {t("subtitle")}
              </Typography>
            </Box>

            <FormControl size="small" sx={{ minWidth: { xs: 110, md: 150 } }}>
              <Select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label={t("language")}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">हिन्दी</MenuItem>
                <MenuItem value="mr">मराठी</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, maxWidth: 1200, mx: "auto", width: "100%" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
