class Token {
    constructor(token) {
        this.token = token
    }

    get getToken() {
        return this.token
    }

    setToken(str) {
        this.token = str
    }
}

module.exports = Token