import React from 'react'
import LandingPage from './pages/LandingPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchResultsPage from './pages/SearchResultsPage'
import TeacherProfilePublicPage from './pages/TeacherProfilePublicPage';
import ParentSignupPage from './pages/ParentSignupPage';
import TeacherSignupPage from './pages/TeacherSignupPage';
import Register from './pages/SignupRoleChoicePage';
import StudentSignupPage from './pages/StudentSignupPage';
import Login from './pages/LoginPage';
import ParentDashBoardPage from './pages/ParentDashboardPage';
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
import StudentResourcesPage from './pages/StudentResourcesPage';
import StudentResultsPage from './pages/StudentResultsPage';
import StudentExamPreparationPage from './pages/StudentExamPreparationPage'
import StudentAchievementsPage from './pages/StudentAchievementsPage'
import StudentNotificationsPage from './pages/StudentNotificationsPage'
import StudentProfilePage from './pages/StudentProfilePage'

import TeacherDashboard from './pages/TeacherDashboardPage';
import TeacherProfilePage from './pages/TeacherProfilePage';
import TeacherStudentsPage from './pages/TeacherStudentsPage';
import TeacherAssignmentsPage from './pages/TeacherAssignmentsPage';
import TeacherCalendarPage from './pages/TeacherCalendarPage';
import TeacherLectureNotesPage from './pages/TeacherLectureNotesPage';
import TeacherAssessments from './pages/TeacherAssessmentsPage';
import TeacherReputationPage from './pages/TeacherReputationPage';
import TeacherEarningsPage from './pages/TeacherEarningsPage';
import TeacherExamPreparationPage from './pages/TeacherExamPreparationPage';
import TeacherSettingsPage from './pages/TeacherSettingsPage'
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminTeachersPage from './pages/AdminTeachersPage';
import AdminAcademicPage from './pages/AdminAcademicPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import AdminTutoringPage from './pages/AdminTutoringPage';
import AdminDisputesPage from './pages/AdminDisputesPage';
import AdminContentPage from './pages/AdminContentPage';
import AdminExamsRewardsPage from './pages/AdminExamsRewardsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import AdminPermissionsPage from './pages/AdminPermissionsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminExamRewardDetailPage from './pages/AdminExamRewardDetailPage';
import AdminDisputeDetailsPage from './pages/AdminDisputeDetailPage';
import AdminTeacherDetailsPage from './pages/AdminTeacherDetailPage';
import AdminTutoringDetailsPage from './pages/AdminTutoringDetailPage';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path='/teacher-public/profile' element={<TeacherProfilePublicPage />} />
        <Route path='/register/parent' element={<ParentSignupPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/register/teacher' element={<TeacherSignupPage />} />
        <Route path='/register/student' element={<StudentSignupPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/parent-dashboard' element={<ParentDashBoardPage />} />
        <Route path='/student-dashboard' element={<StudentDashboardPage />} />
        <Route path='/student-learning' element={<StudentLearningPage />} />
        <Route path='/student-learning/mathematics' element={<StudentSubjectPage />} />
        <Route path='/student-teachers' element={<StudentTeachersPage />} />
        <Route path='/student-schedule' element={<StudentSchedulePage />} />
        <Route path='/student-assessments' element={<StudentAssessmentsPage />} />
        <Route path='/student-results' element={<StudentResultsPage />} />
        <Route path='/student-achievements' element={<StudentAchievementsPage />} />
        <Route path='/student-exam-preparation' element={<StudentExamPreparationPage />} />
        <Route path='/student-resources' element={<StudentResourcesPage />} />
        <Route path='/student-notifications' element={<StudentNotificationsPage />} />
        <Route path='/student-profile' element={<StudentProfilePage />} />
        <Route path='/suivi-demande' element={<SuiviDemandePage />} />
        <Route path='/affectation' element={<AssignmentDetailPage />} />
        <Route path='/parent-teachers' element={<ParentTeachersPage />} />
        <Route path='/parent-schedule' element={<ParentSchedulePage />} />
        <Route path='/child-progress' element={<ParentProgressPage />} />
        <Route path='/paiements' element={<PaymentsPage />} />
        <Route path='/resultats-scolaires' element={<ChildResultsPage />} />
        <Route path='/laisser-un-avis' element={<LeaveReviewPage />} />
        <Route path='/litiges' element={<DisputesPage />} />
        <Route path='/learning-platform' element={<LearningPlatformPage />} />
        <Route path='/parametres' element={<AccountSettingsPage />} />
        <Route path='/teacher-dashboard' element={<TeacherDashboard />} />
        <Route path='/teacher-profile' element={<TeacherProfilePage />} />
        <Route path='/teacher-students' element={<TeacherStudentsPage />} />
        <Route path='/teacher-assignments' element={<TeacherAssignmentsPage />} />
        <Route path='/teacher-calendar' element={<TeacherCalendarPage />} />
        <Route path='/teacher-lecture-notes' element={<TeacherLectureNotesPage />} />
        <Route path='/teacher-assessments' element={<TeacherAssessments />} />
        <Route path='/teacher-reputation' element={<TeacherReputationPage />} />
        <Route path='/teacher-earnings' element={<TeacherEarningsPage />} />
        <Route path='/teacher-exam-preparation' element={<TeacherExamPreparationPage />} />
        <Route path='/teacher-settings' element={<TeacherSettingsPage />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path='/admin-users' element={<AdminUsersPage />} />
        <Route path='/admin-teachers' element={<AdminTeachersPage />} />
        <Route path='/admin-academic' element={<AdminAcademicPage />} />
        <Route path='/admin-finance' element={<AdminPaymentsPage />} />
        <Route path='/admin-tutoring' element={<AdminTutoringPage />} />
        <Route path='/admin-disputes' element={<AdminDisputesPage />} />
        <Route path='/admin-content' element={<AdminContentPage />} />
        <Route path='/admin-exams-rewards' element={<AdminExamsRewardsPage />} />
        <Route path='/admin-analytics' element={<AdminAnalyticsPage />} />
        <Route path='/admin-notifications' element={<AdminNotificationsPage />} />
        <Route path='/admin-permissions' element={<AdminPermissionsPage />} />
        <Route path='/admin-settings' element={<AdminSettingsPage />} />
        <Route path="/admin-exams-rewards/:id" element={<AdminExamRewardDetailPage />} />
        <Route path="/admin-disputes/DSP-006" element={<AdminDisputeDetailsPage />} />
        <Route path="/admin-teachers/:id" element={<AdminTeacherDetailsPage />} />
        <Route path='/admin-tutoring/TUT-004' element={<AdminTutoringDetailsPage/>}/>




      </Routes>
    </BrowserRouter>

  )
}

export default App
