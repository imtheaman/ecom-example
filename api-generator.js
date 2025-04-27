const path = require('path');
const { Project } = require('ts-morph');

const PROJECT_DIR = process.argv[2] || '.';
const SERVICE_OUTPUT_DIR = path.join(PROJECT_DIR, 'src/infrastructure/datamanager');

const project = new Project({
	tsConfigFilePath: path.join(PROJECT_DIR, 'tsconfig.json'),
});

const repoImplPattern = path.join(PROJECT_DIR, 'src/data/repository/**/*RepositoryImpl.ts');
const repoFiles = project.addSourceFilesAtPaths(repoImplPattern);

console.log(`Found ${repoFiles.length} repository implementation files`);

repoFiles.forEach(sourceFile => {
	const filePath = sourceFile.getFilePath();

	if (!filePath.endsWith('RepositoryImpl.ts')) return;

	console.log(`File: ${filePath}`);
	processRepositoryFile(sourceFile, SERVICE_OUTPUT_DIR);
});




function analyzeUsedTypes(methods, repositoryName, domainTypes) {
	const typeMap = new Map();

	methods.forEach(method => {
		if (method.getName() === 'constructor' || method.hasModifier(SyntaxKind.PrivateKeyword)) return;

		method.getParameters().forEach(param => {
			const typeText = param.getType().getText();
			extractTypeInfo(typeText, typeMap, repositoryName, domainTypes);
		});

		const returnType = method.getReturnType().getText();
		if (returnType.includes('Promise<')) {
			const innerType = returnType.match(/Promise<(.+)>/)[1];
			extractTypeInfo(innerType, typeMap, repositoryName, domainTypes);
		}
	});

	return typeMap;
}

function cleanupType(typeText) {
	return typeText.replace(/import\(".*"\)\.default/g, match => {
		const parts = match.split('/');
		return parts[parts.length - 1].replace('").default', '');
	});
}

function extractTypeInfo(typeText, typeMap, repositoryName, domainTypes) {
	// get the base type T from T[]
	const baseType = typeText.replace(/\[\]$/, '').trim();

	let cleanType = baseType.replace(/import\(".*"\)\.default/g, match => {
		const parts = match.split('/');
		return parts[parts.length - 1].replace('").default', '');
	});

	if (!cleanType.includes('.')) {
		if (domainTypes.has(cleanType)) {
			typeMap.set(cleanType, {
				name: cleanType,
				importPath: domainTypes.get(cleanType)
			});
			return;
		}

		// if not imported already, check where to import from
		if (cleanType.includes('Dto') || cleanType.includes('Entity') ||
			cleanType === 'Product' || cleanType.startsWith(repositoryName)) {
			let folder = 'dtos';
			if (cleanType.includes('Entity') || cleanType === 'Product') {
				folder = 'entities';
			}

			const entityType = repositoryName.toLowerCase();

			// create import
			typeMap.set(cleanType, {
				name: cleanType,
				importPath: `@domain/${folder}/${entityType}/${cleanType}`
			});
		}
	}

	// check generic params type T
	const genericMatches = baseType.match(/<([^<>]+)>/g);
	if (genericMatches) {
		genericMatches.forEach(match => {
			// <T>: T
			const innerTypes = match.substring(1, match.length - 1).split(',');
			innerTypes.forEach(innerType => {
				extractTypeInfo(innerType.trim(), typeMap, repositoryName, domainTypes);
			});
		});
	}

	// check object params type T
	const objectMatches = baseType.match(/{[^{}]+}/g);
	if (objectMatches) {
		objectMatches.forEach(match => {
			const propertyTypes = match.match(/:\s*([A-Za-z0-9_]+)/g);
			if (propertyTypes) {
				propertyTypes.forEach(propType => {
					const typeName = propType.substring(propType.indexOf(':') + 1).trim();
					if (typeName && !['string', 'number', 'boolean', 'any', 'void', 'null', 'undefined'].includes(typeName)) {
						extractTypeInfo(typeName, typeMap, repositoryName, domainTypes);
					}
				});
			}
		});
	}
}

