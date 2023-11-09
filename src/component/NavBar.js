import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();
  return (
    <div>
      <Flex>
        <Button onClick={() => navigate("/")}>Home</Button>
        <Button onClick={() => navigate("/write")}>Write</Button>
      </Flex>
    </div>
  );
}