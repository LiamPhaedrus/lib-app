class Api::V1::ShelvesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:index, :show]

  def index
    if current_user
      render json: {
        shelves: shelves_info(current_user.id),
        books: book_info(current_user.id)
      }
    end
  end

  private

  def shelves_info(id)
    shelves = []
    Shelf.where(user_id: id).each do |shelf|
      hash = {}
      hash[:id] = shelf.id
      hash[:name] = shelf.name
      hash[:size] = shelf.size
      hash[:bookIds] = shelf.books.pluck(:id)
      shelves << hash
    end
    shelves
  end

  def book_info(id)
    books = []
    Placement.where(user_id: id).each do |placed|
      hash = {}
      hash[:id] = placed.id
      hash[:title] = placed.book.title
      hash[:author] = placed.book.author
      hash[:spot] = placed.spot
      hash[:shelfId] = placed.shelf_id
      books << hash
    end
    books
  end
end