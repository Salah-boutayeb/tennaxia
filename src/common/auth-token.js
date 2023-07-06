const ID_TOKEN_KEY = 'token';

export const getToken = () => {
    // console.log(window.localStorage.getItem('ID_TOKEN_KEY').charAt(0));
    return window.localStorage.getItem('token');
};

export const saveToken = (token) => {
    window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const destroyToken = () => {
    console.log('destroy');
    window.localStorage.removeItem(ID_TOKEN_KEY);
};

export default { getToken, saveToken, destroyToken };
