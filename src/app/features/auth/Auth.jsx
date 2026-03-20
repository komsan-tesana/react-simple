import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/providers/auth";
import { Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

export function Auth() {
  const location = useLocation();
  const state = location.state;
  const [mode, setMode] = useState(state?.mode || "signup");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signUp, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    setError(null);
    let result;
    if (mode === "signup") {
      result = signUp(data.email, data.password);
    } else {
      result = login(data.email, data.password);
    }

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="auth-container">
          <h1 className="page-title">
            {mode === "signup" ? "Sign Up" : "Login"}
          </h1>
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                className="form-input"
                type="email"
                id="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  maxLength: {
                    value: 12,
                    message: "Password must be less than 12 characters",
                  },
                })}
                className="form-input"
                type="password"
                id="password"
              />
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>

              <div className="flex justify-center">
                <Button htmlType="submit" size="large" variant="solid" color="blue">
                  {mode === "signup" ? "Sign Up" : "Login"}
                </Button>
            </div>
          </form>

          <div className="auth-switch">
            {mode === "signup" ? (
              <p>
                Already have an account?
                <Button
                  variant="link"
                  color="blue"
                  onClick={() => setMode("login")}
                >
                  Login
                </Button>
              </p>
            ) : (
              <p>
                {" "}
                Don't have an account?
                <Button
                  variant="link"
                  color="blue"
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </Button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
