import React from "react";
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

const routes = createBrowserRouter(
    createRoutesFromElements(<Route path="/" element={<HomeLayout/>}>
      <Route index element={<BoardList/>}></Route>
      <Route path="write" element={<BoardWrite/>}></Route>
      <Route path="board/:id" element={<BoardView/>}></Route>
      <Route path="edit/:id" element={<BoardEdit/>}></Route>
      <Route path="signup" element={<MemberSignup/>}></Route>
      <Route path="member/list" element={<MemberList/>}></Route>
      <Route path="member" element={<MemberView/>}></Route>
    </Route>,),);
function App(props) {
  return <RouterProvider router={routes} />;
}
// 노트

export default App;
