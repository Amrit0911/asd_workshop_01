const express = require('express');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (request, response) => {
	response.json({ message: 'API is running' });
});

app.use('/products', productRoutes);

app.use((error, request, response, next) => {
    console.error(error.message);
    response.status(500).json({ message: 'Internal server error' });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Welcome to the Server of Null Vector on port ${port}`);
    });
}

module.exports = app;
