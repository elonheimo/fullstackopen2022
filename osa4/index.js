const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
//models blog
/*
const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})
const Blog = mongoose.model('Blog', blogSchema)
*/
//models blog
/*
app.js
const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
*/
/*
app.get('/api/blogs', (request, response) => {
    Blog
    .find({})
    .then(blogs => {
        response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)
    
    blog
    .save()
    .then(result => {
        response.status(201).json(result)
    })
})
*/
const server = http.createServer(app)


app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})