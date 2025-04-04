import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HomePage, LoginPage, NotificationPage, ProfilePage, RegisterPage } from "./pages/index";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
// import { axiosInstance } from "./utils/axios";
function App() {

  const { data, isLoading } = useQuery({
    queryKey: ['auth/user'],
    // queryFn: async () => {
    //   try {
    //     const res = await axiosInstance.get('auth/user')
    //     return res.data
    //   } catch (error) {
    //     console.log(error);
    //     return null
    //   }
    // },
    retry: false
  })

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center">
      <LoadingSpinner size="lg" />
    </div>
  }
  return (

    <div className="max-w-6xl mx-auto flex" >
      <Router>
        {data && <Sidebar data={data} />}
        <Routes>
          <Route path="/" element={data ? <HomePage /> : <Navigate to={'/login'} />} />
          <Route path="/login" element={!data ? <LoginPage /> : <Navigate to={'/'} />} />
          <Route path="/register" element={!data ? <RegisterPage /> : <Navigate to={'/'} />} />
          <Route path="/notifications" element={data ? <NotificationPage /> : <Navigate to={'/login'} />} />
          <Route path="/profile/:username" element={data ? <ProfilePage /> : <Navigate to={'/login'} />} />
        </Routes>
        {data && <RightPanel />}
      </Router>
      <Toaster />
    </div >
  );
}

export default App;
