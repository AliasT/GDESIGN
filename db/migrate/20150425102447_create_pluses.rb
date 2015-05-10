class CreatePluses < ActiveRecord::Migration
  def change
    create_table :pluses do |t|
      t.integer :pluser
      t.references :comment, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
