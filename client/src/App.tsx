import { Routes, Route } from 'react-router-dom'
import { HomePage } from "./components/HomePage";
import { SignupPage } from "./components/SignupPage";
import { UserDashboard } from './components/UserDashboard';
import './App.css'
import { SigninPage } from './components/SigninPage';
import { ProjectCreationFlow } from './components/ProjectCreationFlow';
import { LearningEnvironment } from './components/LearningEnvironment';
import { useEffect } from 'react';
import { supabase } from './supabase';


function App() {
  useEffect(() => {
    supabase.from('todos').select('*').then(({ data, error }) => {
      console.log('Supabase query executed');
      if (error) console.error('Supabase Error:', error);
      else console.log('Supabase Data:', data);
    });
  }, []);
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/editor" element={<LearningEnvironment />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="signin" element={<SigninPage />} />
      <Route path="create" element={<ProjectCreationFlow />} />
    </Routes>
  );
}

export default App
