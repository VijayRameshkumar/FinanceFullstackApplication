import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'; // Import the power-off icon
import {getUserPermissions } from '../services/api';

const Sidebar = ({ setIsAuthenticated }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [permissions, setPermissions] = useState({
    can_access_budget_analysis: false,
    can_access_accounts: false,
    can_access_analysis_report: false,
  });

  const navigate = useNavigate(); // Initialize useNavigate for redirection

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('id');
        if (token) {
          const response = await getUserPermissions(user_id);
          setIsAdmin(response.data.is_admin);
          setPermissions({
            can_access_budget_analysis: response.data.can_access_budget_analysis,
            can_access_accounts: response.data.can_access_accounts,
            can_access_analysis_report: response.data.can_access_analysis_report,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('id'); // Remove user ID
    localStorage.removeItem('email'); // Remove email
    localStorage.removeItem('is_admin'); // Remove admin status

    setIsAuthenticated(false); // Update authentication state
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="bg-gray-800 text-white w-64 p-4 min-h-screen">
      <h1 className="text-xl font-bold text-blue-200">Synergy Analysis</h1>
      <ul className="mt-4">
        <li className="mb-1"><Link to="/dashboard" className="hover:text-Cyan-blue">Dashboard</Link></li>

        {isAdmin && (
          <>
            <li className="mb-1"><Link to="/admin-console" className="hover:text-Cyan-blue">Admin Console</Link></li>
          </>
        )}

        {permissions.can_access_budget_analysis && (
          <li className="mb-1"><Link to="/budget-analysis" className="hover:text-Cyan-blue">Budget Analysis</Link></li>
        )}
        {permissions.can_access_accounts && (
          <li className="mb-1"><Link to="/accounts" className="hover:text-Cyan-blue">Accounts</Link></li>
        )}
        {permissions.can_access_analysis_report && (
          <li className="mb-1"><Link to="/analysis-report" className="hover:text-Cyan-blue">Analysis Report</Link></li>
        )}
         <li className="mb-1"><Link to="/profile" className="hover:text-Cyan-blue">Profile</Link></li>

        {/* Logout Option with Power Off Icon */}
        <li className="mt-4">
          <button onClick={handleLogout} className="hover:text-red-800 text-red-500 flex items-center">
            <FontAwesomeIcon icon={faPowerOff} className="mr-2" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
