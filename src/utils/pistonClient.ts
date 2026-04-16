// utils/pistonClient.ts
// Piston is a public, keyless API — no secrets exposed.

export type SupportedLanguage = "python" | "javascript" | "cpp";

export interface PistonRequest {
  language: SupportedLanguage;
  version: string;
  files: { content: string }[];
  stdin?: string;
}

export interface PistonResponse {
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  language: string;
  version: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime?: number;
  error?: string;
}

const PISTON_API = "https://emkc.org/api/v2/piston/execute";
const TIMEOUT_MS = 15_000; // 15 seconds

// Language runtime versions pinned for stability
export const LANGUAGE_VERSIONS: Record<SupportedLanguage, string> = {
  python: "3.10.0",
  javascript: "18.15.0",
  cpp: "10.2.0",
};

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  python: "Python 3",
  javascript: "JavaScript",
  cpp: "C++",
};

export const STARTER_CODE: Record<SupportedLanguage, string> = {
  python: `# Write your Python solution here
def solution():
    pass

# Call your function
solution()
`,
  javascript: `// Write your JavaScript solution here
function solution() {
  // your code
}

// Call your function
solution();
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your C++ solution here
    
    return 0;
}
`,
};

/**
 * Executes code via the Piston API with a configurable timeout.
 * Returns a normalized ExecutionResult — never throws.
 */
export async function executeCode(
  language: SupportedLanguage,
  code: string,
  stdin = ""
): Promise<ExecutionResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const startTime = performance.now();

  try {
    const body: PistonRequest = {
      language,
      version: LANGUAGE_VERSIONS[language],
      files: [{ content: code }],
      stdin,
    };

    const res = await fetch(PISTON_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const elapsed = Math.round(performance.now() - startTime);

    if (!res.ok) {
      return {
        stdout: "",
        stderr: "",
        exitCode: -1,
        executionTime: elapsed,
        error: `Piston API error: ${res.status} ${res.statusText}`,
      };
    }

    const data: PistonResponse = await res.json();

    // Compile errors (C/C++) surface in compile.stderr
    const compileStderr = data.compile?.stderr ?? "";
    const runStdout = data.run?.stdout ?? "";
    const runStderr = data.run?.stderr ?? compileStderr;

    return {
      stdout: runStdout,
      stderr: compileStderr || runStderr,
      exitCode: data.run?.code ?? 0,
      executionTime: elapsed,
    };
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - startTime);
    if (err.name === "AbortError") {
      return {
        stdout: "",
        stderr: "",
        exitCode: -1,
        executionTime: elapsed,
        error: "Execution timed out (>15s). Check for infinite loops.",
      };
    }
    return {
      stdout: "",
      stderr: "",
      exitCode: -1,
      executionTime: elapsed,
      error: `Network error: ${err.message}`,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
