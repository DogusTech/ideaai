import os
import random
import smtplib
import time
from email.mime.text import MIMEText
import requests

# 1. Konfigürasyon
OLLAMA_URL = "http://localhost:11434/api/generate"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "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")
SENT_EMAILS_FILE = "sent_emails.txt"

SMTP_CONFIG = {
    "email": "dogusssyilmaz@gmail.com",
    "app_password": "ppuepcrrwnisxmid",
}


# 2. Gönderilmiş Maillerin Dosya Kontrolü
def load_sent_emails():
    if os.path.exists(SENT_EMAILS_FILE):
        with open(SENT_EMAILS_FILE, "r", encoding="utf-8") as f:
            return set(line.strip().lower() for line in f if line.strip())
    return set()


def save_sent_email(email):
    with open(SENT_EMAILS_FILE, "a", encoding="utf-8") as f:
        f.write(email.lower() + "\n")


# 3. Local Llama 3.2 Metin Üretimi
def generate_personalized_pitch(dev_name, bio):
    prompt = f"""
    Write a 2-sentence informal cold email to {dev_name}.
    They are an open-source developer interested in AI/software (Bio: {bio}).
    Pitch IdeaAI (an open-source 100% local autonomous AI engineer running via Ollama/Llama 3.2).
    Keep it friendly, developer-to-developer, no sales buzzwords, no formalities.
    Do NOT add subject line, signatures, or placeholders like [Your Name]. Return ONLY the 2 sentences body text.
    """
    payload = {"model": "llama3.2", "prompt": prompt, "stream": False}

    try:
        res = requests.post(OLLAMA_URL, json=payload, timeout=30)
        return res.json().get("response", "").strip()
    except Exception as e:
        print(f"Ollama bağlantı hatası: {e}")
        return None


# 4. Geliştirici Çekici (150+ Hedef İçin Genişletilmiş Sorgu Mimarisi)
def fetch_target_developers(github_token, max_results=150):
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github.v3+json",
    }

    already_sent = load_sent_emails()
    print(
        f"Hafızada {len(already_sent)} adet daha önce mail atılmış adres bulundu. Bu kişiler atlanacak."
    )

    # 150 kişiyi rahatça bulmak için sorgu çeşitliliğini artırdık
    queries = [
        "topic:ollama type:user",
        "topic:llama3 type:user",
        "topic:local-ai type:user",
        "topic:langchain type:user",
        "language:python followers:5..1000 type:user",
        "language:typescript followers:5..1000 type:user",
    ]

    targets = []
    seen_in_this_run = set()

    print("150 kişilik geniş geliştirici havuzu taranıyor...")

    for q in queries:
        if len(targets) >= max_results:
            break

        # Her sorguda 5 farklı sayfayı tarıyoruz
        for page in range(1, 6):
            if len(targets) >= max_results:
                break

            url = f"https://api.github.com/search/users?q={q}&per_page=50&page={page}"
            res = requests.get(url, headers=headers).json()
            users = res.get("items", [])

            for user in users:
                if len(targets) >= max_results:
                    break

                username = user.get("login")
                if not username:
                    continue

                u_data = requests.get(
                    f"https://api.github.com/users/{username}", headers=headers
                ).json()
                email = u_data.get("email")

                # E-posta profilde yoksa commit loglarına bak
                if not email:
                    events_url = f"https://api.github.com/users/{username}/events/public"
                    events = requests.get(events_url, headers=headers).json()
                    if isinstance(events, list):
                        for event in events:
                            if event.get("type") == "PushEvent":
                                commits = (
                                    event.get("payload", {})
                                    .get("commits", [])
                                )
                                for commit in commits:
                                    author_email = (
                                        commit.get("author", {}).get("email")
                                    )
                                    if (
                                        author_email
                                        and "noreply" not in author_email
                                        and "@" in author_email
                                    ):
                                        email = author_email
                                        break
                            if email:
                                break

                if email:
                    lowered_email = email.lower()

                    if (
                        lowered_email in already_sent
                        or lowered_email in seen_in_this_run
                    ):
                        continue

                    # Kurumsal e-posta filtreleme
                    if any(
                        bad in lowered_email
                        for bad in ["ospo@", "oss@", "info@", "support@"]
                    ):
                        continue

                    seen_in_this_run.add(lowered_email)
                    print(
                        f" [{len(targets)+1}/{max_results} YENİ BULUNDU] {username} -> {email}"
                    )
                    targets.append(
                        {
                            "name": u_data.get("name") or username,
                            "email": email,
                            "bio": u_data.get("bio") or "AI developer",
                        }
                    )

    return targets

