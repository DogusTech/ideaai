import localFont from 'next/font/local'

export const satoshi = localFont({
  src: [
    {
      path: '../public/fonts/satoshi/Satoshi-Variable.woff2',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-VariableItalic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})
