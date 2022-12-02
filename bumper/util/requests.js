import { Alert } from 'react-native';
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
  let response = null;
  try {
    response = await fetch(resource, init)
  } catch (e) {
    if (e instanceof TypeError) {
      Alert.alert("Couldn't reach server. Check IP/internet")
      throw e; // re-raise
    } else {
      throw e; // re-throw the error unchanged
    }
  }
  if (!response.ok) {
    let error = await response.json();
    throw new ServerError(response.status, error.name, error.description);
  }
  return response;
}

export function isCode(e, codes) {
  return (e instanceof ServerError && codes.includes(e.code))
}

export const signUp = async (email, password) => {
  await handledFetch(server + '/signup', {
    method: 'POST',
    body: JSON.stringify({
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
  let data = await response.json();
  console.log(data)
  return [data.name, data.user_id];
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

export const addFriend = async (friend_id) => {
  await handledFetch(server + '/friends/add', {
    method: 'POST',
    body: JSON.stringify({
      friend_id: friend_id
    })
  });
}

export const getFriend = async (user_id) => {
  const response = await handledFetch(server + '/friends/get?user_id=' + user_id, {
    method: 'GET'
  });
  let data = await response.json();
  return data
}

export const getUser = async (user_id) => {
  const response = await handledFetch(server + '/users/get?id=' + user_id, {
    method: 'GET'
  });
  let data = await response.json()
  return data
}

export const userSearch = async (search) => {
  const response = await handledFetch(server + '/users/search?search=' + search, {
    method: 'GET'
  });
  let data = await response.json();
  return data
}

export const friendSearch = async (search) => {
  const response = await handledFetch(server + '/friends/search?search=' + search, {
    method: 'GET'
  });
  let data = await response.json();
  return data
}

export const addLocation = async (location) => {
  await handledFetch(server + '/users/location', {
    method:'POST',
    body: JSON.stringify({
      location: location
    })
  })
}