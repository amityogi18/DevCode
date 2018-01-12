function linkingFuncion($document, $window) {
    return function makeDraggable(scope, element, attr) {
               var startX = 0;
               var startY = 0;

               // Start with a random pos
               var x = -150; //Math.floor((Math.random() * 500) + 40);
               var y = 100; //Math.floor((Math.random() * 360) + 40);

               element.css({
                 position: 'fixed',
                 cursor: 'pointer',
                 top: y + 'px',
                 left: x + 'px'
               });

               element.on('mousedown', function(event) {
                 if(event){
                   event.preventDefault();

                   startX = event.pageX - x;
                   startY = event.pageY - y;

                   $document.on('mousemove', mousemove);
                   $document.on('mouseup', mouseup);
                 }
               });

               function mousemove(event) {
                 y = event.pageY - startY;
                 x = event.pageX - startX;

                 element.css({
                   top: y + 'px',
                   left: x + 'px'
                 });
               }

               function mouseup() {
                 $document.unbind('mousemove', mousemove);
                 $document.unbind('mouseup', mouseup);
               }
             }
};

class ngDraggableDirective {
    constructor($document, $window) {
        this.$document =  $document;
        this.$window =  $window;
        this._instantiate();
    }

    _instantiate() {
        this.restrict = 'A';
        this.scope = {
            dragOptions: '=ngDraggable'
        },
        this.link = linkingFuncion(this.$document, this.$window);
    }
}

ngDraggable.$inject = ['$document', '$window'];

export function ngDraggable($document) {
    return new ngDraggableDirective($document);
}