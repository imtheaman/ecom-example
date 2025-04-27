import useCustomQuery from "@infrastructure/hooks/useCustomQuery";
import useCustomMutation from "@infrastructure/hooks/useCustomMutation";
import { UseQueryResult, UseMutationResult, InvalidateQueryFilters, QueryKey, QueryClient } from "@tanstack/react-query";
import AuthRepository from "@domain/repository/auth/AuthRepository";
import ProfileDto from "@domain/dtos/auth/ProfileDto";
import LoginDto from "@domain/dtos/auth/LoginDto";
import RefreshTokenDto from "@domain/dtos/auth/RefreshTokenDto";
import GoogleProfile from "@domain/entities/auth/GoogleProfile";
import GoogleToken from "@domain/entities/auth/GoogleToken";
import useAuthStore from "@infrastructure/store/auth/authStore";

export const AUTH_KEYS = {
	getProfile: () => ['getProfile'] as const,
};

export function useCreateLogin(repository: AuthRepository): UseMutationResult<LoginDto, Error, ProfileDto, unknown> {
	const setTokens = useAuthStore(state => state.setTokens);

	return useCustomMutation({
		mutationFn: (profile: ProfileDto) => repository.createLogin(profile),
		syncStore: (data: LoginDto) => setTokens(data),
	});
}

export function useSignInWithGoogle(repository: AuthRepository): () => Promise<GoogleProfile> {
	const setGoogleProfile = useAuthStore(state => state.setGoogleProfile);

	return async () => {
		const response = await repository.signInWithGoogle();
		setGoogleProfile(response);
		return response;
	}
}

export function useRefreshGoogleToken(repository: AuthRepository): (accessToken: string) => Promise<GoogleToken> {
	const setGoogleTokens = useAuthStore(state => state.setGoogleTokens);

	return async (accessToken: string) => {
		const response = await repository.refreshGoogleToken(accessToken);
		setGoogleTokens(response);
		return response;
	}
}

export function useSignOutWithGoogle(repository: AuthRepository): () => Promise<void> {
	const deleteGoogleProfile = useAuthStore(state => state.deleteGoogleProfile);

	return async () => {
		const response = await repository.signOutWithGoogle();
		deleteGoogleProfile();
		return response;
	}
}

export function useCreateRefreshToken(repository: AuthRepository, queryClient: QueryClient): UseMutationResult<LoginDto, Error, RefreshTokenDto, unknown> {
	const setTokens = useAuthStore(state => state.setTokens);

	return useCustomMutation({
		mutationFn: (params: RefreshTokenDto) => repository.createRefreshToken(params),
		syncStore: (data: LoginDto) => setTokens(data),
		onSuccess: () => {
			queryClient.invalidateQueries(AUTH_KEYS.getProfile() as InvalidateQueryFilters<QueryKey>);
		}
	});
}

export function useGetProfile(repository: AuthRepository): UseQueryResult<ProfileDto, Error> {
	const setProfile = useAuthStore(state => state.setProfile);

	return useCustomQuery({
		queryKey: AUTH_KEYS.getProfile(),
		queryFn: () => repository.getProfile(),
		syncStore: (data: ProfileDto) => setProfile(data),
	});
}
