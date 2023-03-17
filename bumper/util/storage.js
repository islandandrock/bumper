import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    throw e; // Handle errors (implement later)
  }
}

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    throw e;
  }
}

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if(value !== null) {
      // value previously stored
    }
    return value;
  } catch(e) {
    throw e; // Handle errors (implement later)
  }
}