# 5. SMTP Gönderici (Bağlantı Kopmalarına Karşı Güvenli Yapı)
def run_outreach(devs, smtp_cfg):
    if not devs:
        print("Yeni hedef bulunamadı.")
        return

    print(f"\nToplam {len(devs)} yeni hedef geliştiriciye mail atılacak.\n")
    sent_count = 0

    for dev in devs:
        print(f"Llama 3.2 çalışıyor ({dev['name']})...")
        pitch = generate_personalized_pitch(dev["name"], dev["bio"])

        if pitch:
            msg = MIMEText(pitch)
            msg["Subject"] = "Quick question about your local AI setup"
            msg["From"] = smtp_cfg["email"]
            msg["To"] = dev["email"]

            # Her mail gönderiminde taze SMTP oturumu açıyoruz (Timeout engeli)
            try:
                with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                    server.login(smtp_cfg["email"], smtp_cfg["app_password"])
                    server.send_message(msg)

                sent_count += 1
                save_sent_email(dev["email"])
                print(
                    f" [{sent_count}/{len(devs)}] Mail başarıyla gönderildi -> {dev['email']}"
                )

                # İnsansı Bekleme Süresi (45 - 90 saniye)
                wait = random.randint(45, 90)
                print(f"Spam engeli için {wait} saniye bekleniyor...\n")
                time.sleep(wait)

                # Her 25 BAŞARILI mailde bir 10 dakika güvenlik molası
                if sent_count % 25 == 0 and sent_count != len(devs):
                    print(
                        "\n 25 mail başarıyla gönderildi. Gmail hesabını korumak için 10 dakika güvenlik molası veriliyor...\n"
                    )
                    time.sleep(600)

            except Exception as err:
                print(f" Mail hatası ({dev['email']}): {err}\n")
                time.sleep(10)  # Hata durumunda kısa bir bekleme

    print("Tüm gönderim süreci başarıyla tamamlandı!")

    for dev in devs:
        print(f"Llama 3.2 çalışıyor ({dev['name']})...")
        pitch = generate_personalized_pitch(dev["name"], dev["bio"])

        if pitch:
            msg = MIMEText(pitch)
            msg["Subject"] = "Quick question about your local AI setup"
            msg["From"] = smtp_cfg["email"]
            msg["To"] = dev["email"]

            try:
                server.send_message(msg)
                sent_count += 1
                save_sent_email(dev["email"])
                print(
                    f" [{sent_count}/{len(devs)}] Mail başarıyla gönderildi -> {dev['email']}"
                )
            except Exception as err:
                print(f" Mail hatası ({dev['email']}): {err}")

            # İnsansı Bekleme Süresi (45 - 90 saniye)
            wait = random.randint(45, 90)
            print(f"Spam engeli için {wait} saniye bekleniyor...\n")
            time.sleep(wait)

            # Her 25 mailde bir Gmail koruması için 10 dakika (600sn) mola
            if sent_count % 25 == 0 and sent_count != len(devs):
                print(
                    "\n 25 mail gönderimi tamamlandı. Gmail hesabını korumak için 10 dakika güvenlik molası veriliyor...\n"
                )
                time.sleep(600)

    server.quit()
    print("Tüm 150 kişilik gönderim süreci başarıyla tamamlandı!")


# --- ÇALIŞTIRMA ---
if __name__ == "__main__":
    print("Cold outreach otomasyonu 150 hedef ile başlatılıyor...")
    target_devs = fetch_target_developers(GITHUB_TOKEN, max_results=150)
    run_outreach(target_devs, SMTP_CONFIG)