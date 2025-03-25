import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage, LoginPage, NotificationPage, RegisterPage } from "./pages/index";
import Sidebar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
function App() {
  return (
    <div className="max-w-6xl mx-auto flex" >
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Routes>
        <RightPanel />
      </Router>
    </div >
  );
}

export default App;
