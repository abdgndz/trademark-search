# 🚀 UK Trademark Search - Kurulum Talimatları

Bu rehber, EUIPO API'sini kullanarak gerçek trademark araması yapmak için gerekli adımları açıklar.

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- NPM (Node Package Manager)
- Modern web tarayıcısı

## 🔧 Kurulum Adımları

### 1. Dependencies Yükleme

Terminal/Command Prompt'ta proje klasörüne gidin ve şu komutu çalıştırın:

```bash
npm install
```

Bu komut şu paketleri yükleyecek:
- `express` - Web server
- `cors` - CORS desteği
- `node-fetch` - HTTP istekleri
- `nodemon` - Development için

### 2. Proxy Server'ı Başlatma

```bash
npm start
```

Veya development mode için:

```bash
npm run dev
```

Server başladığında şu mesajı göreceksiniz:
```
Proxy server running on http://localhost:3001
Available endpoints:
  POST /api/oauth/token - OAuth token endpoint
  GET  /api/trademarks - Trademark search endpoint
  GET  /health - Health check
```

### 3. Web Uygulamasını Açma

1. `index.html` dosyasını web tarayıcınızda açın
2. Uygulama otomatik olarak API credentials'larını kullanarak authentication yapacak
3. Başarılı authentication sonrası trademark araması yapabilirsiniz

## 🔑 API Credentials

Uygulamada şu test credentials'ları kullanılmaktadır:
- **Client ID**: `2c56d859a94411ef9345025a8d2e9406`
- **Client Secret**: `e978eaf286e3d7c238f090b6ed005244`

## 🎯 Kullanım

### Trademark Arama
1. Arama kutusuna marka adını yazın (örn: "Apple", "Nike", "Coca-Cola")
2. "Search" butonuna tıklayın
3. Gerçek EUIPO veritabanından sonuçları görün

### Sonuçlar
Her trademark için şu bilgileri göreceksiniz:
- ✅ **Registration Status**: Kayıtlı mı?
- ✅ **Active Status**: Aktif mi?
- ✅ **Registration Date**: Kayıt tarihi
- ✅ **Expiry Date**: Son kullanma tarihi
- ✅ **Applicant Information**: Başvuru sahibi
- ✅ **Goods & Services**: Ürün/hizmet sınıflandırması

## 🛠️ Troubleshooting

### Proxy Server Çalışmıyor
```bash
# Port 3001'in kullanımda olup olmadığını kontrol edin
netstat -an | grep 3001

# Eğer port kullanımdaysa, farklı bir port kullanın
# proxy-server.js dosyasında PORT değişkenini değiştirin
```

### CORS Hatası
- Proxy server'ın çalıştığından emin olun
- Browser console'da hata mesajlarını kontrol edin

### Authentication Hatası
- API credentials'larının doğru olduğundan emin olun
- EUIPO API'sinin erişilebilir olduğunu kontrol edin

### Network Hatası
- İnternet bağlantınızı kontrol edin
- Firewall ayarlarınızı kontrol edin

## 📊 API Endpoints

### OAuth Token
```
POST http://localhost:3001/api/oauth/token
Content-Type: application/json

{
  "grant_type": "client_credentials",
  "client_id": "2c56d859a94411ef9345025a8d2e9406",
  "client_secret": "e978eaf286e3d7c238f090b6ed005244",
  "scope": "uid"
}
```

### Trademark Search
```
GET http://localhost:3001/api/trademarks?query=wordMarkSpecification.verbalElement==*Apple*&size=20&page=0&sort=applicationDate:desc&access_token=YOUR_TOKEN
```

## 🔍 RSQL Query Examples

### Marka Adına Göre Arama
```
wordMarkSpecification.verbalElement==*Apple*
```

### Duruma Göre Arama
```
status==REGISTERED
```

### Tarih Aralığına Göre Arama
```
applicationDate>=2020-01-01 and applicationDate<=2023-12-31
```

### Nice Sınıfına Göre Arama
```
niceClasses=in=(25,26,28)
```

## 🚨 Önemli Notlar

1. **Proxy Server**: CORS sorunlarını çözmek için proxy server kullanıyoruz
2. **Credentials**: Test credentials'ları kullanıyoruz, production'da kendi credentials'larınızı kullanın
3. **Rate Limiting**: EUIPO API'si rate limiting uygular, çok fazla istek göndermeyin
4. **HTTPS**: Production ortamında HTTPS kullanın

## 📞 Destek

Sorun yaşarsanız:
1. Browser console'da hata mesajlarını kontrol edin
2. Proxy server log'larını kontrol edin
3. Network tab'ında API isteklerini kontrol edin

## 🎉 Başarılı Kurulum

Kurulum başarılı olduğunda:
- Proxy server çalışıyor olacak
- Web uygulaması açılacak
- Otomatik authentication yapılacak
- Trademark araması yapabileceksiniz

**Artık gerçek EUIPO trademark veritabanından arama yapabilirsiniz!** 🎯


