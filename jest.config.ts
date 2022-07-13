import type {Config} from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        setupFilesAfterEnv: [
            '<rootDir>/__setup__/setupTests.js'
        ],
        modulePathIgnorePatterns: ["__tests__/utils/"],
        testEnvironment: 'jsdom',
        moduleNameMapper: {
            '^.+\\.(css|less|scss)$': 'identity-obj-proxy'
        },
    }
}
