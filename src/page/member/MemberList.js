import {useEffect, useState} from "react";
import {Box, Spinner, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function MemberList() {
  const [list, setList] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member/list")
    .then(r=> setList(r.data))
  }, []);

  if (list === "") {
    return <Spinner/>
  }

  function handleRowClick(id) {
    const params = new URLSearchParams;
    params.set("id", id);
    // /member?id=id
    navigate("/member?" + params.toString());
  }

  return (<div>
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>pw</Th>
            <Th>email</Th>
            <Th>가입일시</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map((member) => (<Tr _hover={{cursor:'pointer'}} onClick={()=>handleRowClick(member.id)} key={member.id}>
                <Td>{member.id}</Td>
                <Td>{member.password}</Td>
                <Td>{member.email}</Td>
                <Td>{member.inserted}</Td>
              </Tr>))}
        </Tbody>
      </Table>
    </Box>
  </div>);
}