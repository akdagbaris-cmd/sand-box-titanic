# Sand Box Titanic'i App Store'da yayınlama rehberi (Mac'siz, Windows'tan)

Bu rehber, oyunu iPhone ve iPad için App Store'a çıkarmanın adımlarını sırayla anlatır.
**Mac gerekmiyor.** Uygulamayı derleme ve Apple'a yükleme işini GitHub'ın kendi Mac
sunucuları yapıyor (GitHub Actions). Sen her şeyi Windows'tan, tarayıcıyla yapıyorsun.

Depoda hazır olanlar:

- Oyun **Capacitor** ile bir iOS uygulamasına sarıldı (`ios/` klasörü), ikon ve açılış ekranı hazır.
- `.github/workflows/ios-testflight.yml`: tek tıkla derleyip TestFlight'a yükleyen iş akışı.
- Web sürümü hiç değişmedi. Bulut tablette GitHub linkinden oynamaya aynen devam edebilir.

> Kısa özet: Apple Developer hesabı aç → App Store Connect'te uygulama kaydı oluştur →
> bir API anahtarı al → 4 bilgiyi GitHub'a gizli anahtar olarak gir →
> GitHub'da "Run workflow"a bas → TestFlight'ta iPad'de dene → mağaza sayfasını doldur →
> incelemeye gönder.

---

## 0. Neler gerekiyor?

| Gereken | Neden | Not |
|---|---|---|
| **Apple Developer Program üyeliği** | App Store'a yüklemek için şart | Yıllık 99 USD |
| **Windows bilgisayar + tarayıcı** | Apple ve GitHub sitelerinde ayar yapmak | Mac gerekmez |
| **iPad veya iPhone** | Uygulamayı TestFlight ile denemek | Bulut'un tableti iPad ise o olur |
| GitHub hesabı | Zaten var | Depo herkese açık olduğu için Mac sunucusu ücretsiz |

> Not: Tablet **Android** ise App Store işe yaramaz; o zaman Google Play gerekir.
> Bu rehber iPad/iPhone içindir.

---

## 1. Apple Developer hesabını aç

1. https://developer.apple.com/programs/enroll/ adresine git, Apple Kimliğinle gir.
   Apple Kimliğinde **iki adımlı doğrulama** açık olmalı (bir iPhone/iPad'den ya da
   telefon numarasıyla açılabilir).
2. **Bireysel (Individual)** üyelik seç. Mağazada satıcı adı olarak kendi adın görünür.
   Şirket adıyla çıkmak istersen **Organization** gerekir (D-U-N-S numarası, haftalar sürer).
3. 99 USD'yi öde. Onay genelde 1-2 gün sürer, e-postayla gelir.
   Windows'tan kayıt bazen "Apple Developer uygulamasını kullan" der; olmazsa aynı
   Apple Kimliğiyle iPad'deki **Apple Developer** uygulamasından kaydol.
4. Onay gelince https://appstoreconnect.apple.com adresine girebildiğini kontrol et.
5. Oyun ücretsiz olacaksa vergi ve banka bilgisi gerekmez.

---

## 2. Team ID'ni not al

1. https://developer.apple.com/account → **Membership details** (Üyelik bilgileri).
2. **Team ID** yazan 10 karakterlik kodu (ör. `AB12CD34EF`) not al.

---

## 3. App Store Connect'te uygulama kaydı ve API anahtarı

### 3a. Uygulama kimliğini (Bundle ID) kaydet

1. https://developer.apple.com/account/resources/identifiers/list → `+`.
2. **App IDs → App** → Continue.
3. **Description**: Sand Box Titanic, **Bundle ID**: Explicit →
   `com.akdagbaris.sandboxtitanic` → Continue → Register.
   "Kullanımda" derse başka bir şey seç (ör. `com.akdagbaris.sandboxtitanic2`) ve
   bunu bana söyle, depodaki `capacitor.config.json` ve iOS projesinde de değişmesi gerekiyor.

### 3b. Uygulama kaydı

1. https://appstoreconnect.apple.com → **Apps (Uygulamalar)** → `+` → **New App**.
2. **Platform**: iOS, **Name**: Sand Box Titanic (doluysa ör. "Sand Box Titanic: Ship Sandbox"),
   **Primary Language**: English, **Bundle ID**: listeden az önce kaydettiğin,
   **SKU**: `sbt-001`, **User Access**: Full Access → Create.

### 3c. API anahtarı (GitHub'ın senin adına yükleme yapabilmesi için)

1. App Store Connect → **Users and Access** → **Integrations** sekmesi →
   **App Store Connect API** → **Team Keys**.
   (İlk seferde "Request Access" çıkarsa kabul et.)
