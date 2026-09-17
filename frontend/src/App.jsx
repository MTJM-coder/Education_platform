import React from 'react'
import LandingPage from './pages/LandingPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  SearchResultsPage  from './pages/SearchResultsPage'
import TeacherProfilePage from './pages/TeacherProfilePage';
import ParentSignupPage from './pages/ParentSignupPage'; 
import TeacherSignupPage from './pages/TeacherSignupPage';
import Register from './pages/SignupRoleChoicePage';
import StudentSignupPage from './pages/StudentSignupPage';
import Login from './pages/LoginPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path='/teacher-profile' element={<TeacherProfilePage />} />
        <Route path='/register/parent' element={<ParentSignupPage/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/register/teacher' element={<TeacherSignupPage/>}/>
        <Route path='/register/student' element={<StudentSignupPage/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>

  )
}

export default App