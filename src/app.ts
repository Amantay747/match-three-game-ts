import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swagerJsdoc from 'swagger-jsdoc';
import { seqialize } from './config/dqlize';
import gameRoutes from './routes/game.routes';
import { time } from 'console';

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
    apis: ['./src/routes/*.ts'],
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

const startServer = async () => {
    try {
        await seqialize.authenticate();
        console.log('Database connected successfully.');
        await seqialize.sync();
        console.log('Database synchronized.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();

export default app;


