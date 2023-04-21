import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { register, reset } from "../features/auth/authSlice";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    tel: "",
    // role: "user",
  });

  const { name, email, password, password2, tel } = formData;

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user, isError, isSuccess, message } = useSelector((state) => {
    return state.auth;
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    //redirect when logged in
    if (isSuccess || user) {
      navigate("/");
    }
    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        name,
        email,
        password,
        tel,
        // role,
      };
      dispatch(register(userData));
    }
  };

  return (
    <>
      <section className="heading text-center">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Enter Your name"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter Your email"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter Your password"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password2">Re-confirm password</label>
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              placeholder="Confirm Your password"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="tel">Telephone number</label>
            <input
              type="text"
              className="form-control"
              id="tel"
              name="tel"
              value={tel}
              onChange={onChange}
              placeholder="Enter Your Telephone Number"
              required
            />
          </div>
          <div className="form-group mb-4">
            <button className="btn btn-block w-100">Submit</button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
