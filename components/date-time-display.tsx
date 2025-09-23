"use client"

import { useState, useEffect } from "react"

export function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="flex flex-col text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{formatDate(currentTime)}</span>
      <span className="font-mono">{formatTime(currentTime)}</span>
    </div>
  )
}
