Base url:http://127.0.0.1:8000
chat endpoint:/chat/chat
request body:{
    "user_id": "string",
    "message": "message"
}

Response body:{
  "intent": "chat",
  "answer": "Salom! Men Ziyodaman, sizga Venu.uz do'konidagi mahsulotlar bo'yicha yordam bera olaman. Sizga qanday yordam kerak?",
  "products": [],
  "category_id": null,
  "price_max": null,
  "search": null,
  "search_products": [],
  "category_products": [],
  "history": [
    {
      "role": "user",
      "content": "Sen odam emassan"
    }
  ]
}