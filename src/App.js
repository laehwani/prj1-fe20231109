import React from "react";
import {
  createBrowserRouter, createRoutesFromElements, Route, RouterProvider,
} from "react-router-dom";
import {HomeLayout} from "./layout/HomeLayout";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      {/*<Route index element={<BoardList />}></Route>*/}
      {/*<Route path="write" element={<BoardWrite />}></Route>*/}
      {/*<Route path="board/:id" element={<BoardView />}></Route>*/}
    </Route>,
  ),
);
function App(props) {
  return <RouterProvider router={routes} />;
}
// 노트

export default App;
