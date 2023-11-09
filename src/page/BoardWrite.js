import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const toast = useToast();

  function handleSubmit() {
    axios
      .post("/api/board/add", {
        title,
        content,
        writer,
      })
      .then(() => {
        toast({
          description: "새 글이 저장되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status == 400) {
          toast({
            description: "작성한 내용을 확인해주세요!",
            status: "error",
          });
        } else {
          toast({
            description: "저장 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => console.log("끝!!😎😎"));
  }

  return (
    <div>
      <Box>
        <h1>게시물 작성</h1>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></Textarea>
          </FormControl>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={writer} onChange={(e) => setWriter(e.target.value)} />
          </FormControl>
          <Button colorScheme={"blue"} onClick={handleSubmit}>
            저장
          </Button>
        </Box>
      </Box>
    </div>
  );
}
