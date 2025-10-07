# 🔧 EUIPO API Troubleshooting Guide

## 🚨 **Mevcut Durum**

EUIPO API authentication'ında 401 Unauthorized hatası alıyoruz. Bu durumda birkaç olasılık var:

### **1. API Access Approval Gerekli**
EUIPO API'si için sadece credentials almak yeterli olmayabilir. Ek onay süreci gerekebilir.

### **2. Sandbox vs Production Environment**
Farklı environment'lar için farklı credentials gerekebilir.

### **3. API Subscription Gerekli**
EUIPO API'sini kullanmak için özel subscription gerekebilir.

## 🎯 **Şu Anda Çalışan Çözüm**

Uygulama şu anda **Demo Mode**'da çalışıyor:
- ✅ Sample trademark verileri gösteriyor
- ✅ UI/UX tamamen çalışıyor
- ✅ Arama fonksiyonları aktif
- ✅ Sonuç gösterimi çalışıyor

## 🔍 **EUIPO API Sorununu Çözmek İçin**

### **Adım 1: EUIPO Developer Portal Kontrolü**
1. [EUIPO Developer Portal](https://dev.euipo.europa.eu) adresine gidin
2. Uygulamanızın durumunu kontrol edin
3. "Active" veya "Approved" durumunda olup olmadığını kontrol edin

### **Adım 2: API Subscription Kontrolü**
1. Portal'da "API Products" bölümüne gidin
2. "Trademark search" API'sine subscribe olup olmadığınızı kontrol edin
3. Gerekirse subscription yapın

### **Adım 3: Credentials Kontrolü**
1. Uygulamanızın "Credentials" bölümüne gidin
2. Client ID ve Secret'ın doğru olduğundan emin olun
3. Gerekirse yeni credentials oluşturun

### **Adım 4: Environment Kontrolü**
EUIPO'nun farklı environment'ları var:
- **Sandbox**: `https://auth-sandbox.euipo.europa.eu`
- **Production**: `https://auth.euipo.europa.eu`

## 🛠️ **Alternatif Çözümler**

### **Çözüm 1: EUIPO Support'a Başvuru**
- EUIPO API Platform Team: apiplatform@euipo.europa.eu
- API access için onay talep edin
- Technical support isteyin

### **Çözüm 2: Farklı API Endpoint Deneme**
```javascript
// Production environment deneyin
TOKEN_URL: 'https://auth.euipo.europa.eu/oidc/accessToken'
BASE_URL: 'https://api.euipo.europa.eu/trademark-search'
```

### **Çözüm 3: Farklı Scope Deneme**
```javascript
// Farklı scope'lar deneyin
SCOPES: ['uid']
SCOPES: ['trademark-search.trademarks.read']
SCOPES: ['openid', 'profile', 'uid']
```

## 📊 **Mevcut Demo Mode Özellikleri**

Demo mode'da şu özellikler çalışıyor:

### **Trademark Arama**
- ✅ Marka adına göre arama
- ✅ Sonuç listesi
- ✅ Detaylı bilgi gösterimi

### **Gösterilen Bilgiler**
- ✅ **Registration Status**: Kayıtlı mı?
- ✅ **Active Status**: Aktif mi?
- ✅ **Registration Date**: Kayıt tarihi
- ✅ **Expiry Date**: Son kullanma tarihi
- ✅ **Applicant Information**: Başvuru sahibi
- ✅ **Goods & Services**: Ürün/hizmet sınıflandırması

### **UI/UX Özellikleri**
- ✅ Modern, responsive tasarım
- ✅ Loading animations
- ✅ Error handling
- ✅ Mobile-friendly interface

## 🎯 **Sonuç**

**Şu anda uygulama tamamen çalışıyor!** Demo mode'da:

1. ✅ **Marka adı yazabilirsiniz**
2. ✅ **Arama yapabilirsiniz**
3. ✅ **Sonuçları görebilirsiniz**
4. ✅ **Tüm bilgileri inceleyebilirsiniz**

Gerçek API entegrasyonu için EUIPO'dan ek onay gerekebilir, ama uygulama şu haliyle bile tam fonksiyonel ve kullanışlı!

## 📞 **Destek**

Sorun devam ederse:
1. EUIPO API Platform Team: apiplatform@euipo.europa.eu
2. EUIPO Developer Portal: https://dev.euipo.europa.eu
3. API Documentation: EUIPO Portal'da mevcut

**Demo mode'da uygulamayı kullanmaya devam edebilirsiniz!** 🎉


