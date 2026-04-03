import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SavedArticles from './pages/SavedArticles';
import ArticleDetail from './pages/ArticleDetail';

const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) return (
    <div className="flex justify-center items-center h-[60vh] text-[var(--text)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent2)]"></div>
    </div>
  );
  
  // Notice we now don't manually redirect if it's a modal-based login, 
  // but if they hit a direct protected route, we'll guide them home to trigger login.
  return user ? children : <Navigate to="/" />;
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col font-sans transition-colors duration-300">
          <Navbar 
            setSearchQuery={setSearchQuery} 
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
          
          {/* Main layout container adds generic padding unless overridden by internal page layouts */}
          <main className="flex-grow w-full relative pb-16">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Home 
                    searchQuery={searchQuery} 
                    activeCategory={activeCategory} 
                  />
                } 
              />
              <Route 
                path="/article/:id" 
                element={<ArticleDetail />} 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <div className="container mx-auto px-4 lg:px-8 pt-12"><Profile /></div>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/saved" 
                element={
                  <PrivateRoute>
                    <div className="container mx-auto px-4 lg:px-8 pt-12"><SavedArticles /></div>
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
