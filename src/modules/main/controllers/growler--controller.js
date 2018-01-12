export class GrowlerController {
    constructor(GrowlerService) {
        this.growls = GrowlerService.growls;
    }
}
GrowlerController.$inject = ['GrowlerService'];