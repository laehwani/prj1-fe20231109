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

function CommentList({ commentList }) {

  function handleDelete(id) {

    // TODO : then, catch, finally 넣어야댐. 백엔드부터 하겟음.
    axios.delete("/api/comment/" + id);
  }

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
                    <Button size='xs' colorScheme="green"
                            onClick={()=> handleDelete(comment.id)}>
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

  return (
      <Box>
        <CommentForm
            boardId={boardId}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
        />
        <CommentList boardId={boardId} commentList={commentList}/>
      </Box>
  );
}
