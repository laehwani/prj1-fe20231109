import {
  Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input
} from "@chakra-ui/react";
import React, {useState} from "react";
import axios from "axios";

export function MemberSignup() {

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");

  const [idAvailable, setIdAvailable] = useState(false);

// 아무것도 기입안된 처음 로그인 상태에선 가입버튼을 비활성화시켜보자
  let submitAvailable = true;
  if (!idAvailable) {
    submitAvailable = false;
  }
  if (password !== passwordCheck) {
    submitAvailable = false;
  }
  if (password.length === 0) {
    submitAvailable = false;
  }

  function handleSubmit() {
    axios
    .post("/api/member/signup", {
      id, password, email,
    })
    .then(() => console.log("good"))
    .catch(() => console.log('bad'))
    .finally(
        () => console.log('done'));

  };

  function handleIdCheck() {
    const searchParam = new URLSearchParams();
    searchParam.set("id", id);

    axios
    .get("/api/member/check?" + searchParam.toString())
    .then(()=> {
      setIdAvailable(false);
    })
    .catch((error)=> {
      if (error.response.status === 404) {
        setIdAvailable(true);
      }
    })
    // URL 에서 숫자가 아닌 querystring은 그냥붙이면 엔코딩이 되기때문에
    // urlsearchparams 를 써서 string파라미터값을 추출해야함
  }

  return (<div>
    <Box>
      <h1>회원 가입</h1>
      <FormControl isInvalid={!idAvailable}>
        <FormLabel>id</FormLabel>
        <Flex>
          <Input value={id} onChange={(e) => {
            setId(e.target.value);
            setIdAvailable(false);
          }}/>
          <Button onClick={handleIdCheck}>중복확인</Button>
        </Flex>
        <FormErrorMessage>ID 중복체크를 해주세요!.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={password.length === 0}>
        <FormLabel>password</FormLabel>
        <Input type="password" value={password}
               onChange={(e) => setPassword(e.target.value)}/>
        <FormErrorMessage>암호를 입력해주세요.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={password !== passwordCheck}>
        <FormLabel>password 확인</FormLabel>
        <Input type="password" value={passwordCheck}
               onChange={(e) => setPasswordCheck(e.target.value)}/>
        <FormErrorMessage>암호가 다릅니다.</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input type="email" value={email}
               onChange={(e) => setEmail(e.target.value)}/>
      </FormControl>
      <Button onClick={handleSubmit} colorScheme="blue"
              isDisabled={!submitAvailable}>가입</Button>
    </Box>
  </div>);
}