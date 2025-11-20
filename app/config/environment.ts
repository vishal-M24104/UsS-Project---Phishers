// app/config/environment.ts
import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'http://192.168.2.235:3000/api', // Your local IP
  },
  staging: {
    apiUrl: 'http://192.168.2.235:3000/api', // Replace with your VM IP
  },
  prod: {
    apiUrl: 'http://192.168.2.235:3000/api', 
  },
};

const getEnvVars = (env = Constants.expoConfig?.extra?.environment || 'prod') => {
  if (env === 'dev' || __DEV__) return ENV.dev;
  if (env === 'staging') return ENV.staging;
  return ENV.prod;
};

export default getEnvVars();