import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

export default function useAppStart() {
	GoogleSignin.configure({
		iosClientId: Config.IOS_CLIENT_ID,
		webClientId: Config.WEB_CLIENT_ID
	});
}
