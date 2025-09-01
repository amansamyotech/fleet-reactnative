import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'RouteEX',
  slug: 'routeex',
  version: '52.0.0',
  extra: {
    ENV: process.env.APP_ENV || 'development',
    API_URL: process.env.API_URL,
    eas: {
      "projectId": "127528e3-b9c6-42b0-9955-0785b9950879"
    }
  },
});
