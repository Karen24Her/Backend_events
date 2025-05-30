import app from './app.js'
import {connectDB} from './bd.js'

connectDB();
app.listen(5000)
console.log('server on port', 5000);