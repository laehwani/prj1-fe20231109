import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner, Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {LoginContext} from "../../component/LogInProvider";
import {CommentContainer} from "../../component/CommentContainer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";

function LikeContainer({ like, onClick }) {
  const { isAuthenticated } = useContext(LoginContext);

  if (like === null) {
    return <Spinner />;
  }

  return (
      <Flex gap={2}>
        <Tooltip isDisabled={isAuthenticated()} hasArrow label={"로그인 하세요."}>
          <Button variant="ghost" size="xl" onClick={onClick}>
            {like.like && <FontAwesomeIcon icon={fullHeart} size="xl" />}
            {like.like || <FontAwesomeIcon icon={emptyHeart} size="xl" />}
          </Button>
        </Tooltip>
        <Heading size="lg">{like.countLike}</Heading>
      </Flex>
  );
}

export function BoardView() {
  const { id } = useParams();

  const [board, setBoard] = useState(null);
  const [like, setLike] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const {hasAccess, isAdmin} = useContext(LoginContext);

  useEffect(() => {
    axios.get("/api/board/id/" + id)
    .then((r) => setBoard(r.data));
  }, []);

  useEffect(() => {
    axios
    .get("/api/like/board/" + id)
    .then((r) => setLike(r.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete("/api/board/remove/" + id)
      .then((r) => {
        toast({
          description: id + "번 게시물이 삭제되었습니다",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다!",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  function handleLike() {
    axios
    .post("/api/like", {boardId : board.id})
    .then((r) => setLike(r.data))
    .catch(()=> console.log('bad'))
    .finally(()=> console.log('done!'))
  }

  return (
      <Box>
        <Flex justifyContent="space-between">
          <Heading size="xl">{board.id}번 글 보기</Heading>
          <LikeContainer like={like} onClick={handleLike} />
        </Flex>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title} readOnly/>
        </FormControl>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Input value={board.content} readOnly/>
        </FormControl>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input value={board.nickName} readOnly/>
        </FormControl>
        <FormControl>
          <FormLabel>작성일시</FormLabel>
          <Input value={board.inserted} readOnly/>
        </FormControl>

        {(hasAccess(board.writer) || isAdmin()) && (
            <Box>
              <Button colorScheme="yellow"
                      onClick={() => navigate("/edit/" + id)}>수정</Button>
              <Button colorScheme="blue" onClick={onOpen}>
                삭제
              </Button>
            </Box>
        )}

    {/*삭제 모달*/}
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>삭제 확인</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>삭제 하시겠습니까?</ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>닫기</Button>
          <Button onClick={handleDelete} colorScheme="red">
            삭제
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    <CommentContainer boardId={id}/>
  </Box>);
}
