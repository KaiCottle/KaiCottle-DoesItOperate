/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) { 
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                } else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                        (keyCode == 32)                     ||   // space
                        (keyCode == 13)) {                       // enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            } else if ((keyCode == 8)) { // backspace 
                //This was largely thanks to BrenDOS I used his code as a reference.
                if (_Console.buffer.length != 0) {
                    // length of last character
                    let char = _Console.buffer.charAt(_Console.buffer.length - 1);
                    let offset = TSOS.CanvasTextFunctions.measure(_Console.currentFont, _Console.currentFontSize, char);
                    // Delete last character
                    _Console.buffer = _Console.buffer.substring(0, _Console.buffer.length - 1);
                    // Shift X-position and delete last character from text field
                    _Console.currentXPosition = _Console.currentXPosition - offset;
                    _DrawingContext.clearRect(_Console.currentXPosition, _Console.currentYPosition - _DefaultFontSize, offset, _DefaultFontSize + 2 * _FontHeightMargin);
                    if (_Console.currentXPosition <= 0) {
                        _DrawingContext.clearRect(0, _Console.currentYPosition - _DefaultFontSize, _Canvas.width, _DefaultFontSize + 2 * _FontHeightMargin + _Console.currentYPosition);
                        _Console.currentYPosition = _Console.currentYPosition;
                        _Console.currentXPosition = 0;
                        _OsShell.putPrompt();
                        _Console.putText(_Console.buffer);
                    }
                }
            } else if (keyCode == 9) { // tab
                // Tab completion -> Refereneced from BrenDOS but made some stylistic changes
                // "Every good line of code has already been written, you just have to find it"
                const cmdString = _Console.buffer; // Get current command entry
                if (cmdString.length === 0) return;
            
                const matchingCmds = _OsShell.commandList.filter(commandName =>
                    commandName.command.startsWith(cmdString)
                );
            
                if (matchingCmds.length === 1) {
                    // Auto-complete the single matching command
                    const remainingCmd = matchingCmds[0].command.slice(cmdString.length);
                    for (const char of remainingCmd) {
                        _KernelInputQueue.enqueue(char);
                    }
                } else if (matchingCmds.length > 0) {
                    // Clear current line
                    _DrawingContext.clearRect(0, _Console.currentYPosition - _DefaultFontSize, _Canvas.width, _DefaultFontSize + 2 * _FontHeightMargin);
                    _DrawingContext.clearRect(0, _Console.currentYPosition + _FontHeightMargin, _Canvas.width, _DefaultFontSize + 2 * _FontHeightMargin + _Console.currentYPosition);
                    _Console.currentXPosition = 0;
            
                    // Output matching commands, 3 per line
                    matchingCmds.forEach((cmd, index) => {
                        _Console.putText(cmd.command + "   ");
                        if ((index + 1) % 3 === 0) _Console.advanceLine();
                    });
            
                    if (matchingCmds.length % 3 !== 0) _Console.advanceLine();
            
                    // Reprint prompt and entered text
                    _OsShell.putPrompt();
                    _Console.putText(_Console.buffer);
                }
            }  
        }
    }
}
