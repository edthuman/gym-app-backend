import app from './index'

const {PORT = "9090"} = process.env

app.listen(PORT, () => {
    console.log(`[server]: Server is running on port ${PORT}`);
  });