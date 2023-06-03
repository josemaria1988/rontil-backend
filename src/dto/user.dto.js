export default class GetCurrentUserDTO {
    constructor (user) {
      this.name = user.first_name;
      this.role = user.role;
      this.cart = user.cart ? user.cart.length : 0;
    }
  }