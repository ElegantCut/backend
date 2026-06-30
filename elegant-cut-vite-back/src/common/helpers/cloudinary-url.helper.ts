/**
 * Helper para construir URLs de Cloudinary.
 * 
 * Principio SOLID aplicado: SRP + DRY
 * - Responsabilidad única: construir URLs de Cloudinary
 * - Se reutiliza en barbers.service y services.service
 */

const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || 'dbuldg4dt'}/image/upload`;

/**
 * Construye la URL completa de Cloudinary a partir de un public_id.
 * Si el valor ya es una URL completa (http/https), la retorna tal cual.
 * Si es null/undefined/vacío, retorna null.
 * 
 * @param publicId - El public_id de Cloudinary o una URL completa
 * @returns URL completa de la imagen o null
 */
export function buildCloudinaryUrl(publicId: string | null | undefined): string | null {
  if (!publicId || publicId.trim() === '') {
    return null;
  }

  // Si ya es una URL completa, devolverla tal cual
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }

  return `${CLOUDINARY_BASE_URL}/${publicId}`;
}

/**
 * Parsea un campo JSON de fotos (como fotos_portafolio) y construye URLs de Cloudinary.
 * Maneja tanto strings JSON como arrays directos.
 * 
 * @param photosField - String JSON o array de public_ids/URLs
 * @returns Array de URLs completas de Cloudinary
 */
export function parseCloudinaryPhotos(photosField: string | string[] | null | undefined): string[] {
  if (!photosField) {
    return [];
  }

  let photosArray: string[];

  if (typeof photosField === 'string') {
    try {
      photosArray = JSON.parse(photosField);
    } catch {
      // Si no es JSON válido, tratar como un solo valor
      photosArray = [photosField];
    }
  } else if (Array.isArray(photosField)) {
    photosArray = photosField;
  } else {
    return [];
  }

  return photosArray
    .filter((photo: string) => photo && photo.trim() !== '')
    .map((photo: string) => buildCloudinaryUrl(photo)!)
    .filter(Boolean);
}
