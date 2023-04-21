import { Link } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import styles from "../assets/css/Home.module.css";

function Home() {
  const { user } = useSelector((state) => state.auth);

  // const handleShowMe = () => {
  //   fetch(process.env.REACT_APP_BACKEND_URI + "/api/v5/auth/me", {
  //     credentials: "include",
  //   })
  //     .then((res) => res.json())
  //     .then((res) => console.log(res));
  // };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <div>
          <section className={`${styles.heading}`}>
            <h1>A Campground Booking System</h1>
          </section>

          {!user ? (
            <div>
              <Link to="/login" className="btn btn-block">
                <FaSignInAlt />
                &nbsp;Login
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-3">Welcome, {user.name}</div>
              {/* <button
                type="button"
                className="btn btn-block w-100"
                onClick={handleShowMe}
              >
                get me
              </button> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
