import authenFlow from '../../../Test-Flows/Authentication-Flow.js'
import validCredential from '../../../../data/validCredential.js'

describe('Login successfulle', () => {
    it('should login with valid credentials', async () => {
        await authenFlow.login(validCredential.username, validCredential.password)
        await authenFlow.verifyLoginSuccessfully(validCredential.expectedMessage)
    })
})

