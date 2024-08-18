import app from './index'
import dotenv from 'dotenv'

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`[server]: Server is running on port ${port}`);
  });