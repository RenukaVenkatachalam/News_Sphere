import logo from './logo.svg';
import './App.css';
import TimerApp from './timerapp/TimerApp';
import News from './components/News';
//import NewsItem from './components/NewsItem';
import React, {useState} from 'react';
//import TimerApp from './components/TimerApp';
function App() {
  // create a state to store the selected category
  const[Category, setCategory] = useState("General");
  return (
    <div className="App" style={{backgroundColor: 'black'}}>
      <h1 className="Title"> NewsSphere</h1>

      <button className="btn" onClick={() => setCategory("General")}>General</button>
      <button className="btn" onClick={() => setCategory("Technology")}>Technology</button>
      <button className="btn" onClick={() => setCategory("Sports")}>Sports</button>
      <button className="btn" onClick={() => setCategory("Science")}>Science</button>
      <button className="btn" onClick={() => setCategory("Entertainment")}>Entertainment</button>
      <button className="btn" onClick={() => setCategory("Politics")}>Politics</button>
      <button className="btn" onClick={() => setCategory("Business")}>Business</button>
      
      <News category={Category}/>
      {/*<NewsItem/>*/}
      <TimerApp/>
 </div>
  );
}

export default App;
