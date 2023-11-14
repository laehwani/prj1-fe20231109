import {memo, useEffect, useState} from "react";
import {Box, Spinner, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import axios from "axios";

export function MemberList() {
  const [list, setList] = useState("");
  useEffect(() => {
    axios.get("/api/member/list")
    .then(r=> setList(r.data))
  }, []);

  if (list === null) {
    return <Spinner/>
  }
  return (<div>
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>pw</Th>
            <Th>email</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map(member =>
              <Tr key={member.id}></Tr>)}
          <Td>{member.id}</Td>
          <Td>{member.password}</Td>
          <Td>{member.email}</Td>
        </Tbody>
      </Table>
    </Box>
  </div>);
}