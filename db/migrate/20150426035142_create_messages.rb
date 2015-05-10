class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :m_type
      t.integer :r_id
      t.integer :t_id
      t.integer :from_id
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
