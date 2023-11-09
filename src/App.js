import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { BoardList } from "./page/BoardList";
import { BoardWrite } from "./page/BoardWrite";
import { HomeLayout } from "./layout/HomeLayout";
import { BoardView } from "./page/BoardView";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<BoardList />}></Route>
      <Route path="write" element={<BoardWrite />}></Route>
      <Route path="board/:id" element={<BoardView />}></Route>
    </Route>,
  ),
);
function App(props) {
  return <RouterProvider router={routes} />;
}

export default App;
