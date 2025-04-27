import LoginDto from "@domain/dtos/auth/LoginDto";
import ProfileDto from "@domain/dtos/auth/ProfileDto";
import RefreshTokenDto from "@domain/dtos/auth/RefreshTokenDto";
import GoogleProfile from "@domain/entities/auth/GoogleProfile";
import GoogleToken from "@domain/entities/auth/GoogleToken";
import AuthRepository from "@domain/repository/auth/AuthRepository";
import { ApiClient } from "@infrastructure/apiClient";
import { IGoogleClient } from "@infrastructure/googleClient";
import ENDPOINTS from "@shared/constants/endpoints";

export default class AuthRepositoryImpl implements AuthRepository {
	apiClient: ApiClient;
	googleClient: IGoogleClient;

	constructor(apiClient: ApiClient, googleClient: IGoogleClient) {
		this.apiClient = apiClient;
		this.googleClient = googleClient;
	}

	async createLogin(profile: ProfileDto): Promise<LoginDto> {
		try {
			const response = await this.apiClient.post<LoginDto>(ENDPOINTS.auth.createLogin, profile);
			return response.data;
		} catch (error: unknown) {
			throw error;
		}
	}

	async signInWithGoogle(): Promise<GoogleProfile> {
		const profileData = await this.googleClient.signInWithGoogle();
		return profileData;
	}

	async refreshGoogleToken(accessToken: string): Promise<GoogleToken> {
		const tokens = await this.googleClient.refreshGoogleToken(accessToken);
		return tokens;
	}

	async signOutWithGoogle(): Promise<void> {
		return await this.googleClient.signOutWithGoogle();
	}

	async createRefreshToken(params: RefreshTokenDto): Promise<LoginDto> {
		try {
			const response = await this.apiClient.post<LoginDto>(ENDPOINTS.auth.createRefreshToken, params);
			return response.data;
		} catch (error: unknown) {
			throw error;
		}
	}

	async getProfile(): Promise<ProfileDto> {
		try {
			const response = await this.apiClient.get<ProfileDto>(ENDPOINTS.auth.getProfile);
			return response.data;
		} catch (error: unknown) {
			throw error;
		}
	}
}
