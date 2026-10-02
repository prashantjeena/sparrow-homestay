export type Faq = { category: "Booking" | "Stay" | "Getting here"; q: string; a: string };

/** PLACEHOLDER answers. Edit to match the real policies. */
export const faqs: Faq[] = [
  {
    category: "Booking",
    q: "How do I book a room?",
    a: "Check the calendar for free dates, then send us the pre-filled WhatsApp message with your dates and room. We confirm availability and hold the booking once you share an advance.",
  },
  {
    category: "Booking",
    q: "Is an advance payment required?",
    a: "Yes. A 30% advance confirms the booking and the balance is paid at check-in. Payment details are shared on WhatsApp after we confirm your dates.",
  },
  {
    category: "Booking",
    q: "What is the cancellation policy?",
    a: "Free cancellation up to 7 days before check-in. Between 7 and 3 days we refund 50% of the advance. Within 3 days the advance is non-refundable.",
  },
  {
    category: "Stay",
    q: "What are the check-in and check-out times?",
    a: "Check-in from 1:00 PM and check-out by 11:00 AM. Early check-in or late check-out is possible when the room is free, so just ask.",
  },
  {
    category: "Stay",
    q: "Are meals available?",
    a: "Breakfast is included with most rooms. Lunch and dinner are home-cooked and served on request. Tell us any dietary needs when you book.",
  },
  {
    category: "Stay",
    q: "Is there Wi-Fi and mobile network?",
    a: "Yes, Wi-Fi is available in all rooms. Mobile signal is good for major networks but can dip in the evenings, so download maps beforehand.",
  },
  {
    category: "Stay",
    q: "Are pets and children welcome?",
    a: "Children are very welcome. Well-behaved pets are welcome. Please let us know in advance.",
  },
  {
    category: "Getting here",
    q: "How do I reach the homestay?",
    a: "The nearest railhead is around 60 km away and the nearest airport around 100 km. Taxis are easy to arrange, and we can help book one. The last 2 km is a narrow hill road.",
  },
  {
    category: "Getting here",
    q: "Is parking available?",
    a: "Yes, free parking for a few cars on the property. Larger vehicles can be parked at the road head, about 5 minutes' walk away.",
  },
  {
    category: "Getting here",
    q: "When is the best time to visit?",
    a: "March to June for clear skies and pleasant days, October to November for crisp views, and December to February if you want cold weather and a chance of snow.",
  },
];
