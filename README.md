
# Bot-Image-Host-CF-Workers

A Fork from [PhobosID/TL-Bot-Image-Host])(https://github.com/PhobosID/TL-Bot-Image-Host) that aims to make it works using Cloudflare Workers.
As it name suggest. This script will make your telegram bot host your image in external website.

<p align="center">
<img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E">
</p>

## What to Do Next

Configure your main code and enter your credentials. First to get your Bot Token at [BotFather](https://t.me/BotFather). 

Next is the API Key and URL Request. There are plenty of Free Image Hosting that offers free API access along with its Request URL. Below here is the example of them:

| Hosting Provider             | URL Request                                                                | File URL Format |
| ----------------- | ------------------------------------------------------------------ | ----------------- |
| [IMGBB](https://imgbb.com) | https://imgbb.com/api/1/upload | https://i.ibb.co.com/(folder)/(filename).png |
| [ImgHippo](https://www.imghippo.com) | https://www.imghippo.com/v1/upload | https://i.imghippo.com/files/(filename).png |
| [FreeImageHost](https://freeimage.host)* | https://freeimage.host/api/1/upload | https://iili.io/(filename).png |

You need to register/create your own account there at the Image Hosting in order to generate it's API Key. Any Image uploaded by the API will be available in your account.

*FreeImageHost had problem with their API Key, where every user had the exact same API, making every uploaded image using its API won't appear in your account.
```
6d207e02198a847aa98d0a2a901485a5
```
by technicality, you do not need to register your account there.

## Deployment

1. Copy-Paste the Code into your Cloudflare Workers Code, and then hit Deploy.
2. Set the Telegram Webhook as follows:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_CLOUDFLARE_WORKERS_URL>
```
3. All Set. Test your Telegram Bot now!
