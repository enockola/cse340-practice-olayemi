import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// View engine + views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Static files (CSS, images, JS)
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.NODE_ENV = (NODE_ENV || 'production').toLowerCase();
  next();
});

// Dev WebSocket (optional)
if (NODE_ENV.includes('dev')) {
  (async () => {
    const ws = await import('ws');
    const wsPort = Number(PORT) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on('listening', () => {
      console.log(`WebSocket server is running on port ${wsPort}`);
    });

    wsServer.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });
  })().catch((error) => console.error('Failed to start WebSocket server:', error));
}

// Routes
app.get('/', (req, res) => res.render('home', { title: 'Welcome Home' }));
app.get('/about', (req, res) => res.render('about', { title: 'About Me' }));
app.get('/products', (req, res) => res.render('products', { title: 'Our Products' }));

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
