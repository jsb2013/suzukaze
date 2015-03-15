// サーバー接続情報、及びソケットサーバー接続情報
exports.connectionUrl = "localhost";
exports.connectionPort = 3000;

// データベース接続情報
exports.connectionString = process.env.DATABASE_URL
        || "tcp://postgres:postgres@localhost:5432/postgres";

// 帳票サーバ接続情報
exports.connectionPrintServUrl = "54.64.43.110";
