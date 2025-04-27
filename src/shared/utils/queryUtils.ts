export function queryParam(key: string, value: string | number | undefined | null) {
	if (!value) return '';
	return `${key}=${value}&`;
}

export function multipleQueryParams(params: Record<string, number | string | null | undefined>) {
	if (typeof params !== 'object' || params === null) return '';

	let result = '';
	Object.entries(params).forEach(([key, value]) => {
		result += queryParam(key, value);
	})
	return result;
}
