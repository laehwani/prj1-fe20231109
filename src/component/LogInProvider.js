import React, {createContext, useEffect, useState} from 'react';
import axios from "axios";

export const LoginContext = createContext(null);

function LogInProvider({children}) {
  const [login, setLogin] = useState("");

  function fetchLogin() {
    axios
    .get("/api/member/login")
    .then(r => setLogin(r.data));
  }
  function isAuthenticated() {
    return login !== "";
  }

  function isAdmin() {
    if (login.auth) {
      return login.auth.some((elem) => elem.name === "admin");
    }
    return false;
  }
  // function isManager() {
  //   login.auth.some((elem) => elem.name === "manager")
  // }
  // TODO: 선생님은 안하시기에 나중에 꺼내씀.

  function hasAccess(userId) {
    return login.id === userId;
  }
  useEffect(() => {
    fetchLogin()
  }, []);

  console.log(login);

  return <LoginContext.Provider
      value={{login, fetchLogin, isAuthenticated, hasAccess, isAdmin}}>
    {children}
  </LoginContext.Provider>;
}

export default LogInProvider;