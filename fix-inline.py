with open("components/ai/antigravity-markdown.tsx", "r", encoding="utf-8") as f:
    code = f.read()

search = """function CodeBlock({ node, inline, className, children, ...props }: any) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  
  if (inline) {"""

replace = """function CodeBlock({ node, inline, className, children, ...props }: any) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  
  // In react-markdown v9, inline is sometimes undefined. We can guess it's inline if no language class is present and no newlines exist.
  const isInline = inline || (!match && typeof children === 'string' && !children.includes('\\n'))
  
  if (isInline) {"""

code = code.replace(search, replace)
with open("components/ai/antigravity-markdown.tsx", "w", encoding="utf-8") as f:
    f.write(code)
