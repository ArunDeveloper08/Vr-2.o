import { LogBox } from 'react-native';
import LoginEntry from "./login";


LogBox.ignoreLogs([
  
  '"shadow*" style props are deprecated. Use "boxShadow".'
]);
export default function Index() {
  return (

     <LoginEntry/>
  
  );
}
