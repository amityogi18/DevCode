
export class AppHeaderController
{
  /** @ngInject */
  constructor(AuthService) {
    this.AuthService = AuthService;
    this.user = this.AuthService.user;
  
  }
  
}
