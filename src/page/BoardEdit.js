import {
  Box, Button, FormControl, FormLabel, Input, Spinner, useToast
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

  const toast = useToast();

  useEffect(() => {
    axios
    .get("/api/board/id/" + id)
    .then(r => updateBoard(r.data));
  }, []);

  if (board === null) {
    return <Spinner/>;
  }

  const handleSave = () => {

    // 저장 버튼 클릭 시
    // PUT /api/board/edit
    axios
    .put("/api/board/edit", board)
    .then(() => {toast({
      description: board.id +'번 게시글이 수정되었습니다!',
      status: 'success'
    })
      navigate("/board/"+id);
    })
    .catch((error) => {
      if (error.response.data === 400) {
        toast({
          description: "요청이 잘못되었습니다. 수정내용을 다시 확인해주세요!", status: 'error',
        })
      }
      else {
        toast({
          description: "수정 중에 문제가 발생하였습니다.", status: 'error',
        });
      }
    })
    .finally(() => console.log('끝!'))
  };
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
        <Button colorScheme={'yellow'} onClick={handleSave}>저장</Button>

        {/*navigate(-1) : 이전 경로로 이동, (-2) : 이전이전의 경로로 이동 */}
        {/*navigate(+1) : 앞으로 이동*/}
        <Button colorScheme={'blue'} onClick={()=>navigate(-1)}>취소</Button>
      </h1>
    </Box>
  </div>);
}