/*
 @name ErrorLoggerServiceProvider
 @description - Its a Provider class that has a method that logs the error on the console window
 */
class ErrorLoggerServiceProvider {
    log(message) {
        let storedErrors = window.localStorage.consoleErrors;
        storedErrors = storedErrors ? JSON.parse(storedErrors) : [];
        storedErrors.push(message);
        window.localStorage.consoleErrors = JSON.stringify(storedErrors);
    }

    $get() {
        return {}
    }
}

export default ErrorLoggerServiceProvider;