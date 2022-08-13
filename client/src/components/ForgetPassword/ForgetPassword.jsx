import "./forgetPassword.scss";

import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";

const ForgetPassword = () => {
  const [msg, setMsg] = useState(() => "");
  const [color, setColor] = useState(() => "");
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: (currState) => {
      const errors = {};
      if (!currState.email) errors.email = "Email is required*";
      return errors;
    },
    onSubmit: async (currState) => {
      try {
        setMsg(() => "");
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/forgetpassword`, {
          email: currState.email.toLowerCase(),
        });
        console.log(response.data);
      } catch (error) {
        console.log(error.response.data.msg);
        setMsg(() => error?.response?.data?.msg);
        setColor(() => "red");
      }
    },
  });
  return (
    <div className="forgetPasswordForm">
      <div className="forgetPasswordContainer">
        <p className="msg">Enter your valid email address below and we will send you a verification link in your email.</p>
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="email">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            <p>{formik.errors.email && formik.touched.email ? formik.errors.email : ""}</p>
          </div>

          {msg && <p style={{ color: color, marginTop: "0.6rem", fontSize: "0.9rem" }}>{msg}.</p>}

          <div className="submitBtn">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
