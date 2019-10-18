import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { join } from 'path';
import { existsSync } from 'fs';

import { initDatabase, dbInitHook } from './sql';
import { apiRouter, authRouter, searchRouter, userRouter, publishRouter, imageRouter } from './routes';
import { initUtils, registerTasks } from './utils';
import { profiles } from '../api';

class Server {
    public main: Application;
    public app: Application;

    constructor() {
        this.main = express();
        this.app = express();
        this.main.use('/api', this.app);

        this.config();
        this.routes();
        this.angular();
    }

    public config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(cors());
        this.app.use('/', morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.main.use(`/storage`, express.static(process.env.STORAGE));
    }

    public routes(): void {
        this.app.use('/', apiRouter);
        this.app.use('/search', searchRouter);
        this.app.use('/auth', authRouter);
        this.app.use('/user', userRouter);
        this.app.use('/publication', publishRouter);
        this.app.use('/image', imageRouter());
    }

    public angular(): void {
        /*this.main.get('/*', (req, res) => {
            const subdomain = req.hostname.split('.')[0].toLowerCase();
            if (!profiles[subdomain]) res.sendFile(join(__dirname, '/lobby/index.html'));
        });*/
        this.main.get('/*', express.static(join(__dirname, '../app/')));
        const indexPath = join(__dirname, '../app/index.html');
        this.main.get('/*', (_, res) => { if (existsSync(indexPath)) res.sendFile(indexPath); });
    }

    public start(): void {
        this.main.listen(this.app.get('port'), () => console.log('Server on port', this.app.get('port')));
    }
}

dotenv.config();
initUtils();

initDatabase();
dbInitHook().subscribe(registerTasks);

new Server().start();
