import apiClient from '@infrastructure/apiClient';
import GoogleClient from '@infrastructure/googleClient';
import { StorageService } from '@infrastructure/storage/StorageService';
import { queryClient } from '@infrastructure/queryClient';

import AuthRepository from '@domain/repository/auth/AuthRepository';
import CategoryRepository from '@domain/repository/category/CategoryRepository';
import ProductRepository from '@domain/repository/product/ProductRepository';

import AuthRepositoryImpl from '@data/repository/auth/AuthRepositoryImpl';
import CategoryRepositoryImpl from '@data/repository/category/CategoryRepositoryImpl';
import ProductRepositoryImpl from '@data/repository/product/ProductRepositoryImpl';

class _AppModule {
	private static instance: _AppModule;
	queryClient = queryClient;

	private _authRepository: AuthRepository | null = null;
	private _categoryRepository: CategoryRepository | null = null;
	private _productRepository: ProductRepository | null = null;

	private _storageService: StorageService | null = null;

	private constructor() { }

	public static getInstance(): _AppModule {
		if (!_AppModule.instance) {
			_AppModule.instance = new _AppModule();
		}
		return _AppModule.instance;
	}

	public get authRepository(): AuthRepository {
		if (!this._authRepository) {
			this._authRepository = new AuthRepositoryImpl(apiClient, GoogleClient);
		}
		return this._authRepository;
	}

	public get categoryRepository(): CategoryRepository {
		if (!this._categoryRepository) {
			this._categoryRepository = new CategoryRepositoryImpl(apiClient);
		}
		return this._categoryRepository;
	}

	public get productRepository(): ProductRepository {
		if (!this._productRepository) {
			this._productRepository = new ProductRepositoryImpl(apiClient);
		}
		return this._productRepository;
	}

	public get storageService(): StorageService {
		if (!this._storageService) {
			this._storageService = StorageService.getInstance();
		}
		return this._storageService;
	}

	public resetRepositories(): void {
		this._authRepository = null;
		this._categoryRepository = null;
		this._productRepository = null;
	}
}

const AppModule = _AppModule.getInstance();
export default AppModule;
