
export const isTokenValid = () => {
    const token = sessionStorage.getItem(btoa('token'));
    if (!token) return false;
  
    const parsedToken = JSON.parse(atob(token.split('.')[1]));
    const expiry = parsedToken.exp;
    const now = new Date();
    return now.getTime() < expiry * 1000; // Convierte a milisegundos y compara
  };
  