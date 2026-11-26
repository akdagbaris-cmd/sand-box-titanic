# Sand Box Titanic'i App Store'da yayınlama rehberi

Bu rehber, oyunu iPhone ve iPad için App Store'a çıkarmanın adımlarını sırayla anlatır.
Depodaki hazırlık işi bitti: oyun **Capacitor** ile bir iOS uygulamasına sarıldı
(`ios/` klasörü), ikon ve açılış ekranı hazır. Geriye senin elinle yapılması gereken
adımlar kalıyor: Apple hesabı, Mac ve Xcode, imzalama ve mağaza sayfası.

> Kısa özet: Apple Developer hesabı aç → Mac'e Xcode kur → depoyu indir, `npm install`
> ve `npm run ios` → Xcode'da takımını seç, telefonda dene → Archive ile yükle →
> TestFlight'ta dene → App Store Connect'te sayfayı doldur → incelemeye gönder.

---

## 0. Neler gerekiyor?

| Gereken | Neden | Not |
|---|---|---|
| **Mac** (macOS'un güncel sürümü) | iOS uygulaması sadece Xcode ile derlenip yüklenebilir | Mac yoksa kiralık bulut Mac (ör. MacinCloud) da olur |
| **Xcode** (Mac App Store'dan, ücretsiz) | Derleme, imzalama, yükleme | Apple'ın istediği en güncel Xcode sürümünü kullan |
| **Node.js 22 veya üstü** | Capacitor komutları için | https://nodejs.org |
| **Apple Developer Program üyeliği** | App Store'a yüklemek için şart | Yıllık 99 USD (Türkiye'de TL karşılığı) |
| **iPhone veya iPad** (isteğe bağlı ama önerilir) | Gerçek cihazda deneme | |

---

## 1. Apple Developer hesabını aç (senin adımın)

1. https://developer.apple.com/programs/enroll/ adresine git, Apple Kimliğinle gir.
   Apple Kimliğinde **iki adımlı doğrulama** açık olmalı.
2. **Bireysel (Individual)** üyelik seç. Şirketin yoksa en kolayı bu; mağazada
   satıcı adı olarak kendi adın görünür. Şirket adıyla çıkmak istersen
   **Organization** seç; bunun için D-U-N-S numarası gerekir ve birkaç hafta sürebilir.
3. 99 USD'yi öde. Onay genelde 1-2 gün sürer, e-postayla gelir.
4. Onay gelince https://appstoreconnect.apple.com adresine girebildiğini kontrol et.
5. Oyun ücretsiz olacaksa vergi ve banka bilgisi gerekmez. Ücretli olacaksa
   App Store Connect → **Business** (Anlaşmalar, Vergi ve Bankacılık) bölümünü doldur.

---

## 2. Mac'i hazırla

1. Mac App Store'dan **Xcode**'u kur, bir kez aç, ek bileşenleri yüklemesine izin ver.
2. Xcode → **Settings → Accounts** → `+` → Apple ID ile giriş yap.
   Takım (Team) olarak geliştirici hesabın görünmeli.
3. Terminal'de Node kurulu mu bak: `node -v` (22 veya üstü olmalı).

CocoaPods kurmana **gerek yok**: proje Swift Package Manager kullanıyor, Xcode
paketleri kendisi indiriyor.

---

## 3. Projeyi indir ve iOS projesini aç

Terminal'de:

```bash
git clone https://github.com/akdagbaris-cmd/sand-box-titanic.git
cd sand-box-titanic
npm install
npm run ios
```

`npm run ios` üç şey yapar:

1. Oyun dosyalarını `www/` klasörüne kopyalar (`scripts/build-www.mjs`).
2. Bunları iOS projesinin içine aktarır (`npx cap sync ios`).
3. Projeyi Xcode'da açar.

**Oyunda bir şeyi her değiştirdiğinde** (index.html, modeller vb.) yeniden
`npm run ios:sync` çalıştır, sonra Xcode'da tekrar derle.

### Gizli kod ekranı hakkında

Web sürümündeki 6 haneli gizli kod ekranı, **App Store sürümünde otomatik kapalı**.
Sebebi: Apple incelemecisi oyunu kodsuz açabilmeli, mağazadan indiren biri de
kodu bilemez. Kod sadece iOS kopyasında kapanır; web sürümü aynen kalır.
Kodu iOS'ta da açık tutmak istersen: `KILIT=1 npm run ios:sync`
(o zaman App Store yerine sadece TestFlight ile dağıtmak daha doğru olur, bkz. 9. adım).

---

## 4. Xcode'da imzalama ayarları

1. Sol panelde **App** projesini, sonra **App** hedefini (target) seç.
2. **Signing & Capabilities** sekmesi:
   - **Automatically manage signing** işaretli olsun.
   - **Team**: kendi geliştirici hesabını seç.
   - **Bundle Identifier**: `com.akdagbaris.sandboxtitanic`
     Bu kimlik dünyada benzersiz olmalı. Xcode "kullanımda" derse değiştir, örneğin
     `com.akdagbaris.sandboxtitanic2`. Değiştirirsen `capacitor.config.json`
     içindeki `appId`'yi de aynı yap.
3. **General** sekmesi:
   - **Display Name**: Sand Box Titanic (ana ekranda görünen ad)
   - **Version**: 1.0 (mağazada görünen sürüm)
   - **Build**: 1 (her yeni yüklemede 1 artır: 2, 3, 4...)
   - **Minimum Deployments**: iOS 15.0

Proje ayarlarında zaten hazır olanlar:

- Uygulama ikonu (1024×1024, saydamlıksız) ve lacivert açılış ekranı
- `ITSAppUsesNonExemptEncryption = NO` (şifreleme sorusunu her yüklemede sormasın diye)
- iPhone ve iPad desteği, dikey ve yatay ekran
- Oyun internet istemiyor; her şey uygulamanın içinde, çevrimdışı çalışır

---

## 5. Önce simülatörde, sonra telefonda dene

1. Xcode'un üst çubuğundan bir simülatör seç (ör. iPhone 16), ▶ (Run) bas.
2. Telefonu kabloyla bağla, üst çubuktan telefonu seç, ▶ bas.
   - İlk seferde telefonda **Ayarlar → Gizlilik ve Güvenlik → Geliştirici Modu**'nu
     açman istenebilir.
3. Kontrol listesi:
   - [ ] Oyun açılıyor, kod sormuyor
   - [ ] Gemiye dokunma, dümene geçme, batırma, dalış çalışıyor
   - [ ] Futuristic filo sayfası açılıyor ve geri dönülüyor
   - [ ] Uygulamayı kapatıp açınca kayıtlar duruyor
   - [ ] Ses ve konuşma (Bulut'un sesi) çalışıyor
   - [ ] Telefonu yan çevirince düzen bozulmuyor
   - [ ] iPad'de de düzgün görünüyor (Apple iPad'de de test eder)
   - [ ] Uçak modunda da açılıyor

---

## 6. App Store Connect'te uygulama kaydı oluştur

1. https://appstoreconnect.apple.com → **Apps (Uygulamalar)** → `+` → **New App**.
2. Doldur:
   - **Platform**: iOS
   - **Name**: Sand Box Titanic (mağazada benzersiz olmalı; doluysa ör. "Sand Box Titanic: Ship Sandbox")
   - **Primary Language**: English (oyun İngilizce) veya Türkçe
   - **Bundle ID**: listeden `com.akdagbaris.sandboxtitanic` seç
     (görünmüyorsa önce 7. adımda bir kez yükle ya da
     developer.apple.com → Identifiers'dan elle ekle)
   - **SKU**: kendine özel bir kod, ör. `sbt-001`
   - **User Access**: Full Access

---

## 7. Uygulamayı yükle (Archive)

1. Xcode üst çubuğunda cihaz olarak **Any iOS Device (arm64)** seç.
2. Menü: **Product → Archive**. Bitince **Organizer** penceresi açılır.
3. **Distribute App → App Store Connect → Upload** → varsayılanlarla devam et.
4. 10-30 dakika içinde build App Store Connect'te **TestFlight** sekmesinde görünür.

Hata alırsan en sık sebepler: Build numarası artırılmamış, Team seçilmemiş,
Bundle ID App Store Connect'tekiyle aynı değil.

---

## 8. TestFlight ile dene

1. App Store Connect → uygulama → **TestFlight**.
2. **Internal Testing** → kendini (ve aileden birini) tester olarak ekle.
3. Telefona **TestFlight** uygulamasını indir, davet e-postasındaki bağlantıyla oyunu kur.
4. Birkaç gün oynat, sorun çıkarsa düzelt, Build numarasını artırıp tekrar yükle.

---

## 9. Mağaza sayfasını doldur

App Store Connect → uygulama → **App Store** sekmesi:

**Ekran görüntüleri** (zorunlu)
- iPhone 6.9" (1320×2868 veya yatay 2868×1320): en az 1, en fazla 10
- iPad 13" (2064×2752 veya yatay 2752×2064): iPad destekleniyorsa zorunlu
- En kolay yol: Xcode simülatöründe iPhone 16 Pro Max ve iPad Pro 13" aç,
  oyunun en güzel anlarında `Cmd + S` ile ekran görüntüsü al.
- Öneri: harita görünümü, dümen başında, batış anı, dalış/enkaz, Futuristic filo.

**Metinler**
- **Subtitle** (30 karakter): ör. "Sail, sink and dive to the wreck"
- **Description**: oyunda neler yapılabildiğini anlat (gemiyle gezme, batırma,
  filika, enkaza dalma, gemi tersanesi, 2D gemi kum havuzu, Bulut ile dolaşma).
- **Keywords** (100 karakter, virgülle): ör. `ship,titanic,ocean,sandbox,boat,sink,dive,wreck,kids,sailing`
- **Support URL**: zorunlu. Basitçe GitHub sayfası ya da bir iletişim sayfası olur.
- **Privacy Policy URL**: zorunlu (aşağıya bak).

**Kategori ve yaş**
- **Category**: Games → Simulation (ikinci: Family veya Adventure)
- **Age Rating** anketini doğru doldur. Batan gemi, filika gibi sahneler için
  "Cartoon or Fantasy Violence: Infrequent/Mild" demek dürüst olur.

**Kids (Çocuklar) kategorisi** — dikkat
- Oyunu **Kids kategorisine** koymak zorunlu değil. Koyarsan Apple çok daha sıkı
  kurallar uygular (dış bağlantılar ve satın almalar ebeveyn kapısı arkasında olmalı,
  reklam/analitik kısıtlı). Oyunda bunlar olmadığı için uygun olabilir, ama ilk sürümde
  normal **Games** kategorisi daha az sorun çıkarır. Sonra Kids'e geçilebilir.

**Gizlilik (App Privacy)**
- Oyun hiçbir veri toplamıyor, internete bağlanmıyor; kayıtlar sadece cihazda.
  Bu yüzden ankette **"Data Not Collected"** seçilir.
- Yine de bir **gizlilik politikası adresi** zorunlu. Kısa bir sayfa yeterli, örneğin:
  > "Sand Box Titanic hiçbir kişisel veri toplamaz, paylaşmaz veya bir sunucuya
  > göndermez. Oyun ilerlemesi yalnızca cihazınızda saklanır."
  Bunu GitHub Pages, Google Sites ya da Notion'da yayınlayıp bağlantısını yapıştırabilirsin.

**Fiyat**
- **Pricing and Availability** → Ücretsiz (Free) ya da bir fiyat. Ülkeleri seç.

**App Review Information**
- İletişim adı, telefon, e-posta (Apple incelemecisi sorun olursa bunlara yazar).
- **Sign-in required**: hayır (kod ekranı kapalı).
- **Notes** alanına kısa bir açıklama yaz (aşağıdaki 10. adıma bak).

---

## 10. İncelemeye gönder ve ret risklerini azalt

1. **Build** bölümünde TestFlight'a yüklediğin build'i seç.
2. **Add for Review → Submit**. İnceleme genelde 1-3 gün sürer.

**En büyük risk: Kural 4.2 "Minimum işlevsellik".** Apple, sadece bir web sitesini
paketleyen uygulamaları reddeder. Bu oyun tamamen uygulamanın içinde, çevrimdışı
çalışan zengin bir 3D oyun olduğu için şansı iyi, ama incelemeciye bunu anlat.
**Notes** alanı için örnek:

> Sand Box Titanic is a fully offline 3D ship sandbox game built with WebGL.
> All game content (3D models, sounds, fonts) is bundled in the app; it does not load
> any website and needs no internet connection or login. Players can sail ships on a
> map, take the wheel, sink ships with icebergs, launch lifeboats, dive to the 3D wreck,
> build their own ship in the Shipyard and play a 2D soft-body ship sandbox.

**Diğer dikkat edilecekler**
- **Kural 5.2 (Fikri mülkiyet)**: "Titanic" gerçek bir tarihi gemi adı, tek başına sorun
  değil. Ama film afişi, film müziği, başka bir oyunun görselleri veya marka logoları
  kullanılmamalı. Oyundaki 3D modellerin ve seslerin lisansının ticari kullanıma
  (App Store'a) izin verdiğinden emin ol; kaynağını not et.
- **Kural 2.1 (Eksiksizlik)**: çöken, boş kalan veya "yakında" yazan düğme olmasın.
- **Kural 1.3 / Kids**: Kids kategorisi seçilirse dış bağlantılar ebeveyn kapısı ister.
- Ret gelirse panik yok: App Store Connect'teki **Resolution Center**'da sebebi yazar,
  düzeltip ya da açıklama yazıp tekrar gönderirsin.

---

## 11. Yayından sonra güncelleme yapmak

1. Oyunda değişikliği yap.
2. `npm run ios:sync`
3. Xcode → General → **Version**'ı artır (ör. 1.0 → 1.1) ve **Build**'i artır.
4. **Product → Archive → Upload** (7. adım).
5. App Store Connect'te `+ Version` ile yeni sürüm aç, "What's New" yaz, build'i seç,
   incelemeye gönder.

---

## Depodaki dosyalar ne işe yarıyor?

| Dosya | Görevi |
|---|---|
| `package.json` | Capacitor bağımlılıkları ve `npm run ios` komutları |
| `capacitor.config.json` | Uygulama kimliği (`appId`), adı, arka plan rengi |
| `scripts/build-www.mjs` | Oyun dosyalarını `www/` klasörüne kopyalar, iOS kopyasında kod ekranını kapatır |
| `ios/` | Xcode projesi (ikon, açılış ekranı, Info.plist burada) |
| `ios/App/App/Assets.xcassets/AppIcon.appiconset/` | Uygulama ikonu (1024×1024) |
| `ios/App/App/Assets.xcassets/Splash.imageset/` | Açılış ekranı görseli |

`www/` ve `node_modules/` git'e eklenmez; her bilgisayarda `npm install` ve
`npm run ios:sync` ile yeniden oluşur.
