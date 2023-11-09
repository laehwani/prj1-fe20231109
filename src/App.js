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
import { AccordionProvider } from "@chakra-ui/react";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<BoardList />}></Route>
      <Route path="write" element={<BoardWrite />}></Route>
    </Route>,
  ),
);
function App(props) {
  return <RouterProvider router={routes} />;
}

export default App;
