/* ------------
   Control.ts

   Routines for the hardware simulation, NOT for our client OS itself.
   These are static because we are never going to instantiate them, as they represent the hardware.
   In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
   is the "bare metal" (so to speak) for which we write code that hosts our client OS.
   But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
   in both the host and client environments.

   This (and other host/simulation scripts) is the only place that we should see "web" code, such as
   DOM manipulation and event handling, and so on. (Index.html is -- obviously -- the only place for markup.)

   This code references page numbers in the textbook:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne. ISBN 978-0-470-12872-5
------------ */

//
// Control Services
//
module TSOS {
    export class Control {
        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.
            _Canvas = <HTMLCanvasElement>document.getElementById('display');
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions.
            CanvasTextFunctions.enable(_DrawingContext);

            // Clear the log text box and set focus on the start button.
            (<HTMLInputElement>document.getElementById("taHostLog")).value = "";
            (<HTMLInputElement>document.getElementById("btnStartOS")).focus();

            // Check for GLaDOS initialization.
            if (typeof Glados === "function") {
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static updateMemoryDisplay(address: number): void {
            let Address = address.toString(16).toUpperCase();
            if (Address.length === 1) {
                Address = "0" + Address;
            }

            const mem = document.getElementById(Address);
            if (mem) {
                const addressInsert = _Memory.totalMemory[address];
                mem.innerText = addressInsert.toString(16).padStart(2, '0').toUpperCase();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            const clock = _OSclock;
            const now = new Date().getTime();
            const logMessage = `({ clock: ${clock}, source: ${source}, msg: ${msg}, now: ${now} })\n`;

            const taLog = <HTMLInputElement>document.getElementById("taHostLog");
            taLog.value = logMessage + taLog.value;
        }

        public static hostBtnStartOS_click(btn: HTMLButtonElement): void {
            // Disable start button and enable other buttons.
            btn.disabled = true;
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // Set focus on the display.
            document.getElementById("display")?.focus();

            // Initialize CPU and memory.
            _CPU = new Cpu();
            _CPU.init();
            _Memory = new Memory();
            _Memory.init();
            _MemoryAccessor = new MemoryAccessor();
            _Scheduler = new Scheduler();
            _Dispatcher = new Dispatcher();
            

            // Set the host clock pulse and start the kernel.
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();
        }

        public static hostBtnHaltOS_click(): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");

            // Shutdown OS and stop the hardware clock.
            _Kernel.krnShutdown();
            clearInterval(_hardwareClockID);
        }

        // Update the process table
        public static processTableUpdate(): void {
            const processTable = document.getElementById("processTable");
            if (!processTable) return;
        
            processTable.innerHTML = "";
        
            _PCBList.forEach(pcb => {
                // If the PCB is the currently running process, use CPU values else use PCB values
                const isCurrentProcess = pcb === _PCB;
                const PC = isCurrentProcess ? _CPU.PC : pcb.PC;
                const Ir = isCurrentProcess ? _CPU.Ir : pcb.IR;
                const Acc = isCurrentProcess ? _CPU.Acc : pcb.Acc;
                const Xreg = isCurrentProcess ? _CPU.Xreg : pcb.Xreg;
                const Yreg = isCurrentProcess ? _CPU.Yreg : pcb.Yreg;
                const Zflag = isCurrentProcess ? _CPU.Zflag : pcb.Zflag;
                
                const { PID, priority, state, location } = pcb;
                const row = document.createElement("tr");
        
                // List of all values to update in the table
                const values = [
                    PID, PC, Ir, Acc, Xreg, Yreg, Zflag,
                    priority, state, location
                ].map(v => v.toString());
        
                values.forEach(value => {
                    const td = document.createElement("td");
                    td.textContent = value;
                    row.appendChild(td);
                });
        
                processTable.appendChild(row);
            });
        }
        
        // Update the CPU table, same logic as process table but for CPU
        public static cpuTableUpdate(): void {
            const { PC, Ir, Acc, Xreg, Yreg, Zflag } = _CPU;
            const cpuTable = document.getElementById("cpuTable");

            if (!cpuTable) return;

            // Clear the table and update with new values
            cpuTable.innerHTML = "";
            const row = document.createElement("tr");

            // List of CPU registers to update
            const values = [PC, Ir, Acc, Xreg, Yreg, Zflag].map(v => v.toString());

            values.forEach(value => {
                const td = document.createElement("td");
                td.innerHTML = value;
                row.appendChild(td);
            });

            cpuTable.appendChild(row);
        }

        public static tsbTableUpdate(): void {
            const tsbTable = document.getElementById("tsbTable");
            if (!tsbTable) return;
        
            // Clear existing content
            this.removeChildren(tsbTable);
        
            // Add table headers
            const headerRow = `
                <tr>
                    <th>Address (T:S:B)</th>
                    <th>Used</th>
                    <th>Pointer</th>
                    <th>Data</th>
                </tr>`;
            tsbTable.innerHTML = headerRow;
        
            let newRow = "";
        
            // Populate table rows
            for (let t = 0; t < _Disk.track; t++) {
                for (let s = 0; s < _Disk.sector; s++) {
                    for (let b = 0; b < _Disk.block; b++) {
                        const rawInfo = sessionStorage.getItem(`${t}:${s}:${b}`);
                        if (!rawInfo) continue;
        
                        const info = rawInfo.split(" ");
                        const data = info.slice(4).join(" ").trim();
        
                        // Create row for each block
                        newRow += `
                            <tr>
                                <td>${t}:${s}:${b}</td>
                                <td>${info[0]}</td>
                                <td>${info[1]}:${info[2]}:${info[3]}</td>
                                <td>${data || "Empty"}</td>
                            </tr>`;
                    }
                }
            }
        
            tsbTable.innerHTML += newRow;
        }
        
        public static removeChildren(element: HTMLElement) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }

        public static hostBtnReset_click(): void {
            location.reload();
        }
    }
}
