// import { environment } from "../environments/environment";
// const { API_KEY } = environment;
const API_KEY = "7c79b9b9e176bc789314173a26ff86e9";
export class UrlAPI {
  static locations() {
    return `http://htmlweb.ru/geo/api.php?locations&json&api_key=${API_KEY}`;
  }
  static countries(location: string) {
    return `http://htmlweb.ru/geo/api.php?location=${location}&json&api_key=${API_KEY}`;
  }
  static regions(location: string) {
    return `http://htmlweb.ru/geo/api.php?location=${location}&json&api_key=${API_KEY}`;
  }
}
