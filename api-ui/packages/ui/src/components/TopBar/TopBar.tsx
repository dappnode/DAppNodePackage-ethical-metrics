import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { ThemeMode } from "../../types";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function TopBar({
  themeMode,
  setThemeMode,
}: {
    themeMode: ThemeMode;
    setThemeMode: React.Dispatch<React.SetStateAction<ThemeMode>>;
}): JSX.Element {
  return (
    <AppBar position="sticky">
<Toolbar>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          lineHeight: "50px",
        }}
      >
        <img src="/assets/dappnode_logo.png" alt="logo" height={50} />
        <Typography
            variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", ml: 1 }}
        >
            Ethical Metrics
        </Typography>
      </div>
      <div style={{ marginLeft: "auto" }}>
        <Box
          sx={{
            padding: 0.5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{ ml: 1 }}
            onClick={() => setThemeMode(themeMode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK)}
            color="inherit"
          >
            {themeMode === ThemeMode.DARK ? (
              <LightModeIcon titleAccess="Set Light Mode" />
            ) : (
              <DarkModeIcon titleAccess="Set Dark Mode" />
            )}
          </IconButton>
        </Box>
      </div>
    </Toolbar>
    </AppBar>
  );
}
