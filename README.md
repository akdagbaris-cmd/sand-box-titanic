# Sand Box Titanic

Tarayıcıda çalışan, çocuklara uygun bir gemi oyunu. Haritada gemilerle yelken aç, dümene geç, gemileri batır, filikaları indir, sonra dalıp batığı 3D olarak keşfet. İnternet olmadan da çalışır ve telefona uygulama gibi kurulabilir.

## Oyunda neler var

- **Harita ve gemiler:** Haritadan bir gemi seç, *Sail* ile yola çıkar, *Take the wheel* ile dümene geç. Hızı (*Full ahead*, *Slow*, *Stop*), yönü ve kornayı (*Horn*) sen yönetirsin.
- **Batırma:** *Make a hole* ile delik aç, *Iceberg* ile buzdağı gönder ya da *Rocket* at. *Lifeboats* ile filikaları indir, *Fix the ship* ile gemiyi onar.
- **Batığa dalış:** Batan geminin yerine *Dive to the wreck* ile dal. Batık, gerçekten batırdığın gemiyle aynıdır. *Swim to the surface* ile yüzeye çık.
- **Bulut ile gezinti:** Avatar Bulut olarak gemide dolaş, odalara gir, insanlarla konuş (*Talk to someone*), dans et, şarkı söyle, yemek ye, uyu.
- **Ship Sandbox:** 2D yumuşak gövdeli gemi kum havuzu. Gemiler yüzer, kaçar, yangın çıkar; fırtına, gece, dalga ve savaş gemisi ekleyebilirsin.
- **Shipyard (tersane):** Kendi gemini yap. Sürükleyerek uzat, iki parmakla büyüt.
- **Futuristic Fleet:** Neon renkli gelecek gemileri vitrini (`futuristic.html`, oyunda *Futuristic* ve *✨ Fleet* düğmeleri).

Ses için tarayıcının konuşma özelliği kullanılır. Oyunun kaydı (gemiler, avatar, ayarlar) tarayıcının yerel deposunda (localStorage) tutulur; başka cihaza taşınmaz.

## Nasıl oynanır

1. Oyunu aç (aşağıdaki yollardan biriyle).
2. Haritada bir gemiye dokun, *Sail* ile yola çıkar.
3. Gemiyi kendin sürmek için *Take the wheel*, içine bakmak için *Look inside* veya *X-ray*.
4. Batırmak için *Sink it!*, *Make a hole*, *Iceberg* ya da *Rocket*.
5. Battıktan sonra *Dive to the wreck* ile batığa dal.

Fare ve klavyeyle de, dokunmatik ekranla da oynanır.

## Bilgisayarda çalıştırma

Derleme adımı yok, her şey hazır dosyalar. Ama oyunu bir yerel sunucuyla açmak gerekir: dosyaya çift tıklayınca (`file://`) çevrimdışı önbellek çalışmaz.

Depoyu indir ve klasörde bir sunucu başlat:

```bash
git clone https://github.com/akdagbaris-cmd/sand-box-titanic.git
cd sand-box-titanic
python3 -m http.server 8000
```

Sonra tarayıcıda <http://localhost:8000> adresini aç.

Python yoksa Node ile de olur: `npx serve .`

## GitHub Pages'te yayınlama

1. GitHub'da depoyu aç: **Settings → Pages**.
2. **Source** olarak *Deploy from a branch* seç.
3. **Branch** olarak `main` ve klasör olarak `/ (root)` seç, **Save**'e bas.
4. Bir iki dakika sonra oyun şu adreste açılır:
   <https://akdagbaris-cmd.github.io/sand-box-titanic/>

`main` dalına her gönderimden sonra site kendiliğinden güncellenir.

## Uygulama gibi kurma ve çevrimdışı oynama

Oyun bir PWA'dır (`manifest.webmanifest` + `sw.js`). İlk açılışta tüm dosyalar önbelleğe alınır, sonra internet olmadan da açılır.

- **iPhone / iPad (Safari):** Paylaş düğmesi → *Ana Ekrana Ekle*.
- **Android (Chrome):** Menü → *Uygulamayı yükle*.
- **Bilgisayar (Chrome / Edge):** Adres çubuğundaki *Yükle* simgesi.

## Önbellek sürümü (yeni sürüm yayınlarken)

`sw.js` içindeki `VERSION`, önbelleğe alınan oyun dosyalarının parmak izidir. Bir dosya değişince `VERSION` da değişir; tarayıcı yeni service worker'ı kurar, her şeyi yeniden indirir ve eski önbelleği siler. Oyuncu yeni sürümü bir sonraki açılışta görür.

- **Yayından önce:** `./tools/bump-sw-version.sh` çalıştır ve değişen `sw.js`'i de gönder. Sadece kontrol etmek için: `./tools/bump-sw-version.sh --check`.
- **Unutursan:** `.github/workflows/sw-version.yml` her pull request'te ve `main`'e her gönderimde kontrol yapar; sürüm eskiyse kırmızı yanar.

Önbelleğe yeni bir dosya eklemek istersen, onu `sw.js` içindeki `CORE` listesine yaz. Betik o listedeki dosyaların hepsini hesaba katar.

## Dosyalar

| Dosya | Ne işe yarar |
| --- | --- |
| `index.html` | Oyunun tamamı: kod ve 3D modeller (base64 GLB) tek dosyada |
| `futuristic.html` | Futuristic Fleet vitrin sayfası |
| `Sand Box Titanic.html` | Ana sayfaya yönlendiren kısayol |
| `sw.js` | Çevrimdışı önbellek (service worker) |
| `manifest.webmanifest` | Uygulama adı, renkleri ve simgeleri |
| `assets/` | three.js ve yazı tipleri |
| `icons/` | Uygulama simgeleri |
| `tools/bump-sw-version.sh` | Önbellek sürümünü günceller |
