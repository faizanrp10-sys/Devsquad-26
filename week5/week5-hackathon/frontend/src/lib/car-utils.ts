/**
 * Deterministically resolves a car's design (make, model, images) based on its ID.
 * This ensures consistency between the listing and detail pages.
 */

export const designImages = [
  // Primary designs from the Home Page (Live Auctions)
  { make: 'Mazda', model: 'MX - 5', img: 'mazda-mx-5.png' },
  { make: 'Porshe', model: '911', img: 'porshe911.png' },
  { make: 'Alpine', model: 'A110', img: 'alpinea110.png' },
  { make: 'BMW', model: 'M4', img: 'bmwm4.jpg' },
  
  // Secondary designs for more variety
  { make: 'Kia', model: 'Carnival', img: 'kiacarnival.jpg' },
  { make: 'Range Rover', model: 'Range Rover', img: 'rangrover.jpg' },
  { make: 'Bently', model: 'Bently', img: 'bently.jpg' },
  { make: 'Hyunai', model: 'Verna', img: 'hyunaiverna.jpg' },
  { make: 'Mahindra', model: 'Thar', img: 'mahindrathar.jpg' },
  { make: 'Ferrari', model: 'Ferrari', img: 'ferrari.jpg' },
  { make: 'Maruti', model: 'Brezza', img: 'marutibareza.jpg' },
  { make: 'Jaguar', model: 'XF', img: 'jaguarx5.jpg' },
  { make: 'Tata', model: 'Tiago', img: 'tatatiago.jpg' }
];

export function resolveCarDesign(car: any) {
  if (!car) return null;

  const idStr = String(car._id || car.id || '');
  const carMake = String(car.make || '').toLowerCase();
  const carModel = String(car.model || '').toLowerCase();

  // 1. Try to find a match by name (Make or Model)
  let design = designImages.find(d => 
    carMake.includes(d.make.toLowerCase()) || 
    carModel.includes(d.model.toLowerCase()) ||
    d.make.toLowerCase().includes(carMake && carMake.length > 2 ? carMake : '___none___')
  );

  // 2. Fallback to deterministic hash if no name match
  if (!design) {
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = (hash << 5) - hash + idStr.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % designImages.length;
    design = designImages[index];
  }

  return {
    ...car,
    // Use design names for mock cars or if car has no name
    make: (car._id && String(car._id).startsWith('mock-')) || !car.make ? design.make : car.make,
    model: (car._id && String(car._id).startsWith('mock-')) || !car.model ? design.model : car.model,
    // Explicit resolved properties for UI alignment
    imageResolved: design.img,
    designMake: design.make,
    designModel: design.model,
    // Ensure images array includes the design image if empty or for mock consistency
    images: car.images && car.images.length > 0 && !String(car._id).startsWith('mock-') 
      ? car.images 
      : [design.img]
  };
}
