const fs = require('fs');

function translateAndStyle(file) {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');

    // 1. Translations
    code = code.replace("IdeaAI'a giriş yapın", "Sign in to IdeaAI");
    code = code.replace("Hesabınız yok mu?", "Don't have an account?");
    code = code.replace(/>Kaydol<\/Link>/g, ">Sign up</Link>");
    code = code.replace("Google ile giriş yapın", "Continue with Google");
    code = code.replace("GitHub ile giriş yapın", "Continue with GitHub");
    code = code.replace(">Ya da<", ">Or<");
    code = code.replace("E-postanızı girin", "Email address");
    code = code.replace("Şifre ile devam et", "Continue with password");
    code = code.replace("OTP ile giriş yap", "Continue with OTP");
    code = code.replace("Giriş yaparak şunları kabul etmiş olursunuz:", "By signing in, you agree to our");
    code = code.replace(">Şartlar ve Koşullar<", ">Terms of Service<");
    code = code.replace("> ve <", "> and <");
    code = code.replace(">Gizlilik Politikası<", ">Privacy Policy<");
    code = code.replace("Yardıma mı ihtiyacınız var?", "Need help?");
    code = code.replace(">Destekle iletişime geçin<", ">Contact support<");
    
    // Language selector
    code = code.replace("🇹🇷", "🇺🇸");
    code = code.replace("Türkçe", "English");

    // 2. Styling updates (More rounded corners for buttons)
    // The previous border was 'rounded-lg' (which is 0.5rem / 8px). Let's use 'rounded-xl' (0.75rem / 12px) or 'rounded-[10px]'
    code = code.replace(/rounded-lg/g, "rounded-[12px]");

    fs.writeFileSync(file, code);
    console.log("Updated " + file);
}

translateAndStyle('app/ai-landing-page/register/page.tsx');
translateAndStyle('app/ai-landing-page/login/page.tsx');
