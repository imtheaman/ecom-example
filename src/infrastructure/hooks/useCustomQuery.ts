import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

export interface CustomQueryParams<TOutput, TError> extends Omit<UseQueryOptions<TOutput, TError, any, readonly unknown[]>, 'queryKey' | 'queryFn'> {
	queryKey: readonly unknown[],
	queryFn: () => Promise<TOutput>,
	syncStore?: (data: TOutput) => void,
	onSuccess?: (data: TOutput) => void;
}

export default function useCustomQuery<TOutput = void, TError = Error>(
	{
		queryKey,
		queryFn,
		syncStore,
		onSuccess,
		...options
	}: CustomQueryParams<TOutput, TError>
): UseQueryResult<TOutput, TError> {
	return useQuery({
		queryKey,
		queryFn,
		...options,
		select: (data) => {
			if (syncStore) {
				syncStore(data);
			}

			onSuccess?.(data);
			return data;
		},
	});
}
