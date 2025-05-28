import { expect } from '@wdio/globals'
import authenFlow from '../../Auth/authenFlow.js'
import data from './test.data.js'

describe('Login successfulle', () => {
    it('should login with valid credentials', async () => {
        await authenFlow.login(data.username, data.password)
        await authenFlow.verifyLoginSuccessfully(data.expectedMessage)
    })
})

