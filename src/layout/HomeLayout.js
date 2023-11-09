import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import React from "react";
import { NavBar } from "../component/NavBar";

export function HomeLayout() {
  return (
    <div>
      <Box>
        <NavBar />
        <Outlet />
      </Box>
    </div>
  );
}