function generateDirectFunction(managerFunctionName, methodName, parameters, resultType, interfaceName) {
	const outerParamList = [`repository: ${interfaceName}`];

	const innerParamList = parameters.map(param => {
		const name = param.getName();
		const type = cleanupType(param.getType().getText());
		return `${name}: ${type}`;
	});

	const repoParams = parameters.map(param => param.getName()).join(', ');
	const cleanResultType = cleanupType(resultType);

	if (parameters.length > 0) {
		return `
export function ${managerFunctionName}(${outerParamList.join(', ')}): (${innerParamList.join(', ')}) => Promise<${cleanResultType}> {
  return async (${innerParamList.join(', ')}) => {
		const response = await repository.${methodName}(${repoParams});
		return response;
	}
}
`;
	} else {
		return `
export function ${managerFunctionName}(${outerParamList.join(', ')}): () => Promise<${cleanResultType}> {
  return async () => {
		const response = await repository.${methodName}();
		return response;
	}
}
`;
	}
}

function generateInfiniteQueryFunction(managerFunctionName, repoMethodName, parameters, resultType, interfaceName, repositoryName) {
	const cleanResultType = cleanupType(resultType);
	const keysName = repositoryName.toUpperCase() + '_KEYS';

	if (parameters.length > 1) {
		// there should be only one param of type object 
		let filterParam = null;

		for (const param of parameters) {
			const paramType = param.getType();

			if (paramType.isObject()) {
				filterParam = param;
				break;
			}
		}

		// 1 param would always be there in paginated data
		if (!filterParam) {
			filterParam = parameters[parameters.length - 1];
		}

		const filterParamName = filterParam.getName();
		const filterParamType = cleanupType(filterParam.getType().getText());

		const otherParams = parameters.filter(p => p !== filterParam);

		const paramSignature = [
			`repository: ${interfaceName}`,
			...otherParams.map(p => `${p.getName()}: ${cleanupType(p.getType().getText())}`),
			`${filterParamName}: ${filterParamType} = {}`
		].join(', ');

		const repoCallParams = parameters.map(p => {
			return p === filterParam ? 'paginatedFilters' : p.getName();
		}).join(', ');

		const paramNames = parameters.map(p => p.getName()).join(', ');
		const queryKeyReference = `${keysName}.${repoMethodName}(${paramNames})`;

		return `
export function ${managerFunctionName}(${paramSignature}): UseInfiniteQueryResult<${cleanResultType}, Error> {
  return useCustomInfiniteQuery({
    queryKey: ${queryKeyReference},
    queryFn: (pageParam) => {
      const limit = ${filterParamName}.limit || CONSTANTS.PAGE_LIMIT;
      const paginatedFilters = { 
        ...${filterParamName},
        offset: (pageParam as number) * limit,
        limit
      };
      return repository.${repoMethodName}(${repoCallParams});
    },
    getNextPageParam: (lastPage: ${cleanResultType}, allPages: ${cleanResultType}[]) => {
      const limit = ${filterParamName}.limit || CONSTANTS.PAGE_LIMIT;
      if (!lastPage.length || lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    // syncStore: (data: ${cleanResultType}) => void,
  });
}
`;
	} else {
		// only one param
		const filtersParam = parameters[0];
		let filtersParamName = 'filters';
		let filtersParamType = 'any';

		if (filtersParam) {
			filtersParamName = filtersParam.getName();
			filtersParamType = cleanupType(filtersParam.getType().getText());
		}

		const queryKeyReference = `${keysName}.${repoMethodName}(${filtersParamName})`;

		return `
export function ${managerFunctionName}(repository: ${interfaceName}, ${filtersParamName}: ${filtersParamType} = {}): UseInfiniteQueryResult<${cleanResultType}, Error> {
  return useCustomInfiniteQuery({
    queryKey: ${queryKeyReference},
    queryFn: (pageParam) => {
      const limit = ${filtersParamName}.limit || CONSTANTS.PAGE_LIMIT;
      const paginatedFilters = { 
        ...${filtersParamName},
        offset: (pageParam as number) * limit,
        limit
      };
      return repository.${repoMethodName}(paginatedFilters);
    },
    getNextPageParam: (lastPage: ${cleanResultType}, allPages: ${cleanResultType}[]) => {
      const limit = ${filtersParamName}.limit || CONSTANTS.PAGE_LIMIT;
      if (!lastPage.length || lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    // syncStore: (data: ${cleanResultType}) => void,
  });
}
`;
	}
}

