import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {DeleteIcon} from "@chakra-ui/icons";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
      <Box>
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        <Button isDisabled={isSubmitting} onClick={handleSubmit}>
          쓰기
        </Button>
      </Box>
  );
}

function CommentList({ commentList, onDeleteModalOpen, isSubmitting}) {

  return (<Card>
    <CardHeader>
      <Heading size="md">댓글 리스트</Heading>
    </CardHeader>
    <CardBody>
      <Stack divider={<StackDivider/>} spacing="4">
        {commentList.map((comment) => (<Box key={comment.id}>
          <Flex justifyContent="space-between">
            <Heading size="xs">{comment.memberId}</Heading>
            <Text fontSize="xs">{comment.inserted}</Text>
          </Flex>
          <Flex justifyContent="space-between" textAlign="center">
            <Text sx={{whiteSpace: "pre-wrap"}} pt="2" fontSize="sm">
              {/*TODO: sx={{whiteSpace:"pre-wrap"} 로 댓글에 새로운 줄 출력*/}

              {comment.comment}
            </Text>
            <Button size='xs'
                    colorScheme="green"
                    onClick={()=> onDeleteModalOpen(comment.id)}
                    isDisabled={isSubmitting}>
              <DeleteIcon/>
            </Button>
          </Flex>
        </Box>))}
      </Stack>
    </CardBody>
  </Card>);
}

export function CommentContainer({ boardId }) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [id, setId] = useState(0);

  const {
    isOpen,
    onClose,
    onOpen,
  } = useDisclosure();

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);

      axios
      .get("/api/comment/list?" + params)
      // TODO: urlsearchparams 로 url정보를 스트링화할때 + 가 왼쪽,오른쪽을
      //  모두 string으로 바꿔주기에 toString 을 안붙여도 된다..
      .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
    .post("/api/comment/add", comment)
    .finally(() => setIsSubmitting(false));
  }

  function handleDeleteModalOpen(id) {
    // id 를 어딘가 저장
    setId(id);
    // 모달 열기
    onOpen()
  }

  // TODO: 지우는 중간에 submitting 상태를 변경시켜주기 위해 handleDelete를 컨테이너로 옮겼음.
  //  useEffect 가 submitting 상태에 따라서 변경되게 하기 위해..
  function handleDelete() {
    // TODO : 모달, then, catch, finally 넣어야댐.

    setIsSubmitting(true);
    axios
    .delete("/api/comment/" + id)
    .finally(() => {
      onClose();
      setIsSubmitting(false)
    });
    // 위에 코드로 issubmitting 이 바뀌면서 useEffect 가 트리거하게 된다.
  }

  return (<Box>
    <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
    />
    <CommentList boardId={boardId}
                 isSubmitting={isSubmitting}
                 commentList={commentList}
                 onDeleteModalOpen={handleDeleteModalOpen}/>

    {/*삭제 모달*/}
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>삭제 확인</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>삭제 하시겠습니까?</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>닫기</Button>
          <Button onClick={handleDelete}
                  colorScheme="red"
                  isDisabled={isSubmitting}>
            삭제
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Box>);
}
