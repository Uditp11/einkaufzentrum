import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Components/Home';
import ProductExplore from './Components/ProductExplore';
import SearchResult from './Components/SearchResult';
import Login from './Components/Login';
import Signup from './Components/Signup';
import PostAd from './Components/PostAd';
import { AuthProvider } from './context/AuthContext';
import './Style/App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<ProductExplore />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/post-ad" 
              element={
                <ProtectedRoute>
                  <PostAd />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
