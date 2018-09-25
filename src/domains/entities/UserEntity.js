const t = require('tcomb');

const UserEntity = t.struct(
  {
    id: t.maybe(t.String),
    user_name: t.String,
    first_name: t.String,
    last_name: t.maybe(t.String),
    email: t.String,
    address: t.maybe(t.String),
    phone: t.maybe(t.String),
    created_at: t.maybe(t.Integer),
    updated_at: t.maybe(t.Integer),
  },
  'UserEntity'
);

UserEntity.prototype.getFullName = () => {
  return `${this.last_name} ${this.first_name}`;
};


module.exports = UserEntity;