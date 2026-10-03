# Photo slots

Every picture on the site is a placeholder with its own file name printed on it.
Replace each one with a real photo.

## How to replace a photo

1. Export your photo as **WebP** (or JPG), about the size shown below, and under ~250 KB.
2. Put it in the same folder with the same name, for example `rooms/deodar-room-1.webp`.
3. Open `src/data/rooms.ts` or `src/data/gallery.ts` and change `.svg` to `.webp` in that one path.
4. Delete the old placeholder `.svg`.

| File | Where it shows up | Shape and size | What to photograph |
| --- | --- | --- | --- |
| `rooms/deodar-room-1.svg` | Room card (main photo) | 4:3 landscape, 1600 x 1200 | Deodar Room, the best wide shot of the bed and window |
| `rooms/deodar-room-2.svg` | Room card (shows on hover) | 4:3 landscape, 1600 x 1200 | Deodar Room, a second angle or the bathroom |
| `rooms/pine-room-1.svg` | Room card (main photo) | 4:3 landscape, 1600 x 1200 | Pine Room, the best wide shot of the bed and window |
| `rooms/pine-room-2.svg` | Room card (shows on hover) | 4:3 landscape, 1600 x 1200 | Pine Room, a second angle or the bathroom |
| `rooms/garden-room-1.svg` | Room card (main photo) | 4:3 landscape, 1600 x 1200 | Garden Room, the best wide shot of the bed and window |
| `rooms/garden-room-2.svg` | Room card (shows on hover) | 4:3 landscape, 1600 x 1200 | Garden Room, a second angle or the bathroom |
| `house/whole-house-1.svg` | Whole house card (big photo on the left) | near-square portrait, 1200 x 1350 | The house from outside, or the main living space |
| `house/whole-house-2.svg` | Whole house card (small photo, top right) | near-square portrait, 1200 x 1350 | The kitchen |
| `house/whole-house-3.svg` | Whole house card (small photo, bottom right) | near-square portrait, 1200 x 1350 | The balcony, lawn or sitting area |
| `gallery/gallery-01-views-valley-sunrise.svg` | Gallery, category Views | wide landscape, 1600 x 1000 | The valley at sunrise |
| `gallery/gallery-02-rooms-pine-room.svg` | Gallery, category Rooms | tall portrait, 1000 x 1400 | Pine Room, portrait shot |
| `gallery/gallery-03-views-balcony-golden-hour.svg` | Gallery, category Views | square, 1200 x 1200 | The balcony at golden hour |
| `gallery/gallery-04-rooms-deodar-room.svg` | Gallery, category Rooms | square, 1200 x 1200 | Deodar Room, a detail or corner |
| `gallery/gallery-05-food-home-cooked-dinner.svg` | Gallery, category Food | wide landscape, 1600 x 1000 | A home-cooked dinner on the table |
| `gallery/gallery-06-rooms-garden-room-lawn.svg` | Gallery, category Rooms | tall portrait, 1000 x 1400 | Garden Room with the lawn, portrait shot |
| `gallery/gallery-07-around-forest-trail.svg` | Gallery, category Around | square, 1200 x 1200 | The forest trail near the house |
| `gallery/gallery-08-around-evening-bonfire.svg` | Gallery, category Around | wide landscape, 1600 x 1000 | An evening bonfire |
| `Host.png` (in `public/images/`) | Meet your host section | portrait 4:5, at least 800 x 1000 | A friendly portrait of the host, face in the top half |

Tips: shoot landscape for rooms, use daylight, keep the camera level, and never upscale a small photo.
