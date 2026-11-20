(function () {
  "use strict";

  function create(model) {
    const panel = document.getElementById("fictional-scene-panel");
    const content = document.getElementById("scene-content");
    const toggle = document.getElementById("scene-toggle");
    const canvas = document.getElementById("scene-canvas");
    const context = canvas.getContext("2d");
    const time = document.getElementById("scene-time");
    const growth = document.getElementById("scene-growth");
    const angle = document.getElementById("scene-angle");
    const flow = document.getElementById("scene-flow");
    const rain = document.getElementById("scene-rain");
    const reset = document.getElementById("scene-reset-water");
    const status = document.getElementById("scene-status");
    const columns = 32;
    const rows = 22;
    const minX = 0;
    const minY = 0;
    const cell = 20;
    let water = new Float64Array(columns * rows);
    let heights = new Float64Array(columns * rows);
    let inside = new Uint8Array(columns * rows);
    let terrainSignature = "";
    let height = model.getElevation();
    let timer = null;
    let frame = null;
    let hitRegions = [];
    let rainSteps = 0;
    panel.hidden = false;

    if (!context) {
      toggle.disabled = true;
      content.hidden = false;
      status.textContent = "This browser cannot display the 3D scene.";
      console.error("TerraForma could not initialize the 3D canvas.");
      return { update: function () {} };
    }

    function scheduleRender() {
      if (content.hidden || frame !== null) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        render();
      });
    }

    function stopRain() {
      if (timer !== null) clearInterval(timer);
      timer = null;
      rain.textContent = "Start simulated rain";
    }

    function rebuildTerrain() {
      const signature = JSON.stringify({
        boundary: model.getBoundary(),
        polygons: model.getItems().filter(function (item) {
          return ["building-footprint", "greenhouse", "garden-area", "garden-beds", "compost-area"].includes(item.featureId);
        }).map(function (item) { return item.polygon; })
      });
      if (signature === terrainSignature) return;
      terrainSignature = signature;
      height = model.getElevation();
      water = new Float64Array(columns * rows);
      rainSteps = 0;
      stopRain();
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          const index = y * columns + x;
          const point = [minX + (x + 0.5) * cell, minY + (y + 0.5) * cell];
          inside[index] = model.contains(point, model.getBoundary()) ? 1 : 0;
          heights[index] = height(point[0], point[1]);
        }
      }
      status.textContent = "Water cleared when the fictional terrain changed.";
    }

    function update() {
      rebuildTerrain();
      scheduleRender();
    }

    function project(x, y, z) {
      const radians = Number(angle.value) * Math.PI / 180;
      const dx = x - 320;
      const dy = y - 215;
      const rx = dx * Math.cos(radians) - dy * Math.sin(radians);
      const ry = dx * Math.sin(radians) + dy * Math.cos(radians);
      return [480 + rx * 1.3, 325 + ry * 0.66 - z * 0.92, ry];
    }

    function ground(x, y) {
      return (height(x, y) - 10) * model.unitsPerMeter() * 1.5;
    }

    function drawPolygon(points, fill, stroke, lineWidth) {
      if (!points.length) return;
      context.beginPath();
      points.forEach(function (point, index) {
        if (index === 0) context.moveTo(point[0], point[1]);
        else context.lineTo(point[0], point[1]);
      });
      context.closePath();
      if (fill) { context.fillStyle = fill; context.fill(); }
      if (stroke) {
        context.strokeStyle = stroke;
        context.lineWidth = lineWidth || 1;
        context.stroke();
      }
    }

    function position(x, y, offset) {
      return project(x, y, ground(x, y) + (offset || 0));
    }

    function sun() {
      const latitude = 45 * Math.PI / 180;
      const declination = 23.44 * Math.PI / 180;
      const hour = (Number(time.value) - 12) * Math.PI / 12;
      return {
        east: -Math.cos(declination) * Math.sin(hour),
        south: -(Math.cos(latitude) * Math.sin(declination) -
          Math.sin(latitude) * Math.cos(declination) * Math.cos(hour)),
        up: Math.sin(latitude) * Math.sin(declination) +
          Math.cos(latitude) * Math.cos(declination) * Math.cos(hour)
      };
    }

    function shadow(points, heightUnits, light) {
      if (light.up <= 0.03) return;
      const dx = -light.east * heightUnits / light.up;
      const dy = -light.south * heightUnits / light.up;
      const all = points.concat(points.map(function (p) { return [p[0] + dx, p[1] + dy]; }))
        .sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      function cross(a, b, c) {
        return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
      }
      function half(list) {
        const result = [];
        list.forEach(function (point) {
          while (result.length >= 2 && cross(result[result.length - 2], result[result.length - 1], point) <= 0) result.pop();
          result.push(point);
        });
        return result;
      }
      const lower = half(all);
      const upper = half(all.slice().reverse());
      const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
      drawPolygon(hull.map(function (p) { return position(p[0], p[1], 0.2); }), "rgba(35,47,37,.22)");
    }

    function circlePoints(x, y, radius, count) {
      return Array.from({ length: count }, function (_, index) {
        const theta = index * Math.PI * 2 / count;
        return [x + Math.cos(theta) * radius, y + Math.sin(theta) * radius];
      });
    }

    function treeDimensions(age, mature) {
      const fraction = Math.min(1, 0.18 + age / 25 * 0.82);
      return { height: mature * fraction * model.unitsPerMeter(), radius: (0.6 + fraction * 1.4) * model.unitsPerMeter() };
    }

    function tree(x, y, dimensions, color, id) {
      const base = position(x, y);
      const top = position(x, y, dimensions.height);
      context.lineWidth = Math.max(2, dimensions.radius * 0.25);
      context.strokeStyle = "#735640";
      context.beginPath();
      context.moveTo(base[0], base[1]);
      context.lineTo(top[0], top[1] + dimensions.radius * 0.5);
      context.stroke();
      context.beginPath();
      context.ellipse(top[0], top[1], dimensions.radius * 1.15, dimensions.radius * 0.8, 0, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
      context.strokeStyle = "#426344";
      context.lineWidth = 1.5;
      context.stroke();
      if (id) hitRegions.push({ id: id, circle: [top[0], top[1], dimensions.radius * 1.3, dimensions.radius] });
    }

    function extrude(item, heightUnits, color) {
      const bottom = item.polygon.map(function (p) { return position(p[0], p[1]); });
      const top = item.polygon.map(function (p) { return position(p[0], p[1], heightUnits); });
      for (let index = 0; index < bottom.length; index += 1) {
        const next = (index + 1) % bottom.length;
        drawPolygon([bottom[index], bottom[next], top[next], top[index]], color.side, "#6b6b51", 1);
      }
      drawPolygon(top, color.top, "#5b644f", 1.5);
      const hit = new Path2D();
      top.forEach(function (point, index) {
        if (!index) hit.moveTo(point[0], point[1]);
        else hit.lineTo(point[0], point[1]);
      });
      hit.closePath();
      hitRegions.push({ id: item.id, path: hit });
      if (item.polygon.length === 4 && ["building-footprint", "greenhouse"].includes(item.featureId)) {
        const points = item.polygon;
        const ridgeHeight = heightUnits + (item.featureId === "building-footprint" ? 1.5 : 0.8) * model.unitsPerMeter();
        const ridgeStart = position((points[0][0] + points[3][0]) / 2, (points[0][1] + points[3][1]) / 2, ridgeHeight);
        const ridgeEnd = position((points[1][0] + points[2][0]) / 2, (points[1][1] + points[2][1]) / 2, ridgeHeight);
        const roof = [top[0], top[1], ridgeEnd, ridgeStart, top[3]];
        drawPolygon([top[0], top[1], ridgeEnd, ridgeStart], color.top, "#647361", 1);
        drawPolygon([top[3], top[2], ridgeEnd, ridgeStart], item.featureId === "greenhouse" ? "#bde3dc" : "#905b49", "#647361", 1);
        const roofHit = new Path2D();
        roof.forEach(function (point, index) {
          if (!index) roofHit.moveTo(point[0], point[1]);
          else roofHit.lineTo(point[0], point[1]);
        });
        roofHit.closePath();
        hitRegions.push({ id: item.id, path: roofHit });
      }
      if (item.polygon.length === 4 && ["garden-area", "garden-beds"].includes(item.featureId)) {
        context.strokeStyle = item.featureId === "garden-beds" ? "#cdb18a" : "#879c69";
        context.lineWidth = 2;
        for (let row = 1; row < 4; row += 1) {
          const ratio = row / 4;
          const a = [top[0][0] * (1 - ratio) + top[3][0] * ratio, top[0][1] * (1 - ratio) + top[3][1] * ratio];
          const b = [top[1][0] * (1 - ratio) + top[2][0] * ratio, top[1][1] * (1 - ratio) + top[2][1] * ratio];
          context.beginPath(); context.moveTo(a[0], a[1]); context.lineTo(b[0], b[1]); context.stroke();
        }
      }
      (item.fenceSections || []).forEach(function (index) {
        const start = item.polygon[index];
        const end = item.polygon[(index + 1) % item.polygon.length];
        const fenceHeight = 1.2 * model.unitsPerMeter();
        const a = position(start[0], start[1], fenceHeight);
        const b = position(end[0], end[1], fenceHeight);
        drawPolygon([position(start[0], start[1]), position(end[0], end[1]), b, a], "rgba(141,105,66,.22)", "#715137", 2);
      });
      (item.plantings || []).forEach(function (plant) {
        const point = model.bedPlantPoint(item, plant.position);
        if (!point) return;
        const p = position(point[0], point[1], heightUnits + 1);
        context.beginPath(); context.arc(p[0], p[1], 2.5, 0, Math.PI * 2);
        context.fillStyle = "#5b914d"; context.fill();
      });
    }

    function neighbor(index) {
      const x = index % columns;
      const y = Math.floor(index / columns);
      let best = -1;
      let bestSurface = heights[index] + water[index];
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (!dx && !dy) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= columns || ny < 0 || ny >= rows) continue;
          const other = ny * columns + nx;
          if (!inside[other]) continue;
          const surface = heights[other] + water[other];
          if (surface < bestSurface - 0.00001) {
            bestSurface = surface;
            best = other;
          }
        }
      }
      return best;
    }

    function rainStep() {
      const delta = new Float64Array(water.length);
      for (let index = 0; index < water.length; index += 1) {
        if (!inside[index]) continue;
        water[index] += 0.001;
      }
      for (let index = 0; index < water.length; index += 1) {
        if (!inside[index]) continue;
        const next = neighbor(index);
        if (next < 0) continue;
        const transfer = Math.min(water[index] * 0.5,
          Math.max(0, (heights[index] + water[index] - heights[next] - water[next]) / 4));
        delta[index] -= transfer;
        delta[next] += transfer;
      }
      for (let index = 0; index < water.length; index += 1) water[index] += delta[index];
      rainSteps += 1;
      const activeCells = inside.reduce(function (sum, value) { return sum + value; }, 0);
      const retained = activeCells ? water.reduce(function (sum, value) { return sum + value; }, 0) * 1000 / activeCells : 0;
      status.textContent = "Simulated rain: " + rainSteps + " mm added; " + retained.toFixed(1) +
        " mm average retained. Closed boundary; no infiltration or evaporation.";
      scheduleRender();
    }

    function render() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#e7f0e9";
      context.fillRect(0, 0, canvas.width, canvas.height);
      const boundary = model.getBoundary();
      const tiles = [];
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          const index = y * columns + x;
          if (!inside[index]) continue;
          const x0 = minX + x * cell;
          const y0 = minY + y * cell;
          const corners = [[x0, y0], [x0 + cell, y0], [x0 + cell, y0 + cell], [x0, y0 + cell]];
          const projected = corners.map(function (p) { return position(p[0], p[1]); });
          tiles.push({ index: index, points: projected, depth: projected.reduce(function (a, p) { return a + p[2]; }, 0) / 4 });
        }
      }
      tiles.sort(function (a, b) { return a.depth - b.depth; });
      context.save();
      const clipPoints = boundary.map(function (p) { return position(p[0], p[1]); });
      context.beginPath();
      clipPoints.forEach(function (p, index) { if (!index) context.moveTo(p[0], p[1]); else context.lineTo(p[0], p[1]); });
      context.closePath();
      context.clip();
      tiles.forEach(function (tile) {
        const wet = water[tile.index];
        drawPolygon(tile.points, wet > 0.002 ? "rgba(74,159,192," + Math.min(0.8, 0.24 + wet * 8) + ")" : "#bfd1ad", "rgba(91,118,86,.15)", 0.6);
      });
      const driveway = [[70, 401], [190, 396], [223, 373], [171, 349], [148, 338], [139, 337], [145, 325]].map(function (p) {
        return position(p[0], p[1], 0.3);
      });
      context.lineCap = "round";
      context.strokeStyle = "#b49c79";
      context.lineWidth = 20;
      context.beginPath();
      context.moveTo(driveway[0][0], driveway[0][1]);
      context.bezierCurveTo(driveway[1][0], driveway[1][1], driveway[2][0], driveway[2][1], driveway[3][0], driveway[3][1]);
      context.bezierCurveTo(driveway[4][0], driveway[4][1], driveway[5][0], driveway[5][1], driveway[6][0], driveway[6][1]);
      context.stroke();
      context.strokeStyle = "#deccaa";
      context.lineWidth = 14;
      context.stroke();
      if (flow.checked) {
        context.strokeStyle = "rgba(37,114,142,.65)";
        context.lineWidth = 1.8;
        for (let y = 1; y < rows; y += 3) {
          for (let x = 1; x < columns; x += 3) {
            const index = y * columns + x;
            if (!inside[index]) continue;
            const next = neighbor(index);
            if (next < 0) continue;
            const a = position(minX + (x + 0.5) * cell, minY + (y + 0.5) * cell, 0.5);
            const b = position(minX + (next % columns + 0.5) * cell, minY + (Math.floor(next / columns) + 0.5) * cell, 0.5);
            const theta = Math.atan2(b[1] - a[1], b[0] - a[0]);
            context.beginPath(); context.moveTo(a[0], a[1]); context.lineTo(b[0], b[1]);
            context.lineTo(b[0] - 5 * Math.cos(theta - 0.5), b[1] - 5 * Math.sin(theta - 0.5));
            context.moveTo(b[0], b[1]); context.lineTo(b[0] - 5 * Math.cos(theta + 0.5), b[1] - 5 * Math.sin(theta + 0.5)); context.stroke();
          }
        }
      }
      const light = sun();
      const age = Number(growth.value);
      const trees = [];
      for (let x = 95; x <= 550; x += 38) {
        const y = 36 + (x % 3) * 5;
        if (model.contains([x, y], boundary)) trees.push({ x: x, y: y, dimensions: treeDimensions(age, 8), color: "#5c895a" });
      }
      const objects = model.getItems().map(function (item) {
        const center = item.polygon.reduce(function (sum, p) {
          sum[0] += p[0] / item.polygon.length; sum[1] += p[1] / item.polygon.length; return sum;
        }, [0, 0]);
        const treeFeature = ["fruit-tree", "apple-guild", "food-forest", "berry-planting"].includes(item.featureId);
        const objectHeight = (item.featureId === "building-footprint" ? 5 : item.featureId === "greenhouse" ? 3 :
          item.featureId === "beneficial-habitat" ? 1.5 : 0.25) * model.unitsPerMeter();
        if (treeFeature) {
          const bounds = item.polygon.reduce(function (b, p) {
            b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1]);
            b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1]); return b;
          }, [Infinity, Infinity, -Infinity, -Infinity]);
          const count = item.featureId === "food-forest" ? 3 : 1;
          for (let i = 0; i < count; i += 1) {
            const x = bounds[0] + (bounds[2] - bounds[0]) * (i + 1) / (count + 1);
            const y = center[1];
            if (model.contains([x, y], item.polygon)) trees.push({
              x: x, y: y, id: item.id, dimensions: treeDimensions(age, item.featureId === "berry-planting" ? 2 : 6), color: "#679a60"
            });
          }
        }
        return { item: item, center: center, height: objectHeight };
      });
      objects.forEach(function (obj) {
        const roof = obj.item.featureId === "building-footprint" ? 1.5 :
          obj.item.featureId === "greenhouse" ? 0.8 : 0;
        shadow(obj.item.polygon, obj.height + roof * model.unitsPerMeter(), light);
      });
      trees.forEach(function (entry) { shadow(circlePoints(entry.x, entry.y, entry.dimensions.radius, 12), entry.dimensions.height, light); });
      context.restore();
      drawPolygon(clipPoints, null, "#647b60", 2);
      hitRegions = [];
      const drawables = objects.map(function (obj) {
        return { depth: position(obj.center[0], obj.center[1])[2], object: obj };
      }).concat(trees.map(function (entry) {
        return { depth: position(entry.x, entry.y)[2], tree: entry };
      }));
      drawables.sort(function (a, b) {
        const aGarden = a.object && a.object.item.featureId === "garden-area";
        const bGarden = b.object && b.object.item.featureId === "garden-area";
        return Number(bGarden) - Number(aGarden) || a.depth - b.depth;
      });
      drawables.forEach(function (entry) {
        if (entry.tree) {
          tree(entry.tree.x, entry.tree.y, entry.tree.dimensions, entry.tree.color, entry.tree.id);
          return;
        }
        const obj = entry.object;
        const feature = obj.item.featureId;
        const colors = feature === "building-footprint" ? { top: "#ae7157", side: "#dbc7a5" } :
          feature === "greenhouse" ? { top: "#addad2", side: "#d0eae0" } :
          feature === "garden-beds" ? { top: "#946b44", side: "#765036" } :
          feature === "garden-area" ? { top: "#a7bd85", side: "#819b6e" } :
          { top: "#c5ad7f", side: "#a9916c" };
        extrude(obj.item, obj.height, colors);
      });
      document.getElementById("scene-time-output").textContent =
        String(Math.floor(Number(time.value))).padStart(2, "0") + ":" + String(Math.round(Number(time.value) % 1 * 60)).padStart(2, "0") + " solar";
      document.getElementById("scene-growth-output").textContent = age + " years";
      document.getElementById("scene-angle-output").textContent = angle.value + "°";
    }

    toggle.addEventListener("click", function () {
      content.hidden = !content.hidden;
      toggle.setAttribute("aria-expanded", String(!content.hidden));
      toggle.textContent = content.hidden ? "Open 3D view" : "Close 3D view";
      if (content.hidden) stopRain();
      else { rebuildTerrain(); scheduleRender(); }
    });
    [time, growth, angle, flow].forEach(function (input) { input.addEventListener("input", scheduleRender); });
    rain.addEventListener("click", function () {
      if (timer !== null) { stopRain(); status.textContent += " Rain paused."; return; }
      rain.textContent = "Pause simulated rain";
      rainStep();
      timer = setInterval(rainStep, 300);
    });
    reset.addEventListener("click", function () {
      stopRain();
      water.fill(0);
      rainSteps = 0;
      status.textContent = "Simulated water cleared.";
      scheduleRender();
    });
    canvas.addEventListener("click", function (event) {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * canvas.width / rect.width;
      const y = (event.clientY - rect.top) * canvas.height / rect.height;
      const hit = hitRegions.slice().reverse().find(function (entry) {
        return entry.circle
          ? ((x - entry.circle[0]) / entry.circle[2]) ** 2 + ((y - entry.circle[1]) / entry.circle[3]) ** 2 <= 1
          : context.isPointInPath(entry.path, x, y);
      });
      if (hit) {
        status.textContent = model.select(hit.id)
          ? "Feature selected. Use the footprint editor below the 3D view."
          : "Finish or cancel the current drawing before selecting a feature.";
      }
    });
    update();
    return { update: update };
  }

  window.TerraFormaFictionalScene = { create: create };
})();
