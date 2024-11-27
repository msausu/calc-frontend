
const loginEndpoint = import.meta.env.VITE_APP_LOGIN_ENDPOINT || '';
const isBasicLogin = import.meta.env.VITE_APP_LOGIN_BASIC || false;

const basicAuthHeader = (username: string, password: string) => {
  return {
    Authorization: 'Basic ' + btoa(username + ':' + password),
    'Content-Type': 'application/json',
    }
};

const doBasicLogin = async (username: string, password: string) => {
  return await fetch(loginEndpoint, {
    method: "POST",
    headers: new Headers(basicAuthHeader(username, password)),
    credentials: 'include',
  });
}

const doFormLogin = async (username: string, password: string) => {
  return await fetch(loginEndpoint + '-form', {
    method: "POST",
    headers: new Headers({'Content-Type': 'application/json'}),
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
}

const doLogin = isBasicLogin ? doBasicLogin : doFormLogin; 

export default async function getAuthorization(username: string, password: string): Promise<string> {
  const response = await doLogin(username, password);
  if (response.ok) {
    const authHeader = response.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader;
    }
  }
  throw new Error('invalid username/password');
}
