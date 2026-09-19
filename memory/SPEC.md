# Navidha Jewelry Storefront

## What it does
- Premium editorial storefront for Navidha Pearls and Jewelry.
- Uses the supplied gold Navidha logo throughout, with a dark contrast plate when displayed on light surfaces.
- Browse a local demo catalog of pendants, necklaces, earrings, rings, and bracelets.
- Filter by category and material, search by name, and sort by price.
- Open product details, add pieces to a local shopping bag, change quantities, remove items, and review the subtotal in a slide-over bag.
- Join the launch waitlist through a local demo toast; no external integrations or order submission are connected.

## Data model
- `Product`: id, name, category, material, price, description, details, image, alt, tag.
- `CartItem`: product plus quantity, held in Home page state for the demo session.
- Craft stories include Thewa colored-glass jewelry with gold and silver, Hupari silver jewelry, Gulabi Meenakari, Karimnagar silver filigree, and Cuttack silver filigree.
- The Thewa card cycles through three supplied campaign images every four seconds and includes manual previous/next arrows plus position dots.
- The Philosophy section uses the supplied upper-body portrait, cropped to retain the face, pearl collar, and central silver floral brooch.
- The full-screen Campaign Gallery contains two supplied Navidha pearl portraits and three matching generated editorial images, each with a title and caption.

## Key flows
1. Hero CTA scrolls to the collection.
   - Desktop hero is a compact 445px split layout with the “Navidha 2026” image stamp; the mobile image area is also 445px.
   - The hero uses the supplied portrait of an Indian woman wearing layered silver and pearl jewelry, with a responsive focal crop preserving both face and necklace.
2. Collection controls filter/search/sort the local product catalog.
3. Product image/title opens the detail modal; Add to bag updates the local cart and shows a Sonner toast.
4. Bag button opens the cart drawer; quantity controls and remove actions update the subtotal.
5. Preview checkout shows a browser alert because payments are intentionally not integrated.
6. A centered fixed launch popup opens on landing with “We will be Live Soon”; the visitor can close it or use its preview CTA, and it stays fixed while scrolling until dismissed.
7. Campaign links in desktop/mobile navigation and the Philosophy section open a cinematic full-screen lightbox with arrows, keyboard navigation, captions, counter, and thumbnail selection.

## Auth and integrations
- No authentication, accounts, or gated areas.
- No external integrations; remote editorial images and the supplied Navidha logo are presentation assets only.