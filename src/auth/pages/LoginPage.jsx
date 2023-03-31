import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore, useForm } from '../../hooks';
import './LoginPage.css';

const loginFormFields = {
  loginEmail: '',
  loginPassword: '',
};

const registerFormFields = {
  registerName: '',
  registerEmail: '',
  registerPassword: '',
  registerPassword2: '',
};

export const LoginPage = () => {
  const { startLogin, errorMessage, startRegister } = useAuthStore();
  const { loginEmail, loginPassword, onInputChange: onLoginInputChange } = useForm(loginFormFields);
  const { registerName, registerEmail, registerPassword, registerPassword2, onInputChange } =
    useForm(registerFormFields);

  useEffect(() => {
    if (errorMessage !== undefined) {
      Swal.fire('Authentication error', errorMessage, 'error');
    }
  }, [errorMessage]);

  const loginSubmit = e => {
    e.preventDefault();

    startLogin({ email: loginEmail, password: loginPassword });
  };

  const registerSubmit = e => {
    e.preventDefault();

    if (registerPassword !== registerPassword2) {
      Swal.fire('Passwords must match', undefined, 'error');
      return;
    }
    if (registerName === '') {
      Swal.fire('Name is required', undefined, 'error');
      return;
    }
    if (registerPassword === '') {
      Swal.fire('Passwords are required', undefined, 'error');
      return;
    }

    startRegister({ email: registerEmail, name: registerName, password: registerPassword });
  };

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-6 login-form-1">
          <h3>Login</h3>
          <form onSubmit={loginSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                name="loginEmail"
                value={loginEmail}
                onChange={onLoginInputChange}
                autoComplete="username"
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                name="loginPassword"
                value={loginPassword}
                onChange={onLoginInputChange}
                autoComplete="current-password"
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Login"
              />
            </div>
          </form>
        </div>

        <div className="col-md-6 login-form-2">
          <h3>Register</h3>
          <form onSubmit={registerSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                name="registerName"
                value={registerName}
                onChange={onInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="registerEmail"
                value={registerEmail}
                onChange={onInputChange}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="registerPassword"
                value={registerPassword}
                onChange={onInputChange}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Repeat password"
                name="registerPassword2"
                value={registerPassword2}
                onChange={onInputChange}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group mb-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Crear cuenta"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
