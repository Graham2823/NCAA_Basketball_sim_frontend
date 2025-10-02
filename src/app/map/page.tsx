'use client';

import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Text } from 'pixi.js';
import Link from 'next/link';

export default function MapPage() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const appRef = useRef<Application | null>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		const app = new Application();

		const initPixi = async () => {
			await app.init({
				canvas: canvasRef.current!,
				background: '#e6f2ff',
				resizeTo: window,
			});

			// ---------- Data ----------
			const GEOJSON_URL =
				'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
			const geojson = await fetch(GEOJSON_URL).then((r) => r.json());

			// ---------- Scene ----------
			const mapContainer = new Container();
			app.stage.addChild(mapContainer);

			const label = new Text({
				text: 'Click a state',
				style: {
					fontFamily: 'Inter, Arial, sans-serif',
					fontSize: 18,
					fill: 0x003366,
					fontWeight: '600',
					dropShadow: true,
					dropShadowAlpha: 0.2,
					dropShadowAngle: Math.PI / 6,
					dropShadowBlur: 2,
					dropShadowDistance: 2,
				},
			});
			label.x = 16;
			label.y = 16;
			app.stage.addChild(label);

			let selectedState: string | null = null;

			// ---------- Projection helpers ----------
			const padding = 40;
			const bounds = getGeoBounds(geojson);

			function project(
				[lon, lat]: [number, number],
				screenW: number,
				screenH: number
			) {
				const [minLon, minLat, maxLon, maxLat] = bounds;
				const lonSpan = maxLon - minLon;
				const latSpan = maxLat - minLat;

				const plotW = Math.max(screenW - padding * 2, 1);
				const plotH = Math.max(screenH - padding * 2, 1);
				const scaleX = plotW / lonSpan;
				const scaleY = plotH / latSpan;
				const scale = Math.min(scaleX, scaleY);

				const x = padding + (lon - minLon) * scale;
				const y = padding + (maxLat - lat) * scale;

				return { x, y, scale };
			}

			// ---------- Draw states ----------
			const stateGraphics: any[] = [];
			geojson.features.forEach((feature: any) => {
				const name =
					(feature.properties &&
						(feature.properties.name ||
							feature.properties.NAME ||
							feature.properties.state ||
							feature.properties.STATE_NAME)) ||
					'Unknown';

				const g = new Graphics();
				g.eventMode = 'static';
				g.cursor = 'pointer';

				// custom props
				(g as any).__feature = feature;
				(g as any).__name = name;
				(g as any).__baseColor = 0x7fb3d5;
				(g as any).__hoverColor = 0x5499c7;
				(g as any).__selectedColor = 0xffcc66;
				(g as any).__isSelected = false;

				// interactions
				g.on('pointerover', () => {
					if (!(g as any).__isSelected)
						redrawOne(g, { fill: (g as any).__hoverColor });
					app.canvas.style.cursor = 'pointer';
				});
				g.on('pointerout', () => {
					if (!(g as any).__isSelected)
						redrawOne(g, { fill: (g as any).__baseColor });
					app.canvas.style.cursor = 'default';
				});
				g.on('pointertap', () => {
					stateGraphics.forEach((sg) => {
						if (sg !== g) {
							(sg as any).__isSelected = false;
							redrawOne(sg, { fill: (sg as any).__baseColor });
						}
					});
					(g as any).__isSelected = !(g as any).__isSelected;
					redrawOne(g, {
						fill: (g as any).__isSelected
							? (g as any).__selectedColor
							: (g as any).__hoverColor,
					});

					selectedState = (g as any).__isSelected ? (g as any).__name : null;
					label.text = (g as any).__isSelected
						? `Selected: ${(g as any).__name}`
						: 'Click a state';
					redrawMarkers();
				});

				mapContainer.addChild(g);
				stateGraphics.push(g);
			});

			function redrawOne(g: Graphics, styleOverride: any = null) {
				const feature = (g as any).__feature;
				const screenW = app.renderer.width;
				const screenH = app.renderer.height;

				g.clear();
				g.lineStyle(1, 0xffffff, 1);
				g.beginFill(styleOverride?.fill ?? (g as any).__baseColor, 1);

				const geom = feature.geometry;
				if (!geom) return;

				const polys =
					geom.type === 'Polygon'
						? [geom.coordinates]
						: geom.type === 'MultiPolygon'
						? geom.coordinates
						: [];

				polys.forEach((rings: any) => {
					rings.forEach((ring: any) => {
						ring.forEach((coord: any, i: number) => {
							const { x, y } = project(coord, screenW, screenH);
							if (i === 0) g.moveTo(x, y);
							else g.lineTo(x, y);
						});
						g.closePath();
					});
				});

				g.endFill();
			}

			// ---------- Markers ----------
			let markers: any[] = [];
			const markersContainer = new Container();
			mapContainer.addChild(markersContainer);

			const MARKER_VISIBLE_ZOOM = 2.2;
			const ICON_BASE = 18;

			const schools = [
				{
					name: 'Boston College',
					state: 'Massachusetts',
					lon: -71.171,
					lat: 42.3355,
					color: 0x8b0000,
				},
				{
					name: 'UMass Amherst',
					state: 'Massachusetts',
					lon: -72.5293,
					lat: 42.3868,
					color: 0x5a2d82,
				},
			];

			markers = schools.map((school) => {
				const g = new Graphics();
				g.eventMode = 'static';
				g.cursor = 'pointer';
				(g as any).__school = school;

				g.on('pointerover', () => {
					drawMarker(g, true);
					app.canvas.style.cursor = 'pointer';
				});
				g.on('pointerout', () => {
					drawMarker(g, false);
					app.canvas.style.cursor = 'default';
				});
				g.on('pointertap', () => {
					label.text = `Selected: ${school.name}`;
				});

				markersContainer.addChild(g);
				return { school, g };
			});

			function drawMarker(g: Graphics, hover = false) {
				const screenW = app.renderer.width;
				const screenH = app.renderer.height;
				const school = (g as any).__school;

				const { x, y } = project([school.lon, school.lat], screenW, screenH);
				g.position.set(x, y);

				const scaleFactor = Math.max(mapContainer.scale.x, 0.0001);
				const s = ICON_BASE / scaleFactor;

				const roofH = 0.45 * s;
				const bodyH = 0.75 * s;
				const bodyW = 1.05 * s;
				const colW = 0.1 * s;
				const doorW = 0.22 * s;
				const doorH = 0.35 * s;
				const stroke = 2 / scaleFactor;

				const base = school.color;
				const bodyColor = hover ? 0xffff99 : 0xffffff;
				const roofColor = hover ? 0xffe066 : base;
				const lineColor = 0x333333;

				g.clear();

				// Roof
				g.lineStyle(stroke, lineColor, 1);
				g.beginFill(roofColor, 1);
				g.moveTo(0, -(roofH + bodyH));
				g.lineTo(-bodyW * 0.58, -bodyH);
				g.lineTo(+bodyW * 0.58, -bodyH);
				g.closePath();
				g.endFill();

				// Body
				g.lineStyle(stroke, lineColor, 1);
				g.beginFill(bodyColor, 1);
				g.drawRect(-bodyW / 2, -bodyH, bodyW, bodyH);
				g.endFill();

				// Columns
				const colGap = (bodyW - 4 * colW) / 4;
				const colY = -bodyH + stroke;
				for (let i = 0; i < 3; i++) {
					const cx = -bodyW / 2 + colGap + i * (colW + colGap);
					g.beginFill(0xdddddd, 1);
					g.drawRect(cx + colW * 0.5, colY, colW, bodyH - doorH - stroke * 2);
					g.endFill();
				}

				// Door
				g.lineStyle(stroke, lineColor, 1);
				g.beginFill(0x666666, 1);
				g.drawRect(-doorW / 2, -doorH, doorW, doorH);
				g.endFill();

				// Crest
				const crestR = 0.12 * s;
				g.lineStyle(stroke, lineColor, 1);
				g.beginFill(base, 1);
				g.drawCircle(0, -bodyH - roofH * 0.5, crestR);
				g.endFill();

				// Shadow
				g.beginFill(0x000000, 0.08);
				g.drawEllipse(0, stroke, bodyW * 0.6, stroke * 2.5);
				g.endFill();
			}

			function redrawMarkers() {
				if (!markers || markers.length === 0) return;

				const zoom = mapContainer.scale.x;
				const show = zoom >= MARKER_VISIBLE_ZOOM && !!selectedState;

				markers.forEach(({ g }) => {
					g.visible = show && (g as any).__school.state === selectedState;
					if (g.visible) drawMarker(g, false);
				});
			}

			// ---------- Zoom + Pan ----------
			const ZOOM = {
				min: 0.6,
				max: 20,
				stepWheel: 1.2,
				stepPinch: 1.05,
			};

			function clampZoom(v: number) {
				return Math.max(ZOOM.min, Math.min(ZOOM.max, v));
			}

			function zoomAtScreenPoint(
				screenX: number,
				screenY: number,
				factor: number
			) {
				const before = mapContainer.toLocal({ x: screenX, y: screenY });
				const newScale = clampZoom(mapContainer.scale.x * factor);

				mapContainer.scale.set(newScale, newScale);

				const after = mapContainer.toLocal({ x: screenX, y: screenY });

				mapContainer.x += (after.x - before.x) * mapContainer.scale.x;
				mapContainer.y += (after.y - before.y) * mapContainer.scale.y;

				redrawMarkers();
			}

			const PAN_BOUNDS = {
				minX: -200,
				maxX: 200,
				minY: -200,
				maxY: 200,
			};

			function clampPan(x: number, y: number) {
				return {
					x: Math.max(PAN_BOUNDS.minX, Math.min(PAN_BOUNDS.maxX, x)),
					y: Math.max(PAN_BOUNDS.minY, Math.min(PAN_BOUNDS.maxY, y)),
				};
			}

			// Event listeners
			app.canvas.addEventListener(
				'wheel',
				(e) => {
					e.preventDefault();
					const isPinchLike = e.ctrlKey;
					const factor =
						e.deltaY < 0
							? isPinchLike
								? ZOOM.stepPinch
								: ZOOM.stepWheel
							: isPinchLike
							? 1 / ZOOM.stepPinch
							: 1 / ZOOM.stepWheel;
					zoomAtScreenPoint(e.offsetX, e.offsetY, factor);
				},
				{ passive: false }
			);

			// Mouse drag panning
			let mouseDragging = false;
			let mouseLast = { x: 0, y: 0 };

			app.canvas.addEventListener('mousedown', (e) => {
				mouseDragging = true;
				mouseLast = { x: e.clientX, y: e.clientY };
			});

			window.addEventListener('mouseup', () => {
				mouseDragging = false;
			});

			app.canvas.addEventListener('mousemove', (e) => {
				if (!mouseDragging) return;
				const dx = e.clientX - mouseLast.x;
				const dy = e.clientY - mouseLast.y;

				const newX = mapContainer.x + dx;
				const newY = mapContainer.y + dy;
				const clamped = clampPan(newX, newY);

				mapContainer.x = clamped.x;
				mapContainer.y = clamped.y;
				mouseLast = { x: e.clientX, y: e.clientY };
			});

			app.canvas.addEventListener('dblclick', (e) => {
				const rect = app.canvas.getBoundingClientRect();
				zoomAtScreenPoint(
					e.clientX - rect.left,
					e.clientY - rect.top,
					ZOOM.stepWheel
				);
			});

			function redrawAll() {
				stateGraphics.forEach((g) => redrawOne(g));
				redrawMarkers();
			}

			redrawAll();
			window.addEventListener('resize', redrawAll);

			function getGeoBounds(geo: any) {
				let minLon = Infinity,
					maxLon = -Infinity,
					minLat = Infinity,
					maxLat = -Infinity;
				geo.features.forEach((f: any) => {
					const geom = f.geometry;
					if (!geom) return;
					const walk = (coords: any) => {
						if (typeof coords[0] === 'number') {
							const [lon, lat] = coords;
							if (lon < minLon) minLon = lon;
							if (lon > maxLon) maxLon = lon;
							if (lat < minLat) minLat = lat;
							if (lat > maxLat) maxLat = lat;
						} else {
							coords.forEach(walk);
						}
					};
					walk(geom.coordinates);
				});
				if (
					!isFinite(minLon) ||
					!isFinite(maxLon) ||
					!isFinite(minLat) ||
					!isFinite(maxLat)
				) {
					minLon = -170;
					maxLon = -60;
					minLat = 18;
					maxLat = 72;
				}
				return [minLon, minLat, maxLon, maxLat];
			}

			appRef.current = app;
		};

		initPixi();

		return () => {
			if (appRef.current) {
				appRef.current.destroy(true);
				appRef.current = null;
			}
		};
	}, []);

	return (
		<div className='min-h-screen bg-gray-100 p-8'>
			<div className='max-w-7xl mx-auto'>
				<div className='mb-6'>
					<h1 className='text-4xl font-bold text-gray-900 mb-2'>
						NCAA Recruiting Map
					</h1>
					<p className='text-gray-600'>
						Interactive map showing US states and college locations for
						recruiting
					</p>
				</div>

				<div className='flex justify-center'>
					<canvas ref={canvasRef} />
				</div>

				<div className='mt-6 text-center'>
					<Link
						href='/'
						className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
						← Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
