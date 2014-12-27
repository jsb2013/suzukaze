// サーバー接続情報、及びソケットサーバー接続情報
exports.connectionUrl = "localhost";
exports.connectionPort = 3000;

// データベース接続情報
exports.connectionString = process.env.DATABASE_URL
        || "tcp://postgres:hisashiE82@localhost:5432/postgres";
