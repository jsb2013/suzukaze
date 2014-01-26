/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */

// データベース接続情報
exports.connectionString = process.env.DATABASE_URL
        || "tcp://postgres:hisashiE82@localhost:5432/postgres";

// 一人当りの診察時間（min）
exports.perTime = 5;