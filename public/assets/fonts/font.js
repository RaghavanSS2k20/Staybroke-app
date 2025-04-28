import localFont from 'next/font/local'

export const zohoPuvi = localFont({
  src: [
    { path: './ZohoPuvi/Zoho Puvi Thin.ttf', weight: '100', style: 'normal' },
    { path: './ZohoPuvi/Zoho Puvi Light.ttf', weight: '300', style: 'normal' },
    { path: './ZohoPuvi/Zoho Puvi Regular.ttf', weight: '400', style: 'normal' },
    { path: './ZohoPuvi/Zoho Puvi Medium.ttf', weight: '500', style: 'normal' },
    { path: './ZohoPuvi/Zoho Puvi Semibold.ttf', weight: '600', style: 'normal' },
    { path: './ZohoPuvi/Zoho Puvi Bold.ttf', weight: '700', style: 'normal' },
    { path: './ZohoPuvi/Zoho Puvi Extrabold.ttf', weight: '800', style: 'normal' },
    { path: './ZohoPuvi/Zoho Puvi Black.ttf', weight: '900', style: 'normal' },
    { path: './ZohoPuvi/Zoho Puvi Semibold Italic.ttf', weight: '600', style: 'italic' },
    { path: './ZohoPuvi/Zoho Puvi Bold Italic.ttf', weight: '700', style: 'italic' },
    // { path: './ZohoPuvi/Zoho Puvi Extrabold Italic.ttf', weight: '800', style: 'italic' },
    { path: './ZohoPuvi/Zoho Puvi Regular Italic.ttf', weight: '400', style: 'italic' },
  ],
  variable: '--sb',
  display: 'swap',
})