function generateManagerFileContent(repositoryName, interfaceName, methods, usedTypes) {
	const hasQueryMethods = methods.some(method => {
		const methodName = method.getName();
		return methodName.startsWith('get') || methodName.startsWith('create') ||
			methodName.startsWith('update') || methodName.startsWith('delete');
	});

	const hasGetAllMethods = methods.some(method => method.getName().startsWith('getAll'));

	let imports = [`import ${interfaceName} from "@domain/repository/${repositoryName.toLowerCase()}/${interfaceName}";`];

	if (hasQueryMethods) {
		imports = [
			`import useCustomQuery from "@infrastructure/hooks/useCustomQuery";`,
			`import useCustomMutation from "@infrastructure/hooks/useCustomMutation";`,
			`import useCustomInfiniteQuery from "@infrastructure/hooks/useCustomInfiniteQuery";`,
			`import { UseQueryResult, UseMutationResult, UseInfiniteQueryResult, QueryClient } from "@tanstack/react-query";`,
			`import { useNetInfo } from "@react-native-community/netinfo";`,
			...imports
		];
	}

	// create types import statements
	usedTypes.forEach(typeInfo => {
		imports.push(`import ${typeInfo.name} from "${typeInfo.importPath}";`);
	});

	if (hasGetAllMethods) {
		imports.push(`import CONSTANTS from "@shared/constants";`);
	}

	const keysConstant = generateQueryKeysConstant(repositoryName, methods);

	let functionsContent = '';

	methods.forEach(method => {
		const methodName = method.getName();

		if (methodName === 'constructor' || method.hasModifier(SyntaxKind.PrivateKeyword)) {
			return;
		}

		const returnType = method.getReturnType().getText();
		const parameters = method.getParameters();

		let hookType;
		let managerFunctionName;

		if (methodName.startsWith('getAll')) {
			hookType = 'useCustomInfiniteQuery';
			managerFunctionName = `useGetAll${methodName.substring(6)}`;
		} else if (methodName.startsWith('get')) {
			hookType = 'useCustomQuery';
			managerFunctionName = `useGet${methodName.substring(3)}`;
		} else if (methodName.startsWith('create') || methodName.startsWith('update') || methodName.startsWith('delete')) {
			hookType = 'useCustomMutation';
			managerFunctionName = `use${methodName.charAt(0).toUpperCase() + methodName.substring(1)}`;
		} else {
			// for non-react-query methods
			hookType = 'direct';
			managerFunctionName = `use${methodName.charAt(0).toUpperCase() + methodName.substring(1)}`;
		}

		let resultType = '';
		const returnTypeMatch = returnType.match(/Promise<(.+)>/);
		if (returnTypeMatch) {
			resultType = returnTypeMatch[1];
		}

		let functionContent = '';

		if (hookType === 'useCustomInfiniteQuery') {
			functionContent = generateInfiniteQueryFunction(managerFunctionName, methodName, parameters, resultType, interfaceName, repositoryName);
		} else if (hookType === 'useCustomQuery') {
			functionContent = generateQueryFunction(managerFunctionName, methodName, parameters, resultType, interfaceName, repositoryName);
		} else if (hookType === 'useCustomMutation') {
			functionContent = generateMutationFunction(managerFunctionName, methodName, parameters, resultType, interfaceName, repositoryName);
		} else if (hookType === 'direct') {
			functionContent = generateDirectFunction(managerFunctionName, methodName, parameters, resultType, interfaceName);
		}

		functionsContent += functionContent;
	});

	return imports.join('\n') + '\n\n' + keysConstant + functionsContent;
}

