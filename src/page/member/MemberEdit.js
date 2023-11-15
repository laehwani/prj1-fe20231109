import {
  Box, Button, Flex, FormControl, FormLabel, Input, Spinner, useToast
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import axios from "axios";

export function MemberEdit() {

  const [member, setMember] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);

  const [params] = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then(
        (r) => {
          setMember(r.data);
          setEmail(r.data.email);
        })
  }, []);

  const id = params.get("id");

  // 기존 email 과 같은지?
  let sameOriginEmail = false;
  if (member !== null) {
    sameOriginEmail = member.email === email;
  }
  // TODO: 기존 이메일과 같거나, 중복확인을 했거나
  let emailChecked = sameOriginEmail || emailAvailable;

  // 암호가 없으면 기존 암호
  // 암호를 작성하면 새 암호, 암호확인 체크
  let passwordChecked = false;

  if (passwordCheck === password) {
    passwordChecked = true;
  }
  if (password.length === 0) {
    passwordChecked = true;
  }

  if (member === null) {
    return <Spinner/>;
  }

  function handleEmailCheck() {
      const searchParam = new URLSearchParams();
      searchParam.set("email", email);

      axios
      .get("/api/member/check?" + searchParam)
      .then(()=> {
        setEmailAvailable(false);
        toast({
          description: "이미 사용 중인 Email 입니다",
          status: "warning"
        });
      })
      .catch((error)=> {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: '사용 가능한 Email 입니다', status: 'success'
          });
        }
      });
  }

  function handleSubmit() {
    // 항상 업데이트할때 주로 쓰이는건 put 방식이다
    // put /api/member/edit
    // {id, password, email}

    axios
    .put("/api/member/edit", {id: member.id, password, email})

  }

  return (<div>
    <Box>
      <h1>{id}님 정보 수정</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input type="text" value={password}
               onChange={(e) => setPassword(e.target.value)}></Input>
      </FormControl>

      {password.length > 0 && (<FormControl>
            <FormLabel>password 확인</FormLabel>
            <Input type="text"
                   value={passwordCheck}
                   onChange={(e) => setPasswordCheck(e.target.value)}></Input>
          </FormControl>)}

      {/*email 을 변경하면(작성시작) 중복확인 다시 하도록*/}
      {/*기존 email 과 같으면 중복확인 안해도 되게 해보자*/}
      <FormControl>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input type="email" value={email}
                 onChange={(e) => {
                   setEmail(e.target.value);
                   setEmailAvailable(false);
                 }}></Input>
          <Button isDisabled={emailChecked}
                  onClick={handleEmailCheck}>중복확인</Button>
        </Flex>
      </FormControl>
      <Button isDisabled={!emailChecked || !passwordChecked} colorScheme="blue"
              onClick={handleSubmit}>수정</Button>
    </Box>
  </div>);
}