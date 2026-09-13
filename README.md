# Panic Guardian

Phone/wearable **fall + panic SOS** helper. Free and open source.

## What it does (v0.1)

- **Panic button** → countdown → cancel or send
- **Fall / hard-impact detect** (accelerometer) → same countdown SOS
- **Confirm-gated alerts** to contacts you set (SMS / tel links)
- Optional “call emergency services” only after an explicit confirm

## What it does NOT do

- It cannot detect gunpoint or knife threats from sensors alone
- It will not silently auto-dial 911 / emergency services from a guess
- Stress/HR “panic reading” needs wearable APIs; not in v0.1

## Safety & legal

This is a personal safety aid, not a certified medical or law-enforcement device. False alarms can harm you and others — always prefer confirmation + cancel windows. Check local laws before wiring emergency-service contacts.

## Quick start

```bash
npm install
npm run dev
```

Open the URL on your **phone** (secure context / HTTPS for sensors).

## Stack

Vite + vanilla JS (same free lane as Punch Speed Meter). Capacitor / watch packaging can come later.
