const errorHandler = ($provide, ErrorLoggerServiceProvider) => {
    $provide.decorator("$exceptionHandler", ['$delegate',($delegate) => {
        return (exception, cause) => {
            //window.console.log('custom',exception);
            ErrorLoggerServiceProvider.log(exception.message);
            $delegate(exception, cause);
        };
    }]);
};

errorHandler.$inject = ['$provide', 'ErrorLoggerServiceProvider'];
export default errorHandler;