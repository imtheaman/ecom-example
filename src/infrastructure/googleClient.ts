import GoogleProfile from "@domain/entities/auth/GoogleProfile";
import GoogleToken from "@domain/entities/auth/GoogleToken";
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from "@react-native-google-signin/google-signin";

export interface IGoogleClient {
	signInWithGoogle(): Promise<GoogleProfile>
	signOutWithGoogle(): Promise<void>
	refreshGoogleToken(accessToken: string): Promise<GoogleToken>,
}

export default class GoogleClient {
	static async signInWithGoogle(): Promise<GoogleProfile> {
		try {
			await GoogleSignin.hasPlayServices();
			const response = await GoogleSignin.signIn();
			const tokens = await GoogleSignin.getTokens();
			if (isSuccessResponse(response)) {
				return { idToken: tokens.idToken, accessToken: tokens.accessToken, user: response.data.user, lastUpdated: Date.now() };
			} else {
				throw new Error("Signin was not successful");
			}
		} catch (error) {
			if (isErrorWithCode(error)) {
				switch (error.code) {
					case statusCodes.IN_PROGRESS:
						throw error;
					case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
						throw error;
					default:
						throw error;
				}
			} else {
				throw new Error("Something Went wrong");
			}
		}
	}

	static async signOutWithGoogle(): Promise<void> {
		await GoogleSignin.signOut();
	}

	static async refreshGoogleToken(accessToken: string): Promise<GoogleToken> {
		try {
			await GoogleSignin.clearCachedAccessToken(accessToken);
			const tokens = await GoogleSignin.getTokens();
			return tokens;
		} catch (error) {
			throw error;
		}
	}
}
