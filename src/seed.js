require('dotenv').config();
const { fakerFA: faker } = require('@faker-js/faker');
const { Sequelize, DataTypes } = require('sequelize');
const { hash } = require('bcrypt');
const { config } = require('./helpers/config');

const sequelize = new Sequelize(config.dbString);

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

const Move = sequelize.define(
  'Move',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false, indexes: [{ fields: ['name'] }] }
);

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

Category.hasMany(Move);
Move.belongsTo(Category);

const seed = async () => {
  await sequelize.sync({ force: true });
  let data = [];
  for (let i = 0; i < 10; i++) {
    data.push({ name: faker.lorem.word() });
  }
  await Category.bulkCreate(data);
  data = [];
  (await Category.findAll()).forEach((c) => {
    for (let i = 0; i < 20; i++) {
      data.push({ name: faker.lorem.words(), CategoryId: c.id });
    }
  });
  await Move.bulkCreate(data);
  await User.create({ username: 'admin', password: await hash('Fitness2023', 12) });
  await sequelize.close();
};

seed();
