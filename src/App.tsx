import React from "react";
import "./App.scss";
import { HomePage } from "./screens/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import firebase from "firebase";
import "firebase/firestore";
import { GamePage } from "./screens/Game";
import { AddLocations } from "./screens/AddLocations";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "",
};

if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (error) {
    console.warn("[Firebase] Initialization skipped or offline:", error);
  }
}

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/play">
          <GamePage />
        </Route>
        <Route path="/add-location-220">
          <AddLocations />
        </Route>
        <Route path="/">
          <HomePage></HomePage>
        </Route>
      </Switch>
    </Router>
  );
};

function App() {
  return <div className="App">
    <Routes/>
  </div>;
}

export default App;
