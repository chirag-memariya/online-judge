import CodeEditor from '../components/problem/CodeEditor';
import ProblemDiscription from '../components/problem/ProblemDiscription';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import AdminNavbar from '../components/admin/AdminNavbar';
import { useAuth } from '../context/AuthContext';

const Problem = () => {
  const location = useLocation();
  const item = location.state?.item;
  const {isAdmin} = useAuth();

  return (
    <>
      {isAdmin ? <AdminNavbar /> : <Navbar />}
      <div className="flex flex-row justify-between">
        <ProblemDiscription item={item} />
        {item && item._id && (
          <CodeEditor problemId={item._id} />
        )}
      </div>
    </>
  );
};

export default Problem;
