import {Box, Button, Textarea} from "@chakra-ui/react";
import axios from "axios";
import {useEffect, useState} from "react";

function CommentForm({boardId}) {

  const [comment, setComment] = useState("");

  function handleSubmit() {
    axios.post("/api/comment/add", {
      boardId,
      comment
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

  const [commentList, setCommentList] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", boardID);

    axios
    .get("/api/comment/list?"+ params)
    .then(r=> setCommentList(r.data.value))
  }, []);
  return (<div>
        <Box>
          댓글 리스트
        </Box>
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