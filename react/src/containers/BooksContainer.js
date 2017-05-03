import React, { Component }  from 'react'
import { Link } from 'react-router'
import BackButton from '../components/BackButton'
import NewBookFormContainer from './NewBookFormContainer'

class BooksContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      books: []
    }
    this.addNewBook = this.addNewBook.bind(this)
  }

  componentDidMount () {
    fetch('/api/v1/books', {
      credentials: 'include',
      method: 'GET'
    })
      .then(response=> response.json())
      .then(parsed=> {
        this.setState({
          name: parsed.user,
          books: parsed.books
        })
      })
  }

  addNewBook (formPayload) {
    fetch('/api/v1/books', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formPayload)
    })
    .then(response => response.json())
    .then(parsed => {
      this.setState({ books: [...this.state.books, ...parsed.book] })
    })
  }

  render () {
    let bookTitles = this.state.books.map(book => {
      let author = ''
      if (book.author) {
        author = `by ${book.author}`
      }
      return(
        <li key={"book" + book.id}>{book.title} {author}</li>
      )
    })
    return(
      <div id="top-all-books">
        <h1>All of {this.state.name + "'s"} Books</h1>
        <a href='#addbook' className="button react-left">Add Book</a>
        <BackButton />
        <ul>
          {bookTitles}
        </ul>
        <div id='addbook'>
          <NewBookFormContainer
            addNewBook={this.addNewBook}
          />
        </div>
        <a href='#top-all-books' className="button react-left">Top</a><BackButton />
      </div>
    )
  }
}

export default BooksContainer
