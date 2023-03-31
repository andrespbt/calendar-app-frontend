import { useDispatch, useSelector } from 'react-redux';
import calendarApi from '../api/calendarApi';
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from '../store';

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  // Login
  const startLogin = async ({ email, password }) => {
    dispatch(onChecking());

    try {
      const {
        data: { name, uid, token },
      } = await calendarApi.post('/auth', { email, password });

      localStorage.setItem('token', token);
      localStorage.setItem('token-init-date', new Date().getTime());
      dispatch(onLogin({ name, uid }));
    } catch (error) {
      dispatch(onLogout('Incorrect credentials'));

      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  //   Register
  const startRegister = async ({ email, name, password }) => {
    dispatch(onChecking());

    try {
      const {
        data: { token, uid },
      } = await calendarApi.post('/auth/new', { name, email, password });

      localStorage.setItem('token', token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(onLogin({ name, uid }));
    } catch (error) {
      dispatch(onLogout(error.response.data?.msg || 'There is an error, please check your inputs'));

      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');

    if (!token) return dispatch(onLogout());

    try {
      const {
        data: { name, uid, token },
      } = await calendarApi.get('/auth/renew');

      localStorage.setItem('token', token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(onLogin({ name, uid }));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout());
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  };

  return {
    // properties
    errorMessage,
    status,
    user,

    // methods
    checkAuthToken,
    startLogin,
    startLogout,
    startRegister,
  };
};
