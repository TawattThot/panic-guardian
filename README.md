# Panic Guardian

Phone/wearable **fall + panic SOS** helper. Free and open source (MIT).

> Personal safety aid — **not** a certified medical device, alarm monitoring service, or law-enforcement system.

## What it does (v0.1)

- **Panic button** → countdown → cancel or send
- **Fall / hard-impact detect** (phone accelerometer) → same countdown SOS
- **Confirm-gated alerts** to contacts you set (`sms:` / `tel:` links — your OS still asks)
- Optional “call emergency services” only after an **explicit** tap (never silent)

## What it does NOT do

- Detect gunpoint, knife threats, robbery, or “intent” from sensors
- Reliably read panic/stress from heart rate or “vibes” (wearable HR APIs are a later, optional add-on — still not mind-reading)
- Silently auto-dial 911 / emergency services from a sensor guess
- Guarantee rescue, medical response, or that a contact will answer
- Replace a dedicated medical alert / monitored alarm product

## How alerts actually work

1. You (or fall detect) start an SOS **countdown** (default ~15s, adjustable).
2. **Cancel** aborts — nothing is sent.
3. When the countdown ends, the app opens **on-device** SMS/call links for contacts you stored. It does **not** upload your location to our servers (there are none in v0.1).
4. Calling emergency services is a **separate, manual** action after confirm.

False alarms waste responder time and can put you in danger (e.g. unwanted police contact). Prefer longer countdowns until you trust the fall heuristic on *your* device.

## Safety & legal (read this)

- **Not medical advice / not FDA (or equivalent) cleared.** Fall detection can miss real falls and can fire on sports, dropping the phone, or rough movement.
- **Not a substitute for 911 / local emergency numbers** when you can safely call yourself.
- **Sensor limits:** Accelerometers estimate impact/freefall patterns. They cannot classify weapons, coercion, or crime type. Designing “auto police on stress” without hard confirmation is unsafe — we refuse that path.
- **Privacy:** Contacts and settings stay in **localStorage on this device** in v0.1. Clearing site data wipes them. No account, no cloud sync yet.
- **Your responsibility:** You choose contacts, countdown length, and whether fall detect is on. Check **local laws** before wiring emergency-service numbers or recording audio/video (not in v0.1).
- **Minors / others:** Do not install this on someone else’s device to monitor them without clear consent and legal basis.
- **Liability:** Use at your own risk. Authors and contributors provide the software as-is, with no warranty of fitness for a particular purpose.

If you are in immediate danger and can use a phone: call your local emergency number first.

## Quick start

```bash
npm install
npm run dev
```

Open the URL on your **phone** over **HTTPS** (or localhost) so `DeviceMotion` can work. Desktop browsers often have no useful motion sensors.

## Stack / roadmap

- **Now:** Vite + vanilla JS (same free lane as Punch Speed Meter)
- **Next:** Capacitor Android packaging, optional watch/wearable surface, clearer “I’m OK” check-in after a trigger
- **Not planned:** Silent mystery 911 from guessed threats

## Related

Punch Speed Meter (sibling free-lane app): https://github.com/TawattThot/punch-speed-meter
