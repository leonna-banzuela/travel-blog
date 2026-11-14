type Position = [number, number];
type Polygon = Position[][];
type LandFeature = {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: Polygon | Polygon[];
  };
};
type LandDocument =
  | LandFeature
  | {
      type: "FeatureCollection";
      features: LandFeature[];
    };

const radians = Math.PI / 180;

function initialiseGlobe(canvas: HTMLCanvasElement): void {
  if (canvas.dataset.ready) return;
  canvas.dataset.ready = "true";

  const hero = canvas.closest<HTMLElement>(".globe-landing");
  const control = hero?.querySelector<HTMLElement>("[data-globe-control]");
  const status = hero?.querySelector<HTMLElement>("[data-globe-status]");
  const context = canvas.getContext("2d");
  if (!hero || !control || !context) return;

  let land: LandFeature[] = [];
  let viewLongitude = 165;
  let viewLatitude = -18;
  let width = 0;
  let height = 0;
  let radius = 0;
  let centerX = 0;
  let centerY = 0;
  let dragging = false;
  let pointerX = 0;
  let pointerY = 0;
  const storyLatitude = Number(canvas.dataset.latitude);
  const storyLongitude = Number(canvas.dataset.longitude);

  const project = (longitude: number, latitude: number) => {
    const lambda = (longitude - viewLongitude) * radians;
    const phi = latitude * radians;
    const phiZero = viewLatitude * radians;
    const cosine = Math.cos(phi);
    const x = cosine * Math.sin(lambda);
    const y =
      Math.cos(phiZero) * Math.sin(phi) -
      Math.sin(phiZero) * cosine * Math.cos(lambda);
    const z =
      Math.sin(phiZero) * Math.sin(phi) +
      Math.cos(phiZero) * cosine * Math.cos(lambda);
    return { x: centerX + x * radius, y: centerY - y * radius, z };
  };

  const traceCoordinates = (coordinates: Position[], close = false): void => {
    let drawing = false;
    for (const [longitude, latitude] of coordinates) {
      const point = project(longitude, latitude);
      if (point.z < -0.015) {
        drawing = false;
        continue;
      }
      if (!drawing) {
        context.moveTo(point.x, point.y);
        drawing = true;
      } else {
        context.lineTo(point.x, point.y);
      }
    }
    if (close && drawing) context.closePath();
  };

  const drawGrid = (): void => {
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.clip();
    context.strokeStyle = "rgba(97, 67, 54, 0.16)";
    context.lineWidth = Math.max(0.7, width / 1800);

    for (let latitude = -60; latitude <= 60; latitude += 30) {
      context.beginPath();
      traceCoordinates(
        Array.from({ length: 181 }, (_, index) => [-180 + index * 2, latitude]),
      );
      context.stroke();
    }
    for (let longitude = -180; longitude < 180; longitude += 30) {
      context.beginPath();
      traceCoordinates(
        Array.from({ length: 91 }, (_, index) => [longitude, -90 + index * 2]),
      );
      context.stroke();
    }
    context.restore();
  };

  const drawLand = (): void => {
    if (land.length === 0) return;

    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
    context.clip();
    context.beginPath();
    for (const feature of land) {
      const polygons: Polygon[] =
        feature.geometry.type === "Polygon"
          ? [feature.geometry.coordinates as Polygon]
          : (feature.geometry.coordinates as Polygon[]);
      for (const polygon of polygons) {
        for (const ring of polygon) traceCoordinates(ring, true);
      }
    }
    context.fillStyle = "rgba(255, 240, 216, 0.82)";
    context.strokeStyle = "rgba(120, 79, 61, 0.58)";
    context.lineWidth = Math.max(0.8, width / 1500);
    context.fill("evenodd");
    context.stroke();
    context.restore();
  };

  const drawMarker = (): void => {
    const marker = project(storyLongitude, storyLatitude);
    if (marker.z < 0) return;
    const glow = Math.max(12, radius * 0.045);
    const gradient = context.createRadialGradient(
      marker.x,
      marker.y,
      0,
      marker.x,
      marker.y,
      glow * 2.2,
    );
    gradient.addColorStop(0, "rgba(255, 250, 215, 1)");
    gradient.addColorStop(0.2, "rgba(255, 215, 125, 0.95)");
    gradient.addColorStop(1, "rgba(255, 190, 92, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(marker.x, marker.y, glow * 2.2, 0, Math.PI * 2);
    context.fill();

    const distanceX = marker.x - centerX;
    const distanceY = marker.y - centerY;
    const length = Math.hypot(distanceX, distanceY) || 1;
    const beamLength = Math.max(28, radius * 0.15);
    const beamX = marker.x + (distanceX / length) * beamLength;
    const beamY = marker.y + (distanceY / length) * beamLength;
    const beam = context.createLinearGradient(marker.x, marker.y, beamX, beamY);
    beam.addColorStop(0, "rgba(255, 247, 196, 0.95)");
    beam.addColorStop(1, "rgba(255, 247, 196, 0)");
    context.strokeStyle = beam;
    context.lineWidth = Math.max(2, radius * 0.01);
    context.beginPath();
    context.moveTo(marker.x, marker.y);
    context.lineTo(beamX, beamY);
    context.stroke();

    context.fillStyle = "#fff9d5";
    context.strokeStyle = "#7b3f2c";
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(
      marker.x,
      marker.y,
      Math.max(4, radius * 0.012),
      0,
      Math.PI * 2,
    );
    context.fill();
    context.stroke();
  };

  const draw = (): void => {
    context.clearRect(0, 0, width, height);

    context.save();
    context.shadowColor = "rgba(53, 32, 24, 0.35)";
    context.shadowBlur = Math.max(24, radius * 0.11);
    context.shadowOffsetY = Math.max(10, radius * 0.05);
    const ocean = context.createRadialGradient(
      centerX - radius * 0.28,
      centerY - radius * 0.35,
      radius * 0.08,
      centerX,
      centerY,
      radius,
    );
    ocean.addColorStop(0, "#fff2db");
    ocean.addColorStop(0.55, "#e6b99a");
    ocean.addColorStop(1, "#9f6e61");
    context.fillStyle = ocean;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();

    drawGrid();
    drawLand();
    drawMarker();

    context.strokeStyle = "rgba(255, 241, 220, 0.72)";
    context.lineWidth = Math.max(1, radius * 0.005);
    context.beginPath();
    context.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
    context.stroke();
  };

  const resize = (): void => {
    const bounds = hero.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    radius = Math.min(
      width * (width < 700 ? 0.72 : 0.43),
      height * (width < 700 ? 0.43 : 0.7),
    );
    centerX = width * 0.5;
    centerY = height * (width < 700 ? 0.64 : 0.66);
    draw();
  };

  const adjustView = (deltaLongitude: number, deltaLatitude: number): void => {
    viewLongitude = ((viewLongitude + deltaLongitude + 540) % 360) - 180;
    viewLatitude = Math.max(-65, Math.min(65, viewLatitude + deltaLatitude));
    draw();
  };

  control.addEventListener("pointerdown", (event) => {
    dragging = true;
    pointerX = event.clientX;
    pointerY = event.clientY;
    control.setPointerCapture(event.pointerId);
    control.classList.add("is-dragging");
  });
  control.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const deltaX = event.clientX - pointerX;
    const deltaY = event.clientY - pointerY;
    pointerX = event.clientX;
    pointerY = event.clientY;
    adjustView(-deltaX * 0.32, deltaY * 0.22);
  });
  const stopDragging = (event: PointerEvent): void => {
    dragging = false;
    control.classList.remove("is-dragging");
    if (control.hasPointerCapture(event.pointerId))
      control.releasePointerCapture(event.pointerId);
  };
  control.addEventListener("pointerup", stopDragging);
  control.addEventListener("pointercancel", stopDragging);
  control.addEventListener("keydown", (event) => {
    const movement: Record<string, [number, number]> = {
      ArrowLeft: [-8, 0],
      ArrowRight: [8, 0],
      ArrowUp: [0, 6],
      ArrowDown: [0, -6],
    };
    const delta = movement[event.key];
    if (!delta) return;
    event.preventDefault();
    adjustView(delta[0], delta[1]);
  });

  new ResizeObserver(resize).observe(hero);
  resize();

  fetch("/data/world-land-110m.json")
    .then((response) => {
      if (!response.ok) throw new Error("World geometry is unavailable.");
      return response.json() as Promise<LandDocument>;
    })
    .then((document) => {
      land =
        document.type === "FeatureCollection" ? document.features : [document];
      hero.dataset.globeState = "ready";
      if (status)
        status.textContent =
          "Interactive globe ready. Sandy Beach is marked near Auckland, New Zealand.";
      draw();
    })
    .catch(() => {
      hero.dataset.globeState = "fallback";
      if (status)
        status.textContent =
          "The globe could not load. Use the Sandy Beach location link to continue.";
    });
}

for (const canvas of document.querySelectorAll<HTMLCanvasElement>(
  "[data-story-globe]",
)) {
  initialiseGlobe(canvas);
}
