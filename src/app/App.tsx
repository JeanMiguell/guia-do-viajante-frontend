import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Home } from './components/Home';
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Timeline } from '../pages/timeline/ViewTimelinePage';
import { Timelines } from '../pages/timeline/ViewTimelinesPage';
import { CreateTimelinePage } from '../pages/timeline/CreateTimelinePage';
import { CreateFullTimelinePage } from '../pages/timeline/CreateFullTimelinePage';
import { UpdateFullTimelinePage } from '../pages/timeline/UpdateFullTimelinePage';
import { InviteStudentsPage } from '../pages/timeline/InviteStudentsPage';
import { StudentProgressPage } from '../pages/timeline/StudentProgressPage';
import { InteractiveScene } from './components/InteractiveScene';
import { Assessment } from '../pages/Assessment';
import { UnitPage } from '../pages/UnitPage';
import { Profile } from '../pages/Profile';
import { Activities } from '../pages/Activities';
import { ResultPage } from '../pages/ResultPage';
import ResultsPage from '../pages/Results';
import LandingPage from '../pages/LandingPage';
import { Toaster } from "sonner";
import { CreateFullActivityPage } from '../pages/activity/CreateFullActivityPage';
import { ViewTimelineActivitiesPage } from '../pages/activity/ViewTimelineActivitiesPage';
import { UpdateFullActivityPage } from '../pages/activity/UpdateFullActivityPage';
import { CompleteProfilePage } from '../pages/CompleteProfilePage';

export default function App() {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Router>

      <div className="min-h-screen">

        <Routes>

          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/complete-profile" element={<CompleteProfilePage />} />

          <Route path="/home" element={<Home />} />

          <Route path="/timelines" element={<Timelines />} />

          <Route
            path="/timelines/create"
            element={<CreateTimelinePage />}
          />

          <Route
            path="/timelines/full/create"
            element={<CreateFullTimelinePage />}
          />

          <Route
            path="/timelines/full/update/:timelineId"
            element={<UpdateFullTimelinePage />}
          />

          <Route
            path="/timelines/:timelineId/students"
            element={<InviteStudentsPage />}
          />
          <Route
            path="/timelines/:timelineId/progress"
            element={<StudentProgressPage />}
          />

          <Route
            path="/timeline/:timelineId"
            element={<Timeline />}
          />

          <Route
            path="/activities/full/update/:activityId"
            element={<UpdateFullActivityPage />}
          />

          <Route
            path="/scene/:eventId"
            element={<InteractiveScene />}
          />

          <Route
            path="/activities/:unitId"
            element={<Activities />}
          />

          <Route
            path="/activities/start/:activityId"
            element={<Activities />}
          />

          <Route
            path="/activities/timeline/:timelineId"
            element={<ViewTimelineActivitiesPage />}
          />

          <Route
            path="/perfil"
            element={<Profile />}
          />

          <Route
            path="/activities/full/create"
            element={<CreateFullActivityPage />}
          />

          <Route
            path="/result"
            element={<ResultPage />}
          />

          <Route
            path="/assessment/:timelineId"
            element={<Assessment />}
          />

          <Route
            path="/unit/:id"
            element={<UnitPage />}
          />

          <Route
            path="/results/:timelineId"
            element={<ResultsPage />}
          />

        </Routes>

        <Toaster richColors position="top-right" />

      </div>

    </Router>
    </GoogleOAuthProvider>
  );
}