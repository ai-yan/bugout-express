/* eslint-disable no-alert */
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import Editor from '@monaco-editor/react';
import { Button, Text, Box } from '@chakra-ui/core';
import { buildFunction } from '../../server/utils/buildFunction';
import { test } from '../../server/utils/tests';
import { getPromptThunk, setCorrect } from '../store/thunks/gameThunks';

const CodeEditor = (props) => {
  useEffect(() => {
    props.getPromptThunk('easy');
  }, []);

  const [isEditorReady, setIsEditorReady] = useState(false);
  const valueGetter = useRef();

  function handleEditorDidMount(_valueGetter) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

  function handleShowValue() {
    const fn = buildFunction(valueGetter.current());
    const ts = `test${props.game.prompt.id}`;
    const correct = test[ts](fn);
    if (correct) {
      props.setCorrect();
    } else {
      alert('Sorry try again :(');
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '50%',
        margin: '15px',
      }}
    >
      <Box
        w="100%"
        bg="#00c3d9"
        color="white"
        borderWidth="3px"
        borderColor="#3674b5"
        borderStyle="solid"
        rounded="lg"
        m={2}
        p={4}
        maxHeight="150px"
        overflow="scroll"
      >
        <Text fontSize="lg" w="100%">
          {props.game.prompt.name}
        </Text>
        <Text fontSize="sm" w="100%">
          {props.game.prompt.prompt}
        </Text>
      </Box>
      <div style={{ width: '100%' }}>
        <Editor
          height="50vh"
          width="100%"
          theme="dark"
          language="javascript"
          value="function bugout () {
          /*  Your code here  */
          }"
          editorDidMount={handleEditorDidMount}
        />
      </div>
      {props.input.correctAnswer
      && (
      <div style={{ textAlign: 'center' }}>
        <Text color="#2df50a" fontSize="3rem" marginTop="1rem" marginBottom="0">Correct!!!</Text>
        {props.input.score === 0
          && <Text color="#2df50a" marginTop="0">Calculating Score...</Text>}
        {props.input.score > 0
          && <Text color="#2df50a" marginTop="0">You earned {props.input.score} points!</Text>}
        <Text color="#2df50a" marginTop="0">Feel free to keep bugging the competition while you wait.</Text>
      </div>
      )}
      {!props.input.correctAnswer
        && (
        <Button onClick={handleShowValue} disabled={!isEditorReady} type="button" m={1} variantColor="teal" variant="outline" w="100%" marginTop={5}>
          Check Function
        </Button>
        )}
    </div>
  );
};

const mapStateToProps = (props) => (props);
export default connect(mapStateToProps, { getPromptThunk, setCorrect })(CodeEditor);
