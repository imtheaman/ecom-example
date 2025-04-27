export default interface GoogleProfile {
	idToken: string,
	user: {
		id: string;
		name: string | null;
		email: string;
		photo: string | null;
		familyName: string | null;
		givenName: string | null;
	},
	accessToken: string,
	lastUpdated: number
}
