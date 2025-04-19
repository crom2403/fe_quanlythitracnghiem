import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import path from './utils/path';
import Public from './pages/public/Public';
import Home from './modules/home/Home';
import Module from './modules/module/Module';
import Login from './modules/login/Login';
import Group from './modules/group/Group';
import GroupDetail from './modules/groupdetail/GroupDetail';
import ExamPaper from './modules/exampaper/ExamPaper';
import Question from './modules/question/Question';
import User from './modules/user/User';
import Subject from './modules/subject/Subject';
import Assignment from './modules/assignment/Assignment';
import FinishedTest from './modules/finishedtest/FinishedTest';
import Notification from './modules/notification/Notification';
import Test from './modules/test/Test';
import CourseGroups from './modules/svcourse/CourseGroup';
import Exam from './modules/test/Exam';
import Question123 from './modules/question123/question123';
import Examanagement from './modules/exam/ExamManagement';
import CourseManagement from './modules/coursemanagement/CourseManagement';
function App() {
  return (
    <div className="min-h-screen">
      <Router>
        <Routes>
          <Route path={path.PUBLIC} element={<Public />}>
            {/* Các route con của Public sử dụng đường dẫn tương đối */}
            <Route path={path.HOME.substring(1)} element={<Home />} />
            <Route path={path.GROUP.substring(1)} element={<Group />} />
            <Route
              path={path.GROUPDETAIL.substring(1)}
              element={<GroupDetail />}
            />
            <Route path={path.EXAMPAPER.substring(1)} element={<ExamPaper />} />
            <Route path={path.QUESTION.substring(1)} element={<Question />} />
            <Route path={path.Question123.substring(1)} element={<Question123 />} />
            <Route path={path.USER.substring(1)} element={<User />} />
            <Route path={path.MODULE.substring(1)} element={<Module />} />
            <Route path={path.SUBJECT.substring(1)} element={<Subject />} />
            <Route path={path.TEST.substring(1)} element={<Test />} />
            <Route path={path.EXAM.substring(1)} element={<Exam />} />
            <Route path={path.EXAMMANAGEMENT.substring(1)} element={<Examanagement />} />
            <Route path={path.COURSEMANAGEMENT.substring(1)} element={<CourseManagement />} />

            <Route path={path.COURSEGROUP.substring(1)} element={<CourseGroups />} />

            <Route
              path={path.ASSIGNMENT.substring(1)}
              element={<Assignment />}
            />
             <Route path={path.FINISHEDTEST.substring(1)} element={<FinishedTest />} />
             <Route path={path.NOTIFICATION.substring(1)} element={<Notification />} />
          </Route>

          <Route path={path.LOGIN} element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;