import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/problem/CodeEditor';
import ProblemDiscription from '../components/problem/ProblemDiscription';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import isAdmin from '../utils/authUtils';
import AdminNavbar from '../components/admin/AdminNavbar';

const Problem = () => {
  const location = useLocation();
  const item = location.state?.item;
  const [admin, setAdmin] = useState(false); // State to manage admin status

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      const result = await isAdmin();
      setAdmin(result);
    };
    checkAdmin();
  }, []);

  return (
    <>
      {admin ? <AdminNavbar /> : <Navbar />}
      <div className="flex flex-row justify-between p-4 space-x-4">
        <ProblemDiscription item={item} />
        {item && item._id && (
          <CodeEditor problemId={item._id} />
        )}
      </div>
    </>
  );
};

export default Problem;
