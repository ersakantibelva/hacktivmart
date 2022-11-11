'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
    }

    static genders = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' }
    ]

    get formattedDateOfBirth() {
      return this.dateOfBirth.toString()
    }

    get title() {
      if(this.gender == 'male') return 'Mr.'
      if(this.gender == 'female') return 'Ms.'
    }
  }
  Profile.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First Name is required.'
        },
        notEmpty : {
          msg: 'First Name is required.'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last Name is required.'
        },
        notEmpty : {
          msg: 'Last Name is required.'
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Gender is required.'
        },
        notEmpty : {
          msg: 'Gender is required.'
        },
        isIn: {
          args: [['male', 'female']],
          msg: 'Invalid gender, please try again.'
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Date of Birth is required.'
        },
        notEmpty : {
          msg: 'Date of Birth is required.'
        },
        minAge(value) {
          if (value) {
            if ((new Date().getFullYear() - value.getFullYear()) <= 17) {
  
              if (new Date().getMonth() <= value.getMonth()) {
  
                if (new Date().getDate() < value.getDate()) {
  
                  throw new Error('Age must be more or equal than 17 years old.')
                }
              }
            } 
          }
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};