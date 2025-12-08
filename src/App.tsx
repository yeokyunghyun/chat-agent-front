import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainPage from "./pages/MainPage";
import Register from './pages/Register';
import MainLayout from './layouts/MainLayout';
import InquiryTypePage from './pages/InquiryTypePage';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route element={<MainLayout />}>
          <Route path="/agent" element={<MainPage />} />
          <Route path="/inquiry-types" element={<InquiryTypePage />} />
        </Route>


        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
