# Письмо для моей мамочки 🐶❤️

A passcode-locked website — a heartfelt letter "from" your Maltipoo to your mom. Open `index.html` in any browser, no build step, no server needed.

## Before you send it to her

All of these live in **`script.js`**, right at the top, clearly labeled:

1. **`passcode`** — currently `"XXXX"`, a placeholder. Set it to the date the dog joined your family, as four digits (e.g. December 3rd → `"1203"`).
2. **`familyDate`** — currently `"YYYY-MM-DDT00:00:00"`, a placeholder. Set it to the real date, e.g. `"2022-12-03T00:00:00"`. This drives the live "happy beside you for..." timer.
3. **`letter`** — currently a placeholder. Replace the text inside the backticks with the actual letter, written in the dog's voice. Leave a blank line between paragraphs.

## Photo

Replace **`dog.jpg`** with a real photo of your Maltipoo (same filename — it'll be cropped to fit the frame). A placeholder paw-print image is there now so you can preview the layout.

## Music (optional)

Drop an MP3 at **`music.mp3`**, then uncomment the one line near the top of `script.js`:
```js
// document.getElementById('bg-music').play().catch(() => {});
```
Since she has to enter the passcode first, that counts as a user interaction — so autoplay-with-sound should work right after unlock, even on Android Chrome.

## What's inside

- `index.html` — structure
- `style.css` — all styling, warm caramel/cream palette as CSS variables at the top
- `script.js` — passcode logic, canvas-based falling paws/hearts (lightweight, not hundreds of DOM elements), letter reveal by phrase, live timer
- `dog.jpg` — placeholder, replace with your dog's photo
- (add your own `music.mp3` if you want background music)

Built and tuned primarily for a Samsung Galaxy S25 in portrait — the falling celebration animation runs on a single canvas rather than many DOM nodes, and the letter reveals in small word-groups rather than one animation per word, so it should stay smooth even on a longer letter. Also responsive down to smaller phones and up to tablets/desktop.
