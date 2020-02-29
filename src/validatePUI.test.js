import validatePUI from './validatePUI'

describe('sample js tests', () => {
    test('validate PUI', () => {
        expect(validatePUI('ABC123456')).toBe(true)
    })
    test('detect invalid PUI', () => {
        expect(validatePUI('ABC12345')).toBe(false)
    })
})
