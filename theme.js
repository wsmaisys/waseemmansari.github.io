/**
 * ============================================================================
 * THEME.JS - Wasim M Ansari | AI/ML Engineer & GenAI Architect Portfolio
 * 3D Wavy Cubes WebGL Engine (Vertical 3D Wall), UI Controllers, & Zero CDN
 * ============================================================================
 */

(function () {
  "use strict";

  /* ==========================================================================
     1. PURE WEBGL 3D WAVY CUBES WALL ENGINE (Zero CDN / Zero Dependencies)
     ========================================================================== */
  function initWavyCubes() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.warn("WebGL not supported; falling back to CSS background.");
      return;
    }

    // Check for instancing extension
    const ext = gl.getExtension("ANGLE_instanced_arrays");
    if (!ext) {
      console.warn("ANGLE_instanced_arrays not supported.");
      return;
    }

    // Vertex Shader: Vertical 3D Cube Wall
    const vsSource = `
      precision highp float;

      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec2 aOffset; // X, Y position on the wall
      attribute float aInstanceId;

      uniform mat4 uProjection;
      uniform mat4 uView;
      uniform float uTime;
      
      // Ripple trail data (x, y, age, strength)
      uniform vec4 uRipples[32];
      uniform int uRippleCount;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying float vHeight;
      varying vec2 vGridPos;

      // Deterministic noise hash
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123) - 0.5;
      }

      void main() {
        vGridPos = aOffset;
        vec2 worldXY = aOffset + hash(aOffset) * 0.02;
        
        float waveHeight = 0.0;
        float totalWeight = 0.0;
        
        // Interactive cursor ripples across the vertical wall (only animates on user interaction)
        for (int i = 0; i < 32; i++) {
          if (i >= uRippleCount) break;
          vec4 rip = uRipples[i];
          float dist = length(worldXY - rip.xy);
          float wavefront = 8.5 * rip.z; // Wave speed * age
          float relDist = dist - wavefront;
          
          float window = exp(-(relDist * relDist) / 5.2);
          float fade = exp(-rip.z / 2.4);
          float atten = 1.0 / (1.0 + dist * 0.08);
          float weight = fade * window * atten * rip.w;
          
          waveHeight += weight * cos(1.85 * relDist);
          totalWeight += weight;
        }

        if (totalWeight > 0.001) {
          waveHeight /= max(totalWeight, 1.0);
        } else {
          waveHeight = 0.0;
        }
        float displacement = clamp(waveHeight * 1.85, 0.0, 2.4);

        // Displace the front face of the cube forward (+Z towards viewer)
        vec3 pos = aPosition;
        if (pos.z > 0.0) {
          pos.z += displacement;
          vHeight = displacement;
        } else {
          vHeight = 0.0;
        }

        // Final world coordinates on vertical wall (X, Y plane, depth along Z)
        vec3 worldPos = vec3(pos.x + aOffset.x, pos.y + aOffset.y, pos.z);
        vWorldPos = worldPos;
        vNormal = aNormal;

        gl_Position = uProjection * uView * vec4(worldPos, 1.0);
      }
    `;

    // Fragment Shader: High-Impact 3D Shading & Cyber Gradients
    const fsSource = `
      precision highp float;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying float vHeight;
      varying vec2 vGridPos;

      uniform vec3 uColorBase;
      uniform vec3 uColorWave;
      uniform vec3 uColorAccent;

      void main() {
        vec3 normal = normalize(vNormal);

        // Key Light (Top-Left Forward)
        vec3 lightDir1 = normalize(vec3(-0.45, 0.65, 0.85));
        float diff1 = max(dot(normal, lightDir1), 0.0);

        // Fill Light (Bottom-Right Soft)
        vec3 lightDir2 = normalize(vec3(0.55, -0.35, 0.6));
        float diff2 = max(dot(normal, lightDir2), 0.0) * 0.38;

        // Ambient occlusion: front faces are brighter, side faces darker for 3D depth
        float frontMask = smoothstep(0.4, 0.95, normal.z);
        float ambient = mix(0.18, 0.58, frontMask);

        // Height-based dynamic gradient (Z displacement protrusion)
        float t = clamp((vHeight + 0.25) / 1.75, 0.0, 1.0);
        vec3 cubeColor = mix(uColorBase, uColorWave, t);
        
        // Edge crest neon highlight
        cubeColor = mix(cubeColor, uColorAccent, pow(t, 2.4) * 0.88);

        vec3 finalLighting = cubeColor * (diff1 * 0.85 + diff2 + ambient);

        // Soft sunlit atmospheric fog towards the edges of the wall
        float dist = length(vWorldPos.xy);
        float fogFactor = smoothstep(12.0, 32.0, dist);
        vec3 fogColor = vec3(0.933, 0.969, 0.957);

        gl_FragColor = vec4(mix(finalLighting, fogColor, fogFactor * 0.85), 1.0);
      }
    `;

    function compileShader(src, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // High-Resolution Micro-Cube Geometry (w=0.205, h=0.205, depth in Z)
    const w = 0.205, h = 0.205, zFront = 0.28, zBack = -0.75;
    const cubeVertices = new Float32Array([
      // Front face (facing camera +Z)
      -w, -h,  zFront,   0,  0,  1,
       w, -h,  zFront,   0,  0,  1,
       w,  h,  zFront,   0,  0,  1,
      -w, -h,  zFront,   0,  0,  1,
       w,  h,  zFront,   0,  0,  1,
      -w,  h,  zFront,   0,  0,  1,
      // Back face (-Z)
       w, -h,  zBack,    0,  0, -1,
      -w, -h,  zBack,    0,  0, -1,
      -w,  h,  zBack,    0,  0, -1,
       w, -h,  zBack,    0,  0, -1,
      -w,  h,  zBack,    0,  0, -1,
       w,  h,  zBack,    0,  0, -1,
      // Top face (+Y)
      -w,  h,  zBack,    0,  1,  0,
       w,  h,  zBack,    0,  1,  0,
       w,  h,  zFront,   0,  1,  0,
      -w,  h,  zBack,    0,  1,  0,
       w,  h,  zFront,   0,  1,  0,
      -w,  h,  zFront,   0,  1,  0,
      // Bottom face (-Y)
      -w, -h,  zFront,   0, -1,  0,
       w, -h,  zFront,   0, -1,  0,
       w, -h,  zBack,    0, -1,  0,
      -w, -h,  zFront,   0, -1,  0,
       w, -h,  zBack,    0, -1,  0,
      -w, -h,  zBack,    0, -1,  0,
      // Left face (-X)
      -w, -h,  zBack,   -1,  0,  0,
      -w, -h,  zFront,  -1,  0,  0,
      -w,  h,  zFront,  -1,  0,  0,
      -w, -h,  zBack,   -1,  0,  0,
      -w,  h,  zFront,  -1,  0,  0,
      -w,  h,  zBack,   -1,  0,  0,
      // Right face (+X)
       w, -h,  zFront,   1,  0,  0,
       w, -h,  zBack,    1,  0,  0,
       w,  h,  zBack,    1,  0,  0,
       w, -h,  zFront,   1,  0,  0,
       w,  h,  zBack,    1,  0,  0,
       w,  h,  zFront,   1,  0,  0
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

    const aPosLoc = gl.getAttribLocation(program, "aPosition");
    const aNormLoc = gl.getAttribLocation(program, "aNormal");

    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 24, 0);

    gl.enableVertexAttribArray(aNormLoc);
    gl.vertexAttribPointer(aNormLoc, 3, gl.FLOAT, false, 24, 12);

    // Setup Ultra-Dense Vertical Wall Instances (96 columns x 64 rows = 6,144 cubes)
    const cols = 96;
    const rows = 64;
    const gap = 0.46;
    const totalInstances = cols * rows;
    const offsets = new Float32Array(totalInstances * 2);

    let idx = 0;
    const halfWidth = (cols - 1) * gap * 0.5;
    const halfHeight = (rows - 1) * gap * 0.5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        offsets[idx * 2] = c * gap - halfWidth;     // X coordinate
        offsets[idx * 2 + 1] = r * gap - halfHeight; // Y coordinate
        idx++;
      }
    }

    const offsetBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);

    const aOffsetLoc = gl.getAttribLocation(program, "aOffset");
    gl.enableVertexAttribArray(aOffsetLoc);
    gl.vertexAttribPointer(aOffsetLoc, 2, gl.FLOAT, false, 8, 0);
    ext.vertexAttribDivisorANGLE(aOffsetLoc, 1); // Once per instance

    // Uniform Locations
    const uProjLoc = gl.getUniformLocation(program, "uProjection");
    const uViewLoc = gl.getUniformLocation(program, "uView");
    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uColorBaseLoc = gl.getUniformLocation(program, "uColorBase");
    const uColorWaveLoc = gl.getUniformLocation(program, "uColorWave");
    const uColorAccentLoc = gl.getUniformLocation(program, "uColorAccent");
    const uRippleCountLoc = gl.getUniformLocation(program, "uRippleCount");

    // Ripple array uniform locations
    const rippleLocs = [];
    for (let i = 0; i < 32; i++) {
      rippleLocs.push(gl.getUniformLocation(program, `uRipples[${i}]`));
    }

    // Set Sunlit Tropical Colors: Seafoam Sand base, Caribbean Lagoon wave, Hibiscus Coral peak
    gl.uniform3f(uColorBaseLoc, 0.863, 0.957, 0.929);    // #DCF4ED (Sunlit Seafoam Sand)
    gl.uniform3f(uColorWaveLoc, 0.024, 0.714, 0.831);    // #06B6D4 (Caribbean Lagoon Cyan)
    gl.uniform3f(uColorAccentLoc, 0.957, 0.247, 0.369);  // #F43F5E (Hibiscus Coral)

    // Matrix Math Utilities
    function createPerspectiveMatrix(fov, aspect, near, far) {
      const f = 1.0 / Math.tan(fov / 2);
      const nf = 1 / (near - far);
      return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * far * near) * nf, 0
      ]);
    }

    function createLookAtMatrix(eye, target, up) {
      let z0 = eye[0] - target[0], z1 = eye[1] - target[1], z2 = eye[2] - target[2];
      let len = 1 / Math.hypot(z0, z1, z2);
      z0 *= len; z1 *= len; z2 *= len;

      let x0 = up[1] * z2 - up[2] * z1, x1 = up[2] * z0 - up[0] * z2, x2 = up[0] * z1 - up[1] * z0;
      len = 1 / Math.hypot(x0, x1, x2);
      x0 *= len; x1 *= len; x2 *= len;

      let y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0;

      return new Float32Array([
        x0, y0, z0, 0,
        x1, y1, z1, 0,
        x2, y2, z2, 0,
        -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]),
        -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]),
        -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]),
        1
      ]);
    }

    // Ripple State
    const ripples = [];
    let lastPointerPos = null;
    let timeSinceLastPointer = 0;
    let autoRippleTimer = 0;

    function addRipple(x, y, strength = 1.0) {
      if (ripples.length >= 32) ripples.shift();
      ripples.push({ x, y, age: 0, strength });
    }

    // Pointer Mapping directly onto High-Density Vertical Wall (X, Y)
    window.addEventListener("pointermove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Maps screen coordinates directly to the wall plane
      const wallX = nx * 19.5;
      const wallY = ny * 12.5;

      if (lastPointerPos) {
        const dx = wallX - lastPointerPos.x;
        const dy = wallY - lastPointerPos.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.35) {
          addRipple(wallX, wallY, Math.min(dist * 0.95, 1.7));
          lastPointerPos = { x: wallX, y: wallY };
        }
      } else {
        addRipple(wallX, wallY, 1.4);
        lastPointerPos = { x: wallX, y: wallY };
      }
      timeSinceLastPointer = 0;
    }, { passive: true });

    // Handle Resize
    let width = 0, height = 0;
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener("resize", resize);
    resize();

    // GL Settings
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.957, 0.976, 0.969, 1.0);

    // Render Loop
    let lastTime = performance.now();
    let isRunning = true;

    document.addEventListener("visibilitychange", () => {
      isRunning = !document.hidden;
      if (isRunning) lastTime = performance.now();
    });

    function render(currentTime) {
      if (!isRunning) {
        requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((currentTime - lastTime) * 0.001, 0.1);
      lastTime = currentTime;
      const t = currentTime * 0.001;

      // Age active cursor ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].age += dt;
        if (ripples[i].age > 3.6) {
          ripples.splice(i, 1);
        }
      }

      // Update Uniforms
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);

      // Camera: Looking straight at the vertical wall with perspective depth
      const aspect = canvas.width / canvas.height;
      const projMat = createPerspectiveMatrix((46 * Math.PI) / 180, aspect, 0.1, 90.0);
      
      // Clean stationary perspective
      const eye = [0.0, 0.0, 19.5];
      const target = [0.0, 0.0, 0.0];
      const up = [0.0, 1.0, 0.0];
      const viewMat = createLookAtMatrix(eye, target, up);

      gl.uniformMatrix4fv(uProjLoc, false, projMat);
      gl.uniformMatrix4fv(uViewLoc, false, viewMat);
      gl.uniform1f(uTimeLoc, t);

      // Send ripple buffer
      gl.uniform1i(uRippleCountLoc, ripples.length);
      for (let i = 0; i < ripples.length; i++) {
        gl.uniform4f(rippleLocs[i], ripples[i].x, ripples[i].y, ripples[i].age, ripples[i].strength);
      }

      // Draw instanced cubes on vertical wall
      ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 36, totalInstances);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  /* ==========================================================================
     2. PROJECT FILTER CONTROLLER
     ========================================================================== */
  function initProjectFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter") || "all";

        projectCards.forEach((card) => {
          const category = card.getAttribute("data-category") || "";
          if (filter === "all" || category.includes(filter)) {
            card.style.display = "flex";
            card.style.opacity = "0";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 30);
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  /* ==========================================================================
     3. 1-CLICK EMAIL COPY & TOAST NOTIFICATION
     ========================================================================== */
  function showToast(message) {
    let toast = document.getElementById("site-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "site-toast";
      toast.className = "toast-notice";
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  function initEmailCopyButtons() {
    const copyBtns = document.querySelectorAll("[data-copy-email]");
    copyBtns.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const email = btn.getAttribute("data-copy-email") || "wsmaisys@gmail.com";
        try {
          await navigator.clipboard.writeText(email);
          showToast(`Copied to clipboard: ${email}`);
        } catch (err) {
          // Fallback
          const textarea = document.createElement("textarea");
          textarea.value = email;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          showToast(`Copied: ${email}`);
        }
      });
    });
  }

  /* ==========================================================================
     4. ARCHITECTURE DEEP-DIVE MODAL CONTROLLER
     ========================================================================== */
  const ARCH_DATA = {
    hyrefast: {
      title: "HyreFast Intelligence Layer — Knowledge Graph & Ingestion Pipeline",
      category: "Flagship Enterprise AI System (SpearHub POC)",
      badge: "Confidential Client POC",
      tech: "Python, FastAPI, Neo4j, Cypher, LangGraph, Ollama, MCP, Pydantic, Docker",
      summary: "Designed and built an end-to-end recruiter intelligence layer covering resume ingestion, structured parsing, self-healing error repair, candidate skill normalization, and Neo4j 1-2 hop graph retrieval.",
      architecture: [
        "Ingestion Pipeline: PyMuPDF / pdfplumber parser with LLM structuring, fallback schema checks, and Pydantic validation guarantees.",
        "Self-Healing Loop: Classified-error repair loops with history-aware retry prompting for real-world messy resume variance.",
        "Skill Taxonomy Normalization: Exact lookup → BM25 full-text search → lexical scoring → synonym expansion → graph traversal against 12,000+ approved skills.",
        "Graph Traversal: Neo4j Cypher queries optimized for 1-2 hop candidate-role matching with privacy-preserving workspace boundaries."
      ],
      impact: "Eliminated candidate ingestion failures, normalized 12k+ skills with zero taxonomy pollution, and enabled instant recruiter sub-graph querying."
    },
    zovia: {
      title: "Zovia Inventory Forecasting Module — Intermittent Demand & Simulation",
      category: "Manufacturing Decision Platform (ERP Integration)",
      badge: "Confidential Client Module",
      tech: "Python, FastAPI, Scikit-learn, TSB Model, Monte Carlo, Celery, Redis, MongoDB, Matplotlib, Docker",
      summary: "Engineered an ERP-integrated forecasting API predicting weekly/monthly warehouse stock IN/OUT movement using Croston/TSB intermittent demand models and Monte Carlo simulations.",
      architecture: [
        "Forecasting Engine: Teunter-Syntetos-Babai (TSB) algorithm tailored for sporadic, zero-heavy industrial parts demand.",
        "Stochastic Simulation: Monte Carlo confidence intervals for overstock and stockout risk mitigation.",
        "Async Task Queue: Redis-backed Celery worker processing batch forecasts with webhook callbacks to ERP platforms.",
        "Automated Reporting: Matplotlib visualization generator outputting trend charts and health KPIs."
      ],
      impact: "Delivered 25-40% inventory buffer optimization for manufacturing clients with automated job status polling and ERP data synchronization."
    },
    mediflow: {
      title: "MediFlow — Post-Discharge Medical AI Assistant & Nephrology MCP",
      category: "Clinical Decision Support & Agentic System",
      badge: "Live Cloud Run Demo",
      tech: "LangChain, LangGraph, FAISS Vector Store, Nephrology MCP Server, Mistral AI, Google Cloud Run, Docker",
      summary: "Multi-agent post-discharge clinical assistant with intelligent routing, patient history contextualization, and an authenticated Model Context Protocol (MCP) server for specialized nephrology knowledge.",
      architecture: [
        "Multi-Agent Routing: LangGraph state graph coordinating Receptionist (triage) and Clinical Specialist agents.",
        "RAG Retrieval: FAISS vector database chunked over clinical guidelines with strict PHI/PII redacting.",
        "Nephrology MCP Tool: Standalone MCP server with HTTP/SSE transport exposing authenticated clinical endpoints to Claude Desktop & Web apps.",
        "Observability: Full LangSmith tracing for token streaming, latency tracking, and hallucination guardrails."
      ],
      impact: "Maintained 95%+ test coverage, automated 24/7 post-op patient triage guidance, and achieved 99.9% uptime on Google Cloud Run."
    }
  };

  function initArchitectureModals() {
    const modalOverlay = document.getElementById("arch-modal");
    if (!modalOverlay) return;

    const modalTitle = modalOverlay.querySelector(".modal-title");
    const modalCategory = modalOverlay.querySelector(".modal-category");
    const modalTech = modalOverlay.querySelector(".modal-tech");
    const modalSummary = modalOverlay.querySelector(".modal-summary");
    const modalList = modalOverlay.querySelector(".modal-arch-list");
    const modalImpact = modalOverlay.querySelector(".modal-impact");
    const closeBtn = modalOverlay.querySelector(".modal-close-btn");

    function openModal(id) {
      const data = ARCH_DATA[id];
      if (!data) return;

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalCategory) modalCategory.textContent = data.category;
      if (modalTech) modalTech.textContent = data.tech;
      if (modalSummary) modalSummary.textContent = data.summary;
      if (modalImpact) modalImpact.textContent = data.impact;

      if (modalList) {
        modalList.innerHTML = "";
        data.architecture.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          modalList.appendChild(li);
        });
      }

      modalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    document.querySelectorAll("[data-arch-modal]").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const id = trigger.getAttribute("data-arch-modal");
        openModal(id);
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     5. 3D CARD PARALLAX TILT
     ========================================================================== */
  function init3DTilt() {
    const cards = document.querySelectorAll(".flagship-card, .project-card, .bento-card, .timeline-card");
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ==========================================================================
     6. MOBILE NAVIGATION DRAWER & SCROLL WATCHER
     ========================================================================== */
  function initNavigation() {
    const toggle = document.querySelector(".mobile-toggle");
    const drawer = document.querySelector(".mobile-drawer");
    const navbar = document.querySelector(".navbar");

    if (toggle && drawer) {
      toggle.addEventListener("click", () => {
        drawer.classList.toggle("open");
      });

      drawer.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          drawer.classList.remove("open");
        });
      });
    }

    if (navbar) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }, { passive: true });
    }
  }

  /* ==========================================================================
     7. COOKIE BANNER & FOOTER YEAR
     ========================================================================== */
  function initCookieAndFooter() {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.querySelector("[data-cookie-accept]");

    if (banner && acceptBtn) {
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) {
        banner.style.display = "flex";
      }

      acceptBtn.addEventListener("click", () => {
        localStorage.setItem("cookie_consent", "accepted");
        banner.style.display = "none";
      });
    }

    const yearEl = document.getElementById("footer-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ==========================================================================
     8. INTELLIGENT TELEMETRY & CONVERSION TRACKING (GA4)
     ========================================================================== */
  function initEventTelemetry() {
    function trackGA4(eventName, params = {}) {
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
      }
    }

    // 1. WhatsApp & Contact Intent
    document.querySelectorAll("a[href*='wa.me']").forEach((link) => {
      link.addEventListener("click", () => {
        trackGA4("contact_lead", {
          method: "whatsapp",
          label: link.innerText.trim() || "WhatsApp Click",
          destination: link.href
        });
      });
    });

    // 2. Email Copy Conversion
    document.querySelectorAll("[data-copy-email]").forEach((btn) => {
      btn.addEventListener("click", () => {
        trackGA4("contact_lead", {
          method: "copy_email",
          email: btn.getAttribute("data-copy-email") || "wsmaisys@gmail.com"
        });
      });
    });

    // 3. CV / Resume PDF Download
    document.querySelectorAll("a[href*='.pdf']").forEach((link) => {
      link.addEventListener("click", () => {
        trackGA4("file_download", {
          file_name: link.getAttribute("href"),
          file_type: "pdf"
        });
      });
    });

    // 4. Architecture Modal Openings & Flagship System Clicks
    document.querySelectorAll("[data-arch-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        trackGA4("explore_architecture", {
          system_name: btn.getAttribute("data-arch-modal"),
          action: "modal_inspect"
        });
      });
    });

    // 5. Outbound Platform & External Demo Links (HyreFast, GitHub, Kaggle, HuggingFace)
    document.querySelectorAll("a[target='_blank']").forEach((link) => {
      link.addEventListener("click", () => {
        const href = link.href || "";
        if (href.includes("github.com")) {
          trackGA4("outbound_tech", { platform: "github", url: href });
        } else if (href.includes("linkedin.com")) {
          trackGA4("outbound_social", { platform: "linkedin", url: href });
        } else if (href.includes("kaggle.com")) {
          trackGA4("outbound_tech", { platform: "kaggle", url: href });
        } else if (href.includes("hyrefast.ai")) {
          trackGA4("explore_architecture", { system_name: "hyrefast", action: "live_platform_visit" });
        }
      });
    });

    // 6. Project Filter Interactions
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        trackGA4("project_filter", {
          filter_category: btn.getAttribute("data-filter") || "all"
        });
      });
    });

    // 7. Language Switch Tracking
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        trackGA4("language_switch", {
          target_language: btn.innerText.trim()
        });
      });
    });

    // 8. Reading Depth Milestones (25%, 50%, 75%, 90%)
    const milestones = { 25: false, 50: false, 75: false, 90: false };
    window.addEventListener("scroll", () => {
      const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      for (const m of [25, 50, 75, 90]) {
        if (scrollPercent >= m && !milestones[m]) {
          milestones[m] = true;
          trackGA4("reading_milestone", { depth_percentage: m });
        }
      }
    }, { passive: true });
  }

  /* ==========================================================================
     9. INITIALIZATION
     ========================================================================== */
  window.addEventListener("DOMContentLoaded", () => {
    initWavyCubes();
    initProjectFilters();
    initEmailCopyButtons();
    initArchitectureModals();
    init3DTilt();
    initNavigation();
    initCookieAndFooter();
    initEventTelemetry();
  });
})();
