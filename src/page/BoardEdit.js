import {Box, FormControl, FormLabel, Input, Spinner} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useImmer} from "use-immer";
import axios from "axios";

export function BoardEdit() {

  const [board, updateBoard] = useImmer(null);

  // edit/:id
  const {id}= useParams();

  useEffect(() => {
    axios
    .get("/api/board/id/" + id)
    .then(r => updateBoard(r.data));
  }, []);

  if (board === null) {
    return <Spinner/>;
  }

  return (<div>
    <Box>
      <h1>
        {id}번 글 수정
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title}/>
        </FormControl>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Input value={board.content}/>
        </FormControl>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input value={board.writer}/>
        </FormControl>
      </h1>
    </Box>
  </div>);
}