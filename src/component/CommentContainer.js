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
  useToast,
} from "@chakra-ui/react";
import React, {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import {DeleteIcon, EditIcon, NotAllowedIcon} from "@chakra-ui/icons";
import {LoginContext} from "./LogInProvider";

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

function CommentItem({comment, onDeleteModalOpen, setIsSubmitting, isSubmitting}) {

  const [isEditing, setIsEditing] = useState(false);
  const [commentEdited, setCommentEdited] = useState(comment.comment);

  const {hasAccess} = useContext(LoginContext);

  const toast = useToast();

  function handleSubmit() {
    //TODO: 저장 실행시 textarea 닫기..저장시 refresh도 완료..
    //TODO: 응답 코드에 따른 기능들 마감.. 완료...
    setIsSubmitting(true);
    axios
    .put("/api/comment/edit", {id: comment.id, comment: commentEdited})
    .then(()=> {
      toast({
        description: '댓글이 수정되었습니다!',
        status: 'success'
      })
    })
    .catch((error)=> {
      if (error.response.status === 401 || error.response.status === 403) {
        toast({
          description: '권한이 없습니다.',
          status: 'warning'
        });
      }
      if (error.response.status === 400) {
        toast({
          description: '잘못된 입력입니다. 다시 확인해주세요!',
          status: 'warning'
        });
      }
    })
    .finally(()=> {
      setIsSubmitting(false);
      setIsEditing(false);
    })
  }

  return (
      <Box>
        <Flex justifyContent="space-between">
          <Heading size="xs">{comment.memberNickName}</Heading>
          <Text fontSize="xs">{comment.inserted}</Text>
        </Flex>
        <Flex justifyContent="space-between" textAlign="center">
          <Box flex={1}>
            <Text sx={{whiteSpace: "pre-wrap"}} pt="2" fontSize="sm">
              {/*TODO: sx={{whiteSpace:"pre-wrap"} 로 댓글에 새로운 줄 출력*/}
              {comment.comment}
            </Text>
            {isEditing && (
                <Box>
                  <Textarea value={commentEdited}
                            onChange={(e) =>
                                setCommentEdited(e.target.value)}
                  />
                  <Button colorScheme='green' onClick={handleSubmit} isDisabled={isSubmitting}>
                    저장
                  </Button>
                </Box>
            )}
          </Box>

          {hasAccess(comment.memberId) && (
              <Box>
                {isEditing || (
                    <Button size='xs'
                            colorScheme='purple'
                            onClick={() => setIsEditing(true)}
                    >
                      <EditIcon/>
                    </Button>
                )}
                {isEditing && (
                    <Button size='xs'
                            colorScheme='red'
                            onClick={() => setIsEditing(false)}
                    >
                      <NotAllowedIcon/>
                    </Button>
                )}
                <Button size='xs'
                        colorScheme="green"
                        onClick={() => onDeleteModalOpen(comment.id)}>
                  <DeleteIcon/>
                </Button>
              </Box>)}
        </Flex>
      </Box>);
}

function CommentList({ commentList, onDeleteModalOpen, isSubmitting, setIsSubmitting}) {

  const {hasAccess} = useContext(LoginContext);

  return (
      <Card>
        <CardHeader>
          <Heading size="md">댓글 리스트</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider/>} spacing="4">
            {commentList.map((comment) => (
                <CommentItem
                    key={comment.id}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    comment={comment}
                    onDeleteModalOpen={onDeleteModalOpen}
                />
            ))}
          </Stack>
        </CardBody>
      </Card>);
}

export function CommentContainer({ boardId }) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);
  // const [id, setId] = useState(0);

  //TODO: useRef 컴포넌트는 렌더링을 필요치 않은 즉, 임시로 값을 저장하는 용도의 컴포넌트를 원할 때 쓴다.
  // 하지만 위에 특별한 상황이 아니면 주석처리한 useState 를 써도 상관은 없다..퍼포먼스용..
  const commentIdRef = useRef(0);

  const {
    isOpen,
    onClose,
    onOpen,
  } = useDisclosure();

  const {isAuthenticated} = useContext(LoginContext);

  const toast = useToast();

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
    .then(()=> {
      toast({
        description: '댓글이 등록되었습니다!',
        status: 'success'
      })
    })
    .catch((error)=> {
      toast({
        description: '댓글 등록 중 문제가 발생하였습니다.',
        status: 'error'
      })
    })
    .finally(() => setIsSubmitting(false));
  }

  function handleDeleteModalOpen(id) {
    // id 를 어딘가 저장
    // setId(id);
    commentIdRef.current = id;

    // 모달 열기
    onOpen()
  }

  // TODO: 지우는 중간에 submitting 상태를 변경시켜주기 위해 handleDelete를 컨테이너로 옮겼음.
  //  useEffect 가 submitting 상태에 따라서 변경되게 하기 위해..
  function handleDelete() {

    setIsSubmitting(true);
    axios
    .delete("/api/comment/" + commentIdRef.current)
    .then(()=> {
      toast({
        description: '댓글이 삭제되었습니다!',
        status: 'success'
      })
    })
    .catch((error)=> {
      if (error.response.status === 401 || error.response.data === 403) {
        toast({
          description: '권한이 없습니다.', status: 'warning'
        });
      } else {
        toast({
          description: '댓글 삭제 중 문제가 발생하였습니다',
          status: 'error'
        })
      }
    })
    .finally(() => {
      onClose();
      setIsSubmitting(false)
    });
    // 위에 코드로 issubmitting 이 바뀌면서 useEffect 가 트리거하게 된다.
  }

  return (<Box>
    {isAuthenticated() && (
        <CommentForm
            boardId={boardId}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
        />
    )}
    <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
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
