import {Box, Button, Textarea} from "@chakra-ui/react";
import axios from "axios";
import {useState} from "react";

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

function CommentList() {
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
          <CommentList></CommentList>
        </Box>
      </div>
  );
}