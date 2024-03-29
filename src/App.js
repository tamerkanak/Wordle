import { useEffect, useState, createContext,Fragment } from 'react';
import './App.css';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import { boardDefault, generateWordSet } from './components/Words';
import GameOver from './components/GameOver';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'

export const AppContext = createContext();

function App() {

  const [board, setBoard] = useState(boardDefault)
  const [currAttempt, setCurrAttempt] = useState({attempt:0, letterPos: 0});
  const [wordSet, setWordSet] = useState(new Set())
  const [disabledLetters, setDisableLetters] = useState([])
  const [gameOver, setGameOver] = useState({gameOver: false, guessWord: false});
  const [correctWord, setCorrectWord] = useState("")


  useEffect(()=>{
    generateWordSet().then((words) => {
      setWordSet(words.wordSet)
      setCorrectWord(words.todaysWord.toUpperCase())
      
    });
  },[]);
  
  const onSelectLetter = (keyVal) => {
    if(currAttempt.letterPos > 4) return;
    const newBoard = [...board]
    newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal
    setBoard(newBoard);
    setCurrAttempt({...currAttempt, letterPos: currAttempt.letterPos + 1})
  }

  const onDelete = () => {
    if(currAttempt.letterPos === 0) return;
    const newBoard = [...board]
    newBoard[currAttempt.attempt][currAttempt.letterPos-1] = ""
    setBoard(newBoard)
    setCurrAttempt({...currAttempt, letterPos: currAttempt.letterPos - 1})
  }

  const onEnter = () => {
    if(currAttempt.letterPos !== 5) return; 

    let currWord = ""

    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i]
    } 

    if (wordSet.has(currWord.toLowerCase())){
      setCurrAttempt({attempt: currAttempt.attempt + 1, letterPos: 0})
    }else{
      alert("The word you entered is not in the word list.")
    }

    if (currWord === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }

    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
      return;
    }
  }
  

  return (
    <div className="App">

        <BrowserRouter>       
          <Navbar bg="light" expand="xl">
            <Container>
              <Navbar.Brand as={Link} to="home">Word Game</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="">Wordle</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
      
          <div>
            <Routes>
              
              <Route path="/" element={
              <Fragment>
                <AppContext.Provider value={{board, setBoard, currAttempt, setCurrAttempt,onSelectLetter,onEnter,onDelete,correctWord,setDisableLetters,disabledLetters,gameOver, setGameOver}}>
                  <div className='game'>
                      <Board/>
                      {gameOver.gameOver ? <GameOver/> : <Keyboard/>}
                    </div> 
                </AppContext.Provider>
              </Fragment>
            
            }>

              </Route>
              
            </Routes>
          </div> 

        </BrowserRouter>
              
      </div>
  );
}

export default App;
