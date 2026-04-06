
import { Level } from './types';

export const CURRICULUM: Level[] = [
  {
    id: 1,
    title: "System Boot",
    description: "Lecture 1: The architecture of C, Variables, I/O streams, and Arithmetic Logic Units.",
    xpReward: 100,
    isLocked: false,
    lessons: [
      {
        title: "The Mainframe Entry",
        text: "Welcome, Operator. C is the language of the kernel. Every program initiates at the <span class='text-green-400 font-bold'>main()</span> function. This is your entry vector.<br><br><strong>Key Directives:</strong><ul class='list-disc pl-5 mt-2 space-y-1'><li><span class='text-purple-400'>#include &lt;stdio.h&gt;</span>: Loads the Standard Input/Output toolkit.</li><li><span class='text-blue-400'>void</span>: Indicates the function returns no data to the caller.</li><li><span class='text-yellow-400'>;</span> (Semicolon): Terminates every instruction. Do not forget this.</li></ul>",
        codeSnippet: `#include <stdio.h> // Load I/O Module

// The Entry Point
void main(void) {
  printf("System Online_"); 
  // Execution ends here
}`
      },
      {
        title: "Secure Containers (Variables)",
        text: "Data must be stored in allocated memory sectors called <span class='text-yellow-400'>Variables</span>. You must declare the payload type:<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>📦 <span class='text-blue-400'>int</span>: Integers (Whole numbers, e.g., <code>ammo = 150</code>).</li><li>📦 <span class='text-purple-400'>float</span>: Floating Point (Decimals, e.g., <code>health = 98.5</code>).</li><li>📦 <span class='text-green-400'>char</span>: Character (Single symbol, e.g., <code>rank = 'S'</code>).</li></ul>",
        codeSnippet: `int ammo = 150;
float signalStrength = 98.5;
char rank = 'S';`
      },
      {
        title: "Output Uplink (Printf)",
        text: "Broadcast data to the console using <code>printf</code>. We use <span class='text-pink-400'>Format Specifiers</span> as placeholders within the string.<br><br><strong>Specifier Codes:</strong><ul class='list-disc pl-5 mt-2 space-y-1'><li>🟢 <code>%d</code> : Decimal Integers</li><li>🟣 <code>%f</code> : Floating Point Numbers</li><li>🔵 <code>%c</code> : Single Characters</li><li>🔄 <code>\\n</code> : Newline Escape Sequence (Presses Enter)</li></ul>",
        codeSnippet: `int targets = 5;
printf("Targets: %d\\n", targets);
printf("Status: Active");`
      },
      {
        title: "Input Intercept (Scanf)",
        text: "To receive intel from the user, use <code>scanf</code>. <br><br>⚠️ <strong>CRITICAL PROTOCOL:</strong><br>You must use the <span class='text-red-400'>Address-Of Operator (&)</span> to tell <code>scanf</code> exactly <em>where</em> in memory to store the input.",
        codeSnippet: `int pin;
printf("Enter PIN: ");
// Store input at the ADDRESS of 'pin'
scanf("%d", &pin);`
      },
      {
        title: "Arithmetic Logic Unit",
        text: "The CPU handles math at blistering speeds. <br><br><strong>Operations:</strong><ul class='list-disc pl-5 mt-2 space-y-1'><li>Basic: <code>+</code> (Add), <code>-</code> (Sub), <code>*</code> (Mult), <code>/</code> (Div)</li><li>Special: <span class='text-yellow-400'>% (Modulus)</span>. Returns the <strong>remainder</strong> of division.</li></ul><br><em>Tip:</em> Modulus is vital for cycling values (e.g., determining if a number is even or odd).",
        codeSnippet: `int bullets = 10;
int shots = 3;
int remaining = bullets % shots; 
// 10 / 3 = 3 with Remainder 1
// remaining == 1`
      }
    ],
    quiz: [
      {
        id: 101,
        question: "Which function acts as the entry point for C programs?",
        options: ["start()", "init()", "main()", "run()"],
        correctIndex: 2,
        explanation: "main() is the mandatory function where execution begins."
      },
      {
        id: 102,
        question: "What symbol is required when using scanf with an integer?",
        options: ["*", "$", "&", "#"],
        correctIndex: 2,
        explanation: "& (Address-Of) tells scanf the memory address to write data to."
      },
      {
        id: 103,
        question: "What represents a decimal integer placeholder?",
        options: ["%f", "%d", "%s", "%c"],
        correctIndex: 1,
        explanation: "%d is the standard specifier for decimal integers."
      }
    ]
  },
  {
    id: 2,
    title: "Logic Gates",
    description: "Lecture 2: Boolean logic, Conditional branching, and Decision trees.",
    xpReward: 150,
    isLocked: true,
    lessons: [
      {
        title: "The Binary Truth",
        text: "In older C standards, there is no 'boolean' type. We operate on a primitive numerical rule:<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>🔴 <span class='text-red-400 font-bold'>0 is FALSE</span>.</li><li>🟢 <span class='text-green-400 font-bold'>Non-Zero is TRUE</span> (e.g., 1, -5, 99).</li></ul><br>Your conditional checks rely entirely on this logic.",
        codeSnippet: `if (0) { /* Never runs */ }
if (100) { /* Always runs */ }
if (-1) { /* Always runs */ }`
      },
      {
        title: "Relational Scanners",
        text: "Compare data states using relational operators.<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li><code>==</code> : Checks Equality. <strong>Do not confuse with <code>=</code> (Assignment).</strong></li><li><code>!=</code> : Not Equals.</li><li><code>> <</code> : Greater/Less Than.</li><li><code>>= <=</code> : Greater/Less Than or Equal.</li></ul>",
        codeSnippet: `int health = 0;
if (health == 0) {
  printf("System Flatline.");
}`
      },
      {
        title: "Complex Circuits (Logical Ops)",
        text: "Combine multiple checks into one security gate.<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>🤝 <span class='text-blue-400'>&& (AND)</span>: All conditions must be True.</li><li>🤷 <span class='text-yellow-400'>|| (OR)</span>: At least one condition must be True.</li><li>⛔ <span class='text-red-400'>! (NOT)</span>: Inverts the signal (True becomes False).</li></ul>",
        codeSnippet: `if (hasKey && !isLocked) {
  enterVault();
}`
      },
      {
        title: "Branching Paths (If/Else)",
        text: "Split the timeline based on intel.<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li><span class='text-green-400'>if</span>: The primary condition check.</li><li><span class='text-blue-400'>else if</span>: Secondary checks if the first failed.</li><li><span class='text-orange-400'>else</span>: The fallback protocol if all prior checks fail.</li></ul>",
        codeSnippet: `if (xp > 1000) levelUp();
else if (xp > 500) gainBadge();
else trainMore();`
      },
      {
        title: "The Switch Dispatcher",
        text: "When checking one variable against many specific values, <code>if-else</code> is messy. Use <span class='text-purple-400'>switch</span>.<br><br>⚠️ <strong>Warning:</strong> Always use <code>break</code> to stop the code from 'falling through' to the next case.",
        codeSnippet: `switch(securityLevel) {
  case 1: openGate(); break;
  case 2: scanID(); break;
  default: lockDown(); break;
}`
      }
    ],
    quiz: [
      {
        id: 201,
        question: "What is the boolean value of the number -5?",
        options: ["False", "True", "Undefined", "Error"],
        correctIndex: 1,
        explanation: "Any non-zero number evaluates to True in C."
      },
      {
        id: 202,
        question: "Which operator creates an 'AND' logic gate?",
        options: ["&", "&&", "||", "!"],
        correctIndex: 1,
        explanation: "&& is the Logical AND operator."
      },
      {
        id: 203,
        question: "What keyword prevents 'fall-through' in a switch?",
        options: ["stop", "return", "break", "exit"],
        correctIndex: 2,
        explanation: "'break' exits the switch block immediately."
      }
    ]
  },
  {
    id: 3,
    title: "Automation (Loops)",
    description: "Lecture 3: Iteration, Infinite loops, and Flow control.",
    xpReward: 200,
    isLocked: true,
    lessons: [
      {
        title: "The Loop Concept",
        text: "Hackers don't repeat tasks manually. We automate. Loops execute a block of code repeatedly until a condition is met. <br>⚠️ <strong>Caution:</strong> Watch out for <span class='text-red-400'>Infinite Loops</span> (logic traps) that freeze the system.",
        codeSnippet: `while(systemOnline) {
  processData();
  // If 'systemOnline' never changes, 
  // this runs forever.
}`
      },
      {
        title: "For Loop: Precision Iteration",
        text: "Use this when you know exactly how many times to run.<br><strong>Syntax:</strong> <code>for (Init; Condition; Update)</code>.<br>It handles initialization, checking, and incrementing in a single line.",
        codeSnippet: `for (int i = 0; i < 10; i++) {
  printf("Hack Attempt %d\\n", i);
}`
      },
      {
        title: "While vs Do-While",
        text: "<ul class='list-disc pl-5 mt-2 space-y-1'><li>🕰️ <span class='text-blue-400'>While</span>: Checks <em>then</em> acts. Might never run if condition starts False.</li><li>🛡️ <span class='text-green-400'>Do-While</span>: Acts <em>then</em> checks. Guaranteed to run at least once. Ideal for 'Input validation' loops.</li></ul>",
        codeSnippet: `do {
  printf("Enter Password: ");
  scanf("%d", &pass);
} while (pass != 1234);`
      },
      {
        title: "Flow Control Override",
        text: "Take manual control of the loop cycle.<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>🛑 <code>break</code>: Emergency exit. Stops the loop immediately.</li><li>⏭️ <code>continue</code>: Skip. Ignores the rest of the current iteration and jumps to the next cycle.</li></ul>",
        codeSnippet: `for(int i=0; i<10; i++) {
  if(i == 5) continue; // Skip printing 5
  if(i == 8) break;    // Stop loop at 8
  printf("%d ", i);
}`
      },
      {
        title: "Nested Loops (The Matrix)",
        text: "A loop inside a loop creates multi-dimensional logic. This is how we scan 2D grids, images, or matrices.<br>The inner loop completes a full cycle for <em>every single step</em> of the outer loop.",
        codeSnippet: `for(int y=0; y<5; y++) {
  for(int x=0; x<5; x++) {
    printf("(%d,%d) ", x, y);
  }
}`
      }
    ],
    quiz: [
      {
        id: 301,
        question: "Which loop runs at least once regardless of condition?",
        options: ["For", "While", "Do-While", "Recursion"],
        correctIndex: 2,
        explanation: "Do-While evaluates the condition after the code block executes."
      },
      {
        id: 302,
        question: "What does `continue` do?",
        options: ["Stops the loop", "Restarts the program", "Skips to next iteration", "Exits the function"],
        correctIndex: 2,
        explanation: "It skips the remaining code in the current loop cycle."
      }
    ]
  },
  {
    id: 4,
    title: "Subroutines (Functions)",
    description: "Lecture 4: Modular code, Stack frames, and Recursive logic.",
    xpReward: 250,
    isLocked: true,
    lessons: [
      {
        title: "Modular Design",
        text: "Don't write monolithic code. Break your program into <span class='text-green-400'>Functions</span> (Subroutines). define the logic once, and call it by name whenever needed. This makes code readable and debuggable.",
        codeSnippet: `// Definition
void activateShields() {
  printf("Shields Up.");
}

// Usage in main
activateShields();`
      },
      {
        title: "Arguments & Returns",
        text: "Functions are data factories.<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>📥 <span class='text-blue-400'>Arguments</span>: Raw materials you feed in.</li><li>📤 <span class='text-purple-400'>Return Value</span>: The product shipped out.</li></ul><br>Use <code>void</code> if you don't need input or output.",
        codeSnippet: `int add(int a, int b) {
  return a + b;
}`
      },
      {
        title: "Prototypes: Forward Intel",
        text: "The compiler reads top-to-bottom. If you call a function before defining it, it panics. A <span class='text-yellow-400'>Prototype</span> is a declaration (header) that promises the compiler the function exists elsewhere.",
        codeSnippet: `void login(void); // Prototype

void main() { login(); } // Call

void login() { ... } // Definition`
      },
      {
        title: "Scope: The Event Horizon",
        text: "Variables born inside a function are <span class='text-orange-400'>Local</span>. They exist only on the Stack and are destroyed when the function ends. <span class='text-red-400'>Global</span> variables live forever but can be modified by anyone (dangerous).",
        codeSnippet: `int globalVar = 100; // Accessible everywhere

void test() {
  int localVar = 5; // Only exists in test()
}`
      },
      {
        title: "Recursion: The Loop Within",
        text: "A function can call <em>itself</em>. This is <span class='text-pink-400'>Recursion</span>. It replaces loops in complex algorithms (like traversing trees). <br>⚠️ <strong>Critical:</strong> You MUST have a 'Base Case' (exit condition) or you will cause a Stack Overflow.",
        codeSnippet: `int factorial(int n) {
  if(n <= 1) return 1; // Base Case
  return n * factorial(n-1); // Recursive Call
}`
      }
    ],
    quiz: [
      {
        id: 401,
        question: "What happens to local variables when a function ends?",
        options: ["They are saved", "They become global", "They are destroyed", "They are printed"],
        correctIndex: 2,
        explanation: "Local variables are popped off the stack and lost."
      },
      {
        id: 402,
        question: "What is essential for a recursive function?",
        options: ["A Loop", "A Base Case", "Global Variables", "Pointers"],
        correctIndex: 1,
        explanation: "Without a base case to stop it, recursion runs infinitely."
      }
    ]
  },
  {
    id: 5,
    title: "Data Banks (Arrays)",
    description: "Lecture 5: Memory blocks, Bubble sort, and Binary search.",
    xpReward: 300,
    isLocked: true,
    lessons: [
      {
        title: "Arrays: Contiguous Storage",
        text: "An <span class='text-blue-400'>Array</span> is a series of variables of the same type sitting side-by-side in memory. <br><br>🚨 <strong>HACKER RULE #1:</strong> Indexes start at 0.<br>The first element is <code>arr[0]</code>. The last is <code>arr[size-1]</code>.",
        codeSnippet: `int loot[5]; // Allocates space for 5 ints
loot[0] = 500; // First slot
loot[4] = 100; // Last slot (5-1)`
      },
      {
        title: "Initialization Protocols",
        text: "You can fill an array the moment you create it. If you provide fewer values than the size, C automatically fills the remaining slots with Zeros.",
        codeSnippet: `int codes[5] = {1, 2}; 
// Result in memory: {1, 2, 0, 0, 0}`
      },
      {
        title: "Bubble Sort Algorithm",
        text: "Data is useless if chaotic. <span class='text-yellow-400'>Bubble Sort</span> organizes data by stepping through the list, comparing neighbors, and swapping them if they are in the wrong order. Large values 'bubble' to the end.",
        codeSnippet: `// If Left > Right, Swap them
if (data[i] > data[i+1]) {
  swap(&data[i], &data[i+1]);
}`
      },
      {
        title: "Search Algorithms",
        text: "How do we find intel?<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>🕵️ <span class='text-orange-400'>Linear Search</span>: Check every item one by one. Slow but simple.</li><li>⚡ <span class='text-green-400'>Binary Search</span>: Requires <strong>Sorted</strong> data. Cuts the list in half repeatedly. Finds data in massive datasets instantly.</li></ul>",
        codeSnippet: `// Binary Search Concept:
// Is Target > Midpoint? 
// Yes: Ignore Left half. Look Right.`
      },
      {
        title: "Multi-Dimensional Arrays",
        text: "An array of arrays. Used for grids, maps, and matrices. Access them using coordinates <code>[y][x]</code>.",
        codeSnippet: `int grid[3][3] = {
  {1, 0, 0},
  {0, 1, 0},
  {0, 0, 1}
}; // A 3x3 Identity Matrix`
      }
    ],
    quiz: [
      {
        id: 501,
        question: "If `int arr[5]` is declared, what is the last valid index?",
        options: ["5", "4", "0", "Unknown"],
        correctIndex: 1,
        explanation: "0 to 4 makes 5 elements."
      },
      {
        id: 502,
        question: "Binary Search requires the array to be...",
        options: ["Large", "Sorted", "Random", "Integers"],
        correctIndex: 1,
        explanation: "You cannot predict where to look if the data isn't sorted."
      }
    ]
  },
  {
    id: 6,
    title: "Memory Hacking (Pointers)",
    description: "Lecture 6: Addresses, Dereferencing, and Pointer arithmetic.",
    xpReward: 400,
    isLocked: true,
    lessons: [
      {
        title: "The Address Concept",
        text: "Every variable lives at a specific number in RAM called an <span class='text-purple-400'>Address</span>. <br>A <span class='text-green-400'>Pointer</span> is a variable that holds an Address, not a value. It points to a location.",
        codeSnippet: `int gold = 999;
int *map = &gold; // 'map' holds address of 'gold'`
      },
      {
        title: "Dereferencing (The Loot)",
        text: "Having the map is useless if you don't dig. <span class='text-yellow-400'>Dereferencing (*)</span> means 'Go to the address held by this pointer and access the data there'.",
        codeSnippet: `*map = 0; 
// Went to address of 'gold' and set it to 0`
      },
      {
        title: "Pointer Arithmetic",
        text: "Pointers are smart. If you add +1 to an <code>int*</code>, it doesn't move 1 byte. It moves <strong>4 bytes</strong> (size of int) to the next integer. It steps by the 'stride' of the data type.",
        codeSnippet: `int *ptr = 0x1000;
ptr++; // Now 0x1004 (assuming 32-bit int)`
      },
      {
        title: "Arrays are Pointers",
        text: "The name of an array is effectively a pointer to its first element! <br><code>arr[0]</code> is exactly the same as <code>*arr</code>.<br><code>arr[i]</code> is exactly the same as <code>*(arr + i)</code>.",
        codeSnippet: `int list[] = {10, 20};
int *p = list;
// *p is 10`
      },
      {
        title: "Call by Reference",
        text: "Standard functions use 'Pass by Value' (copies data). Pointers allow 'Pass by Reference'. You pass the address, allowing the function to modify the <strong>original</strong> variable in the caller's scope.",
        codeSnippet: `void doubleIt(int *p) {
  *p = *p * 2;
}
doubleIt(&score); // Score is actually changed`
      }
    ],
    quiz: [
      {
        id: 601,
        question: "Which symbol extracts the address of a variable?",
        options: ["*", "&", "->", "."],
        correctIndex: 1,
        explanation: "& is the Address-Of operator."
      },
      {
        id: 602,
        question: "If `p` points to an integer (4 bytes) at 1000, what is `p+1`?",
        options: ["1001", "1004", "2000", "Error"],
        correctIndex: 1,
        explanation: "Pointer arithmetic adds sizeof(type). 1000 + 4 = 1004."
      }
    ]
  },
  {
    id: 7,
    title: "Data Types & Modifiers",
    description: "Lecture 7: Unsigned, Static, Volatile, and Typedefs.",
    xpReward: 450,
    isLocked: true,
    lessons: [
      {
        title: "Signed vs Unsigned",
        text: "By default, <code>int</code> uses one bit for the sign (+/-). <span class='text-green-400'>unsigned</span> removes negative numbers, effectively doubling your positive range. Use this for counters, sizes, and binary masks.",
        codeSnippet: `unsigned char byte = 255; // Max 8-bit value
// signed char max is only 127`
      },
      {
        title: "Size Modifiers",
        text: "Control your memory footprint precisely.<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li><span class='text-blue-400'>short</span>: Small int (usually 2 bytes).</li><li><span class='text-purple-400'>long</span>: Large int (4 or 8 bytes).</li><li><span class='text-purple-600'>long long</span>: Huge int (8 bytes guaranteed).</li></ul>",
        codeSnippet: `long long balance = 9000000000;`
      },
      {
        title: "Typedef: Custom Aliases",
        text: "Stop typing `unsigned long long int`. Use <span class='text-yellow-400'>typedef</span> to create your own type names. In embedded coding, we usually define `u8`, `u16`, `u32` for specific byte widths.",
        codeSnippet: `typedef unsigned int u32;
u32 reg = 0xFFFFFFFF;`
      },
      {
        title: "Static: Persistent Memory",
        text: "A <span class='text-red-400'>static</span> variable inside a function doesn't die when the function ends. It remembers its value for the next call. It is stored in global memory but scoped locally.",
        codeSnippet: `void count() {
  static int c = 0;
  c++; // Remembers previous c value
}`
      },
      {
        title: "Volatile: Hardware Access",
        text: "Compilers optimize 'useless' code. <span class='text-orange-400'>volatile</span> tells the compiler: 'Do not optimize this variable. It may change externally (by hardware/sensors).' Critical for driver dev.",
        codeSnippet: `volatile int *sensor = 0x5000;
while(*sensor == 0); // Wait for hardware`
      }
    ],
    quiz: [
      {
        id: 701,
        question: "What range does `unsigned` imply?",
        options: ["Negative only", "Positive and Negative", "Positive only", "Floating point"],
        correctIndex: 2,
        explanation: "Unsigned removes the sign bit, disallowing negative numbers."
      },
      {
        id: 702,
        question: "Does a `static` local variable reset every function call?",
        options: ["Yes", "No", "Sometimes", "Compiler dependent"],
        correctIndex: 1,
        explanation: "Static variables persist their value between calls."
      }
    ]
  },
  {
    id: 8,
    title: "Structs & Unions",
    description: "Lecture 8: Custom data structures, Padding, and Bit Fields.",
    xpReward: 500,
    isLocked: true,
    lessons: [
      {
        title: "Structs: Data Bundles",
        text: "Primitives are not enough. <span class='text-blue-400'>Structs</span> allow you to group different variables into a single object. Like a 'Player' object containing health(int), name(char*), and speed(float).",
        codeSnippet: `struct Robot {
  int id;
  float power;
};
struct Robot unit1;
unit1.id = 50;`
      },
      {
        title: "The Arrow Operator",
        text: "When you have a <em>pointer</em> to a struct, you can't use the dot <code>.</code> directly easily. C gives you the <span class='text-green-400'>Arrow (->)</span> operator. It follows the pointer AND accesses the member.",
        codeSnippet: `struct Robot *ptr = &unit1;
ptr->power = 95.5; // Same as (*ptr).power`
      },
      {
        title: "Unions: Memory Sharing",
        text: "A <span class='text-purple-400'>Union</span> is a space-saver. All members share the <strong>same memory address</strong>. You can store an Int OR a Float, but not both at once. Writing to one overwrites the other.",
        codeSnippet: `union Data {
  int i;
  float f;
}; // Size is 4 bytes (max of members)`
      },
      {
        title: "Enums: Readable States",
        text: "Stop using magic numbers like 0, 1, 2 for states. Use <span class='text-yellow-400'>Enums</span> to create named constants. The compiler treats them as integers, but humans read them as words.",
        codeSnippet: `enum State { IDLE, RUN, JUMP };
enum State current = JUMP;`
      },
      {
        title: "Bit Fields",
        text: "You can specify the exact number of <em>bits</em> a struct member uses. This is used for packing data tightly, like in network headers or hardware registers.",
        codeSnippet: `struct Flags {
  unsigned int isOnline : 1; // Uses only 1 bit
  unsigned int mode : 3;     // Uses 3 bits
};`
      }
    ],
    quiz: [
      {
        id: 801,
        question: "Which operator accesses members from a struct pointer?",
        options: [".", "::", "->", "&"],
        correctIndex: 2,
        explanation: "The arrow -> dereferences the pointer and accesses the member."
      },
      {
        id: 802,
        question: "In a Union, can you store all members simultaneously?",
        options: ["Yes", "No", "Depends on RAM", "Only ints"],
        correctIndex: 1,
        explanation: "Union members overlap. Writing one destroys the others."
      }
    ]
  },
  {
    id: 9,
    title: "The Preprocessor",
    description: "Lecture 9: Macros, Conditional Compilation, and Header Guards.",
    xpReward: 350,
    isLocked: true,
    lessons: [
      {
        title: "Text Substitution Engine",
        text: "The <span class='text-green-400'>Preprocessor</span> runs <em>before</em> the compiler. It looks for lines starting with <code>#</code>. It doesn't know C; it simply copies, pastes, and cuts text based on your commands.",
        codeSnippet: `#include <file.h> 
// Copies file.h content right here`
      },
      {
        title: "Macros (#define)",
        text: "Use <code>#define</code> to create constants. It replaces every instance of the name with the value. No memory is used; it's a text swap.",
        codeSnippet: `#define MAX_PLAYERS 16
int lobby[MAX_PLAYERS];`
      },
      {
        title: "Function Macros",
        text: "Macros can take arguments. They act like functions but are faster (no call overhead). <br>⚠️ <strong>WARNING:</strong> Always put parentheses around arguments to avoid math order errors.",
        codeSnippet: `#define SQUARE(x) ((x)*(x))`
      },
      {
        title: "Conditional Compilation",
        text: "You can choose which code gets compiled based on conditions. Useful for supporting multiple Operating Systems (Windows vs Linux) in one codebase.",
        codeSnippet: `#ifdef WINDOWS
  #include <win.h>
#else
  #include <linux.h>
#endif`
      },
      {
        title: "Header Guards",
        text: "If you include a file twice, you get errors. Wrap your headers in 'Guards' to prevent this. This is standard practice for all .h files.",
        codeSnippet: `#ifndef MY_LIB_H
#define MY_LIB_H
// Code here
#endif`
      }
    ],
    quiz: [
      {
        id: 901,
        question: "When does the preprocessor run?",
        options: ["After compilation", "During execution", "Before compilation", "Never"],
        correctIndex: 2,
        explanation: "It prepares the source code for the compiler."
      },
      {
        id: 902,
        question: "What is the purpose of Header Guards?",
        options: ["Security", "Prevent duplicate inclusion", "Optimize RAM", "Link libraries"],
        correctIndex: 1,
        explanation: "They ensure the header content is processed only once."
      }
    ]
  },
  {
    id: 10,
    title: "Dynamic Memory",
    description: "Lecture 10: The Heap, Malloc, and Memory Management.",
    xpReward: 600,
    isLocked: true,
    lessons: [
      {
        title: "Stack vs Heap",
        text: "RAM is split into two zones:<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>🥞 <span class='text-orange-400'>Stack</span>: Fast, small, automatic cleanup. Used for local variables.</li><li>🏔️ <span class='text-blue-400'>Heap</span>: Slow, massive, manual control. Used for large data that needs to survive function calls.</li></ul>",
        codeSnippet: `int x; // Stack
int *y = malloc(4); // Heap`
      },
      {
        title: "Malloc (Memory Allocate)",
        text: "<span class='text-green-400'>malloc()</span> asks the OS for a block of bytes on the Heap. It returns a pointer to the start. If RAM is full, it returns <code>NULL</code>. Always check for NULL!",
        codeSnippet: `int *arr = malloc(100 * sizeof(int));
if (arr == NULL) crash();`
      },
      {
        title: "Free (Release)",
        text: "The Heap is not automatic. You MUST call <span class='text-red-400'>free()</span> when done. If you don't, that memory stays occupied forever (<span class='text-red-400'>Memory Leak</span>).",
        codeSnippet: `free(arr); // Give memory back to OS
arr = NULL; // Good practice`
      },
      {
        title: "Calloc & Realloc",
        text: "🧹 <code>calloc</code>: Allocates AND cleans (sets to 0).<br>📏 <code>realloc</code>: Resizes an existing block (grows or shrinks it). Useful for dynamic lists.",
        codeSnippet: `int *p = calloc(5, 4); // 5 integers, zeroed`
      },
      {
        title: "Linked Lists Intro",
        text: "A dynamic chain of nodes. Unlike arrays, they don't need contiguous memory. Each node holds data and a pointer to the <em>next</em> node.",
        codeSnippet: `struct Node {
  int data;
  struct Node *next;
};`
      }
    ],
    quiz: [
      {
        id: 1001,
        question: "Which function allocates memory on the Heap?",
        options: ["alloc()", "heap()", "malloc()", "stack()"],
        correctIndex: 2,
        explanation: "malloc stands for Memory Allocation."
      },
      {
        id: 1002,
        question: "What happens if you forget to free()?",
        options: ["Nothing", "Memory Leak", "Faster Code", "Compiler Error"],
        correctIndex: 1,
        explanation: "The memory remains reserved but unusable, eventually crashing the system."
      }
    ]
  },
  {
    id: 11,
    title: "String Mastery",
    description: "Lecture 11: Manipulating text buffers and safe string handling.",
    xpReward: 400,
    isLocked: true,
    lessons: [
      {
        title: "The Null Terminator",
        text: "C strings are just <code>char</code> arrays. How does C know where the text ends? The <span class='text-red-400'>Null Terminator (\\0)</span>. It's a hidden zero byte at the end. Without it, functions read garbage memory until they crash.",
        codeSnippet: `char name[] = {'N', 'e', 'o', '\\0'};
// Or simply:
char name[] = "Neo";`
      },
      {
        title: "String Lib (string.h)",
        text: "Don't reinvent the wheel. Use standard tools.<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>📏 <code>strlen</code>: Length (minus null).</li><li>📑 <code>strcpy</code>: Copy string.</li><li>🤝 <code>strcat</code>: Concatenate (join) strings.</li></ul>",
        codeSnippet: `char buf[20];
strcpy(buf, "Cyber");
strcat(buf, "Punk"); // "CyberPunk"`
      },
      {
        title: "Comparison Trap",
        text: "NEVER use <code>==</code> to compare strings. That compares memory addresses! Use <span class='text-yellow-400'>strcmp()</span>. It returns 0 if strings are identical.",
        codeSnippet: `if (strcmp(pass, "1234") == 0) {
  unlock();
}`
      },
      {
        title: "Buffer Overflows",
        text: "Hacker's favorite exploit. If you copy a 100-char string into a 10-char buffer, you overwrite adjacent RAM. Always use 'n' versions: <code>strncpy</code>, <code>strncat</code> which allow you to set a size limit.",
        codeSnippet: `strncpy(dest, src, 10); // Safe`
      },
      {
        title: "Formatting (sprintf)",
        text: "Print to a string buffer instead of the console. Powerful for generating filenames, logs, or UI messages dynamically.",
        codeSnippet: `char log[50];
sprintf(log, "Error: %d", errorCode);`
      }
    ],
    quiz: [
      {
        id: 1101,
        question: "What character ends a C string?",
        options: ["\\n", "\\0", ".", "END"],
        correctIndex: 1,
        explanation: "The Null Terminator \\0 marks the end."
      },
      {
        id: 1102,
        question: "Why is strcpy dangerous?",
        options: ["It's slow", "It doesn't check size", "It's deprecated", "It crashes"],
        correctIndex: 1,
        explanation: "It will blindly copy data even if the destination is too small (Buffer Overflow)."
      }
    ]
  },
  {
    id: 12,
    title: "File Systems",
    description: "Lecture 12: Persistent storage, reading, and writing files.",
    xpReward: 450,
    isLocked: true,
    lessons: [
      {
        title: "Opening Streams",
        text: "To access disk data, open a file stream <code>FILE*</code>.<br><strong>Modes:</strong><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>'r': Read.</li><li>'w': Write (Wipes existing content!).</li><li>'a': Append (Add to end).</li></ul>",
        codeSnippet: `FILE *f = fopen("log.txt", "w");`
      },
      {
        title: "Text I/O",
        text: "Write text just like printf, but to a file.<br>📤 <code>fprintf()</code>: Write formatted text.<br>📥 <code>fscanf()</code>: Read formatted text.",
        codeSnippet: `fprintf(f, "Score: %d", 100);`
      },
      {
        title: "Line Reading",
        text: "Reading word-by-word is tedious. Use <span class='text-green-400'>fgets()</span> to read an entire line of text into a buffer. Safe and efficient.",
        codeSnippet: `char line[100];
fgets(line, 100, f); // Reads one line`
      },
      {
        title: "Binary I/O",
        text: "For game saves or raw data, text is slow. Use <code>fread</code> and <code>fwrite</code> to dump raw memory bytes directly to disk. It's faster and harder for humans to edit.",
        codeSnippet: `fwrite(&player, sizeof(Player), 1, f);`
      },
      {
        title: "Closing the Stream",
        text: "Files are system resources. You have a limited number of handles. Always <span class='text-red-400'>fclose()</span> your file when done to prevent data corruption and locks.",
        codeSnippet: `fclose(f);`
      }
    ],
    quiz: [
      {
        id: 1201,
        question: "Which mode overwrites the entire file?",
        options: ["r", "a", "w", "rw"],
        correctIndex: 2,
        explanation: "'w' (Write) creates a fresh file, deleting old content."
      },
      {
        id: 1202,
        question: "What function releases the file?",
        options: ["close()", "fclose()", "end()", "exit()"],
        correctIndex: 1,
        explanation: "fclose() closes the file stream."
      }
    ]
  },
  {
    id: 13,
    title: "Terminal Interface",
    description: "Lecture 13: Command Line Arguments (argc/argv).",
    xpReward: 500,
    isLocked: true,
    lessons: [
      {
        title: "The Entry Arguments",
        text: "<code>main()</code> can accept input from the terminal launch command.<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>🔢 <code>argc</code>: Argument Count.</li><li>📋 <code>argv[]</code>: Argument Vector (Array of strings).</li></ul>",
        codeSnippet: `int main(int argc, char *argv[])`
      },
      {
        title: "Identity (argv 0)",
        text: "The first argument <code>argv[0]</code> is always the program's own name/path. Real user inputs start at index 1.",
        codeSnippet: `printf("Running: %s", argv[0]);`
      },
      {
        title: "Parsing Numbers",
        text: "CLI args are always strings (\"50\"). Math requires integers. Use <span class='text-green-400'>atoi()</span> (ASCII to Int) to convert them.",
        codeSnippet: `int damage = atoi(argv[1]);`
      },
      {
        title: "Safety Checks",
        text: "Never trust user input. Always check <code>argc</code> before accessing <code>argv</code>. If you access <code>argv[1]</code> when no args were provided, you get a Segfault.",
        codeSnippet: `if (argc < 2) return 1; // Error`
      },
      {
        title: "Return Codes",
        text: "Your program talks back to the OS. <br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li><code>return 0</code>: Success.</li><li><code>return 1</code>: Error.</li></ul><br>Scripts use this to chain commands (&&).",
        codeSnippet: `return 0; // Signal "All Good"`
      }
    ],
    quiz: [
      {
        id: 1301,
        question: "What is argv[0]?",
        options: ["First user input", "Program Name", "Null", "Count"],
        correctIndex: 1,
        explanation: "It contains the name of the executable."
      },
      {
        id: 1302,
        question: "How do you convert a string arg to an int?",
        options: ["int()", "cast", "atoi()", "parse()"],
        correctIndex: 2,
        explanation: "atoi (ASCII to Integer) is the standard conversion function."
      }
    ]
  },
  {
    id: 14,
    title: "Dynamic Logic (Func Ptrs)",
    description: "Lecture 14: Function pointers, Callbacks, and Jump Tables.",
    xpReward: 600,
    isLocked: true,
    lessons: [
      {
        title: "Code as Data",
        text: "Functions have addresses too. A <span class='text-purple-400'>Function Pointer</span> stores the address of code. This lets you pass logic (functions) as arguments to other functions.",
        codeSnippet: `void (*funcPtr)(); 
funcPtr = &attack;`
      },
      {
        title: "Callbacks",
        text: "Used heavily in UI and Events. You pass a function to a system, and the system 'Calls you back' when an event happens (like a button click).",
        codeSnippet: `registerClickHandler(myFunction);`
      },
      {
        title: "Sorting Logic",
        text: "<code>qsort()</code> is a generic sorter. It sorts anything, but it needs YOU to tell it how to compare items. You pass a function pointer to your comparison logic.",
        codeSnippet: `qsort(data, 5, 4, compareFunc);`
      },
      {
        title: "Typedef Strategy",
        text: "Function pointer syntax is ugly: <code>void (*p)(int)</code>. Use <span class='text-yellow-400'>typedef</span> to clean it up.",
        codeSnippet: `typedef void (*Action)(int);
Action act = jump;`
      },
      {
        title: "Jump Tables",
        text: "An array of function pointers. Replaces massive switch statements. You can map Input IDs directly to Functions.",
        codeSnippet: `Action moves[] = {run, jump, shoot};
moves[input](); // Fast execution`
      }
    ],
    quiz: [
      {
        id: 1401,
        question: "What does a function pointer store?",
        options: ["Return value", "Address of code", "Function name", "Variables"],
        correctIndex: 1,
        explanation: "It stores the memory address where the function's machine code begins."
      },
      {
        id: 1402,
        question: "Why use function pointers?",
        options: ["To confuse users", "For Callbacks/Plugins", "It uses less RAM", "Required by law"],
        correctIndex: 1,
        explanation: "They allow dynamic behavior injection (Callbacks)."
      }
    ]
  },
  {
    id: 15,
    title: "Architecture (Modules)",
    description: "Lecture 15: Multi-file compilation, Linker, and Scope control.",
    xpReward: 550,
    isLocked: true,
    lessons: [
      {
        title: "Split Compilation",
        text: "Big projects are split into modules.<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>📄 <span class='text-blue-400'>.h (Header)</span>: The Menu. Declarations and prototypes.</li><li>⚙️ <span class='text-green-400'>.c (Source)</span>: The Kitchen. Actual code implementation.</li></ul>",
        codeSnippet: `// math.h
int add(int a, int b);
// math.c
int add(int a, int b) { return a+b; }`
      },
      {
        title: "Include Guards",
        text: "Including a header twice causes errors. Wrap every header in <span class='text-yellow-400'>Guards</span>. This ensures it's only processed once per file.",
        codeSnippet: `#ifndef MATH_H
#define MATH_H
// content
#endif`
      },
      {
        title: "Private Functions (Static)",
        text: "If you mark a function <code>static</code> in a .c file, it becomes <span class='text-purple-400'>Private</span>. Other files cannot see or call it. Great for internal helpers.",
        codeSnippet: `static void helper() { ... }`
      },
      {
        title: "Extern Variables",
        text: "To share a global variable between files, define it in one .c file, and declare it as <span class='text-orange-400'>extern</span> in the header. It tells the linker 'Look for this elsewhere'.",
        codeSnippet: `extern int gameScore;`
      },
      {
        title: "The Linker",
        text: "The Compiler creates object files (.o). The <span class='text-blue-400'>Linker</span> glues them together into an .exe. If you declare a function but don't define it, you get a Linker Error.",
        codeSnippet: `Undefined reference to 'start'`
      }
    ],
    quiz: [
      {
        id: 1501,
        question: "Where do function prototypes go?",
        options: [".c files", ".h files", "main.c", "Makefiles"],
        correctIndex: 1,
        explanation: "Header files (.h) act as the public interface."
      },
      {
        id: 1502,
        question: "What keyword makes a function private to a file?",
        options: ["private", "local", "static", "hidden"],
        correctIndex: 2,
        explanation: "Static restricts the scope to the translation unit."
      }
    ]
  },
  {
    id: 16,
    title: "Bit Manipulation",
    description: "Lecture 16: Masks, Shifting, and Low-level optimization.",
    xpReward: 600,
    isLocked: true,
    lessons: [
      {
        title: "The Bitmask",
        text: "A <span class='text-blue-400'>Mask</span> is a binary pattern used to isolate specific bits. If you want to read just the 3rd bit, you AND it with 00000100.",
        codeSnippet: `if (flags & (1 << 2)) { /* Bit 2 is ON */ }`
      },
      {
        title: "Set, Clear, Toggle",
        text: "The holy trinity of hardware hacking.<br><br><ul class='list-disc pl-5 mt-2 space-y-1'><li>💡 <strong>Set (OR):</strong> <code>x |= (1<<n)</code></li><li>🌑 <strong>Clear (AND NOT):</strong> <code>x &= ~(1<<n)</code></li><li>🔀 <strong>Toggle (XOR):</strong> <code>x ^= (1<<n)</code></li></ul>",
        codeSnippet: `leds |= (1 << 5); // Turn on LED 5`
      },
      {
        title: "Shifting",
        text: "Moving bits left or right.<br><code><<</code>: Left Shift (Multiplies by 2).<br><code>>></code>: Right Shift (Divides by 2). <br>Ultra-fast math.",
        codeSnippet: `x = x << 1; // Double x`
      },
      {
        title: "Endianness",
        text: "How bytes are stored. <br><span class='text-green-400'>Big Endian</span>: Human readable (MSB first).<br><span class='text-orange-400'>Little Endian</span>: Reverse (LSB first). Intel is Little Endian. Crucial for networking.",
        codeSnippet: `// 0x1234 stored as 34 12`
      },
      {
        title: "Data Packing",
        text: "Storing multiple small values in one integer. E.g., RGB colors. Red, Green, and Blue (0-255) packed into one 32-bit int using shifts.",
        codeSnippet: `int color = (r << 16) | (g << 8) | b;`
      }
    ],
    quiz: [
      {
        id: 1601,
        question: "Which operator toggles bits?",
        options: ["|", "&", "~", "^"],
        correctIndex: 3,
        explanation: "XOR (^) flips bits where the mask is 1."
      },
      {
        id: 1602,
        question: "Left shifting by 1 is equivalent to...",
        options: ["Add 1", "Multiply by 2", "Divide by 2", "Subtract 1"],
        correctIndex: 1,
        explanation: "Shifting left moves digits to higher powers of 2."
      }
    ]
  },
  {
    id: 17,
    title: "Data Structures I",
    description: "Lecture 17: Stacks, Queues, and Linked implementations.",
    xpReward: 700,
    isLocked: true,
    lessons: [
      {
        title: "The Stack (LIFO)",
        text: "Last In, First Out. Like a magazine of bullets. You push to the top, you pop from the top.<br> Used for: Undo features, Function calls.",
        codeSnippet: `push(data);
val = pop();`
      },
      {
        title: "The Queue (FIFO)",
        text: "First In, First Out. Like a server request line. Enqueue at the back, Dequeue from the front.",
        codeSnippet: `enqueue(data);
val = dequeue();`
      },
      {
        title: "Stack Overflow",
        text: "If you push too much data, you crash. In recursion, this happens if you forget the base case. In arrays, it happens if you exceed the index.",
        codeSnippet: `// Danger zone`
      },
      {
        title: "Circular Buffer",
        text: "Implementing a Queue with an array. When you reach the end, you wrap around to index 0 using Modulus <code>%</code>. Efficient and fast.",
        codeSnippet: `next = (current + 1) % SIZE;`
      },
      {
        title: "Linked Implementation",
        text: "Stacks/Queues can use Linked Lists. This allows them to grow indefinitely (until RAM runs out), unlike fixed Arrays.",
        codeSnippet: `// No fixed size limit`
      }
    ],
    quiz: [
      {
        id: 1701,
        question: "A Queue follows which principle?",
        options: ["LIFO", "FIFO", "Random", "Sorted"],
        correctIndex: 1,
        explanation: "First In, First Out."
      },
      {
        id: 1702,
        question: "What happens if a fixed stack is full?",
        options: ["It grows", "It overwrites", "Stack Overflow", "It deletes"],
        correctIndex: 2,
        explanation: "Overflow occurs when capacity is exceeded."
      }
    ]
  },
  {
    id: 18,
    title: "Data Structures II",
    description: "Lecture 18: Binary Trees and Recursion patterns.",
    xpReward: 750,
    isLocked: true,
    lessons: [
      {
        title: "The Tree Topology",
        text: "A hierarchical structure. A Root node links to Child nodes. <span class='text-green-400'>Binary Trees</span> have at most 2 children (Left/Right).",
        codeSnippet: `struct Node {
  int data;
  struct Node *left, *right;
};`
      },
      {
        title: "Binary Search Tree (BST)",
        text: "Organized data. Everything smaller goes Left. Everything larger goes Right. Enables ultra-fast searching (O(log n)).",
        codeSnippet: `if (val < node->data) goLeft();
else goRight();`
      },
      {
        title: "Traversal",
        text: "How to read a tree? Use Recursion.<br> <strong>In-Order</strong>: Left, Self, Right (Sorted).<br> <strong>Pre-Order</strong>: Self, Left, Right (Copying).",
        codeSnippet: `print(n->left);
print(n->data);
print(n->right);`
      },
      {
        title: "Leaves and Height",
        text: "🌱 <strong>Root</strong>: Top.<br> 🍂 <strong>Leaf</strong>: Node with no children.<br> 📏 <strong>Height</strong>: Distance from root to deepest leaf.",
        codeSnippet: `if (!left && !right) // Is Leaf`
      },
      {
        title: "Efficiency",
        text: "Searching 1 million items in an Array takes 500k steps. In a balanced Tree? About 20 steps. Logarithmic scaling is powerful.",
        codeSnippet: `// O(n) vs O(log n)`
      }
    ],
    quiz: [
      {
        id: 1801,
        question: "In a BST, where do smaller values go?",
        options: ["Right", "Left", "Root", "Random"],
        correctIndex: 1,
        explanation: "Smaller to the Left, Larger to the Right."
      },
      {
        id: 1802,
        question: "What creates the tree structure?",
        options: ["Arrays", "Pointers", "Files", "Magic"],
        correctIndex: 1,
        explanation: "Nodes allow structural linking via pointers."
      }
    ]
  },
  {
    id: 19,
    title: "System Integrity",
    description: "Lecture 19: Error codes, Errno, and Assertions.",
    xpReward: 600,
    isLocked: true,
    lessons: [
      {
        title: "Defensive Coding",
        text: "Assume failure. Files won't open. Memory will fail. <span class='text-red-400'>Always check return values</span>. If <code>malloc</code> returns NULL, handle it.",
        codeSnippet: `if (ptr == NULL) crash_gracefully();`
      },
      {
        title: "The Errno Protocol",
        text: "Standard functions set a global variable <code>errno</code> when they fail. You can check this code to see <em>why</em> it failed (Permission Denied, Not Found, etc).",
        codeSnippet: `if (errno == EACCES) printf("Permission Denied");`
      },
      {
        title: "Perror",
        text: "A built-in tool that prints the human-readable error string for the current <code>errno</code>. Use it immediately after a failure.",
        codeSnippet: `perror("File Error");
// Output: "File Error: No such file"`
      },
      {
        title: "Assert",
        text: "<span class='text-purple-400'>assert()</span> checks for 'impossible' logic errors during dev. If false, the program aborts instantly with line number. Remove in production.",
        codeSnippet: `assert(x > 0); // Crash if x is 0`
      },
      {
        title: "Standard Error",
        text: "Don't print errors to <code>stdout</code>. Use <code>stderr</code>. It allows separating logs from real program output.",
        codeSnippet: `fprintf(stderr, "Fatal Error");`
      }
    ],
    quiz: [
      {
        id: 1901,
        question: "What variable holds the last error code?",
        options: ["error", "errno", "status", "code"],
        correctIndex: 1,
        explanation: "errno (Error Number) is the standard global."
      },
      {
        id: 1902,
        question: "What does assert() do if false?",
        options: ["Print warning", "Return 0", "Abort program", "Retry"],
        correctIndex: 2,
        explanation: "It terminates execution to flag a logic bug."
      }
    ]
  },
  {
    id: 20,
    title: "Final Optimization",
    description: "Lecture 20: Const, Inline, Padding, and Compilation flags.",
    xpReward: 1000,
    isLocked: true,
    lessons: [
      {
        title: "Const Correctness",
        text: "The <code>const</code> keyword is a contract. \"I promise not to change this.\" It prevents bugs and allows compiler optimizations.",
        codeSnippet: `void print(const char *msg);`
      },
      {
        title: "Inline Speed",
        text: "<span class='text-blue-400'>inline</span> suggests the compiler copy-paste the function code instead of calling it. Removes call overhead for tiny functions.",
        codeSnippet: `inline int max(int a, int b) { ... }`
      },
      {
        title: "Structure Padding",
        text: "Processors like aligned data. The compiler inserts invisible 'padding' bytes between struct members. Order members Largest to Smallest to minimize waste.",
        codeSnippet: `struct Bad { char c; int i; }; // 8 bytes
struct Good { int i; char c; }; // 8 bytes`
      },
      {
        title: "Compiler Flags",
        text: "<code>-O2</code> or <code>-O3</code>. These flags tell GCC to analyze your code and rewrite it for maximum speed (Loop unrolling, branch prediction).",
        codeSnippet: `gcc -O3 main.c`
      },
      {
        title: "Mission Debrief",
        text: "You have survived the memory gauntlet. You know the stack, the heap, and the pointer. You are now C-Certified. Go forth and code the kernel. <br><br> <span class='text-green-400 font-bold'>// END OF LINE</span>",
        codeSnippet: `exit(0);`
      }
    ],
    quiz: [
      {
        id: 2001,
        question: "What does `const` protect against?",
        options: ["Reading", "Copying", "Modification", "Deleting"],
        correctIndex: 2,
        explanation: "It marks variable as Read-Only."
      },
      {
        id: 2002,
        question: "What is the goal of `-O3`?",
        options: ["Debug info", "Optimization", "Warnings", "Linking"],
        correctIndex: 1,
        explanation: "It is the high-level optimization flag."
      }
    ]
  }
];
