'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
    }

    static roles = [
      { label: 'Buyer', value: 'buyer' },
      { label: 'Seller', value: 'seller' }
    ]

    checkPassword(password, req, res) {
      const isValidPassword = bcrypt.compareSync(password, this.password)

      if(isValidPassword) {
        req.session.userId = this.id
        req.session.role = this.role

        return res.redirect('./products')
      }
      const errMsg = 'Invalid password, please try again'
      res.redirect(`./login?error=${errMsg}`)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username is required.'
        },
        notEmpty : {
          msg: 'Username is required.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email is required.'
        },
        notEmpty : {
          msg: 'Email is required.'
        },
        isEmail: {
          msg: 'Invalid email, please try again'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password is required.'
        },
        notEmpty : {
          msg: 'Password is required.'
        },
        len: {
          args: [5, 10],
          msg: 'Password length must between 5 and 10 letters.'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Role is required.'
        },
        notEmpty : {
          msg: 'Role is required.'
        },
        isIn: {
          args: [['buyer', 'seller']],
          msg: "Invalid role, please choose between 'Buyer' and 'Seller' "
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((instance, options) => {
    const salt = bcrypt.genSaltSync(10);
    instance.password = bcrypt.hashSync(instance.password, salt);
  })

  return User;
};