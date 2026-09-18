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
import ParentDashBoardPage from './pages/ParentDashBoardPage';
import SuiviDemandePage from './pages/SuiviDemandePage';
import AssignmentDetailPage from './pages/AssignmentWorkspacePage';
import PaymentsPage from './pages/PaymentsPage';
import ChildResultsPage from './pages/ChildResultsPage';
import LeaveReviewPage from './pages/LeaveReviewPage';
import DisputesPage from './pages/DisputesWorkspacePage';
import LearningPlatformPage from './pages/LearningWorkspacePage';
import AccountSettingsPage from './pages/AccountSettingsPage';
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
        <Route path='/parent-dashboard' element={<ParentDashBoardPage/>}/>
        <Route path='/suivi-demande' element={<SuiviDemandePage/>}/>
        <Route path='/affectation' element={<AssignmentDetailPage/>}/>
        <Route path='/paiements' element={<PaymentsPage/>}/>
        <Route path='/resultats-scolaires' element={<ChildResultsPage/>}/>
        <Route path='/laisser-un-avis' element={<LeaveReviewPage/>}/>
        <Route path='/litiges' element={<DisputesPage/>}/>
        <Route path='/learning-platform' element={<LearningPlatformPage/>}/>
        <Route path='/parametres' element={<AccountSettingsPage/>}/>
      </Routes>
    </BrowserRouter>

  )
}

export default App
