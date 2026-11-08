import * as THREE from 'three';

/**
 * Attaches a pointer gesture filter to disambiguate OrbitControls pan/drag motions
 * from intentional planet selection clicks (D-03).
 *
 * Filters out gestures with Euclidean displacement >= 5px or duration >= 300ms.
 * Returns a cleanup function removing event listeners.
 */
export function setupDragFilter(
  element: HTMLElement,
  onClick: (event: PointerEvent) => void
): () => void {
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let isPointerDown = false;

  const handlePointerDown = (e: PointerEvent) => {
    startX = e.clientX;
    startY = e.clientY;
    startTime = performance.now();
    isPointerDown = true;
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!isPointerDown) return;
    isPointerDown = false;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const distance = Math.hypot(dx, dy);
    const duration = performance.now() - startTime;

    // A deliberate click has minimal pointer movement (< 5px) and short duration (< 300ms)
    if (distance < 5 && duration < 300) {
      onClick(e);
    }
  };

  element.addEventListener('pointerdown', handlePointerDown);
  element.addEventListener('pointerup', handlePointerUp);

  return () => {
    element.removeEventListener('pointerdown', handlePointerDown);
    element.removeEventListener('pointerup', handlePointerUp);
  };
}

/**
 * Converts pointer event coordinates into Normalized Device Coordinates (NDC)
 * and performs raycasting against the target 3D objects.
 *
 * T-10-04 Mitigation: Checks container dimensions > 0 and clamps NDC to [-1, 1]
 * to eliminate NaN raycasting vectors and division-by-zero vulnerabilities.
 */
export function raycastObjects(
  event: PointerEvent,
  camera: THREE.Camera,
  objects: THREE.Object3D[],
  container: HTMLElement
): THREE.Intersection[] {
  const rect = container.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return [];
  }

  const rawX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const rawY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

  // Clamp NDC coordinates safely to [-1, 1]
  const ndcX = Math.max(-1, Math.min(1, rawX));
  const ndcY = Math.max(-1, Math.min(1, rawY));

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
  return raycaster.intersectObjects(objects, true);
}

/**
 * Raycasts pointer events against solar system planet meshes and returns the selected PlanetId or null.
 */
export function raycastSolarSystem(
  event: PointerEvent,
  camera: THREE.Camera,
  planetMeshes: THREE.Mesh[],
  container: HTMLElement
): string | null {
  const intersects = raycastObjects(event, camera, planetMeshes, container);
  if (intersects.length === 0) return null;

  for (const hit of intersects) {
    let current: THREE.Object3D | null = hit.object;
    while (current) {
      if (current.userData && typeof current.userData.planetId === 'string') {
        return current.userData.planetId;
      }
      current = current.parent;
    }
  }

  return null;
}
