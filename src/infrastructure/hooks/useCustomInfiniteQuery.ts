import { InfiniteData, UseInfiniteQueryOptions, UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';

export type GetNextPageParamFunction<TPage> =
	(lastPage: TPage, allPages: TPage[]) => unknown | undefined | null;

export interface CustomInfiniteQueryParams<TOutput, TError> extends Omit<UseInfiniteQueryOptions<TOutput, TError, TOutput, TOutput, readonly unknown[]>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'select' | 'initialPageParam'> {
	queryKey: readonly unknown[],
	queryFn: (pageParam: unknown) => Promise<TOutput>,
	getNextPageParam: GetNextPageParamFunction<TOutput>,
	syncStore?: (data: TOutput) => void,
	onSuccess?: (data: { pages: TOutput[], pageParams: unknown[] }) => void;
}

export default function useCustomInfiniteQuery<TOutput, TError = Error>(
	{
		queryKey,
		queryFn,
		getNextPageParam,
		syncStore,
		onSuccess,
		...options
	}: CustomInfiniteQueryParams<TOutput, TError>
): UseInfiniteQueryResult<TOutput, TError> {
	return useInfiniteQuery({
		queryKey,
		queryFn: ({ pageParam = undefined }) => queryFn(pageParam),
		...options,
		initialPageParam: 1,
		getNextPageParam,
		select: (data: InfiniteData<TOutput, unknown>) => {
			const flattenedData = data.pages.flat() as unknown as TOutput;
			
			if (syncStore) {
				syncStore(flattenedData);
			}

			onSuccess?.(data);
			return flattenedData;
		},
	}) as UseInfiniteQueryResult<TOutput, TError>;
}
