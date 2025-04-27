import CONSTANTS from '@shared/constants';
import { MMKV } from 'react-native-mmkv';

export class StorageService {
	private static instance: StorageService;
	private storageInstances: Map<string, MMKV> = new Map();

	private constructor() { }

	static getInstance(): StorageService {
		if (!this.instance) {
			this.instance = new StorageService();
		}
		return StorageService.instance;
	}

	getStorage(id: string): MMKV {
		if (this.storageInstances.has(id)) {
			return this.storageInstances.get(id)!;
		}

		try {
			const storage = new MMKV({ id, encryptionKey: CONSTANTS.ENC_KEY });
			this.storageInstances.set(id, storage);
			return storage;
		} catch (error) {
			throw new Error(`Failed to create storage for ${id}`);
		}
	}

	createJSONStorageAdapter(storeId: string): {
		getItem: (name: string) => string | null;
		setItem: (name: string, value: string) => void;
		removeItem: (name: string) => void;
	} {
		const storage = this.getStorage(storeId);

		return {
			getItem: (name: string): string | null => {
				const value = storage.getString(name);
				return value ?? null;
			},
			setItem: (name: string, value: string): void => {
				storage.set(name, value);
			},
			removeItem: (name: string): void => {
				storage.delete(name);
			},
		};
	}
}
