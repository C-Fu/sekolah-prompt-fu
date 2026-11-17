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
| `mercury.jpg` | Mercury Surface | NASA MESSENGER MDIS Global Mosaic / USGS Astrogeology | Solar System Scope |
| `venus_surface.jpg` | Venus Cloud Tops | NASA Magellan Radar & Pioneer Venus Orbiter Cartography | Solar System Scope |
| `mars.jpg` | Mars Surface | NASA Mars Global Surveyor / Mars Orbiter Laser Altimeter (MOLA) | Solar System Scope |
| `jupiter.jpg` | Jupiter Atmosphere | NASA Cassini & Voyager imaging mosaics | Solar System Scope |
| `saturn.jpg` | Saturn Atmosphere | NASA Cassini imaging mosaic | Solar System Scope |
| `neptune.jpg` | Neptune Atmosphere | NASA Voyager 2 imaging mosaic | Solar System Scope |
| `sun.jpg` | Solar Photosphere | NASA Solar Dynamics Observatory (SDO) / SOHO | Solar System Scope |

*Note: Uranus is rendered with a procedural soft cyan atmosphere shader (`#b8e8ee` / `#9ed5de`) as real Uranus is nearly featureless.*

## Modifications

All Solar System Scope 4K/2K maps are optimized to 2048x1024 equirectangular JPEGs with 85% quality via FFmpeg, providing crisp 3D sphere mapping while maintaining an ultra-lean total asset footprint (~1.5 MB total across all bodies) for low latency on mobile and school networks without CDN dependencies.
