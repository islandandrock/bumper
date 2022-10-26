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

export const signUp = async (email, username, password) => {
  await handledFetch(server + '/signup', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      email: email,
      password: password
    })
  });
}

export const signIn = async (email, password) => {
  const response = await handledFetch(server + '/signin', {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      password: password
    })
  });
  data = await response.json();
  console.log(data)
  return [data.username, data.user_id];
}

export const addConnection = async (app_name, link) => {
  await handledFetch(server + "/connections/add", {
    method: 'POST',
    body: JSON.stringify({
      app_name: app_name,
      link: link
    })
  })
}

export const getConnections = async (user_id) => {
  const response = await handledFetch(server + "/connections/get/"+user_id, {
    method: 'GET'
  })
  let data = await response.json()
  return data
}

export const addFriend = async (friend_username, friend_id, username, user_id) => {
  await handledFetch(server + '/friends/add', {
    method: 'POST',
    body: JSON.stringify({
      friend_username: friend_username,
      friend_id: friend_id
    })
  });
}


export const getFriend = async (user_id) => {
  const response = await handledFetch(server + '/friends/get?user_id=' + user_id, {
    method: 'GET'
  });
  data = await response.json();
  return data
}