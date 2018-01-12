class AsmComponentLoaderDirective {
    constructor() {
        this.replace = true;
        this.templateUrl = 'main/partials/component-loader.jade';
    }
}

export function asmComponentLoader() {
    return new AsmComponentLoaderDirective();
}
