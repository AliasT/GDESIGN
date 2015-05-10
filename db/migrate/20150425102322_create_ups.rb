class CreateUps < ActiveRecord::Migration
  def change
    create_table :ups do |t|
      t.integer :uper
      t.references :post, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
