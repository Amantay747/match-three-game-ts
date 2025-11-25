import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swagerJsdoc from 'swagger-jsdoc';
import { seqialize } from './config/database';
import { gameRoutes } from './routes/game.routes';

const app = express();

app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Match Three Game API',
            version: '1.0.0',
            description: 'API documentation for the Match Three Game application',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./dist/routes/*.js'],
};

const swaggerSpecs = swagerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api', gameRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        time: new Date().toISOString(),
    });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ message: 'Route Not Found' });
});

const PORT = process.env.PORT || 3000;

const retryConnection = async (maxRetries = 10, delay = 3000): Promise<void> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Database connection attempt ${attempt}/${maxRetries}...`);
            await seqialize.authenticate();
            console.log('✓ Database authenticated successfully.');
            await seqialize.sync();
            console.log('✓ Database synchronized.');
            return;
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            const waitTime = delay * attempt;
            console.log(`Connection failed. Retrying in ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
};

const startServer = async () => {
    try {
        await retryConnection();
        app.listen(PORT, () => {
            console.log(`✓ Server is running on port ${PORT}`);
            console.log(`✓ API documentation: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('✗ Unable to connect to the database after retries:', error);
        process.exit(1);
    }
};

startServer();

export default app;


