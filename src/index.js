// scroll bar
import "simplebar/src/simplebar.css";

import React from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <HelmetProvider>
    <App />
  </HelmetProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
