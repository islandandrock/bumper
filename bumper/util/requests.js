import file from './server.json'
let server = file.ip
if (server == "REPLACEME") {
  console.log("Change the IP in server.json!!!")
}

export class ServerError extends Error {
  constructor(code, name, description) {
    super(code);
    this.name = name;
    this.code = code;
    this.description = description;
  }
}

const handledFetch = async (resource, init={}) => {
  init.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
  const response = await fetch(resource, init)
  if (!response.ok) {
    let error = await response.json();
    throw new ServerError(response.status, error.name, error.description);
  }
  return response;
}

export function isCode(e, codes) {
  return (e instanceof ServerError && codes.includes(e.code))
}

export const signUp = async (username, email, password) => {
  await handledFetch(server + '/signup', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      email: email,
      password: password
    })
  });
}