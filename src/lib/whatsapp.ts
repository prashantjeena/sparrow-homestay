import { site } from "@/data/site";

/** Builds a click-to-chat link with a pre-filled message. */
export function whatsappLink(message: string) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Ends with a prompt so the guest can type their dates straight after it. */
export const roomEnquiry = (roomName: string) =>
  `Hi! I'd like to know if the ${roomName} at ${site.name} is available. My dates and number of guests: `;

export const houseEnquiry = `Hi! We're a group and would like to know about booking the whole house at ${site.name}. Our dates and number of guests: `;

/** The full message sent from the booking form. */
export function bookingEnquiry(d: {
  stay: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  name: string;
}) {
  return [
    `Hi! I'd like to book a stay at ${site.name}.`,
    ``,
    `Stay: ${d.stay}`,
    `Check-in: ${d.checkIn}`,
    `Check-out: ${d.checkOut} (${d.nights} ${d.nights === 1 ? "night" : "nights"})`,
    `Guests: ${d.guests}`,
    d.name.trim() ? `Name: ${d.name.trim()}` : null,
    ``,
    `Please let me know if these dates are available.`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export const generalEnquiry = `Hi! I found ${site.name} online and would like to know about availability.`;
