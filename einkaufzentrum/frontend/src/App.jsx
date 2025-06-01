import { Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Components/Home';
import ProductExplore from './Components/ProductExplore';
import SearchResult from './Components/SearchResult';
import Login from './Components/Login';
import Signup from './Components/Signup';
import PostAd from './Components/PostAd';
import './Style/App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ProductExplore />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post-ad" element={<PostAd />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
