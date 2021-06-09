import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import MainApp from "./routes";
import { GlobalProvider } from "./context";
import { CssBaseline } from "@material-ui/core";
import theme from "./theme";
import AppAlert from "./App.Alert";

import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// const theme = createMuiTheme({
//   typography: {
//     fontFamily: [

//       'Roboto'

//     ].join(','),
//   },
// });
function App() {
  return (
    <GlobalProvider>
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <CssBaseline />
          <Router>
            <AppAlert>
              <MainApp />
            </AppAlert>
          </Router>
        </div>
      </MuiThemeProvider>
    </GlobalProvider>
  );
}

export default App;
