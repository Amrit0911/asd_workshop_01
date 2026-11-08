const { convert, ConversionError } = require('py2js-converter');

function transpilePython(request, response, next) {
    const { source } = request.body;

    if (typeof source !== 'string') {
        return response.status(400).json({
            message: 'The request body must include a Python source string.',
        });
    }

    try {
        return response.json({ javascript: convert(source) });
    } catch (error) {
        if (error instanceof ConversionError) {
            return response.status(422).json({
                message: error.message,
                kind: error.kind,
                line: error.line,
                column: error.column,
            });
        }

        return next(error);
    }
}

module.exports = { transpilePython };
