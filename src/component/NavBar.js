import {Button, Flex, useToast} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useContext} from "react";
import {LoginContext} from "../App";

export function NavBar() {

  // TODO: 아래 작업들을 계속 하는 이유는 세션은 서버에 있고, 바깥에 있는 클라이언트가
  //  로그인에 있는 정보들을 받아와야 하기 때문이다. 이런면에선 jsp 가 훨씬 편리하다.

  const {fetchLogin, login, isAuthenticated} = useContext(LoginContext)
  const navigate = useNavigate();
  const toast = useToast();

  function handleLogout() {
    axios
    .post("/api/member/logout")
    .then(() => {
      toast({
        description: '로그아웃 되었습니다.',
        status: 'info'
      });
      navigate("/");
    })
    .finally(()=> fetchLogin());
  }

  return (<div>
    <Flex>
      <Button onClick={() => navigate("/")}>Home</Button>
      {isAuthenticated() &&
          (<Button onClick={() => navigate("/write")}>Write</Button>)}
      {isAuthenticated() ||
          (<Button onClick={() => navigate("/signup")}>SignUp</Button>)}
      {isAuthenticated() && (
          <Button onClick={() => navigate("/member/list")}>MemberList</Button>)}
      {isAuthenticated() ||
          (<Button onClick={() => navigate("/login")}>로그인</Button>)}
      {isAuthenticated() && (<Button onClick={handleLogout}>로그아웃</Button>)}

    </Flex>
  </div>);
}
