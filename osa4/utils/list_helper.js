const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    return blogs.reduce((accumulator, current) => {
        return accumulator + current.likes
    }, 0)
}
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }
    return blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })
}
const mostBlogs = (blogs) => {
    if (blogs.length <= 1) {
        if (blogs.length == 0) {
            return undefined
        }
        return blogs[0]
    }
    authorBlogCount = blogs.reduce((memo, current) => {
        console.log(memo, current)
        const foundIndex = memo.findIndex((ele) => ele.author == current.author)
        if (foundIndex != -1) {
            memo[foundIndex].blogs += 1
            return memo
        }
        memo.push(
            {
                author: current.author,
                blogs: 1
            }
        )
        return memo
    }, [])

    return authorBlogCount.reduce((prev, curr) => {
        return prev.blogs > curr.blogs ? prev : curr
    })


}

const mostLikes = (blogs) => {
    if (blogs.length <= 1) {
        if (blogs.length == 0) {
            return undefined
        }
        return {
            author: blogs[0].author,
            likes: blogs[0].likes
        }
    }
    authorBlogCount = blogs.reduce((memo, current) => {
        console.log(memo, current)
        const foundIndex = memo.findIndex((ele) => ele.author == current.author)
        if (foundIndex != -1) {
            memo[foundIndex].likes += current.likes
            return memo
        }
        memo.push(
            {
                author: current.author,
                likes: current.likes
            }
        )
        return memo
    }, [])
    return authorBlogCount.reduce((prev, curr) => {
        return prev.likes > curr.likes ? prev : curr
    })
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}