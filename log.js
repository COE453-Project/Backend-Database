require('colors');

const logResponse = (req, res, next) => {
    let sourceIP = req.ip || req.connection.remoteAddress;

    if (sourceIP.substr(0, 7) == "::ffff:") {
        sourceIP = sourceIP.substr(7);
    }
    else if (sourceIP === '::1') {
        sourceIP = '127.0.0.1';
    }

    const sourcePort = req.connection.remotePort;

    const method = req.method;

    const endpoint = req.originalUrl;

    const statusCode = res.statusCode;

    // Log the connection details without a new line
    process.stdout.write('INFO:\t'.blue);

    process.stdout.write(`${sourceIP}:${sourcePort} ${method} ${endpoint} `);

    if (statusCode >= 200 && statusCode < 300) {
        console.log(`${statusCode}`.green);
    }
    else if (statusCode >= 300 && statusCode < 400) {
        console.log(`${statusCode}`.yellow);
    }
    else {
        console.log(`${statusCode}`.red);
    }

    next();
}

module.exports = logResponse;