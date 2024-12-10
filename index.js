export default {
  async fetch(request, env, ctx) {
    const TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"; // GET FROM BOTFATHER
    const API_KEY = "IMAGE_HOSTING_APIKEY"; // REFER TO README.MD
    const REQUEST_URL = "IMAGE_HOSTING_REQUESTURL"; // REFER TO README.MD

    if (request.method === 'POST') {
      try {
        const update = await request.json();
        
        if (update.message) {
          const message = update.message;
          
          if (message.text === '/start') {
            await sendTelegramMessage(TOKEN, message.chat.id, 
              "Hello, Please send me your Image that you want to Upload! You can send the image as file or plain compressed image."
            );
            return new Response('OK', { status: 200 });
          }
          if (message.photo) {
            const photo = message.photo[message.photo.length - 1];
            const fileResponse = await getFilePath(TOKEN, photo.file_id);
            
            if (fileResponse.file_path) {
              const imageUrl = `https://api.telegram.org/file/bot${TOKEN}/${fileResponse.file_path}`;
              await processImageUpload(imageUrl, TOKEN, message.chat.id, API_KEY, REQUEST_URL);
            }
            return new Response('OK', { status: 200 });
          }
          if (message.document) {
            const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
            if (supportedFormats.includes(message.document.mime_type)) {
              const fileResponse = await getFilePath(TOKEN, message.document.file_id);
              
              if (fileResponse.file_path) {
                const imageUrl = `https://api.telegram.org/file/bot${TOKEN}/${fileResponse.file_path}`;
                await processImageUpload(imageUrl, TOKEN, message.chat.id, API_KEY, REQUEST_URL);
              }
            } else {
              await sendTelegramMessage(TOKEN, message.chat.id, 
                "Apologies, but I can only upload images in PNG and JPG/JPEG formats."
              );
            }
            return new Response('OK', { status: 200 });
          }
          if (message.video) {
            await sendTelegramMessage(TOKEN, message.chat.id, 
              "Apologies, but I am unable to upload video-type format."
            );
            return new Response('OK', { status: 200 });
          }
        }
        return new Response('OK', { status: 200 });
      } catch (error) {
        console.error('Error processing update:', error);
        return new Response('Error', { status: 500 });
      }
    }
    return new Response('Telegram Bot Webhook', { status: 200 });
  }
};

async function getFilePath(token, fileId) {
  const response = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
  const data = await response.json();
  return data.result;
}

async function sendTelegramMessage(token, chatId, text) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  });
}

async function processImageUpload(imageUrl, token, chatId, apiKey, requestUrl) {
  try {
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    const formData = new FormData();
    formData.append('source', imageBlob, 'image.jpg');
    formData.append('type', 'file');
    formData.append('key', apiKey);

    const uploadResponse = await fetch(requestUrl, {
      method: 'POST',
      body: formData
    });

    const uploadData = await uploadResponse.json();
    if (uploadData.image && uploadData.image.url) {
      await sendTelegramMessage(token, chatId, `Here is the image URL:\n${uploadData.image.url}`);
    } else {
      await sendTelegramMessage(token, chatId, 
        'An unexpected error occurred during uploading your image. Kindly Wait a Moment. If the issue still persists, Please contact the Developer!'
      );
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    await sendTelegramMessage(token, chatId, 
      'There was an error during uploading your image. Please try again. If the issue still persists, Please contact the Developer!'
    );
  }
}