2. `+` → Name: `GitHub`, **Access: Admin** → Generate.
   Admin gerekli: GitHub'ın Mac'i imzalama sertifikasını senin adına oluşturacak.
3. Açılan listede not al:
   - **Issuer ID** (sayfanın üstünde, uzun bir kod)
   - **Key ID** (anahtarın satırında, 10 karakter)
4. **Download** ile `AuthKey_XXXXXXXXXX.p8` dosyasını indir.
   **Bu dosya sadece bir kez indirilebilir**, güvenli bir yerde sakla, kimseyle paylaşma.

---

## 4. Bilgileri GitHub'a gizli anahtar olarak gir

1. https://github.com/akdagbaris-cmd/sand-box-titanic/settings/secrets/actions
2. **New repository secret** ile şu dördünü tek tek ekle:

| Name | Değer |
|---|---|
| `APPLE_TEAM_ID` | 2. adımdaki Team ID |
| `ASC_KEY_ID` | 3c'deki Key ID |
| `ASC_ISSUER_ID` | 3c'deki Issuer ID |
| `ASC_KEY_P8` | `.p8` dosyasını **Not Defteri** ile aç, `-----BEGIN PRIVATE KEY-----` satırından `-----END PRIVATE KEY-----` satırına kadar hepsini kopyala yapıştır |

Gizli anahtarlar depo herkese açık olsa bile kimseye görünmez.

---

## 5. Derle ve TestFlight'a yükle (tek tık)

1. (Bu PR birleştirilmiş olmalı; iş akışı ancak `main` dalında görünür.)
   https://github.com/akdagbaris-cmd/sand-box-titanic/actions → solda **iOS TestFlight**.
2. Sağda **Run workflow** →
   - **version**: `1.0` (ilk sürüm)
   - **kilit**: işaretsiz bırak (gizli kod ekranı App Store sürümünde kapalı olsun)
   → yeşil **Run workflow**.
3. 10-20 dakika sürer. Yeşil tik çıkınca build Apple'a gitmiş demektir.
   Kırmızı çarpı çıkarsa iş akışına tıkla, hatalı adımı aç; ekran görüntüsünü bana at.
4. 10-30 dakika sonra App Store Connect → uygulama → **TestFlight** sekmesinde görünür.
   Build numarası otomatik artar, elle bir şey yapman gerekmez.

### Gizli kod ekranı hakkında

Web sürümündeki 6 haneli gizli kod ekranı, **App Store sürümünde kapalı**.
Apple incelemecisi oyunu kodsuz açabilmeli; kodla kilitli bir uygulama büyük ihtimalle
"özel kullanım" diye reddedilir. Kod sadece iOS kopyasında kapanır; Bulut'un oynadığı
web sürümü aynen kalır. Sadece TestFlight ile aile içinde dağıtacaksan **kilit**
kutusunu işaretleyebilirsin.

---

## 6. TestFlight ile iPad'de dene

1. App Store Connect → uygulama → **TestFlight** → **Internal Testing** → `+` grup oluştur,
   kendini tester olarak ekle (Apple Kimliğin).
2. iPad'e App Store'dan **TestFlight** uygulamasını indir, aynı Apple Kimliğiyle gir,
   oyunu kur.
3. Kontrol listesi:
   - [ ] Oyun açılıyor, kod sormuyor
   - [ ] Gemiye dokunma, dümene geçme, batırma, dalış çalışıyor
   - [ ] Futuristic filo sayfası açılıyor ve geri dönülüyor
   - [ ] Uygulamayı kapatıp açınca kayıtlar duruyor
   - [ ] Bulut'un sesi (konuşma) çalışıyor
   - [ ] Ekranı döndürünce düzen bozulmuyor
   - [ ] Uçak modunda da açılıyor
4. Sorun çıkarsa bana yaz, düzeltelim; sonra 5. adımı tekrar çalıştır.

---

## 7. Mağaza sayfasını doldur

App Store Connect → uygulama → **App Store** sekmesi:

**Ekran görüntüleri** (zorunlu)
- iPhone 6.9" (yatay 2868×1320) ve iPad 13" (yatay 2752×2064), her biri için en az 1.
- Başlangıç için iki tane hazırladım (proje dosyalarında `app-store/ekran-goruntuleri/`).
- Daha fazlasını Windows'ta **Chrome** ile çekebilirsin: oyunu aç, `F12` → cihaz simgesi
  (Ctrl+Shift+M) → üstten **Dimensions: Responsive**, genişlik 1376, yükseklik 1032,
  "DPR" 2 seç → `Ctrl+Shift+P` → "Capture screenshot". Çıkan resim 2752×2064 olur (iPad).
  iPhone için 956×440, DPR 3.
