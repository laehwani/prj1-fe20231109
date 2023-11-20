import {
  Box,
  Button,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Textarea,
  Text,
  Card, Flex
} from "@chakra-ui/react";
import axios from "axios";
import React, {useEffect, useState} from "react";

function CommentForm({boardId}) {

  const [comment, setComment] = useState("");

  function handleSubmit() {
    axios.post("/api/comment/add", {
      boardId, comment
    });
  }

  return (<div>
        <Box>
          <Textarea value={comment} onChange={e=> setComment(e.target.value)}></Textarea>
          <Button onClick={handleSubmit}>댓글 쓰기</Button>
        </Box>
      </div>);
}

function CommentList({boardID}) {

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", boardID);

    axios.get("/api/comment/list?" + params)
    // TODO: urlsearchparams 로 url정보를 스트링화할때 + 가 왼쪽,오른쪽을
    // 모두 string으로 바꿔주기에 toString 을 안붙여도 된다..
    .then(r => setCommentList(r.data.value));
  }, []);
  return (<div>
    <Card>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {/*TODO: 새로운 줄 출력*/}
          {/*TODO: 댓글 작성 후 re render*/}
          {commentList.map((comment) => (
              <Box>
                <Flex justifyContent="space-between">
                  <Heading size="xs">{comment.memberId}</Heading>
                  <Text fontSize="xs">{comment.inserted}</Text>
                </Flex>
                <Text sx={{whiteSpace:"pre-wrap"}} pt="2" fontSize="sm">
                  {comment.comment}
                </Text>
              </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  </div>);
}

export function CommentContainer({boardId}) {
  return (
      <div>
        <Box>
          <CommentForm boardId={boardId}></CommentForm>
          <CommentList boardID={boardId}></CommentList>
        </Box>
      </div>
  );
}