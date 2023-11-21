import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
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

function CommentList({ commentList, onDelete, isSubmitting}) {

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
                            onClick={()=> onDelete(comment.id)}
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

  // TODO: 지우는 중간에 submitting 상태를 변경시켜주기 위해 handleDelete를 컨테이너로 옮겼음.
  //  useEffect 가 submitting 상태에 따라서 변경되게 하기 위해..
  function handleDelete(id) {
    // TODO : 모달, then, catch, finally 넣어야댐.

    setIsSubmitting(true);
    axios
    .delete("/api/comment/" + id)
    .finally(() => setIsSubmitting(false));
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
                     onDelete={handleDelete}/>
      </Box>);
}
