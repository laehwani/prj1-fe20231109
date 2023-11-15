import {useNavigate, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure, useToast
} from "@chakra-ui/react";
import axios from "axios";

export function MemberView() {

  const [member, setMember] = useState(null);

  // /member?id=userid
  const [params] = useSearchParams();

  const {
    isOpen, onClose, onOpen,
  } = useDisclosure();

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
    .get("/api/member?"+ params.toString())
    .then(r => setMember(r.data))
  }, []);

  if (member === null) {
    return <Spinner/>;
  }


  function handleDelete() {
    // axios
    // delete /api/member?id=userid

    // ok -> home 이동, toast 띄우기
    // error -> toast 띄우기
    // finally -> modal 닫기
    axios.delete("/api/member?" + params.toString()).then(() => {
      toast({
        description: '탈퇴가 완료되었습니다', status: 'success'
      });
      navigate("/");

      // TODO: 로그아웃 기능 추가하기
      // FIXME: 이 기능 고치기

    }).catch((error) => {
      if (error.response.data === 401 || error.response.data === 403) {
        toast({
          description: '권한이 없습니다', status: 'error'
        });
      } else {

        toast({
          description: '탈퇴 처리 중에 문제가 발생하였습니다', status: 'error'
        })
      }
    });

  }

  return (<div>
        <Box>
          <h1>{member.id}님 정보</h1>
          <FormControl>
            <FormLabel>password</FormLabel>
            <Input type="text" value={member.password} readOnly></Input>
          </FormControl>
          <FormControl>
            <FormLabel>email</FormLabel>
            <Input value={member.email} readOnly></Input>
          </FormControl>
          <Button colorScheme="purple" onClick={()=>navigate("/member/edit?")+params.toString()}>수정</Button>
          <Button colorScheme="red" onClick={onOpen}>탈퇴</Button>

          {/*탈퇴 모달*/}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
              <ModalHeader>탈퇴 확인</ModalHeader>
              <ModalCloseButton/>
              <ModalBody>탈퇴 하시겠습니까?</ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>닫기</Button>
                <Button onClick={handleDelete} colorScheme="red">
                  탈퇴하기
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </div>);
}