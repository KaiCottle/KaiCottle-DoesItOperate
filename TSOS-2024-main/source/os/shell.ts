/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new ShellCommand(this.shellDate,
                                "date",
                                "- Displays the current date.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new ShellCommand(this.shellWhereAmI,
                "whereami",
                "- Displays the current location.");
            this.commandList[this.commandList.length] = sc;
            // days2live
            sc = new ShellCommand(this.shellDays2Live,
                "days2live",
                "- Tells user how long they have until they die.");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - Sets the status.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            
            // bsod
            sc = new ShellCommand(this.shellBsod,
                "bsod",
                "Displays the Blue Screen of Death.");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                "load",
                "<load>- Validates previous input, only hex digits and spaces are valid.");
            this.commandList[this.commandList.length] = sc;

            // run
            sc = new ShellCommand(this.shellRun,
                "run",
                "run <pid>, runs the specified program.");
            this.commandList[this.commandList.length] = sc;
            
            //clearmem
            sc = new ShellCommand(this.shellClearMem,
                "clearmem",
                "<clearmem> - Clear all memory segments.");
            this.commandList[this.commandList.length] = sc;
            
            //runall
            sc = new ShellCommand(this.shellRunAll,
                "runall",
                "<runall> - Execute all programs at once.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellPs,
                "ps",
                "<ps> - Display the PID and state of all processes.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellKillOne,
                "killone",
                "<int> - Kill one process.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellKillAll,
                "killall",
                "<killall> - Kill all processes.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellQuantum,
                "quantum",
                "<int> - Enter an integer to set Round Robin quantum (measured in cpu cycles).");
            this.commandList[this.commandList.length] = sc;
            
            sc = new ShellCommand(this.shellFormat,
                "format",
                "<format> - Initialize all blocks in all sectors in all tracks.");
            this.commandList[this.commandList.length] = sc;
            sc = new ShellCommand(this.shellCreate,
                "create",
                "<filename> - Create the file 'filename'.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRead,
                "read",
                "<filename> - Read and display the contents of 'filename'.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellWrite,
                "write",
                "<filename> 'data' - Write the data inside the quotes (but not the quoter themselves) to 'filename'.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellDelete,
                "delete",
                "<filename> - Remove 'filename' from storage.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellCopy,
                "copy",
                "<existing filename> <new filename> — copy.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRename,
                "rename",
                "<current filename> <new filename>— rename.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLs,
                "ls",
                "<ls> - list the files currently stored on the disk.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellDate(args: string[]){
            _StdOut.putText("Todays Date: " + Date())
        }

        public shellWhereAmI(args: string[]){
            _StdOut.putText("Look behind you ;)")
        }

        public shellDays2Live(args: string[]) {
            let daysLeft = Math.floor(Math.random() * 100) + 1;
            _StdOut.putText(`You have: ${daysLeft} days left.`);
        }

        public shellBsod(args: string[]) {
            _Console.BSOD();
        }

        public shellLoad(args: string[]): void {
            // Check if CPU is executing
            if (_CPU.isExecuting) {
                _StdOut.putText("Unable to load programs while CPU is executing.");
                return;
            }
        
            // Retrieve and sanitize input
            const text = (<HTMLInputElement>document.getElementById("taProgramInput"))
                .value.replace(/\s/g, '');
        
            // Validate input using regex and even length check
            const isValidHex = /^[A-Fa-f0-9]+$/.test(text);
            const isEvenLength = text.length % 2 === 0;
        
            if (!isValidHex || !isEvenLength) {
                _StdOut.putText("Invalid input.");
                _StdOut.advanceLine();
                return;
            }
        
            _StdOut.putText("Valid input.");
            _StdOut.advanceLine();
        
            // Convert input into an array of bytes
            const userInputArray: string[] = [];
            for (let i = 0; i < text.length; i += 2) {
                userInputArray.push(text[i] + text[i + 1]);
            }
        
            // Initialize a new PCB
            _PCB = new Pcb();
            _PCB.init();
        
            // Create a new MemoryManager and find an available segment
            _MemoryManager = new MemoryManager();
            const availableSegment = _MemoryManager.segmentAvailable();
        
            // Check for memory availability
            if (availableSegment === -1) {
                if (_DSDD.isFormatted) {
                    // Handle loading to disk if memory is full
                    _PCB.PID = _PID++;
                    _PCB.priority = 5;
                    _PCB.location = "Disk";
                    _PCB.state = "Resident";
                    _PCB.machineCode = userInputArray;
                    _PCBList.push(_PCB);
        
                    // Generate file name and prepare machine code for disk
                    const fileName = `~${_PCB.PID}`;
                    while (_PCB.machineCode.length < 256) {
                        _PCB.machineCode.push("00");
                    }
        
                    // Create and write to disk
                    _DSDD.fileCreate(fileName);
                    _DSDD.fileWrite(fileName, _PCB.machineCode);
        
                    _StdOut.putText(`PID: ${_PCB.PID.toString()} loaded onto disk.`);
                    _StdOut.advanceLine();
                } else {
                    _StdOut.putText("No available memory and disk is not formatted.");
                    _StdOut.advanceLine();
                }
            } else {
                // Load into main memory if available
                _PCB.PID = _PID++;
                _PCB.priority = 5;
                _PCB.location = "Memory";
                _PCB.state = "Resident";
                _PCB.segment = availableSegment;
                _PCB.machineCode = userInputArray;
                _PCB.setBaseLimit();
                _PCBList.push(_PCB);
        
                // Allocate memory for the process
                _MemoryManager.allocateSegment(userInputArray);
        
                _StdOut.putText(`PID: ${_PCB.PID.toString()} loaded into main memory.`);
                _StdOut.advanceLine();
            }
        
            // Update process table
            Control.processTableUpdate();
        }        
        
        public shellRun(args: string[]) {
            var pidCheck = Number(args[0]);
            if (pidCheck <= _PCBList.length - 1) {
                if (_PCBList[pidCheck].PID === pidCheck) {
                    _PCBList[pidCheck].state = "Executing";
                    _CPU.isExecuting = true;
                }
            }
            else {
                _StdOut.putText("ERROR- INVALID PID");
                _CPU.isExecuting = false;
            }
            Control.processTableUpdate();
            Control.cpuTableUpdate();
        }

        public shellClearMem() {
            if (_CPU.isExecuting) {
                _StdOut.putText("Cannot clear memory while CPU is executing.")
            }
            else {
                _MemoryAccessor.clearAll();
            }
        }

        public shellRunAll(): void {
            for (const pcb of _PCBList) {
                if (pcb.state === "Resident") {
                    pcb.state = "Ready";
                    _ReadyQueue.enqueue(pcb);
                }
            }
        
            if (!_CPU.isExecuting) {
                _PCB = _ReadyQueue.dequeue();
                _ReadyQueue.enqueue(_PCB);
                _CPU.isExecuting = true;
            }
        
            _MemoryAccessor.updateTables();
        }
        
        public shellPs() {
            if (_PCBList.length > 0) {
                _PCBList.forEach(pcb => {
                    _StdOut.putText(`PID: ${pcb.PID} | STATE: ${pcb.state}`);
                    _StdOut.advanceLine();
                });
            } else {
                _StdOut.putText("No processes currently loaded.");
                _StdOut.advanceLine();
            }
        }

        public shellKillOne(args: string[]) {
            const pidInput = Number(args[0]);
            const pcb = _PCBList.find(p => p.PID === pidInput);

            if (pcb) {
                // Only terminate if the process is not already terminated
                if (pcb.state === "Ready" || pcb.state === "Running" || pcb.state === "Resident") {
                    pcb.state = "Terminated";
                    _Segments[pcb.segment].ACTIVE = false;
                    _MemoryManager.clearSegment(pcb.base, pcb.limit);

                    _StdOut.putText(`TERMINATED PROCESS: ${pcb.PID}`);
                    _StdOut.advanceLine();

                    // Calculate turnaround and wait times
                    pcb.turnAround = pcb.cycleEnd - pcb.cycleStart;
                    pcb.waitTime = Math.max(0, pcb.turnAround - pcb.waitRun);

                    if (_CPU.isExecuting && _PCB === pcb) {
                        _CPU.isExecuting = false;
                        _CPU.init();
                        _StdOut.putText("CPU execution stopped as the current process was terminated.");
                        _StdOut.advanceLine();
                    }
                } else {
                    _StdOut.putText(`Process ${pidInput} is already terminated.`);
                    _StdOut.advanceLine();
                }
            } else {
                _StdOut.putText("ERROR - INVALID PID");
                _StdOut.advanceLine();
            }
            _MemoryAccessor.updateTables();
        }

        public shellKillAll(): void {
            if (_CPU.isExecuting) {
                _CPU.isExecuting = false;
                _CPU.init();
                _StdOut.putText("CPU execution stopped.");
                _StdOut.advanceLine();
            }
        
            for (let i = 0; i < _PCBList.length; i++) {
                const pcb = _PCBList[i];
        
                // Only terminate processes that are not already terminated
                if (pcb.state !== "Terminated") {
                    pcb.state = "Terminated";
                    _Segments[pcb.segment].ACTIVE = false;
                    _MemoryManager.clearSegment(pcb.base, pcb.limit);
        
                    _StdOut.putText(`PROCESS ${pcb.PID} terminated.`);
                    _StdOut.advanceLine();
                }
            }
        
            _MemoryAccessor.updateTables();
            _StdOut.putText("All processes have been terminated.");
            _StdOut.advanceLine();
        }

        public shellQuantum(args: string[]) {
            if (Number(args[0]) > 0) {
                _PRQuantum = parseInt(args[0]);
            }
            else {
                _StdOut.putText("< 0");
            }
        }

        public shellFormat(): void {
            if (_CPU.isExecuting) {
                _StdOut.putText("Unable to format disk while CPU is executing.");
            } else {
                _DSDD.fileFormat();
                _StdOut.putText("Disk Formatted.");
            }
        }

        public shellCreate(args: string[]): void {
            if (args && args[0]) {
                if (_DSDD.isFormatted) {
                    if (args[0].length < 60) {
                        if (_DSDD.fileCreate(args[0])) {
                            _StdOut.putText("File " + args[0] + " created.");
                        } else {
                            _StdOut.putText("File " + args[0] + " already exists.");
                        }
                    } else {
                        _StdOut.putText("File name too large.");
                    }
                } else {
                    _StdOut.putText("Must format disk before creating files.");
                }
            } else {
                _StdOut.putText("Enter filename.");
            }
        }

        public shellRead(args: string[]): void {
            if (_DSDD.isFormatted) {
                if (!_DSDD.fileRead(args[0])) {
                    _StdOut.putText("File does not exist.");
                }
            } else {
                _StdOut.putText("Must format disk before reading.");
            }
        }

        public shellWrite(args: string[]): void {
            if (_DSDD.isFormatted) {
                if (args.length > 1) {
                    const firstQuote = args[1].charAt(0) === "\"";
                    const lastQuote = args[args.length - 1].charAt(args[args.length - 1].length - 1) === "\"";
        
                    if (firstQuote && lastQuote) {
                        if (args.length === 2) {
                            args[1] = args[1].slice(1, -1);
                        } else {
                            args[1] = args[1].slice(1);
                            args[args.length - 1] = args[args.length - 1].slice(0, -1);
                        }
        
                        const incomingName = args[0];
                        const incomingData = args.slice(1).join(" ");
        
                        if (_DSDD.fileWrite(incomingName, incomingData.split(""))) {
                            _StdOut.putText('File ' + incomingName + ' written to.');
                        } else {
                            _StdOut.putText('File: ' + incomingName + ' , does not exist.');
                        }
                    } else {
                        _StdOut.putText('Please enter filename "data" in quotes.');
                    }
                } else {
                    _StdOut.putText('Please enter filename data after file name.');
                }
            } else {
                _StdOut.putText("Please format disk.");
            }
        }

        public shellDelete(args: string[]): void {
            if (_DSDD.isFormatted) {
                if (args[0].length < 60) {
                    if (_DSDD.fileDelete(args[0])) {
                        _StdOut.putText("File " + args[0] + " deleted.");
                    } else {
                        _StdOut.putText("File " + args[0] + " does not exist.");
                    }
                } else {
                    _StdOut.putText("File name too long.");
                }
            } else {
                _StdOut.putText("Please format disk.");
            }
        }

        public shellCopy(args: string[]): void {
            if (_DSDD.isFormatted) {
                if (args.length === 2) {
                    if (_DSDD.doesFileExist(args[0])) {
                        if (_DSDD.fileCopy(args[0], args[1])) {
                            _StdOut.putText('Successfully copied "' + args[0] + '" to "' + args[1] + '".');
                        } else {
                            _StdOut.putText("Copy failed.");
                        }
                    } else {
                        _StdOut.putText("File does not exist.");
                    }
                } else {
                    _StdOut.putText("Please enter file to copy and file to copy to");
                }
            } else {
                _StdOut.putText("Please format disk.");
            }
        }

        public shellRename(args: string[]): void {
            if (_DSDD.isFormatted) {
                if (_DSDD.doesFileExist(args[0])) {
                    if (_DSDD.fileRename(args[0], args[1])) {
                        _StdOut.putText("File successfully renamed.");
                    } else {
                        _StdOut.putText("File rename failed, please rename to a non-existing name.");
                    }
                } else {
                    _StdOut.putText("File does not exist.");
                }
            } else {
                _StdOut.putText("Please format disk.");
            }
        }

        public shellLs(args: string[]): void {
            if (_DSDD.isFormatted) {
                const files = _DSDD.fileLs();
                files.forEach((file) => {
                    _StdOut.putText(file);
                    _StdOut.advanceLine();
                });
            } else {
                _StdOut.putText("Please format disk.");
            }
        }
        
        public shellKill() {
            var curPid = _PCB.PID;
            _CPU.killProg(curPid);
            _PCB.state = "Terminated";
            _Segments[_PCB.segment].ACTIVE = false;
            _MemoryManager.clearSegment(_PCB.base, _PCB.limit);
            _MemoryAccessor.updateTables();
            
            _StdOut.advanceLine();
            _OsShell.putPrompt();
        }
        
        public shellStatus(args: string[]) {
            if (args.length > 0) {
                const status = args.join(' ');
                const statusElement = document.getElementById("status"); 
        
                if (statusElement) {
                    statusElement.innerHTML = "Status: " + status;
                    _StdOut.putText("Status set to: " + status);
                } else {
                    _StdOut.putText("Error: Status element not found.");
                }
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }
        
        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Displays the current version data.");
                        break;
                    case "date":
                        _StdOut.putText("Displays the current date.");
                        break;
                    case "whereami":
                        _StdOut.putText("Displays your current location.");
                        break;
                    case "days2live":
                        _StdOut.putText("Tells the user how long they have until they die.");
                        break;
                    case "status":
                        _StdOut.putText("Sets the status. Usage: status <string>");
                        break;
                    case "bsod":
                        _StdOut.putText("Displays the Blue Screen of Death.");
                        break;
                    case "load":
                        _StdOut.putText("<load> - Validates previous input, only hex digits and spaces allowed.")
                        break;
                    case "run":
                        _StdOut.putText("<pid> - Run a program already in memory.")
                        break;
                    case "clearmem":
                        _StdOut.putText("<clearMem> - Clear all memory partitions.")
                        break;
                    case "runall":
                        _StdOut.putText("<runAll> - Execute all programs at once.")
                        break;
                    case "ps":
                        _StdOut.putText("<ps> - Display the PID and state of all processes.")
                        break;
                    case "killone":
                        _StdOut.putText("<int> - Kill one process.")
                        break;
                    case "killall":
                        _StdOut.putText("<killAll> - Kill all processes.")
                        break;
                    case "quantum":
                        _StdOut.putText("<int> - Enter an integer to set Round Robin quantum (measured in cpu cycles).")
                        break;
                    case "format":
                        _StdOut.putText("<format> - Initialize all blocks in all sectors in all tracks.")
                        break;
                    case "create":
                        _StdOut.putText("<filename> - Create the file 'filename'.")
                        break;
                    case "read":
                        _StdOut.putText("<filename> - Read and display the contents of 'filename'.")
                        break;
                    case "write":
                        _StdOut.putText("<filename> 'data' - Write the data inside the quotes (but not the quoter themselves) to 'filename'.")
                        break;
                    case "delete":
                        _StdOut.putText("<filename> - Remove 'filename' from storage.")
                        break;
                    case "copy":
                        _StdOut.putText("<existing filename> <new filename> — copy.")
                        break;
                    case "rename":
                        _StdOut.putText("<current filename> <new filename>— rename.")
                        break;
                    case "ls":
                        _StdOut.putText("<ls> - list the Eiles currently stored on the disk.")
                        break;
                    case "help":
                        _StdOut.putText("Displays a list of available commands.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
                        break;
                    case "cls":
                        _StdOut.putText("Clears the screen and resets the cursor position.");
                        break;
                    case "man":
                        _StdOut.putText("Displays the manual page for a specific command. Usage: man <command>");
                        break;
                    case "trace":
                        _StdOut.putText("Turns the OS trace on or off. Usage: trace <on | off>");
                        break;
                    case "rot13":
                        _StdOut.putText("Does rot13 obfuscation on a string. Usage: rot13 <string>");
                        break;
                    case "prompt":
                        _StdOut.putText("Sets the prompt. Usage: prompt <string>");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

    }
}
