import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import LoginDto from '@domain/dtos/auth/LoginDto';
import ProfileDto from '@domain/dtos/auth/ProfileDto';
import GoogleProfile from '@domain/entities/auth/GoogleProfile';
import GoogleToken from '@domain/entities/auth/GoogleToken';
import AppModule from '@/di/AppModule';

interface AuthStateValues {
	isAuthenticated: boolean;
	accessToken: string | null;
	refreshToken: string | null;
	profile: ProfileDto | null;
	lastUpdated: number | null;
	googleProfile: GoogleProfile | null;
}

interface AuthStateMethods {
	setGoogleProfile: (googleProfile: GoogleProfile) => void;
	setGoogleTokens: (googleTokens: GoogleToken) => void;
	deleteGoogleProfile: () => void;
	setTokens: (loginDto: LoginDto) => void;
	setProfile: (profile: ProfileDto) => void;
	clearAuth: () => void;
	updateLastUpdated: () => void;
}

interface AuthState extends AuthStateValues, AuthStateMethods { }

const authStorageAdapter: StateStorage = AppModule.storageService.createJSONStorageAdapter('auth-store');

const initialValues: AuthStateValues = {
	isAuthenticated: false,
	accessToken: null,
	refreshToken: null,
	profile: null,
	lastUpdated: null,
	googleProfile: null,
}

const useAuthStore = create<AuthState>()(
	persist(
		immer(
			(set) => ({
				...initialValues,

				setTokens: (loginDto: LoginDto) =>
					set(state => {
						state.accessToken = loginDto.access_token;
						state.refreshToken = loginDto.refresh_token;
						state.isAuthenticated = true;
						state.lastUpdated = Date.now();
					}),

				setGoogleProfile: (googleProfile) => {
					set(state => {
						state.googleProfile = googleProfile;
						state.isAuthenticated = true;
					})
				},

				setGoogleTokens: (googleTokens) => {
					set(state => {
						if (state.googleProfile) {
							state.googleProfile.accessToken = googleTokens.accessToken;
							state.googleProfile.idToken = googleTokens.idToken;
						}
					})
				},

				deleteGoogleProfile: () => {
					set(state => {
						state.googleProfile = null;
						state.isAuthenticated = true;
					})
				},

				setProfile: (profile: ProfileDto) =>
					set(state => {
						state.profile = profile;
						state.lastUpdated = Date.now();
					}),

				clearAuth: () =>
					set(state => {
						state.isAuthenticated = false;
						state.accessToken = null;
						state.refreshToken = null;
						state.profile = null;
						state.lastUpdated = Date.now();
					}),

				updateLastUpdated: () =>
					set(state => {
						state.lastUpdated = Date.now();
					}),
			})
		),
		{
			name: 'auth-store',
			storage: createJSONStorage(() => authStorageAdapter),
			partialize: (state) => ({
				isAuthenticated: state.isAuthenticated,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				profile: state.profile,
				lastUpdated: state.lastUpdated,
			}),
		}
	)
);

export default useAuthStore;
