import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage.jsx';
import Nav from './components/Nav/Nav';
import Form from './components/Form/Form';
import Detail from './components/Detail/Detail';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterGames, getAllGames, getAllGenres, orderGames, searchByName } from './redux/actions.js';
import Landing from './components/Landing/Landing.jsx';
import Error from './components/Error/Error.jsx';

import imageLanding from "./assets/images/FondoLanding.jpg"

function App() {
  let body = document.querySelector("body");
  body.style.backgroundImage = `url(${imageLanding})`

  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const allGames = useSelector(state => state.allVideogames);
  const gamesFiltered = useSelector(state => state.gamesFiltered);
  
  const [videogames, setVideogames] = useState(null);
  const [error, setError] = useState(false);

  useEffect( ()=>{
    dispatch(getAllGames());
    dispatch(getAllGenres());
  }, [dispatch]);

  useEffect(() => {
    if (allGames.length > 0) {
      setVideogames(allGames);
      dispatch(filterGames("all"))
    }
  }, [allGames, dispatch]);


  useEffect(()=>{ 
    if (videogames !== null && gamesFiltered.length) {
      if (gamesFiltered[0].error) setError(true)
      else setError(false)
      setVideogames(gamesFiltered)
    }
    else if(videogames !== null && !gamesFiltered.length) setError(true)

  }, [gamesFiltered, videogames])

  const searchGame = (name)=>{
    dispatch(searchByName(name))
  }

  const filter = (value)=>{
      dispatch(filterGames(value))
  }
  const order = (value)=>{
    dispatch(orderGames(value))
  }
  
  return (
    <> 
      {
        pathname === "/home" && <Nav searchGame={searchGame}></Nav>
      }
      
      <Routes>
        <Route path="*" element={<Error errorPage={true} />} />
        <Route path='/' element={<Landing />} />
        <Route path="/home" element={<HomePage videogames={videogames} filter={filter} order={order} error={error}/>}/>
        <Route path='/create' element={<Form />}/>
        <Route path='/detail/:id' element={<Detail />}/>
      </Routes>
    </>
  );
}

export default App;
