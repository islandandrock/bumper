import * as SecureStore from 'expo-secure-store';

export const storeData = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    throw e; // Handle errors (implement later)
  }
}

export const removeData = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key)
  } catch (e) {
    throw e;
  }
}

export const getData = async (key) => {
  try {
    let value = await SecureStore.getItemAsync(key);
    if(value !== null) {
      // value previously stored
    }
    return value;
  } catch(e) {
    throw e; // Handle errors (implement later)
  }
}