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
import Dashboard from './Components/Dashboard';  
import PostsPendingApproval from './Components/Admin/PostsPendingApproval';
import PostApprovalDetail from './Components/Admin/PostApprovalDetail';
import ReportedUsers from './Components/Admin/ReportedUsers';
import UserDetail from './Components/Admin/UserDetail';
import ReportedPosts from './Components/Admin/ReportedPosts';
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
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/posts-awaiting-approval"
              element={
                <ProtectedRoute>
                  <PostsPendingApproval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/post-approval/:postId"
              element={
                <ProtectedRoute>
                  <PostApprovalDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/posts-marked-scam"
              element={
                <ProtectedRoute>
                  <ReportedPosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/reported-users"
              element={
                <ProtectedRoute>
                  <ReportedUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/reported-users/:userId"
              element={
                <ProtectedRoute>
                  <UserDetail />
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
