import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RouteLoader from './components/Common/RouteLoader';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import CategoriesManager from './components/Categories/CategoriesManager';
import CategoryForm from './components/Categories/CategoryForm';
import QuestionsManager from './components/Questions/QuestionsManager';
import QuestionForm from './components/Questions/QuestionForm';
import QuizzesManager from './components/Quizzes/QuizzesManager';
import QuizForm from './components/Quizzes/QuizForm';
import QuizPreview from './components/Quizzes/QuizPreview';
import QuizShare from './components/Quizzes/QuizShare';
import QuizResults from './components/Quizzes/QuizResults';
import AllResults from './components/Results/AllResults';
import SearchResults from './components/Search/SearchResults';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import SettingsPage from './components/Settings/SettingsPage';
import StudentQuizEntry from './components/Student/StudentQuizEntry';
import StudentQuizTaking from './components/Student/StudentQuizTaking';
import StudentQuizResults from './components/Student/StudentQuizResults';
import { ViewType } from './types';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAddNew = () => {
    // This function is no longer used since we removed the duplicate buttons
    console.log('Add new item');
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <Header 
          onAddNew={handleAddNew}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Layout Container - Below header */}
      <div className="flex pt-16 h-full">
        {/* Sidebar - Fixed position */}
        <div className={`
          fixed lg:static top-16 bottom-0 left-0 z-50 lg:z-auto w-64
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          transition-transform duration-300 ease-in-out lg:transition-none
        `}>
          <Sidebar 
            onSidebarClose={() => setSidebarOpen(false)}
          />
        </div>
        
        {/* Main Content Area - Scrollable */}
        <div className="flex-1 lg:ml-0 overflow-hidden">
          <main className="h-full overflow-y-auto scrollbar-minimal px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                  <RouteLoader>
                    <DashboardOverview />
                  </RouteLoader>
                } />
                <Route path="/categories" element={
                  <RouteLoader>
                    <CategoriesManager />
                  </RouteLoader>
                } />
                <Route path="/categories/new" element={
                  <RouteLoader delay={100}>
                    <CategoryForm />
                  </RouteLoader>
                } />
                <Route path="/categories/:id/edit" element={<CategoryForm />} />
                <Route path="/questions" element={
                  <RouteLoader>
                    <QuestionsManager />
                  </RouteLoader>
                } />
                <Route path="/questions/new" element={
                  <RouteLoader delay={100}>
                    <QuestionForm />
                  </RouteLoader>
                } />
                <Route path="/questions/:id/edit" element={<QuestionForm />} />
                <Route path="/quizzes" element={
                  <RouteLoader>
                    <QuizzesManager />
                  </RouteLoader>
                } />
                <Route path="/quizzes/new" element={
                  <RouteLoader delay={100}>
                    <QuizForm />
                  </RouteLoader>
                } />
                <Route path="/quizzes/:id/edit" element={<QuizForm />} />
                <Route path="/quizzes/:id/preview" element={
                  <RouteLoader>
                    <QuizPreview />
                  </RouteLoader>
                } />
                <Route path="/quizzes/:id/share" element={
                  <RouteLoader>
                    <QuizShare />
                  </RouteLoader>
                } />
                <Route path="/quizzes/:id/results" element={
                  <RouteLoader>
                    <QuizResults />
                  </RouteLoader>
                } />
                <Route path="/results" element={
                  <RouteLoader>
                    <AllResults />
                  </RouteLoader>
                } />
                <Route path="/search" element={
                  <RouteLoader>
                    <SearchResults />
                  </RouteLoader>
                } />
                <Route path="/analytics" element={
                  <RouteLoader>
                    <AnalyticsDashboard />
                  </RouteLoader>
                } />
                <Route path="/settings" element={
                  <RouteLoader>
                    <SettingsPage />
                  </RouteLoader>
                } />
                
                {/* Student Routes */}
                <Route path="/quiz/:id" element={
                  <RouteLoader>
                    <StudentQuizEntry />
                  </RouteLoader>
                } />
                <Route path="/quiz/:id/take" element={
                  <RouteLoader>
                    <StudentQuizTaking />
                  </RouteLoader>
                } />
                <Route path="/quiz/:id/results" element={
                  <RouteLoader>
                    <StudentQuizResults />
                  </RouteLoader>
                } />
                
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;