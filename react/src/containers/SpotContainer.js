import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { DropTarget } from 'react-dnd'
import Book from '../components/Book'

const Types = {
  BOOK: 'book'
};

const spotTarget = {
  canDrop(props, monitor) {
    // You can disallow drop based on props or item
    const item = monitor.getItem()
    // return canMakeChessMove(item.fromPosition, props.position);
    // ie- the above, if one shelf was only for sci fi, putting a biography would return false
    return true
  },

  hover(props, monitor, component) {
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // here—if you need them, put monitor.isOver() into collect() so you
    // can just use componentWillReceiveProps() to handle enter/leave.

    // You can access the coordinates if you need them
    const clientOffset = monitor.getClientOffset();
    const componentRect = findDOMNode(component).getBoundingClientRect();

    // You can check whether we're over a nested drop target
    const isJustOverThisOne = monitor.isOver({ shallow: true });

    // You will receive hover() even for items for which canDrop() is false
    const canDrop = monitor.canDrop();
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return
    }
    // Obtain the dragged item
    const item = monitor.getItem()
    // You can do something with it
    // ChessActions.movePiece(item.fromPosition, props.position);

    props.handleAdd(item.id, component.props.id, component.props.shelfId)
    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true }
  }
}

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  }
}

class SpotContainer extends Component {
  componentWillReceiveProps (nextProps) {
    if (!this.props.isOver && nextProps.isOver) {
      // You can use this as enter handler
    }
    if (this.props.isOver && !nextProps.isOver) {
      // You can use this as leave handler
    }
    if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
      // You can be more specific and track enter/leave
      // shallowly, not including nested targets
    }
  }

  render () {
    const { position } = this.props
    const { isOver, canDrop, connectDropTarget, handleAdd } = this.props
    let books = this.props.books.map(book=> {
      return(
        <Book
          key={"book" + book.id}
          id={book.id}
          title={book.title}
          cover={book.cover}
        />
      )
    })
    return connectDropTarget (
      <div className="spot">
        {books}
      </div>
    )
  }
}


export default DropTarget(Types.BOOK, spotTarget, collect)(SpotContainer)
