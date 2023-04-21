import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaCampground,
  FaBook,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import styles from "../assets/css/Header.module.css";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header
      className={`${styles.header} d-flex justify-content-between align-items-center py-3`}
    >
      <div className="logo">
        <Link to="/">
          <FaCampground />
          &nbsp;Campground
        </Link>
      </div>
      <ul className={`d-flex align-items-center justify-content-between mb-0`}>
        {user ? (
          <>
            {user.role === "admin" && (
              <li>
                <Link to="/statistic">
                  <FaBook />
                  Statistics
                </Link>
              </li>
            )}
            <li>
              <button className="btn" onClick={onLogout}>
                <FaSignOutAlt />
                &nbsp;Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt />
                &nbsp;Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser />
                &nbsp;Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
