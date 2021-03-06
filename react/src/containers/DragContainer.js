import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ShelfContainer from './ShelfContainer'
import MoveBookList from './MoveBookList'
import BackButton from '../components/BackButton'
import SelectShelf from './SelectShelf'
import PlusMinus from './PlusMinus'

class DragContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shelves: [],
      books: [],
      selectedShelf: '',
      bookcases: []
    }

    this.handleSpotPlace = this.handleSpotPlace.bind(this)
    this.handleShelf = this.handleShelf.bind(this)
    this.handleEmptyShelf = this.handleEmptyShelf.bind(this)
  }

  componentDidMount () {
    fetch(`api/v1/shelves`, {
      credentials: 'include',
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          shelves: data.shelves,
          books: data.books,
          bookcases: data.bookcases,
          selectedShelf: data.shelves[0].id
        })
      })

  }

  handleSpotPlace (book, spot, shelf) {
    let findBook = (obj) => {
      return obj.id === book
    }
    let payload = {placement: {id: book, spot: spot, shelf_id: shelf}}
    fetch(`/api/v1/placements/${book}`, {
      credentials: 'include',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        this.setState({ shelves: data.shelves, books: data.books })
      })
  }

  handleShelf (event) {
    this.setState({ selectedShelf: event.target.value })
  }

  handleEmptyShelf () {
    let payload = { shelf_to_empty: {id: this.state.selectedShelf} }
    fetch(`api/v1/shelves/${this.state.selectedShelf}`, {
      credentials: 'same-origin',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ shelves: data.shelves, books: data.books })
    })
  }

  render () {
    let unplacedBooks = []
    this.state.books.forEach(book => {
      if (book.shelfId === null) {
        unplacedBooks.push(book)
      }
    })

    let whichShelf = (obj) => {
      return obj.id === this.state.selectedShelf
    }

    let bob = this.state.shelves.find(whichShelf)
    let shelves = this.state.shelves.map(shelf => {

      let filterById = (obj) => {
        return shelf.bookIds.includes(obj.id)
      }
      let shelvedBooks = this.state.books.filter(filterById)
      if (shelf.id === parseFloat(`${this.state.selectedShelf}`)) {
        return(
          <div key={"shelf" + shelf.id} className='row columns'>
            <h3>{shelf.name}</h3>
            <PlusMinus
              id={shelf.id}
              handleEmptyShelf={this.handleEmptyShelf}
            />
          <ShelfContainer
            id={shelf.id}
            size={shelf.size}
            books={shelvedBooks}
            handleAdd={this.handleSpotPlace}
          />
          </div>
        )
      }

    })
    return(
      <div className='bg-fade-more'>
        <div className="columns dnd-container">
          <div className='row columns'>
            <BackButton />
          </div>
          <SelectShelf
            bookcases={this.state.bookcases}
            handleShelf={this.handleShelf}
            selectedShelf={this.state.selectedShelf}
          />
          {shelves}
          <MoveBookList
            books={this.state.books}
            handleAdd={this.handleSpotPlace}
            id={null}
          />
        </div>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(DragContainer)
