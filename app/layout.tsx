// app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
// Hapus import Poppins dari google
// import { Poppins } from "next/font/google" 
// Ganti dengan import localFont
import localFont from "next/font/local"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/toaster"

// Definisikan font lokal di sini
const poppins = localFont({
  src: [
    {
      path: './fonts/Poppins-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/Poppins-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/Poppins-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Poppins-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Poppins-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Poppins-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    // Tambahkan file italic jika kamu punya dan membutuhkannya
  ],
  variable: "--font-poppins",
});


export const metadata: Metadata = {
  title: "Canvasing CMS",
  description: "Content Management System for Canvasing Business",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Gunakan variabel CSS dari font lokal
    <html lang="en" className={`${poppins.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}