import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { UserDetailsPage } from './pages/user/UserDetailsPage';
import { UserFormPage } from './pages/user/UserFormPage';
import { UsersListPage } from './pages/user/UsersListPage';



import Home from './pages/home/Home';
import Provience from './pages/geography/Province';
import District from './pages/geography/District';
import DistrictList from './pages/geography/DistrictList';
import ProvinceList from './pages/geography/ProvinceList';
import MunicipalityList from './pages/geography/MunicipalityList';
import Municipality from './pages/geography/Municipality';
import MunicipalityDetails from './pages/geography/MuniciplaityDetails';

import Province from './pages/geography/Province';


import ProvinceDetails from './pages/geography/ProvinceDetails';
import Kyc from './pages/kyc/Kyc';
import KycList from './pages/kyc/KycList';
import KycDetails from './pages/kyc/KycDetails';
import DistrictDetails from './pages/geography/DistrictDetails';


// function AppLayout() {
//   const { logout } = useAuth();

//   return (
//     <div className="app-shell">
//       <header className="app-header">
//         <Link to="/">
//           <span className="">KYC</span>
//         </Link>
//         <div className="page-actions">
//           <Link className="btn" to="/login">
//             Login
//           </Link>
//           <Link className="btn" to="/register">
//             SignUp
//           </Link>
//           <button className="btn" onClick={logout}>
//             Logout
//           </button>
//         </div>
//       </header>
//       <Outlet />
//     </div>
//   );
// }
function App() {
  return (
    <AuthProvider>
      <Routes> 

        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <RequireAuth>
              {/* <AppLayout /> */}
              <Outlet/>
            </RequireAuth>
          }
        >
          <Route path="/home" element={<Home/>} />

          <Route path="/users" element={<UsersListPage />} />
          <Route path="/users/new" element={<UserFormPage />} />
          <Route path="/users/:id" element={<UserDetailsPage />} />
          <Route path="/users/:id/edit" element={<UserFormPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/provience-form" element={<Provience/>}/>
          
          <Route path="/district-form" element={<District/>}/>
          <Route path="/district-list" element={<DistrictList/>}/>
          <Route path="/district-details/:id" element={<DistrictDetails/>}/>
          <Route path="/district-form/:id/:edit" element={<District/>}/>

          <Route path="/province-lists" element={<ProvinceList/>}/>
          <Route path="/province-form" element={<Province/>}/>
          <Route path="/province-details/:id" element={<ProvinceDetails/>}/>
          <Route path="/province-form/:id/:edit" element={<Province/>}/>

          <Route path="/municipality-form" element={<Municipality/>}/>
          <Route path="/municipality-lists" element={<MunicipalityList/>}/>
          <Route path="municipality-details/:id" element={<MunicipalityDetails/>}/>
          <Route path="/municipality-form/:id/:edit" element={<Municipality/>}/>

          <Route path="/kyc-form"  element={<Kyc/>}/>
          <Route path="/kyc-lists" element={<KycList/>}/>
          <Route path="/kyc-details/:id" element={<KycDetails/>}/>
          <Route path="/kyc-form/:id/:edit"  element={<Kyc/>}/>
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AuthProvider>
  );
}


export default App;