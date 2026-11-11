import os
import json
import glob

# Paths to the directories we want to include in our dataset
DIRS = [
    "spectrum-ui-main",
    "fluentui-master",
    "material-ui-master",
    "saas-starter-main",
    "saasternity-main",
    "ui-main"
]

BASE_PATH = r"C:\Users\dogus\Downloads\togetlinkk"
OUTPUT_FILE = os.path.join(BASE_PATH, "ui_dataset.jsonl")

def create_dataset():
    dataset = []
    
    for dir_name in DIRS:
        dir_path = os.path.join(BASE_PATH, dir_name)
        if not os.path.exists(dir_path):
            print(f"Directory not found: {dir_path}")
            continue
            
        print(f"Scanning {dir_name}...")
        
        # We will look for .tsx, .jsx files which represent React components
        search_pattern = os.path.join(dir_path, "**", "*.tsx")
        for file_path in glob.glob(search_pattern, recursive=True):
            if "node_modules" in file_path or "dist" in file_path or ".next" in file_path:
                continue
                
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                if len(content.strip()) < 50:
                    continue # Skip very small or empty files
                    
                filename = os.path.basename(file_path)
                component_name = os.path.splitext(filename)[0]
                
                # Create Alpaca format for fine-tuning
                instruction = f"Create a React component for {component_name}."
                
                # Try to give context based on folder path
                context = f"Framework: {dir_name}. Path: {file_path.replace(BASE_PATH, '')}"
                
                dataset_entry = {
                    "instruction": instruction,
                    "input": context,
                    "output": f"```tsx\n{content}\n```"
                }
                dataset.append(dataset_entry)
                
            except Exception as e:
                print(f"Error reading {file_path}: {e}")

        # Search for JSX as well
        search_pattern_jsx = os.path.join(dir_path, "**", "*.jsx")
        for file_path in glob.glob(search_pattern_jsx, recursive=True):
             if "node_modules" in file_path or "dist" in file_path or ".next" in file_path:
                 continue
                 
             try:
                 with open(file_path, "r", encoding="utf-8") as f:
                     content = f.read()
                     
                 if len(content.strip()) < 50:
                     continue
                     
                 filename = os.path.basename(file_path)
                 component_name = os.path.splitext(filename)[0]
                 
                 instruction = f"Create a React component for {component_name}."
                 context = f"Framework: {dir_name}. Path: {file_path.replace(BASE_PATH, '')}"
                 
                 dataset_entry = {
                     "instruction": instruction,
                     "input": context,
                     "output": f"```jsx\n{content}\n```"
                 }
                 dataset.append(dataset_entry)
             except Exception as e:
                 print(f"Error reading {file_path}: {e}")

    print(f"Collected {len(dataset)} examples. Writing to {OUTPUT_FILE}...")
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out_f:
        for entry in dataset:
            out_f.write(json.dumps(entry, ensure_ascii=False) + "\n")
            
    print("Done! You can upload ui_dataset.jsonl to Google Drive / Colab.")

if __name__ == "__main__":
    create_dataset()
