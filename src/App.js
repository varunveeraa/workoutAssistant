import React, { useState } from "react";
import "./App.css";
import Header from "./components/header/header";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import CounterPage from "./pages/CounterPage";
import DoubleBicepCurl from "./components/doubleBicepCurl";

import Auth from "./pages/auth";
import SignIn from "./components/auth/signIn";
import SignUp from "./components/auth/signUp";
import AuthDetails from "./components/authDetails";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <div>
        <Header />
      </div>
      <Route
        path="/"
        exact
        render={() =>
          isAuthenticated ? <Redirect to="/home" /> : <Redirect to="/auth" />
        }
      />
      <Route path="/counter" component={CounterPage} />
      <Route path="/doubleBicepCurls">
        <DoubleBicepCurl />
      </Route>
      <Route path="/auth">
        <Auth handleAuthSuccess={handleAuthSuccess} />
      </Route>
      <Route path="/home">
        {isAuthenticated ? <Home /> : <Redirect to="/auth" />}
      </Route>
    </BrowserRouter>
  );
}

export default App;