function generateQueryFunction(managerFunctionName, repoMethodName, parameters, resultType, interfaceName, repositoryName) {
	// repository as first parameter
	const paramList = [`repository: ${interfaceName}`];

	parameters.forEach(param => {
		const name = param.getName();
		const type = cleanupType(param.getType().getText());
		paramList.push(`${name}: ${type}`);
	});

	const repoParams = parameters.map(param => param.getName()).join(', ');

	const cleanResultType = cleanupType(resultType);

	// QUERY_KEYS
	const keysName = repositoryName.toUpperCase() + '_KEYS';
	let queryKeyReference;

	if (parameters.length > 0) {
		const paramNames = parameters.map(p => p.getName()).join(', ');
		queryKeyReference = `${keysName}.${repoMethodName}(${paramNames})`;
	} else {
		queryKeyReference = `${keysName}.${repoMethodName}()`;
	}

	return `
export function ${managerFunctionName}(${paramList.join(', ')}): UseQueryResult<${cleanResultType}, Error> {
  return useCustomQuery({
    queryKey: ${queryKeyReference},
    queryFn: () => repository.${repoMethodName}(${repoParams}),
    // syncStore: (data: ${cleanResultType}) => void,
  });
}
`;
}

function generateQueryKeysConstant(repositoryName, methods) {
	const keysName = repositoryName.toUpperCase() + '_KEYS';
	let keysContent = `export const ${keysName} = {\n`;

	let hasKeys = false;

	methods.forEach(method => {
		const methodName = method.getName();

		if (methodName === 'constructor' ||
			method.hasModifier(SyntaxKind.PrivateKeyword) ||
			!methodName.startsWith('get')) {
			return;
		}

		hasKeys = true;
		const parameters = method.getParameters();

		if (parameters.length > 0) {
			const paramsList = parameters.map(param => {
				const paramName = param.getName();
				const paramType = cleanupType(param.getType().getText());
				return `${paramName}?: ${paramType}`;
			}).join(', ');

			keysContent += `\t${methodName}: (${paramsList}) => {\n`;
			keysContent += `\t\tconst key: any[] = ['${methodName}'];\n`;

			parameters.forEach(param => {
				const paramName = param.getName();
				keysContent += `\t\tif (${paramName}) key.push(${paramName});\n`;
			});

			keysContent += `\t\treturn key;\n`;
			keysContent += `\t},\n`;
		} else {
			keysContent += `\t${methodName}: () => ['${methodName}'],\n`;
		}
	});

	keysContent += `};\n`;

	if (!hasKeys) {
		return '';
	}

	return keysContent;
}

function processRepositoryFile(sourceFile, outDir) {
	const filePath = sourceFile.getFilePath();

	const fileName = path.basename(filePath, '.ts');
	const repositoryName = fileName.replace('RepositoryImpl', '');
	const managerName = `${repositoryName}Manager`;

	const classes = sourceFile.getClasses();
	const repoClass = classes.find(cls => cls.getName() === `${repositoryName}RepositoryImpl`);

	if (!repoClass) {
		throw new Error(`Repository file: ${repositoryName}RepositoryImpl is not available`)
	}

	const implementsClause = repoClass.getImplements()[0];
	if (!implementsClause) {
		throw new Error(`Repository interface ${repoClass.getName()} is not available`);
	}

	const interfaceName = implementsClause.getText();

	const methods = repoClass.getMethods();
	console.log(`Total methods in ${repoClass.getName()}: ${methods.length} `);

	const importDeclarations = sourceFile.getImportDeclarations();
	const domainTypes = new Map();

	importDeclarations.forEach(importDecl => {
		const moduleSpecifier = importDecl.getModuleSpecifierValue();

		if (moduleSpecifier.includes('@domain/') || moduleSpecifier.includes('domain/')) {
			const importClause = importDecl.getImportClause();

			if (importClause) {
				const defaultImport = importClause.getDefaultImport();
				if (defaultImport) {
					const typeName = defaultImport.getText();
					domainTypes.set(typeName, moduleSpecifier);
				}

				const namedImports = importClause.getNamedImports();
				namedImports.forEach(namedImport => {
					const typeName = namedImport.getName();
					domainTypes.set(typeName, moduleSpecifier);
				});
			}
		}
	});

	const usedTypes = analyzeUsedTypes(methods, repositoryName, domainTypes);

	const outputDir = path.join(outDir, repositoryName.toLowerCase());
	fs.mkdirSync(outputDir, { recursive: true });

	const managerFileContent = generateManagerFileContent(
		repositoryName,
		interfaceName,
		methods,
		usedTypes
	);

	const outputFilePath = path.join(outputDir, `${managerName}.ts`);
	fs.writeFileSync(outputFilePath, managerFileContent);
	console.log(`Generated: ${outputFilePath}`);
}

