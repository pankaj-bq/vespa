import React from "react";
import './App.css';
import TabView from "./components/TabView";
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import ReactDOM from 'react-dom/client';
//import App from 'App';

export default function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  const isAuthenticating = isLoading && !isAuthenticated;

  return (
    <div className="App">
      <header className="main-header">
        <div className="container">
          <div className="logo">
            <img src="logo4.png" width="150px" />
            <span>BQ Universe Search(v0.1)</span>
          </div>
          <div className="nav">
            {isAuthenticating ? (
              <div className="center">
                <div className="logo">
                  <img src="logo4.png" width="150px" />
                  <span>{process.env.REACT_APP_TITLE}</span>
                </div>
                <LoginButton />
              </div>
            ) : (
              <LogoutButton />
            )}
          </div>
        </div>
      </header>
      {!isAuthenticating && <TabView />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render();