import React from 'react'
import LandingPage from './pages/LandingPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  SearchResultsPage  from './pages/SearchResultsPage'
import TeacherProfilePublicPage from './pages/TeacherProfilePublicPage';
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
import ParentTeachersPage from './pages/ParentTeachersPage';
import ParentSchedulePage from './pages/ParentSchedulePage';
import ParentProgressPage from './pages/ParentProgressPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentLearningPage from './pages/StudentLearningPage';
import StudentSubjectPage from './pages/StudentSubjectPage';
import StudentTeachersPage from './pages/StudentTeachersPage';
import StudentSchedulePage from './pages/StudentSchedulePage';
import StudentAssessmentsPage from './pages/StudentAssessmentsPage';
import { StudentAchievementsPage, StudentExamPreparationPage, StudentNotificationsPage, StudentProfilePage, StudentResourcesPage, StudentResultsPage } from './pages/StudentAdditionalPages';
import TeacherDashboard from './pages/TeacherDashboardPage';
import TeacherProfilePage from './pages/TeacherProfilePage';
import TeacherStudentsPage from './pages/TeacherStudentsPage';
import TeacherAssignmentsPage from './pages/TeacherAssignmentsPage';
import TeacherCalendarPage from './pages/TeacherCalendarPage';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path='/teacher-public/profile' element={<TeacherProfilePublicPage />} />
        <Route path='/register/parent' element={<ParentSignupPage/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/register/teacher' element={<TeacherSignupPage/>}/>
        <Route path='/register/student' element={<StudentSignupPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/parent-dashboard' element={<ParentDashBoardPage/>}/>
        <Route path='/student-dashboard' element={<StudentDashboardPage/>}/>
        <Route path='/student-learning' element={<StudentLearningPage/>}/>
        <Route path='/student-learning/mathematics' element={<StudentSubjectPage/>}/>
        <Route path='/student-teachers' element={<StudentTeachersPage/>}/>
        <Route path='/student-schedule' element={<StudentSchedulePage/>}/>
        <Route path='/student-assessments' element={<StudentAssessmentsPage/>}/>
        <Route path='/student-results' element={<StudentResultsPage/>}/>
        <Route path='/student-achievements' element={<StudentAchievementsPage/>}/>
        <Route path='/student-exam-preparation' element={<StudentExamPreparationPage/>}/>
        <Route path='/student-resources' element={<StudentResourcesPage/>}/>
        <Route path='/student-notifications' element={<StudentNotificationsPage/>}/>
        <Route path='/student-profile' element={<StudentProfilePage/>}/>
        <Route path='/suivi-demande' element={<SuiviDemandePage/>}/>
        <Route path='/affectation' element={<AssignmentDetailPage/>}/>
        <Route path='/parent-teachers' element={<ParentTeachersPage/>}/>
        <Route path='/parent-schedule' element={<ParentSchedulePage/>}/>
        <Route path='/child-progress' element={<ParentProgressPage/>}/>
        <Route path='/paiements' element={<PaymentsPage/>}/>
        <Route path='/resultats-scolaires' element={<ChildResultsPage/>}/>
        <Route path='/laisser-un-avis' element={<LeaveReviewPage/>}/>
        <Route path='/litiges' element={<DisputesPage/>}/>
        <Route path='/learning-platform' element={<LearningPlatformPage/>}/>
        <Route path='/parametres' element={<AccountSettingsPage/>}/>
        <Route path='/teacher-dashboard' element={<TeacherDashboard/>}/>
        <Route path='/teacher-profile' element={<TeacherProfilePage/>}/>
        <Route path='/teacher-students' element={<TeacherStudentsPage/>}/>
        <Route path='/teacher-assignment' element={<TeacherAssignmentsPage/>}/>
        <Route path='/teacher-calendar' element={<TeacherCalendarPage/>}/>

      </Routes>
    </BrowserRouter>

  )
}

export default App
