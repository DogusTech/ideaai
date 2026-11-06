const { exec } = require('child_process');

/**
 * Executes a bash command and formats the output specifically for LLMs.
 * @param {string} command - The bash command to execute (e.g., 'npm run build').
 * @param {string} cwd - The current working directory.
 * @returns {Promise<Object>} JSON object optimized for LLM context.
 */
function executeAndParseForLLM(command, cwd = process.cwd()) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    exec(command, { cwd }, (error, stdout, stderr) => {
      const executionTimeMs = Date.now() - startTime;
      
      // Clean up ansi escape codes (colors) so LLMs don't get confused
      const cleanString = (str) => str.replace(/\x1B\[\d+m/g, '').trim();

      const result = {
        command_executed: command,
        working_directory: cwd,
        execution_time_ms: executionTimeMs,
        success: !error,
        stdout: cleanString(stdout),
        stderr: cleanString(stderr),
        llm_suggestion: "None"
      };

      if (error) {
        result.error_code = error.code;
        result.llm_suggestion = "Analyze the 'stderr' block. Identify the missing module, syntax error, or failing test. Return a function call to edit the file causing the issue.";
      }

      resolve(result);
    });
  });
}

module.exports = {
  executeAndParseForLLM
};
