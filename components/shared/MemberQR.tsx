'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

interface Props {
  customerId: string
  customerName: string
  phone?: string | null
  email?: string | null
}

export default function MemberQR({ customerId, customerName, phone, email }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    // QR payload — identifier the POS can use
    const payload = JSON.stringify({
      id: customerId,
      phone: phone ?? null,
      email: email ?? null,
      t: 'cc-member', // type identifier
    })

    import('qrcode').then((QRCode) => {
      QRCode.toDataURL(payload, {
        width: 280,
        margin: 2,
        color: { dark: '#3D2200', light: '#FFF8EE' },
        errorCorrectionLevel: 'M',
      }).then((url) => setQrDataUrl(url))
    })
  }, [customerId, phone, email])

  const handleDownload = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `crazy-chips-member-${customerId.slice(-6)}.png`
    a.click()
  }

  return (
    <div className="flex flex-col items-center">
      {qrDataUrl ? (
        <>
          <div className="bg-[#FFF8EE] rounded-[20px] p-4 shadow-[0_4px_20px_rgba(61,34,0,0.12)]">
            <img src={qrDataUrl} alt="Member QR Code" className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px]" />
          </div>
          <p className="text-[#8a7a6a] text-xs font-[600] mt-3 text-center">
            Show this at the counter to earn reward points
          </p>
          <button
            onClick={handleDownload}
            className="mt-3 flex items-center gap-1.5 text-[#D92B2B] text-xs font-[700] hover:underline"
          >
            <Download size={13} /> Save to phone
          </button>
        </>
      ) : (
        <div className="w-[220px] h-[220px] bg-[#F5EDD8] rounded-[20px] animate-pulse" />
      )}
    </div>
  )
}
