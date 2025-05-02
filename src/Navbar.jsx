import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex space-x-6 p-4 bg-white shadow-md mb-6">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `text-lg font-semibold transition-colors ${
            isActive ? "text-blue-600 underline" : "text-gray-700 hover:text-blue-500"
          }`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          `text-lg font-semibold transition-colors ${
            isActive ? "text-blue-600 underline" : "text-gray-700 hover:text-blue-500"
          }`
        }
      >
        Admin
      </NavLink>
      <NavLink
        to="/add-transaction"
        className={({ isActive }) =>
          `text-lg font-semibold transition-colors ${
            isActive ? "text-blue-600 underline" : "text-gray-700 hover:text-blue-500"
          }`
        }
      >
        Add Transaction
      </NavLink>
    </nav>
  );
}