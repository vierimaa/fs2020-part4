const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce( (sum, blog) => {
    return sum + blog.likes
  },0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce( (favorite, blog) => {
    if (blog.likes > favorite.likes || Object.keys(favorite).length === 0){
      favorite.author = blog.author
      favorite.title = blog.title
      favorite.likes = blog.likes
    } else {
      favorite = favorite
    }
    return favorite
  },{})
}

const mostBlogs = (blogs) => {
  if (blogs.length <0){
    return
  }
  const blogsByAuthor = blogs.reduce( (blogCount, blog) => {
    let author = blog['author']
    if (!blogCount[author]){
      blogCount[author] = [0]
    }
    blogCount[author]++
    return blogCount
  },{})

  const blogEntries = Object.entries(blogsByAuthor)
  return blogEntries.reduce( (blogKing, author) => {
    if (author[1] > blogKing.blogs){
      blogKing.author = author[0]
      blogKing.blogs = author[1]
    }
    return blogKing
  }, blogKing = {author: '', blogs: 0})
}

const mostLikedBlogger = (blogs) => {
  if (blogs.length <0){
    return
  }
  const likesbyAuthor = blogs.reduce( (authorLikes, blog) => {
    const author = blog['author']
    const likes = blog['likes']

    if (!authorLikes[author]){
      authorLikes[author] = likes
    } else {
    authorLikes[author] += likes
    }
    return authorLikes
  },{})

  const likeEntries = Object.entries(likesbyAuthor)
  return likeEntries.reduce((adoredOne, totLikesByAuthor) => {
    if(totLikesByAuthor[1] >= adoredOne.likes){
      adoredOne.author = totLikesByAuthor[0]
      adoredOne.likes = totLikesByAuthor[1]
    }
    return adoredOne
  }, adoredOne = {author: '', likes: 0})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikedBlogger
}