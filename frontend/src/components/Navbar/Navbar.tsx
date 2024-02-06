import { Dispatch, SetStateAction, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  token: boolean;
  settoken: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ token, settoken }) => {
    const navigate = useNavigate();
    function handleLogout(){
        console.log('first')
        settoken(false);
        localStorage.removeItem('token');
        navigate('/login');
    }
  return (
    <div className="h-20 bg-slate-400 flex items-center justify-between">
      <h1 className="text-4xl font-sans font-bold">TaskForge</h1>
      <div className="flex gap-2 p-2">
        {!token ? (
          <>
            <Link to={'/login'} className="bg-sky-600 px-3 py-2 rounded-md font-sans font-medium">
              Login
            </Link>
            <Link to={'/signup'} className="border-2 border-sky-600 px-3 py-2 rounded-md font-sans font-medium">
              Sign Up
            </Link>
          </>
        ) : (
          <button className="bg-sky-600 px-3 py-2 rounded-md font-sans font-medium" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
