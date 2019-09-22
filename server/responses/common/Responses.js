
module.exports = {
    DataResponse: class {
        constructor(success = false,numRows = 0,data = null){
            this.success = success;
            this.numRows = numRows;
            this.data = data;
        }
    },
    CollectionResponse: class {
        constructor(success = false,numRows = 0,rows = []){
            this.success = success;
            this.numRows = numRows;
            this.rows = rows;
        }
    },
    PostResponse: class {
        constructor(success = false,insertId = 0){
            this.success = success;
            this.insertId = insertId;
        }
    },
    StatusResponse: class {
        constructor(success = false, message = ""){
            this.success = success;
            this.message = message;
        }
    }
}