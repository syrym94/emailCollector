var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host: '192.168.1.15',
    user: 'admin',
    password: 'Capstone2019admin',
    database: 'test'
});

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    let messages = `create table if not exists messages(
                            message_id int primary key auto_increment not null,
                            html VARCHAR(255),
                            header VARCHAR(255),
                            created INT NOT NULL,
                            updated INT NOT NULL
                            )`;
    let attachments = `CREATE TABLE if not exists attachments (
                            attachment_id INT NOT NULL AUTO_INCREMENT,
                            file VARCHAR(45) NOT NULL,
                            path VARCHAR(45) NOT NULL,
                            attachment_message_id INT NOT NULL,
                            created INT NOT NULL,
                            updated INT NOT NULL,
                            PRIMARY KEY (attachment_id),
                            INDEX attachment_message_id_idx (attachment_message_id ASC),
                            CONSTRAINT attachment_message_id
                            FOREIGN KEY (attachment_message_id)
                            REFERENCES messages (message_id)
                            ON DELETE CASCADE
                            ON UPDATE CASCADE)`;
    let profiles = `CREATE TABLE if not exists profiles (
                            profile_id INT NOT NULL AUTO_INCREMENT,
                            profile_message_id INT NOT NULL,
                            created INT NOT NULL,
                            updated INT NOT NULL,
                            PRIMARY KEY (profile_id),
                            INDEX profile_message_id_idx (profile_message_id ASC),
                            CONSTRAINT profile_message_id
                            FOREIGN KEY (profile_message_id)
                            REFERENCES messages (message_id)
                            ON DELETE CASCADE
                            ON UPDATE CASCADE)`

    connection.query(messages, function (err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        console.log(results, fields)
    });
    connection.query(attachments, function (err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        console.log(results, fields)
    });
    connection.query(profiles, function (err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        console.log(results, fields)
    });
});

module.exports = connection;