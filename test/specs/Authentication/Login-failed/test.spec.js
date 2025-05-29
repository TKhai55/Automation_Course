import authenFlow from '../../../Auth/authenFlow.js'
import data from './test.data.js'

describe('Login failed', () => {
    beforeEach(async () => {
        await authenFlow.openLoginPage()
    })
    it('should login failed with invalid username', async () => {
        await authenFlow.login(data.incorrectUsername, data.password)
        await authenFlow.verifyLoginFailed(data.expectedErrorNameMessage)
    })
    it('should login failed with invalid password', async () => {
        await authenFlow.login(data.username, data.incorrectPassword)
        await authenFlow.verifyLoginFailed(data.expectedErrorPassMessage)
    })
})

