// IdeaAI Open-Core Execution Engine
// Standalone runner supporting Local Ollama, OpenAI-compatible APIs, and local workspace tools.

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const IGNORED_ENTRIES = new Set([
  '.git', 'node_modules', '.next', 'dist', 'build', 'release', 'coverage', '.cache'
]);

class CoreEngine {
  constructor(options = {}) {
    this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
    this.provider = options.provider || process.env.IDEAAI_PROVIDER || 'ollama'; // 'ollama' | 'openai' | 'custom'
    this.model = options.model || process.env.IDEAAI_MODEL || (this.provider === 'ollama' ? 'llama3.2' : 'gpt-4o');
    this.ollamaUrl = options.ollamaUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY || '';
    this.apiBaseUrl = options.apiBaseUrl || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.maxSteps = options.maxSteps || 6;
  }

  resolvePath(relPath) {
    const target = path.resolve(this.workspaceRoot, relPath);
    if (target !== this.workspaceRoot && !target.startsWith(`${this.workspaceRoot}${path.sep}`)) {
      throw new Error(`Security Exception: Access denied outside workspace root: ${relPath}`);
    }
    return target;
  }

  async collectFiles(dirPath = this.workspaceRoot, depth = 0, files = []) {
    if (depth > 6 || files.length >= 500) return files;
    try {
      const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
      for (const item of items) {
        if (IGNORED_ENTRIES.has(item.name)) continue;
        const full = path.join(dirPath, item.name);
        const rel = path.relative(this.workspaceRoot, full);
        if (item.isDirectory()) {
          files.push({ path: rel, isDirectory: true });
          await this.collectFiles(full, depth + 1, files);
        } else {
          files.push({ path: rel, isDirectory: false });
        }
        if (files.length >= 500) break;
      }
    } catch (err) {
      // Ignore unreadable dirs
    }
    return files;
  }

  async executeTool(toolCall) {
    const { name, params } = toolCall;
    if (name === 'read_file') {
      try {
        const resolved = this.resolvePath(params.path);
        const content = await fs.promises.readFile(resolved, 'utf8');
        return { success: true, output: content };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    if (name === 'write_file') {
      try {
        const resolved = this.resolvePath(params.path);
        await fs.promises.mkdir(path.dirname(resolved), { recursive: true });
        await fs.promises.writeFile(resolved, params.content, 'utf8');
        return { success: true, output: `Saved ${params.path}` };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    if (name === 'run_command') {
      return new Promise((resolve) => {
        exec(params.command, { cwd: this.workspaceRoot, windowsHide: true, timeout: 60000 }, (error, stdout, stderr) => {
          resolve({
            success: !error,
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            error: error ? error.message : null
          });
        });
      });
    }

    return { success: false, error: `Unknown tool: ${name}` };
  }

  async callLLM(messages) {
    if (this.provider === 'ollama') {
      const res = await fetch(`${this.ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false
        })
      });

      if (!res.ok) {
        throw new Error(`Ollama API error (${res.status}): ${res.statusText}. Make sure Ollama is running at ${this.ollamaUrl}`);
      }

      const json = await res.json();
      return json.message?.content || '';
    }

    // OpenAI or custom endpoint
    const res = await fetch(`${this.apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.2
      })
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      throw new Error(`LLM API error (${res.status}): ${errBody || res.statusText}`);
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content || '';
  }

  parseToolCalls(text) {
    const calls = [];
    const readMatches = text.matchAll(/<read_file\s+path=["']([^"']+)["']\s*\/?>/gi);
    for (const match of readMatches) {
      calls.push({ name: 'read_file', params: { path: match[1].trim() } });
    }

    const writeMatches = text.matchAll(/<write_file\s+path=["']([^"']+)["']>([\s\S]*?)<\/write_file>/gi);
    for (const match of writeMatches) {
      calls.push({ name: 'write_file', params: { path: match[1].trim(), content: match[2] } });
    }

    const cmdMatches = text.matchAll(/<run_command>([\s\S]*?)<\/run_command>/gi);
    for (const match of cmdMatches) {
      calls.push({ name: 'run_command', params: { command: match[1].trim() } });
    }

    return calls;
  }

  async run(taskDescription, onEvent = () => {}) {
    onEvent({ type: 'start', task: taskDescription, workspace: this.workspaceRoot, model: this.model });

    onEvent({ type: 'status', message: 'Scanning local repository tree...' });
    const files = await this.collectFiles();
    const treeSummary = files.map(f => `${f.isDirectory ? '[DIR]' : '[FILE]'} ${f.path}`).slice(0, 300).join('\n');

    const systemPrompt = `You are IdeaAI, an autonomous desktop AI engineer running natively on the developer's computer.
You have direct read/write access to files and terminal command execution in the designated workspace.

WORKSPACE ROOT: ${this.workspaceRoot}

Available tools (format strictly as XML):
1. <read_file path="relative/path/to/file" />
2. <write_file path="relative/path/to/file">full file content</write_file>
3. <run_command>shell command</run_command>

RULES:
- Always read existing files before modifying them.
- Emitting <write_file> will directly write to the developer's filesystem.
- Emitting <run_command> will execute directly in their shell.
- Provide clear, actionable output. When finished with all changes, summarize what was achieved.

CURRENT REPOSITORY TREE:
${treeSummary || '(Empty or new directory)'}`;

    const conversation = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: taskDescription }
    ];

    let step = 0;
    while (step < this.maxSteps) {
      step++;
      onEvent({ type: 'step_start', step, maxSteps: this.maxSteps });

      onEvent({ type: 'status', message: `Querying ${this.model} (${this.provider})...` });
      let assistantText = '';
      try {
        assistantText = await this.callLLM(conversation);
      } catch (err) {
        onEvent({ type: 'error', error: err.message });
        throw err;
      }

      onEvent({ type: 'thought', content: assistantText });
      const toolCalls = this.parseToolCalls(assistantText);

      if (toolCalls.length === 0) {
        onEvent({ type: 'completed', summary: assistantText });
        return { success: true, text: assistantText };
      }

      onEvent({ type: 'status', message: `Executing ${toolCalls.length} autonomous tool action(s)...` });
      const toolResults = [];

      for (const call of toolCalls) {
        onEvent({ type: 'tool_executing', tool: call.name, params: call.params });
        const res = await this.executeTool(call);
        onEvent({ type: 'tool_result', tool: call.name, result: res });

        if (call.name === 'read_file') {
          toolResults.push(`<tool_result path="${call.params.path}">\n${res.success ? res.output : `ERROR: ${res.error}`}\n</tool_result>`);
        } else if (call.name === 'write_file') {
          toolResults.push(`<tool_result path="${call.params.path}">\n${res.success ? 'File written successfully' : `ERROR: ${res.error}`}\n</tool_result>`);
        } else if (call.name === 'run_command') {
          toolResults.push(`<tool_result command="${call.params.command}">\nExit: ${res.success ? 0 : 1}\nStdout: ${res.stdout}\nStderr: ${res.stderr || res.error || ''}\n</tool_result>`);
        }
      }

      conversation.push({ role: 'assistant', content: assistantText });
      conversation.push({
        role: 'user',
        content: `TOOL EXECUTION RESULTS:\n${toolResults.join('\n\n')}\n\nContinue executing the task or conclude with your final summary if completed.`
      });
    }

    onEvent({ type: 'completed', summary: 'Max autonomous steps reached.' });
    return { success: true, message: 'Max steps reached.' };
  }
}

module.exports = { CoreEngine };
