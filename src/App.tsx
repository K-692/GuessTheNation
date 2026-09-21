import React from "react";
import "./App.scss";
import { HomePage } from "./screens/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import firebase from "firebase";
import "firebase/firestore";
import { GamePage } from "./screens/Game";
import { AddLocations } from "./screens/AddLocations";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAqoZ0vfJCotYvF2Vzn6wP0smSqcSRNjMs",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mapi-c1e47.firebaseapp.com",
  databaseURL:
    process.env.REACT_APP_FIREBASE_DATABASE_URL ||
    "https://mapi-c1e47-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mapi-c1e47",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mapi-c1e47.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "325914929273",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:325914929273:web:94ed448366e2445db38ca8",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-KLTLYCSS41",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
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
