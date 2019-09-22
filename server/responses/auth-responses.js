module.exports = {
    AuthResponse: class {
        constructor(success = false, message = "", token = null, userData = null){
            this.success = success;
            this.message = message;
            this.token = token;
            this.userData = userData;
        }
    }
}