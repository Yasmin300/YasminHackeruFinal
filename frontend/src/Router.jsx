import { Routes, Route } from 'react-router-dom';
import Jobs from './components/jobs/jobs';              // All jobs
import FavJobs from './components/jobs/FavJobs';       // Favorite jobs
import MyJobs from './components/jobs/MyJobs';        // My posted jobs
import JobForm from './components/jobs/JobForm';       // Add/Edit job
import JobDetail from './components/jobs/explainBusiness';    // Job detail / explain
import Register from './components/register';
import Login from './components/Login';
import About from './components/about';
import EditProfile from './components/profileEdit';
import GetMyApplications from './components/jobs/myJobApplications';
import GetJobApplications from './components/jobs/showApplicants';
import Admin from './components/admin/admin';

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Jobs />} />                       {/* All jobs */}
            <Route path="/FavJobs" element={<FavJobs />} />             {/* Favorite jobs */}
            <Route path="/MyJobs" element={<MyJobs />} />               {/* Jobs posted by user */}
            <Route path="/AddJob" element={<JobForm />} />              {/* Add new job */}
            <Route path="/editJob/:jobId" element={<JobForm />} />      {/* Edit job */}
            <Route path="/job/:jobId" element={<JobDetail />} />         {/* Job detail */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/MyApplications" element={<GetMyApplications />} />             {/* Favorite jobs */}
            <Route path="/JobApplications/:jobId" element={<GetJobApplications />} />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
    );
}
