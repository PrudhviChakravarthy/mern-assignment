import LoginForm from './components/login';
import RegistrationForm from './components/register';

import { BrowserRouter, Routes, Route,Navigate, useNavigate } from 'react-router-dom';
import UserListPage from './components/userlist';

function App() {
  const navigate = useNavigate
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<UserListPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          {/* Remove the Register and Home routes */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
