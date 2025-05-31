import authenFlow from '../../../Test-Flows/Authentication-Flow.js'
import invalidCredential from '../../../../data/invalidCredential.js'

describe('Login failed', () => {
    beforeEach(async () => {
        await authenFlow.openLoginPage()
    })
    it('should login failed with invalid username', async () => {
        await authenFlow.login(invalidCredential.incorrectUsername, invalidCredential.password)
        await authenFlow.verifyLoginFailed(invalidCredential.expectedErrorNameMessage)
    })
    it('should login failed with invalid password', async () => {
        await authenFlow.login(invalidCredential.username, invalidCredential.incorrectPassword)
        await authenFlow.verifyLoginFailed(invalidCredential.expectedErrorPassMessage)
    })
})

