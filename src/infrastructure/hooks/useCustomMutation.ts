import { UseMutationOptions, UseMutationResult, useMutation } from '@tanstack/react-query';

export interface CustomMutationParams<TInput, TOutput, TError> extends Omit<UseMutationOptions<TOutput, TError, TInput, unknown>, 'mutationFn'> {
	mutationFn: (variables: TInput) => Promise<TOutput>,
	syncStore?: (data: TOutput, variables: TInput) => void,
	onSuccess?: (data: TOutput, variables: TInput) => void,
}

export default function useCustomMutation<TInput, TOutput, TError = Error>(
	{
		mutationFn,
		syncStore,
		onSuccess,
		...options
	}: CustomMutationParams<TInput, TOutput, TError>
): UseMutationResult<TOutput, TError, TInput, unknown> {
	return useMutation({
		mutationFn,
		...options,
		onSuccess: (data, variables) => {
			if (syncStore) {
				syncStore(data, variables);
			}
			onSuccess?.(data, variables);
		},
	});
}
