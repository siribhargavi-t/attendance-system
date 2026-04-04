import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MarkAttendance from "./pages/MarkAttendance";
import ViewAttendance from "./pages/ViewAttendance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mark" element={<MarkAttendance />} />
        <Route path="/view" element={<ViewAttendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;