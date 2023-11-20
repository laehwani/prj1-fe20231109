import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function NavBar() {
  const navigate = useNavigate();

  function handleLogout() {
    axios
    .post("/api/member/logout")
    .then(() => console.log('로그아웃 성공'))

  }

  return (<div>
        <Flex>
          <Button onClick={() => navigate("/")}>Home</Button>
          <Button onClick={() => navigate("/write")}>Write</Button>
          <Button onClick={() => navigate("/signup")}>SignUp</Button>
          <Button onClick={() => navigate("/member/list")}>MemberList</Button>
          <Button onClick={() => navigate("/login")}>로그인</Button>
          <Button onClick={handleLogout}>로그아웃</Button>
        </Flex>
      </div>);
}
