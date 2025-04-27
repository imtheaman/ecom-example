import LoginDto from "@domain/dtos/auth/LoginDto";
import ProfileDto from "@domain/dtos/auth/ProfileDto";
import RefreshTokenDto from "@domain/dtos/auth/RefreshTokenDto";
import GoogleProfile from "@domain/entities/auth/GoogleProfile";
import GoogleToken from "@domain/entities/auth/GoogleToken";

export default interface AuthRepository {
	signInWithGoogle(): Promise<GoogleProfile>
	signOutWithGoogle(): Promise<void>
	refreshGoogleToken(accessToken: string): Promise<GoogleToken>,
	createLogin(profile: ProfileDto): Promise<LoginDto>,
	getProfile(): Promise<ProfileDto>,
	createRefreshToken(params: RefreshTokenDto): Promise<LoginDto>,
}
