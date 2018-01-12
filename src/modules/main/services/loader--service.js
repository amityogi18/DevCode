let service;
export class LoaderService {
    constructor() {
        service = this;
        service.loader = {};
    }

    show() {
        service.loader.active = true;
    }

    hide() {
        service.loader.active = false;
    }
}