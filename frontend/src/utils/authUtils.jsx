export const isAuthenticated = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token;
  };
  
  export const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'admin';
  };
  