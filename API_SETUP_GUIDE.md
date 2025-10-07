# EUIPO API Setup Guide

Bu rehber, gerçek EUIPO API'sini kullanarak trademark araması yapmak için gerekli adımları açıklar.

## 🔑 API Credentials Alma

### 1. EUIPO Developer Portal'a Kayıt Olun
- [EUIPO Developer Portal](https://dev.euipo.europa.eu) adresine gidin
- "Create account" butonuna tıklayın
- Gerekli bilgileri doldurarak hesap oluşturun

### 2. Application Kaydı
- Portal'da "Create application" seçeneğini bulun
- Application bilgilerini doldurun:
  - **Application Name**: UK Trademark Search
  - **Description**: Trademark search application
  - **Redirect URI**: `http://localhost` (development için)

### 3. Credentials Alma
- Application oluşturduktan sonra:
  - **Client ID**'yi kopyalayın
  - **Client Secret**'i kopyalayın
  - Bu bilgileri güvenli bir yerde saklayın

## 🚀 Uygulamayı Kullanma

### 1. Uygulamayı Açın
- `index.html` dosyasını web tarayıcınızda açın

### 2. API Credentials Girin
- Açılan modal'da:
  - **Client ID**'nizi girin
  - **Client Secret**'inizi girin
  - "Save & Continue" butonuna tıklayın

### 3. Trademark Arama
- Arama kutusuna marka adını yazın (örn: "Apple", "Nike")
- "Search" butonuna tıklayın
- Gerçek EUIPO veritabanından sonuçları görün

## 🔍 API Endpoints

Uygulama şu EUIPO API endpoint'lerini kullanır:

### Search Endpoint
```
GET https://api.euipo.europa.eu/trademark-search/trademarks
```

**Parameters:**
- `query`: RSQL formatında arama sorgusu
- `size`: Sayfa başına sonuç sayısı (10-100)
- `page`: Sayfa numarası (0'dan başlar)
- `sort`: Sıralama kriteri

**Example Query:**
```
wordMarkSpecification.verbalElement==*Apple*
```

### Authentication
- **OAuth2 Client Credentials Flow** kullanılır
- Token URL: `https://euipo.europa.eu/cas-server-webapp/oidc/accessToken`
- Scope: `uid`

## 📊 RSQL Query Syntax

EUIPO API, RSQL (RESTful Service Query Language) kullanır:

### Temel Operatörler
- `==`: Eşittir
- `!=`: Eşit değildir
- `=in=`: İçinde
- `=out=`: Dışında
- `=all=`: Hepsi içinde
- `>`, `>=`, `<`, `<=`: Karşılaştırma

### Örnek Sorgular

**Marka adına göre arama:**
```
wordMarkSpecification.verbalElement==*Apple*
```

**Duruma göre arama:**
```
status==REGISTERED
```

**Tarih aralığına göre arama:**
```
applicationDate>=2020-01-01 and applicationDate<=2023-12-31
```

**Nice sınıfına göre arama:**
```
niceClasses=in=(25,26,28)
```

**Karmaşık sorgu:**
```
wordMarkSpecification.verbalElement==*Nike* and status==REGISTERED and niceClasses=in=(25,26)
```

## 🛠️ Troubleshooting

### Yaygın Hatalar

**401 Unauthorized:**
- Client ID ve Client Secret'ı kontrol edin
- Credentials'ların doğru olduğundan emin olun

**429 Rate Limit Exceeded:**
- Çok fazla istek gönderdiniz
- Birkaç dakika bekleyin

**Network Error:**
- İnternet bağlantınızı kontrol edin
- EUIPO API'sinin erişilebilir olduğundan emin olun

### Demo Mode
API credentials'larınız yoksa veya API erişiminde sorun yaşıyorsanız:
- "Use Demo Mode" butonuna tıklayın
- Örnek verilerle uygulamayı test edin

## 📝 API Response Format

### Search Response
```json
{
  "trademarks": [
    {
      "applicationNumber": "018692868",
      "applicationDate": "2020-03-15",
      "registrationDate": "2021-06-20",
      "expiryDate": "2031-06-20",
      "status": "REGISTERED",
      "markFeature": "WORD",
      "wordMarkSpecification": {
        "verbalElement": "APPLE"
      },
      "applicants": [
        {
          "name": "Apple Inc.",
          "identifier": "12345678"
        }
      ],
      "goodsAndServices": [
        {
          "classNumber": 9,
          "description": "Computer software and hardware"
        }
      ]
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "page": 0,
  "size": 20
}
```

## 🔒 Güvenlik

- Client Secret'ınızı asla paylaşmayın
- Credentials'ları güvenli bir yerde saklayın
- Production ortamında HTTPS kullanın
- Rate limit'lere dikkat edin

## 📞 Destek

- **EUIPO API Documentation**: [https://dev.euipo.europa.eu](https://dev.euipo.europa.eu)
- **API Platform Team**: apiplatform@euipo.europa.eu
- **Technical Support**: EUIPO Developer Portal üzerinden

## 🎯 Sonuç

Bu rehberi takip ederek gerçek EUIPO trademark veritabanından arama yapabilirsiniz. Uygulama, marka adını girdiğinizde:

1. ✅ **UK'de kayıtlı olup olmadığını** gösterir
2. ✅ **Aktif bir marka olup olmadığını** belirtir  
3. ✅ **Ne zaman kaydedildiğini** tarih olarak verir
4. ✅ **Ek detayları** (başvuru sahibi, sınıflandırma, vb.) gösterir

Gerçek verilerle çalışmak için yukarıdaki adımları takip edin!
