const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('GET method testing', () => {
  
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    // console.log('response.body', response.body)
    
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have id field', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(blog => expect(blog.id).toBeDefined())
  })

})

describe('POST method testing', () => {
  
  test('a valid blog can be added ', async () => {
    const newBlog = { 
      title: 'Awesome JS no-scope tricks', 
      author: 'Olli V', 
      url: 'https://no-scope247.com/', 
      likes: 99
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
    const title = blogsAtEnd.map(b => b.title)
    expect(title).toContain('Awesome JS no-scope tricks')
  })

  test('incase of no like value given, set likes to 0', async () => {
    const newBlogWithoutLikes = { 
      title: 'This will get so many likes', 
      author: 'Olli V', 
      url: 'https://everyonelovesme.com/'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
    const likes = blogsAtEnd.map(b => b.likes)
    expect(likes[likes.length - 1]).toEqual(0)
  })

  test('incase of no title or url given, response with 400', async () => {
    const newBlogWithoutTitleAndUrl = { 
      author: 'Olli V', 
      likes: 13
    }
  
    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitleAndUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  
  })
})

describe('DELETE method testing', () => {
  
  test('a blog can be deleted', async () => {
    const savedBlogs = await helper.blogsInDb()
    const blogIdToDelete = savedBlogs[0].id

    await api
      .delete(`/api/blogs/${blogIdToDelete}`)
      .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })
})

describe('PUT method testing', () => {
  
  test('likes on a blog can be edited', async () => {
    const savedBlogs = await helper.blogsInDb()
    const blogToUpdate = savedBlogs[0]

    const updatedBlog = {
      title: 'Awesome JS no-scope tricks', 
      author: 'Olli V', 
      url: 'https://no-scope247.com/', 
      likes: 99
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].likes).toEqual(99)
  })
})

afterAll(() => {
  mongoose.connection.close()
})