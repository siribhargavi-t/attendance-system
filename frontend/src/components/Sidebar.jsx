import { FaHome, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 bg-blue-600 text-white p-5">
      <h2 className="text-2xl font-bold mb-8">AMS</h2>

      <ul className="space-y-4">
        <Link to="/dashboard">
          <li className="flex items-center gap-2 hover:opacity-80">
            <FaHome /> Dashboard
          </li>
        </Link>

        <Link to="/attendance">
          <li className="flex items-center gap-2 hover:opacity-80">
            <FaClipboardList /> Attendance
          </li>
        </Link>
      </ul>
    </div>
  );
}