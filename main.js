lucide.createIcons();
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function escapeAttr(str) {
  if (!str) return "";
  return String(str).replace(/"/g, "&quot;");
} /* Helper lấy chuỗi giờ hiện tại theo giờ Việt Nam UTC+7 chuẩn xác*/
function getNowUtc7String() {
  var now = new Date();
  var utc = now.getTime() + now.getTimezoneOffset() * 60000;
  var d7 = new Date(utc + 3600000 * 7);
  var pad = function (n) {
    return n < 10 ? "0" + n : n;
  };
  return (
    pad(d7.getHours()) +
    ":" +
    pad(d7.getMinutes()) +
    ":" +
    pad(d7.getSeconds()) +
    " " +
    d7.getDate() +
    "/" +
    (d7.getMonth() + 1) +
    "/" +
    d7.getFullYear()
  );
} /* =============================================================            // LOGIC MẪU 3: CỔNG QUỐC TẾ ĐỘC QUYỀN (3D COVERFLOW & CYBER CANVAS)            // =============================================================            // 1. Đồng hồ thời gian thực GIỜ HỆ THỐNG (UTC+7)*/
function tickSystemTime() {
  var now = new Date();
  var utc = now.getTime() + now.getTimezoneOffset() * 60000;
  var d7 = new Date(utc + 3600000 * 7);
  var pad = function (n) {
    return n < 10 ? "0" + n : n;
  };
  var timeStr =
    pad(d7.getHours()) +
    ":" +
    pad(d7.getMinutes()) +
    ":" +
    pad(d7.getSeconds()) +
    " UTC+7";
  var el = document.getElementById("status-system-time");
  if (el) el.textContent = timeStr;
}
tickSystemTime();
setInterval(
  tickSystemTime,
  1000,
); /* 2. Fetch IP thực tế của khách hàng (Client Real IP) nếu có mạng                        // 3. Khởi tạo & Tạo ngẫu nhiên Fake IP cho hệ thống*/
var RANDOM_IP_PREFIXES = [
  "103.253.142.",
  "177.18.230.",
  "88.247.112.",
  "94.200.15.",
  "104.244.42.",
  "51.140.128.",
  "133.242.18.",
  "185.86.151.",
  "45.120.150.",
  "128.199.204.",
  "139.59.221.",
  "165.22.108.",
  "14.161.42.",
  "211.234.12.",
  "176.234.85.",
  "191.232.140.",
];
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomFakeIp(baseIp) {
  if (baseIp && typeof baseIp === "string") {
    var trimmed = baseIp.trim();
    var parts = trimmed.split(".");
    if (parts.length === 4) {
      return (
        parts[0] + "." + parts[1] + "." + parts[2] + "." + randomInt(10, 245)
      );
    }
    if (parts.length === 3) {
      return trimmed + (trimmed.endsWith(".") ? "" : ".") + randomInt(10, 245);
    }
  }
  var prefix =
    RANDOM_IP_PREFIXES[Math.floor(Math.random() * RANDOM_IP_PREFIXES.length)];
  return prefix + randomInt(10, 245);
}
function updateStatusFakeIp() {
  var fakeIpEl = document.getElementById("status-fake-ip");
  if (!fakeIpEl || totalCards === 0) return;
  var activeCard = cards[activeIndex];
  var baseIp = activeCard ? activeCard.getAttribute("data-fake-ip") : "";
  fakeIpEl.textContent = getRandomFakeIp(baseIp);
} /* 4. Khởi tạo 3D Coverflow Carousel*/
var cards = Array.from(document.querySelectorAll(".coverflow-card"));
var totalCards = cards.length;
var activeIndex = Math.min(
  3,
  Math.floor(totalCards / 2),
); /* Ưu tiên card giữa*/
var autoSwipeInterval = 3;
var isAutoSwipe = true;
var swipeTimer = null;
var isHovering = false;
function updateCoverflow() {
  if (totalCards === 0) return;
  var isMobile = window.innerWidth < 640;
  var stepX = isMobile ? 85 : 210;
  var stepZ = isMobile ? -50 : -65;
  var stepRotate = isMobile ? 18 : 25;
  cards.forEach(function (card, i) {
    var diff = i - activeIndex; /* Xử lý vòng lặp tròn (circular wrap-around)*/
    while (diff > totalCards / 2) diff -= totalCards;
    while (diff < -totalCards / 2) diff += totalCards;
    card.classList.remove("active-node");
    if (diff === 0) {
      /* Card trung tâm (Active) - Luôn sắc nét 100% không làm mờ pixel*/
      card.classList.add("active-node");
      card.style.transform = "translate(-50%, -50%)";
      card.style.zIndex = "50";
      card.style.opacity = "1";
      card.style.filter = "none";
      card.style.pointerEvents = "auto";
    } else if (Math.abs(diff) === 1) {
      /* Card bên cạnh 1 nấc*/
      var tx = diff * stepX;
      var scaleSide = isMobile ? 0.85 : 0.88;
      var opacitySide = isMobile ? 0.45 : 0.6;
      card.style.transform =
        "translate(-50%, -50%) translateX(" +
        tx +
        "px) scale(" +
        scaleSide +
        ")";
      card.style.zIndex = "30";
      card.style.opacity = String(opacitySide);
      card.style.filter = "none";
      card.style.pointerEvents = "auto";
    } else if (Math.abs(diff) === 2 && !isMobile) {
      /* Card bên cạnh 2 nấc*/
      var tx2 = diff * (stepX * 1.65);
      card.style.transform =
        "translate(-50%, -50%) translateX(" + tx2 + "px) scale(0.75)";
      card.style.zIndex = "20";
      card.style.opacity = "0.35";
      card.style.filter = "none";
      card.style.pointerEvents = "auto";
    } else {
      /* Các card xa hơn*/
      var txFar = diff > 0 ? 450 : -450;
      card.style.transform =
        "translate(-50%, -50%) translateX(" + txFar + "px) scale(0.6)";
      card.style.zIndex = "10";
      card.style.opacity = "0";
      card.style.filter = "none";
      card.style.pointerEvents = "none";
    }
  }); /* Cập nhật ngẫu nhiên Fake IP theo card đang được chọn*/
  updateStatusFakeIp();
} /* Tự động nhảy random fake IP tuần hoàn mô phỏng Dynamic VPN Tunnel*/
setInterval(updateStatusFakeIp, 4500);
var isTouchMoving = false;
window.handleCardClick = function (idx) {
  if (isTouchMoving) return;
  if (idx !== activeIndex) {
    activeIndex = idx;
    updateCoverflow();
    resetAutoSwipeTimer();
  }
};
window.handlePrevClick = function (e) {
  if (e) e.stopPropagation();
  if (totalCards > 0) {
    activeIndex = (activeIndex - 1 + totalCards) % totalCards;
    updateCoverflow();
    resetAutoSwipeTimer();
  }
};
window.handleNextClick = function (e) {
  if (e) e.stopPropagation();
  if (totalCards > 0) {
    activeIndex = (activeIndex + 1) % totalCards;
    updateCoverflow();
    resetAutoSwipeTimer();
  }
}; /* Hỗ trợ Auto swipe tự động lướt*/
function initFlagSpheres() {
  document.querySelectorAll(".flag-orb-image").forEach(function (image) {
    function renderSphere() {
      if (!image.naturalWidth || image.dataset.flagOrbReady) return;
      image.dataset.flagOrbReady = "true";

      var textureCanvas = document.createElement("canvas");
      textureCanvas.width = image.naturalWidth;
      textureCanvas.height = image.naturalHeight;
      var textureContext = textureCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (!textureContext) return;
      textureContext.drawImage(image, 0, 0);
      var texture = textureContext.getImageData(
        0,
        0,
        textureCanvas.width,
        textureCanvas.height,
      );

      var size = 160;
      var sphereCanvas = document.createElement("canvas");
      sphereCanvas.className = "flag-orb-canvas";
      sphereCanvas.width = size;
      sphereCanvas.height = size;
      sphereCanvas.setAttribute("aria-hidden", "true");
      var sphereContext = sphereCanvas.getContext("2d");
      if (!sphereContext) return;
      var frame = sphereContext.createImageData(size, size);
      var pixels = frame.data;
      var points = [];
      var radius = size / 2;
      var tau = Math.PI * 2;
      var lightX = -0.45;
      var lightY = -0.35;
      var lightZ = 0.82;
      var lightLength = Math.sqrt(
        lightX * lightX + lightY * lightY + lightZ * lightZ,
      );
      lightX /= lightLength;
      lightY /= lightLength;
      lightZ /= lightLength;

      for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
          var nx = (x + 0.5 - radius) / radius;
          var ny = (y + 0.5 - radius) / radius;
          var distanceSquared = nx * nx + ny * ny;
          var pixelIndex = (y * size + x) * 4;
          if (distanceSquared > 1) continue;

          var nz = Math.sqrt(1 - distanceSquared);
          var longitude = Math.atan2(nx, nz);
          var latitude = Math.asin(-ny);
          var light = Math.max(
            0.28,
            0.3 + (nx * lightX - ny * lightY + nz * lightZ) * 0.7,
          );
          points.push({
            pixelIndex: pixelIndex,
            longitude: longitude,
            textureY: Math.min(
              textureCanvas.height - 1,
              Math.max(
                0,
                Math.floor((0.5 - latitude / Math.PI) * textureCanvas.height),
              ),
            ),
            light: light,
          });
          pixels[pixelIndex + 3] = 255;
        }
      }

      image.parentElement.appendChild(sphereCanvas);
      image.style.opacity = "0";
      function drawSphere(timestamp) {
        var rotation = timestamp * 0.00055;
        for (var i = 0; i < points.length; i++) {
          var point = points[i];
          var u = ((point.longitude + rotation) / tau + 0.5) % 1;
          if (u < 0) u += 1;
          var textureX = Math.floor(u * textureCanvas.width);
          var textureIndex =
            (point.textureY * textureCanvas.width + textureX) * 4;
          var outputIndex = point.pixelIndex;
          pixels[outputIndex] = texture.data[textureIndex] * point.light;
          pixels[outputIndex + 1] =
            texture.data[textureIndex + 1] * point.light;
          pixels[outputIndex + 2] =
            texture.data[textureIndex + 2] * point.light;
        }
        sphereContext.putImageData(frame, 0, 0);
        requestAnimationFrame(drawSphere);
      }
      requestAnimationFrame(drawSphere);
    }

    if (image.complete) {
      renderSphere();
    } else {
      image.addEventListener("load", renderSphere, { once: true });
    }
  });
}
initFlagSpheres();
function startAutoSwipe() {
  if (!isAutoSwipe || totalCards <= 1) return;
  stopAutoSwipe();
  swipeTimer = setInterval(
    function () {
      if (!isHovering) {
        activeIndex = (activeIndex + 1) % totalCards;
        updateCoverflow();
      }
    },
    Math.max(1500, autoSwipeInterval * 1000),
  );
}
function stopAutoSwipe() {
  if (swipeTimer) {
    clearInterval(swipeTimer);
    swipeTimer = null;
  }
}
function resetAutoSwipeTimer() {
  stopAutoSwipe();
  startAutoSwipe();
}
var carouselBox = document.getElementById("coverflow-carousel");
if (carouselBox) {
  carouselBox.addEventListener("mouseenter", function () {
    isHovering = true;
  });
  carouselBox.addEventListener("mouseleave", function () {
    isHovering = false;
  }); /* Touch swipe gestures cho Mobile mượt mà, không bị xung đột với Click*/
  var touchStartX = 0;
  var touchStartY = 0;
  carouselBox.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isTouchMoving = false;
        isHovering = true;
      }
    },
    { passive: true },
  );
  carouselBox.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches && e.touches.length > 0) {
        var dx = Math.abs(e.touches[0].clientX - touchStartX);
        var dy = Math.abs(e.touches[0].clientY - touchStartY);
        if (dx > 8 || dy > 8) {
          isTouchMoving = true;
        }
      }
    },
    { passive: true },
  );
  carouselBox.addEventListener(
    "touchend",
    function (e) {
      isHovering = false;
      if (e.changedTouches && e.changedTouches.length > 0) {
        var diffX = e.changedTouches[0].clientX - touchStartX;
        var diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            window.handleNextClick();
          } else {
            window.handlePrevClick();
          }
        }
      }
      setTimeout(function () {
        isTouchMoving = false;
      }, 100);
    },
    { passive: true },
  );
}
window.addEventListener("resize", updateCoverflow);
updateCoverflow();
startAutoSwipe(); /* Mô phỏng đo đạc trực tiếp (Telemetry dao động nhẹ ping ±1-2ms, tải ±0.2% như hệ thống thật)*/
setInterval(function () {
  var pings = document.querySelectorAll(".dynamic-card-ping");
  var loads = document.querySelectorAll(".dynamic-card-load");
  pings.forEach(function (el) {
    var base = parseInt(el.getAttribute("data-ping")) || 25;
    var offset = Math.floor(Math.random() * 3) - 1;
    el.textContent = Math.max(5, base + offset) + "ms";
  });
  loads.forEach(function (el) {
    var base = parseFloat(el.getAttribute("data-load")) || 18.5;
    var offset = Math.random() * 0.6 - 0.3;
    el.textContent = Math.max(5, base + offset).toFixed(1) + "%";
  });
}, 3500); /* 5. Khởi tạo Interactive Cyber Canvas (Các line màu sắc nét tỏa ra di chuyển theo chuột) */
(function initCyberCanvas() {
  var canvas = document.getElementById("cyber-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var width, height;
  var dpr = window.devicePixelRatio || 1;
  var particles = [];
  var numParticles = Math.min(65, Math.floor(window.innerWidth / 20));
  var mouse = {
    x: null,
    y: null,
    targetX: null,
    targetY: null,
    isHovered: false,
  };
  var colors = [
    "#00f2fe",
    "#4facfe",
    "#06b6d4",
    "#a855f7",
    "#38bdf8",
    "#00ffcc",
  ];
  var glowIntensity = 0;
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);
  for (var i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.45 + 0.35,
    });
  }
  window.addEventListener("mousemove", function (e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isHovered = true;
    if (mouse.x === null) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
  });
  window.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches && e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isHovered = true;
        if (mouse.x === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        }
      }
    },
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches && e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isHovered = true;
        if (mouse.x === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        }
      }
    },
    { passive: true },
  );
  window.addEventListener(
    "touchend",
    function () {
      mouse.isHovered = false;
    },
    { passive: true },
  );
  window.addEventListener(
    "touchcancel",
    function () {
      mouse.isHovered = false;
    },
    { passive: true },
  );
  window.addEventListener("mouseleave", function () {
    mouse.isHovered = false;
  });
  function draw() {
    requestAnimationFrame(draw);
    ctx.fillStyle = "rgba(3, 7, 18, 0.3)";
    ctx.fillRect(
      0,
      0,
      width,
      height,
    ); /* Fade in/out cho hiệu ứng tỏa tia theo tương tác*/
    if (mouse.isHovered) {
      glowIntensity = Math.min(1, glowIntensity + 0.12);
    } else {
      glowIntensity = Math.max(0, glowIntensity - 0.05);
    }
    if (glowIntensity > 0.01 && mouse.targetX !== null && mouse.x !== null) {
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y +=
        (mouse.targetY - mouse.y) *
        0.18; /* Quầng sáng Laser bao quanh vị trí chuột (mờ dần và biến mất khi ngưng chạm)*/
      var glow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        4,
        mouse.x,
        mouse.y,
        170,
      );
      glow.addColorStop(0, "rgba(6, 182, 212, " + 0.45 * glowIntensity + ")");
      glow.addColorStop(
        0.4,
        "rgba(168, 85, 247, " + 0.15 * glowIntensity + ")",
      );
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 170, 0, Math.PI * 2);
      ctx.fill(); /* Các tia sáng tỏa ra từ chuột tới các điểm hạt gần nhất*/
      for (var p = 0; p < particles.length; p++) {
        var pt = particles[p];
        var dx = pt.x - mouse.x;
        var dy = pt.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 210) {
          var factor = (1 - dist / 210) * glowIntensity;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(pt.x, pt.y);
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = factor * 1.6;
          ctx.globalAlpha = factor * 0.9;
          ctx.stroke(); /* Lực đẩy / hút hạt nhẹ khi di chuyển qua */
          pt.x += (dx / dist) * factor * 1.1;
          pt.y += (dy / dist) * factor * 1.1;
        }
      }
    } /* Vẽ các điểm hạt bay và line liên kết giữa các hạt*/
    for (var i = 0; i < particles.length; i++) {
      var p1 = particles[i];
      p1.x += p1.vx;
      p1.y += p1.vy;
      if (p1.x < 0) p1.x = width;
      if (p1.x > width) p1.x = 0;
      if (p1.y < 0) p1.y = height;
      if (p1.y > height) p1.y = 0;
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
      ctx.fillStyle = p1.color;
      ctx.globalAlpha = p1.alpha;
      ctx.fill();
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var ddx = p1.x - p2.x;
        var ddy = p1.y - p2.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p1.color;
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = (1 - d / 110) * 0.35;
          ctx.stroke();
        }
      }
    }
  }
  draw();
})();
