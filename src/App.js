import React, {createContext, useEffect, useState} from "react";
import {
  createBrowserRouter, createRoutesFromElements, Route, RouterProvider,
} from "react-router-dom";
import {BoardList} from "./page/board/BoardList";
import {BoardWrite} from "./page/board/BoardWrite";
import {HomeLayout} from "./layout/HomeLayout";
import {BoardView} from "./page/board/BoardView";
import {BoardEdit} from "./page/board/BoardEdit";
import {MemberSignup} from "./page/member/MemberSignup";
import {MemberList} from "./page/member/MemberList";
import {MemberView} from "./page/member/MemberView";
import {MemberEdit} from "./page/member/MemberEdit";
import {MemberLogin} from "./page/member/MemberLogin";
import axios from "axios";

const routes = createBrowserRouter(
    createRoutesFromElements(<Route path="/" element={<HomeLayout/>}>
      <Route index element={<BoardList/>}></Route>
      <Route path="write" element={<BoardWrite/>}></Route>
      <Route path="board/:id" element={<BoardView/>}></Route>
      <Route path="edit/:id" element={<BoardEdit/>}></Route>
      <Route path="signup" element={<MemberSignup/>}></Route>
      <Route path="member/list" element={<MemberList/>}></Route>
      <Route path="member" element={<MemberView/>}></Route>
      <Route path="member/edit" element={<MemberEdit/>}></Route>
      <Route path="login" element={<MemberLogin/>}></Route>

    </Route>,),);

export const LoginContext = createContext(null);
function App(props) {

  const [login, setLogin] = useState("");

  function fetchLogin() {
    axios
    .get("/api/member/login")
    .then(r => setLogin(r.data));
  }
  function isAuthenticated() {
    return login !== "";
  }
  function hasAccess(userId) {
    return login.id === userId;
  }
  useEffect(() => {
    fetchLogin()
  }, []);


  return (
  < LoginContext.Provider value={{login, fetchLogin, isAuthenticated, hasAccess}}>
    <RouterProvider router={routes}/>;
  </LoginContext.Provider>);
}
// 노트

export default App;
