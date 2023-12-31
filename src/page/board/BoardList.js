import React, {useEffect, useState} from "react";
import {
  Badge, Box, Button, Flex, Input, Spinner, Table, Tbody, Td, Th, Thead, Tr,
} from "@chakra-ui/react";
import axios from "axios";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {ChatIcon} from "@chakra-ui/icons";
import {
  faAngleLeft, faAngleRight, faHeart
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function PageButton({ variant, pageNumber, children }) {

  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    navigate("/?" + params);
  }

  return (
      <Button variant={variant} onClick={handleClick}>
        {children}
      </Button>
  );
}

function Pagination({ pageInfo }) {
  const pageNumbers = [];

  const navigate = useNavigate();

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
      <Box>
        {pageInfo.prevPageNumber && (
            <PageButton variant="ghost" pageNumber={pageInfo.prevPageNumber}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </PageButton>
        )}

        {pageNumbers.map((pageNumber) => (
            <PageButton
                key={pageNumber}
                variant={
                  pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
                }
                pageNumber={pageNumber}
            >
              {pageNumber}
            </PageButton>
        ))}

        {pageInfo.nextPageNumber && (
            <PageButton variant="ghost" pageNumber={pageInfo.nextPageNumber}>
              <FontAwesomeIcon icon={faAngleRight} />
            </PageButton>
        )}
      </Box>
  );
}

function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  function handleSearch() {

    // /?k=keyword
    const params = new URLSearchParams();
    params.set("k", keyword);

    navigate("/?" + params);
  }

  return (
      <Flex>
        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <Button onClick={handleSearch}>검색</Button>
      </Flex>
  );
}

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const [params] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    axios
    .get("/api/board/list?" + params)
    .then((response) => {
      setBoardList(response.data.boardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location]);

  if (boardList === null) {
    return <Spinner />;
  }

  return (
      <Box>
        <h1>게시물 목록</h1>
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>id</Th>
                <Th>
                  <FontAwesomeIcon icon={faHeart} />
                </Th>
                <Th>title</Th>
                <Th>by</Th>
                <Th>at</Th>
              </Tr>
            </Thead>
            <Tbody>
              {boardList.map((board) => (
                  <Tr
                      _hover={{
                        cursor: "pointer",
                      }}
                      key={board.id}
                      onClick={() => navigate("/board/" + board.id)}
                  >
                    <Td>{board.id}</Td>
                    <Td>{board.countLike != 0 && board.countLike}</Td>
                    <Td>
                      {board.title}
                      {board.countComment > 0 && (
                          <Badge>
                            <ChatIcon />
                            {board.countComment}
                          </Badge>
                      )}
                    </Td>
                    <Td>{board.nickName}</Td>
                    <Td>{board.ago}</Td>
                  </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <SearchComponent />
        <Pagination pageInfo={pageInfo} />
      </Box>
  );
}
