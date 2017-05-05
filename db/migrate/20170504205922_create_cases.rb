class CreateCases < ActiveRecord::Migration[5.0]
  def change
    create_table :cases do |t|
      t.string :name
      t.string :location

      t.belongs_to :user
      t.timestamps
    end
  end
end
