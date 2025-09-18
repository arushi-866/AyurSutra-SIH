import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import Notifications from './components/Notifications';
import Feedback from './components/Feedback';
import PatientManagement from './components/PatientManagement';
import Analytics from './components/Analytics';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;