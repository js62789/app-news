import config from 'config';
import app from './server';

const PORT = config.get('port');

const server = app.listen(PORT, () => {
  console.log(`Application is listening on port ${PORT}`);
});

export default server;
