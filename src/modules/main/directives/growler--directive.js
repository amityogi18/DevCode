class AsmGrowlerDirective {
    constructor() {
        this.restrict = 'A';
        this.scope = true;
        this.replace = true;
        this.templateUrl = 'main/partials/growler.jade';
        this.controller = 'GrowlerController';
        this.controllerAs = 'GrowlerCtrl';
    }
}

export function asmGrowler() {
    return new AsmGrowlerDirective();
}

