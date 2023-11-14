import {
  Box, Button,
  FormControl,
  FormLabel,
  Input,
  Spinner
} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useImmer} from "use-immer";
import axios from "axios";

export function BoardEdit() {

  const [board, updateBoard] = useImmer(null);

  // edit/:id
  const {id}= useParams();

  const navigate = useNavigate();

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
          <Input value={board.title} onChange={e => {
            updateBoard((draft) => {
              draft.title = e.target.value
            });
          }}/>
        </FormControl>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Input value={board.content} onChange={e => {
            updateBoard((draft) => {
              draft.content = e.target.value
            });
          }}/>
        </FormControl>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input value={board.writer} onChange={e => {
            updateBoard((draft) => {
              draft.writer = e.target.value
            });
          }}/>
        </FormControl>
        <Button colorScheme={'yellow'}>저장</Button>

        {/*navigate(-1) : 이전 경로로 이동, (-2) : 이전이전의 경로로 이동 */}
        {/*navigate(+1) : 앞으로 이동*/}
        <Button colorScheme={'blue'} onClick={()=>navigate(-1)}>취소</Button>
      </h1>
    </Box>
  </div>);
}