- Öneri: harita, dümen başında, batış anı, enkaza dalış, Futuristic filo.

**Metinler**
- **Subtitle** (30 karakter): ör. "Sail, sink and dive to the wreck"
- **Description**: oyunda neler yapılabildiğini anlat (gemiyle gezme, batırma,
  filika, enkaza dalma, gemi tersanesi, 2D gemi kum havuzu, Bulut ile dolaşma).
- **Keywords** (100 karakter): ör. `ship,titanic,ocean,sandbox,boat,sink,dive,wreck,kids,sailing`
- **Support URL**: zorunlu. GitHub sayfası olabilir.
- **Privacy Policy URL**: zorunlu (aşağıya bak).

**Kategori ve yaş**
- **Category**: Games → Simulation (ikinci: Family veya Adventure)
- **Age Rating** anketini dürüst doldur; batan gemi sahneleri için
  "Cartoon or Fantasy Violence: Infrequent/Mild" uygun.

**Kids (Çocuklar) kategorisi**
- Zorunlu değil. Seçilirse Apple çok daha sıkı kurallar uygular (dış bağlantılar
  ebeveyn kapısı arkasında olmalı vb.). İlk sürümde normal **Games** kategorisi
  daha az sorun çıkarır.

**Gizlilik (App Privacy)**
- Oyun hiçbir veri toplamıyor, internete bağlanmıyor; kayıtlar sadece cihazda.
  Ankette **"Data Not Collected"** seç.
- Gizlilik politikası adresi yine de zorunlu. Kısa bir sayfa yeterli:
  > "Sand Box Titanic hiçbir kişisel veri toplamaz, paylaşmaz veya bir sunucuya
  > göndermez. Oyun ilerlemesi yalnızca cihazınızda saklanır."
  Google Sites, Notion ya da GitHub Pages'te yayınlayıp linkini yapıştır.

**Fiyat**: **Pricing and Availability** → Free (ücretsiz) ve ülkeler.

**App Review Information**: iletişim adı, telefon, e-posta; **Sign-in required**: hayır.

---

## 8. İncelemeye gönder

1. **Build** bölümünde TestFlight'taki build'i seç.
2. **Add for Review → Submit**. İnceleme genelde 1-3 gün sürer.

**En büyük risk: Kural 4.2 "Minimum işlevsellik".** Apple, sadece bir web sitesini
paketleyen uygulamaları reddeder. Bu oyun tamamen uygulamanın içinde, çevrimdışı çalışan
3D bir oyun; bunu incelemeciye **Notes** alanında anlat:

> Sand Box Titanic is a fully offline 3D ship sandbox game built with WebGL.
> All game content (3D models, fonts) is bundled in the app; it does not load
> any website and needs no internet connection or login. Players can sail ships on a
> map, take the wheel, sink ships with icebergs, launch lifeboats, dive to the 3D wreck,
> build their own ship in the Shipyard and play a 2D soft-body ship sandbox.

**Diğer dikkat edilecekler**
- **Kural 5.2 (Fikri mülkiyet)**: "Titanic" tarihi bir gemi adı, sorun değil. Film afişi,
  film müziği veya başka bir oyunun görselleri olmamalı. 3D modellerin lisansının
  ticari kullanıma izin verdiğinden emin ol.
- **Kural 2.1 (Eksiksizlik)**: çöken ya da boş kalan düğme olmasın.
- Ret gelirse: **Resolution Center**'da sebebi yazar; düzeltip tekrar gönderirsin.

---

## 9. Sonradan güncelleme yapmak

1. Oyunda değişikliği yap ve `main` dalına birleştir.
2. GitHub → Actions → **iOS TestFlight** → **Run workflow**, **version**'ı artır (ör. `1.1`).
3. App Store Connect'te `+ Version` → aynı sürüm numarası → "What's New" yaz →
   yeni build'i seç → incelemeye gönder.

---

## Depodaki dosyalar ne işe yarıyor?

| Dosya | Görevi |
|---|---|
| `.github/workflows/ios-testflight.yml` | GitHub'ın Mac'inde derleyip TestFlight'a yükler |
| `package.json` | Capacitor bağımlılıkları ve `npm run ios:sync` komutu |
| `capacitor.config.json` | Uygulama kimliği (`appId`), adı, arka plan rengi |
| `scripts/build-www.mjs` | Oyun dosyalarını `www/` klasörüne kopyalar, iOS kopyasında kod ekranını kapatır |
| `ios/` | Xcode projesi (ikon, açılış ekranı, Info.plist) |

İleride bir Mac'e erişirsen: `npm install`, `npm run ios` ile proje Xcode'da da açılır.
