Dosyalar
- quiz_questions.json : 25 soru + trait tabanlı puanlama modeli
- quiz_characters.json: 60 karakterlik sonuç havuzu (traits + result_blurb_tr)

Skorlama önerisi (özet)
1) Kullanıcının trait skorları 0-10 aralığında toplanır (baseline 5).
2) Her karakterin traits vektörü ile Manhattan mesafesi hesaplanır.
3) En düşük mesafe = en iyi eşleşme. Beraberlikte tie_breakers: resilience, logic, integrity.
4) Sonuç ekranında:
   - En iyi 1 karakter: ana sonuç
   - Sonraki 2 karakter: "yakın eşleşme" olarak gösterilebilir.

Not
- image_search_hint alanı görsel bulma/thumbnail araması için yardımcı ipucu.