function generateMutationFunction(managerFunctionName, repoMethodName, parameters, resultType, interfaceName, repositoryName) {
	const cleanResultType = cleanupType(resultType);

	if (repoMethodName.startsWith('create')) {
		const param = parameters[0];
		const paramName = param.getName();
		const paramType = cleanupType(param.getType().getText());

		return `
export function ${managerFunctionName}(repository: ${interfaceName}, queryClient: QueryClient): UseMutationResult<${cleanResultType}, Error, ${paramType}, unknown> {
  return useCustomMutation({
    mutationFn: (${paramName}: ${paramType}) => repository.${repoMethodName}(${paramName}),
    // syncStore: (data: ${cleanResultType}, variables: ${paramType}) => void,
    // onSuccess: (data: ${cleanResultType}, variables: ${paramType}) => void
  });
}
`;
	} else if (repoMethodName.startsWith('update')) {
		const paramTypes = parameters.map(p => ({
			name: p.getName(),
			type: cleanupType(p.getType().getText())
		}));

		const varsType = `{ ${paramTypes.map(p => `${p.name}: ${p.type}`).join(', ')} }`;

		return `
export function ${managerFunctionName}(repository: ${interfaceName}, queryClient: QueryClient): UseMutationResult<${cleanResultType}, Error, ${varsType}, unknown> {
  return useCustomMutation({
    mutationFn: ({ ${paramTypes.map(p => p.name).join(', ')} }: ${varsType}) => 
      repository.${repoMethodName}(${paramTypes.map(p => p.name).join(', ')}),
    // syncStore: (data: ${cleanResultType}, variables: ${varsType}) => void,
    // onSuccess: (data: ${cleanResultType}, variables: ${varsType}) => void
  });
}
`;
	} else if (repoMethodName.startsWith('delete')) {
		const param = parameters[0];
		const paramName = param.getName();
		const paramType = cleanupType(param.getType().getText());

		return `
export function ${managerFunctionName}(repository: ${interfaceName}, queryClient: QueryClient): UseMutationResult<${cleanResultType}, Error, ${paramType}, unknown> {
  return useCustomMutation({
    mutationFn: (${paramName}: ${paramType}) => repository.${repoMethodName}(${paramName}),
    // syncStore: (data: ${cleanResultType}, variables: ${paramType}) => void,
    // onSuccess: (data: ${cleanResultType}, variables: ${paramType}) => void
  });
}
`;
	} else {
		if (parameters.length === 0) {
			return `
export function ${managerFunctionName}(repository: ${interfaceName}, queryClient: QueryClient): UseMutationResult<${cleanResultType}, Error, void, unknown> {
  return useCustomMutation({
    mutationFn: () => repository.${repoMethodName}(),
    // syncStore: (data: ${cleanResultType}, variables: void) => void,
    // onSuccess: (data: ${cleanResultType}, variables: void) => void
  });
}
`;
		} else {
			const paramTypes = parameters.map(p => ({
				name: p.getName(),
				type: cleanupType(p.getType().getText())
			}));

			const varsType = paramTypes.length === 1
				? paramTypes[0].type
				: `{ ${paramTypes.map(p => `${p.name}: ${p.type}`).join(', ')} }`;

			const fnParams = paramTypes.length === 1
				? `(${paramTypes[0].name}: ${paramTypes[0].type})`
				: `({ ${paramTypes.map(p => p.name).join(', ')} }: ${varsType})`;

			const repoParams = paramTypes.length === 1
				? paramTypes[0].name
				: paramTypes.map(p => p.name).join(', ');

			return `
export function ${managerFunctionName}(repository: ${interfaceName}, queryClient: QueryClient): UseMutationResult<${cleanResultType}, Error, ${varsType}, unknown> {
  return useCustomMutation({
    mutationFn: ${fnParams} => repository.${repoMethodName}(${repoParams}),
    // syncStore: (data: ${cleanResultType}, variables: ${varsType}) => void,
    // onSuccess: (data: ${cleanResultType}, variables: ${varsType}) => void
  });
}
`;
		}
	}
}
