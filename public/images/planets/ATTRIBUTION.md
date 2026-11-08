# Planetary Cartography Texture Attributions

The equirectangular planetary surface textures bundled in `public/images/planets/` are derived from authentic NASA, USGS, and Solar System Scope cartographic datasets.

## Licensing

- **License:** [Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/)
- **Source Portal:** [Solar System Scope Textures](https://www.solarsystemscope.com/textures/)
- **Permitted Reuse:** Free for non-commercial and commercial educational use with attribution.
- **Application:** Bundled directly in **Sekolah Prompt-Fu** to support offline-ready, low-bandwidth interactive 3D science and language learning missions.

## Texture Lineage & Original Cartography Sources

| Texture File | Celestial Target | Original Cartography & Science Missions | Source / Curator |
|--------------|------------------|----------------------------------------|------------------|
| `earth.jpg` | Earth Day Surface | NASA Earth Observatory / NASA Visible Earth | Solar System Scope |
| `earth_clouds.jpg` | Earth Cloud Layer | NASA Earth Observatory MODIS Cloud Imagery | Solar System Scope |
| `moon.jpg` | Earth's Moon | USGS Astrogeology Science Center / NASA LRO (Clementine/LROC) | Solar System Scope |
| `mars.jpg` | Mars Surface | NASA Mars Global Surveyor / Mars Orbiter Laser Altimeter (MOLA) | Solar System Scope |
| `mercury.jpg` | Mercury Surface | NASA MESSENGER MDIS Global Mosaic / USGS Astrogeology | Solar System Scope |
| `venus_surface.jpg` | Venus Radar Surface | NASA Magellan Radar Cartography / USGS Astrogeology | Solar System Scope |
| `sun.jpg` | Solar Photosphere | NASA Solar Dynamics Observatory (SDO) / SOHO | Solar System Scope |

## Modifications

All master 2048x1024 textures were downscaled to 1024x512 equirectangular JPEGs with progressive quality compression (q=4) via FFmpeg, optimizing the total combined asset footprint to under 750 KB for instant client loading across school networks without external CDN dependencies.
