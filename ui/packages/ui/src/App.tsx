import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import { ThemeMode } from './types';
import TopBar from './components/TopBar/TopBar';
import PeerPkgsStatus from './components/PeerPkgsStatus/PeerPkgsStatus';
import MainCard from './components/MainCard/MainCard';

function App(): JSX.Element {

  const [themeMode, setThemeMode] = React.useState<ThemeMode>(ThemeMode.LIGHT);

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: themeMode,
        },
      })}
    >
      <CssBaseline />
      <TopBar
        themeMode={themeMode}
        setThemeMode={setThemeMode}
      />

      <PeerPkgsStatus />

      <MainCard/>

    </ThemeProvider>
  );
}

export default App;
