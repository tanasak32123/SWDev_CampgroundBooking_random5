import { Link } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <section className="heading">
        <h1>A Campground Booking System</h1>
      </section>

      {!user ? (
        <Link to="/login" className="btn btn-block">
          <FaSignInAlt />
          Login
        </Link>
      ) : (
        <>Welcome, {user.name}</>
      )}
    </>
  );
}

export default Home;
