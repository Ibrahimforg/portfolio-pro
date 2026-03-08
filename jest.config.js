import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Options de configuration Next.js pour Jest
  dir: './',
  testEnvironment: 'jsdom',
  
  // Configuration des chemins pour les modules
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Configuration des fichiers de test
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  
  // Exclusion des fichiers
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
  ],
  
  // Configuration de la collecte de couverture
  collectCoverageFrom: [
    'src/**/*.(ts|tsx|js)',
    '!src/**/*.d.ts',
    '!src/**/*.stories.(ts|tsx|js)',
    '!src/**/index.ts',
  ],
  
  // Seuils de couverture de code
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Configuration du rapport de couverture
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  
  // Setup et teardown
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Transformation des fichiers
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    }],
  },
  
  // Modules à transformer
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  // Configuration des mocks
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Variables d'environnement
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
})

// Configuration spécifique pour Next.js App Router
export default createJestConfig
