import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { function_name, parameters } = body;

    let result = "";

    if (function_name === "write_file") {
      const { file_path, content } = parameters;
      const projectRoot = process.cwd();
      const fullPath = path.resolve(projectRoot, file_path);
      
      if (!fullPath.startsWith(projectRoot)) {
        throw new Error("Security Error: Cannot write outside project root.");
      }
      
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, content, "utf8");
      result = `Successfully wrote file to ${file_path}`;
      
    } else if (function_name === "read_file") {
      const { file_path } = parameters;
      const projectRoot = process.cwd();
      const fullPath = path.resolve(projectRoot, file_path);
      
      if (!fullPath.startsWith(projectRoot)) {
        throw new Error("Security Error: Cannot read outside project root.");
      }
      
      if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found: ${file_path}`);
      }
      
      const content = fs.readFileSync(fullPath, "utf8");
      // Limit read size to prevent overflowing prompt
      result = content.substring(0, 10000);
      
    } else if (function_name === "list_directory") {
      const { dir_path } = parameters;
      const projectRoot = process.cwd();
      const fullPath = path.resolve(projectRoot, dir_path);
      
      if (!fullPath.startsWith(projectRoot)) {
        throw new Error("Security Error: Cannot list outside project root.");
      }
      
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Directory not found: ${dir_path}`);
      }
      
      const files = fs.readdirSync(fullPath);
      result = `Files in ${dir_path}:\n${files.join('\n')}`;
      
    } else if (function_name === "commit_and_push") {
      const { commit_message } = parameters;
      const { execSync } = require('child_process');
      const projectRoot = process.cwd();
      
      const githubToken = process.env.GITHUB_TOKEN;
      if (!githubToken) {
        throw new Error("GITHUB_TOKEN is missing in environment variables. Cannot push to GitHub.");
      }

      try {
        // Set up Git credentials for the cloud environment
        execSync('git config --global user.email "ai@togetlink.com"', { cwd: projectRoot });
        execSync('git config --global user.name "IdeaAI"', { cwd: projectRoot });
        
        // Add all changes
        execSync('git add .', { cwd: projectRoot });
        
        // Commit
        try {
          execSync(`git commit -m "${commit_message.replace(/"/g, '\\"')}"`, { cwd: projectRoot });
        } catch (e: any) {
          if (e.stdout && e.stdout.toString().includes("nothing to commit")) {
            result = "Nothing to commit.";
            return NextResponse.json({ success: true, result });
          }
          throw e;
        }
        
        // Push using the token
        const remoteUrl = `https://${githubToken}@github.com/DogusTech/togetlink-ui.git`;
        execSync(`git push ${remoteUrl} main`, { cwd: projectRoot });
        
        result = `Successfully committed and pushed to GitHub with message: "${commit_message}". Vercel is now deploying.`;
      } catch (err: any) {
        throw new Error(`Git error: ${err.message || err.toString()}`);
      }
      
    } else if (function_name === "scrape_website") {
      const { url } = parameters;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      const html = await res.text();
      // Basic extraction of text using regex or cheerio if installed
      // Next.js might not have cheerio, fallback to basic regex strip
      result = html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').substring(0, 1000); 
      // Limits to 1000 chars to avoid prompt overflow and rate limits
      result = `Scraped content from ${url}:\n${result}`;
      
    } else if (function_name === "task_complete") {
      result = "Task completed successfully.";
    } else {
      throw new Error(`Unknown function ${function_name}`);
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("AI Execute Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
