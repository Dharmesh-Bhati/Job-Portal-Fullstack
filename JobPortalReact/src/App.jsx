import { createBrowserRouter, RouterProvider } from 'react-router-dom'; 
import Layout from './Components/Layout'
import HomeLayout from './Components/HomeLayout'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/Register';
import ConfirmEmail from './Pages/ConfirmEmail';
import AddJobSeekerDetails from './Pages/JobSeeker/AddJobSeekerDetails';
import MyResume from './Pages/JobSeeker/MyResume';
import CompanyAddress from './Pages/Recruiter/CompanyAddress';
import JobPost from './Pages/Job/JobPost';
import AllJobs from './Pages/Job/AllJobs';
import JobDetails from './Pages/Job/JobDetails';
import ManageJobs from './Pages/Job/ManageJobs';
import EditJob from './Pages/Job/EditJob';
import ViewApplicants from './Pages/ManageApplication/ViewApplicants';
import ManageApplications from './Pages/ManageApplication/ManageApplications';
import ViewSeekerApplication from './Pages/ManageApplication/ViewSeekerApplication';
import MyApplication from './Pages/JobSeeker/MyApplication';
import SearchResult from './Pages/Job/SearchResult';


const router = createBrowserRouter([
    {
        path: '/', // Homepage route
        element: <HomeLayout />,
        children: [{
            path: '/',
            element: <HomePage />,
        }],
    },
    {
        path: '/', // Login page route
        element: <Layout />,
        children: [
            //Account controller
            {path: '/login',element: <LoginPage />},
            { path: '/register', element: <RegisterPage /> },
            { path: '/confirm-email', element: <ConfirmEmail /> }, 

            //JobSeeker controller
            { path: '/JobSeeker/AddJobSeekerDetails', element: <AddJobSeekerDetails />}, 
            { path: '/jobseeker/myresume', element: <MyResume /> }, 

            //Recruiter controller
            { path: '/Recruiter/Registercompany', element: <CompanyAddress /> }, 

            //Job controller
            { path: '/Job/PostJob', element: <JobPost /> }, 
            { path: '/Job/AllJobs', element: <AllJobs /> }, 
            { path: '/job-detail/:id', element: <JobDetails /> }, 
            { path: '/Job/ManageJobs', element: <ManageJobs /> }, 
            { path: '/Job/EditJob/:id', element: <EditJob /> }, 
            { path: '/Job/SearchResults', element: <SearchResult /> }, 

            //ManageApplication controller
            { path: '/ManageApplication/ViewApplicants/:jobId', element: <ViewApplicants /> }, 
            { path: '/ManageApplication/ManageApplications', element: <ManageApplications /> }, 
            { path: '/ManageApplication/ViewSeekerApplication/:id', element: <ViewSeekerApplication /> }, 
            { path: '/ManageApplication/MyApplication', element: <MyApplication/> }, 
            

        ],
    },
]);
function App() {
 
  return (
	<>
	  <div >
              <RouterProvider router={router} />
	  </div>
	  
	</>
  )
}

export default App

 