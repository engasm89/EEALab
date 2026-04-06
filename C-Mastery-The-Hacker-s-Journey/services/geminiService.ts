import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const askAITutor = async (
  currentTopic: string, 
  question: string,
  lessonContext: string,
  history: ChatMessage[] = []
): Promise<string> => {
  try {
    // Initialize the client inside the function to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';
    
    // 1. Manage History Context (Sliding Window)
    // We keep the last 6 messages (3 turns) to maintain context without bloating the prompt.
    const recentHistory = history.slice(-6);
    const historyText = recentHistory.map(msg => 
      `${msg.role === 'user' ? 'Hacker_Student' : 'CyberMentor'}: ${msg.text}`
    ).join('\n');

    // 2. Manage Lesson Context
    // Truncate lesson context if it's too long to ensure the model focuses on the immediate query
    // but keeps enough for reference.
    const safeLessonContext = lessonContext.length > 1500 
      ? lessonContext.substring(0, 1500) + "...(truncated)" 
      : lessonContext;

    const prompt = `
      You are "CyberMentor", a friendly and expert C Programming Tutor for beginners in a gamified hacking-themed learning app.
      
      === MISSION INTEL (Current Lesson) ===
      Topic: "${currentTopic}"
      Material:
      ${safeLessonContext}
      
      === COMMS LOG (Previous Context) ===
      ${historyText}
      
      === INCOMING TRANSMISSION ===
      Hacker_Student: "${question}"

      Instructions:
      1. Provide a concise, encouraging answer (max 3 sentences ideally, unless code is needed).
      2. Use a "hacker/cyber" flavor in your tone (e.g., "Good compile," "Check your memory," "Access granted").
      3. If code is requested, provide valid C code snippets.
      4. Answer based on the context of the lesson provided if relevant.
      5. Do not give the direct answer to quizzes, but guide them.
      6. If the user asks about something in the "COMMS LOG", refer back to it.
      
      CyberMentor:
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Connection interrupted. Signal lost.";
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Error: Neural link unstable. Unable to reach the mainframe.";
  }
};

export const compileAndRunC = async (code: string, stdin: string): Promise<string> => {
  try {
    // Initialize the client inside the function to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Use Pro model for better code simulation logic, or Flash for speed. 
    // Flash is sufficient for basic C execution simulation.
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Act as a C Compiler (GCC) and Execution Environment.
      
      Your task is to:
      1. Check the following C code for syntax errors.
      2. If there are errors, output the compiler error messages (like GCC).
      3. If there are no errors, simulate the execution of the program.
      4. Use the provided Standard Input (STDIN) if the code calls for input (scanf, fgets, etc).
      
      RULES:
      - OUTPUT ONLY THE RAW CONSOLE OUTPUT. Do not add markdown blocks like \`\`\`. 
      - Do not add conversational text like "Here is the output".
      - If the code loops infinitely, stop it and print "Error: Time Limit Exceeded".
      
      === C CODE ===
      ${code}
      
      === STANDARD INPUT (STDIN) ===
      ${stdin}
      
      === CONSOLE OUTPUT ===
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    // Strip any markdown code blocks if the model accidentally includes them
    let output = response.text || "";
    // Regex to remove ```c, ```text, or just ``` and trim whitespace
    output = output.replace(/^```[a-z]*\n?/gm, '').replace(/```$/gm, '').trim();
    
    return output;
  } catch (error) {
    console.error("Compiler Service Error:", error);
    return "GCC Error: Backend connection failed. Compilation aborted.";
  }
};