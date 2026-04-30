import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

const navItems = [
  { key: "dashboard", icon: DashboardRoundedIcon },
  { key: "clients", icon: PeopleAltRoundedIcon },
  { key: "settings", icon: SettingsRoundedIcon },
];

const SidebarNav = ({
  t,
  appName,
  page,
  setPage,
  drawerWidth,
  isMobile,
  mobileOpen,
  onClose,
}) => {
  const drawerContent = (
    <>
      <Box sx={{ px: 2.5, py: 2.25 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
          {appName}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ p: 1.25 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = page === item.key || (item.key === "clients" && page === "clientDetail");
          return (
            <ListItemButton
              key={item.key}
              selected={selected}
              onClick={() => setPage(item.key)}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                py: 0.95,
                "&.Mui-selected": {
                  bgcolor: "#eaf2ff",
                  color: "#0f4db8",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 34,
                  color: selected ? "#0f4db8" : "#6b7280",
                }}
              >
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t(item.key)} />
            </ListItemButton>
          );
        })}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #e5e7eb",
          bgcolor: "#ffffff",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SidebarNav;
