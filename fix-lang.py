with open("components/ai/idea-ai-interface-mac.tsx", "r", encoding="utf-8") as f:
    code = f.read()

search = "**[Otonom Islem Basarili]**\\nSu dosyalar bilgisayariniza kaydedildi:\\n"
replace = "**[Autonomous Action Successful]**\\nThe following files have been saved to your local workspace:\\n"

code = code.replace(search, replace)

with open("components/ai/idea-ai-interface-mac.tsx", "w", encoding="utf-8") as f:
    f.write(code)
