import logo from './logo.svg';
import './App.css';
import {Amplify, API } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import '@aws-amplify/ui-react/styles.css';
import axios from 'axios';
import { 
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack, 
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  FormLabel, 
  FormControl,
  Tag, 
  TagLabel, 
  TagCloseButton,
} from "@chakra-ui/react";

// Uncomment the line below after Amplify push
// import awsExports from './aws-exports';
// Amplify.configure(awsExports);

const myAPI = "ec2scheduler"
const path = '/customers'; 

const App = () => {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState([
    {id: nanoid(), value: "Empty", title: "Title 1"}, 
    {id: nanoid(), value: "Else", title: "Title 2"},
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [cronExpression, setCronExpression] = useState('');
  
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  useEffect(() => {
    axios.get('https://my-json-server.typicode.com/typicode/demo/posts').then((res) => console.log(res));
  }, [submitted]);

  const deleteTag = (e) => {
    let id = e.currentTarget.parentElement.id;
    let newTags = tags.filter(function(t) { return t.id !== id });
    setTags(newTags);
  };

  const InputedTags = () => (
    <HStack spacing={4} m="20px auto">
      {
        tags.map((tag) => (
          <Tag size="lg" key={tag.id} id={tag.id} colorScheme="green">
            <TagLabel color='grey' m="auto 5px">{tag.title}</TagLabel>
            <TagLabel>{tag.value}</TagLabel>
            <TagCloseButton id={tag.id} onMouseUp={deleteTag}/>
          </Tag>
        ))
      }
    </HStack>
  );

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log(`tags=${JSON.stringify(tags)}\ncron=${cronExpression}\naccess_key=${accessKey}\nsecret_key=${secretKey}`);
  }

  return (
      <Box align="left" maxW="2xl" m="0 auto" >
        <Heading as="h3" textAlign="center" fontSize="2xl" mt="100px">
          Terminate these EC2 instances
        </Heading>

        <form>
          <FormControl>
            <FormLabel p="20px 10px">Tag of EC2</FormLabel>
            <InputGroup>
              <Input 
                id="tags" 
                placeholder='The tag:The value'
                variant="flushed"
                p="20px"
                value={input}
                onChange={(e) => {
                  setInput(e.currentTarget.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    let index = input.indexOf(':');
                    let title = input.substring(0, index).trim();
                    let value = input.substring(index + 1).trim();
                    setTags(tags.concat({id: nanoid(), value, title}));
                    setInput("");
                  }
                }}
              />
            </InputGroup>
          </FormControl>

          <InputedTags />

          <FormControl>
            <FormLabel p="20px 10px">Frequency Cron expression: (Minutes Hours DayOfMonth Month DayOfWeek Year)</FormLabel>
            <InputGroup>
              <InputLeftAddon children='(' />
              <Input 
                id="cron" 
                placeholder='Minutes Hours DayOfMonth Month DayOfWeek Year'
                variant="flushed"
                p="20px"
                onKeyUp={(e) => {
                  setCronExpression(`(${e.currentTarget.value.trim()})`);
                }}
              />
              <InputRightAddon children=')' />
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel p="20px 10px">AWS Access Key</FormLabel>
            <InputGroup>
              <Input 
                id="access_key" 
                variant="filled"
                p="20px"
                onChange={(e) => {
                  setAccessKey(e.currentTarget.value.trim());
                }}
              />
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel p="20px 10px">AWS Secret key</FormLabel>
            <InputGroup>
              <Input
                type="password"
                id="secret_key" 
                variant="filled"
                p="20px"
                onChange={(e) => {
                   setSecretKey(e.currentTarget.value.trim());
                }}
              />
            </InputGroup>
          </FormControl>
          <Button m="20px 20px" p="20px 20px" colorScheme='blue' onMouseUp={submit}>Submit</Button>
        </form>
      </Box>
  )
}

export default App;