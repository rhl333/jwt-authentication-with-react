import { useFormik } from "formik";
import "./resetPassword.scss";

const ResetPassword = () => {
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: (currState) => {
      const errors = {};
      if (!currState.password) errors.password = "Password is required*";
      else if (currState.password.length < 5) errors.password = "Password must be greater than 5 characters.";
      return errors;
    },
    onSubmit: (currState) => {
      console.log(currState);
    },
  });
  return (
    <div className="resetPasswordForm">
      <div className="resetPasswordContainer">
        <p className="msg">Choose a strong password and note it somewhere. the password length must be greater than 5 characters. </p>
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="password">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              autoComplete="on"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <p>{formik.errors.password && formik.touched.password ? formik.errors.password : ""}</p>
          </div>

          <div className="submitBtn">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
