import { useEffect, useMemo, useRef, useState } from "react";
import heroArt from "./assets/hero.png";
import scanArt from "./assets/medguard-scan.svg";
import routeArt from "./assets/medguard-route.svg";
import labArt from "./assets/medguard-lab.svg";
import Header from "./components/navigation/Header.jsx";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

const navItems = [
  { id: "home", label: "Home" },
  { id: "how-it-works", label: "How It Works" },
  { id: "manufacturers", label: "For Manufacturers" },
  { id: "regulators", label: "For Regulators" },
  { id: "resources", label: "Resources" },
  { id: "about", label: "About Us" }
];

const trustPoints = [
  { label: "Works Offline", detail: "Scan first, sync later." },
  { label: "AI-Powered", detail: "Packaging and label analysis." },
  { label: "Blockchain Secured", detail: "Batch provenance on-chain." },
  { label: "Privacy Focused", detail: "Minimize retained personal data." }
];

const whyCards = [
  {
    title: "On-Device AI",
    description: "Fast packaging verification when connectivity is weak or unavailable.",
    icon: "scan"
  },
  {
    title: "Blockchain Verified",
    description: "Tamper-evident batch registration and chain-backed audit trails.",
    icon: "chain"
  },
  {
    title: "Delivery Path Tracking",
    description: "Manufacture, ship, receive, dispense, and issue events in one chain.",
    icon: "route"
  },
  {
    title: "Trusted by Professionals",
    description: "Built for pharmacists, healthcare workers, and regulatory review.",
    icon: "shield"
  }
];

const processSteps = [
  {
    number: "1",
    title: "Scan Medicine",
    description: "Capture the packaging, batch code, and visible security cues.",
    note: "Camera capture with optional QR-assisted scan."
  },
  {
    number: "2",
    title: "AI Analysis",
    description: "Run the package through the authenticity pipeline and packaging checks.",
    note: "OCR, image quality, defect detection, and batch matching."
  },
  {
    number: "3",
    title: "Get Result",
    description: "Show a genuine / suspect verdict with traceable reasoning.",
    note: "Evidence, confidence, and matched batch metadata."
  },
  {
    number: "4",
    title: "Track Delivery",
    description: "Follow the medicine through the shipment path and custody chain.",
    note: "Hub scans, handoffs, and delivery proof updates."
  },
  {
    number: "5",
    title: "Blockchain Proof",
    description: "Anchor the batch event on-chain for tamper resistance.",
    note: "A public confirmation signal for regulators and manufacturers."
  }
];

const deliveryStops = [
  {
    hub: "Manufacturer",
    city: "Pune, IN",
    status: "Registered",
    detail: "Batch declared and committed to the registry."
  },
  {
    hub: "Distributor",
    city: "Mumbai, IN",
    status: "In Transit",
    detail: "Packaging scanned at departure and arrival checkpoints."
  },
  {
    hub: "Pharmacy",
    city: "Bengaluru, IN",
    status: "Verified",
    detail: "Received package matched the expected metadata hash."
  },
  {
    hub: "Customer",
    city: "Delivery",
    status: "Completed",
    detail: "Final handoff recorded with a timeline of custody events."
  }
];

const trustedBy = ["WHO", "MoHFW", "FIP", "Pharmacy Council"];

function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

function Icon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  };

  switch (name) {
    case "scan":
      return (
        <svg {...common}>
          <path d="M7 3H5a2 2 0 0 0-2 2v2" />
          <path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <path d="M17 21h2a2 2 0 0 0 2-2v-2" />
          <path d="M7 12h10" />
          <path d="M12 7v10" />
        </svg>
      );
    case "chain":
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
          <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
        </svg>
      );
    case "route":
      return (
        <svg {...common}>
          <path d="M4 19c5-1 5-7 10-8s5-6 6-8" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="12" cy="10" r="2" />
          <circle cx="18" cy="4" r="2" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 4 6v6c0 5 3.3 8.7 8 11 4.7-2.3 8-6 8-11V6l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M4 7h4l2-2h4l2 2h4v12H4V7Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="m10 8 6 4-6 4V8Z" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 0 1 0 18" />
          <path d="M12 3a15 15 0 0 0 0 18" />
        </svg>
      );
    case "login":
      return (
        <svg {...common}>
          <path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2" />
          <path d="m14 12-4 4" />
          <path d="m14 12-4-4" />
          <path d="M10 12H3" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M14 7V5a2 2 0 0 0-2-2H5v18h7a2 2 0 0 0 2-2v-2" />
          <path d="M10 12h11" />
          <path d="m17 8 4 4-4 4" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 7h11v10H3z" />
          <path d="M14 10h4l3 3v4h-7z" />
          <circle cx="7" cy="18" r="1.8" />
          <circle cx="18" cy="18" r="1.8" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M9 18 3 20V6l6-2 6 2 6-2v14l-6 2-6-2Z" />
          <path d="M9 4v14" />
          <path d="M15 6v14" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="m12 2 1.7 5.1L19 9l-5.3 1.8L12 16l-1.7-5.2L5 9l5.3-1.9L12 2Z" />
          <path d="m19 14 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />
        </svg>
      );
    default:
      return null;
  }
}

function BrandMark() {
  return (
    <a className="brand" href="#home" aria-label="MedGuard home">
      <span className="brand-mark">
        <Icon name="shield" />
      </span>
      <span className="brand-copy">
        <strong>MedGuard</strong>
        <small>AI-Powered Medicine Verification</small>
      </span>
    </a>
  );
}

function NavLink({ id, label, active }) {
  return (
    <a
      className={joinClasses("nav-link", active === id && "active")}
      href={`#${id}`}
      onClick={() => {
        const toggle = document.querySelector(".header-toggle");
        if (toggle instanceof HTMLButtonElement) {
          toggle.click();
        }
      }}
    >
      {label}
    </a>
  );
}

function Stat({ value, label }) {
  return (
    <div className="stat-pill">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <article className="feature-card">
      <span className="feature-icon">
        <Icon name={icon} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}

function StepCard({ number, title, description, note }) {
  return (
    <article className="step-card">
      <div className="step-number">{number}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="step-image">
        <img src={number === "1" ? scanArt : number === "4" ? routeArt : labArt} alt="" aria-hidden="true" />
      </div>
      <small>{note}</small>
    </article>
  );
}

function DeliveryNode({ hub, city, status, detail, last }) {
  return (
    <div className="delivery-node">
      <div className="delivery-node-meta">
        <span className="delivery-dot" />
        {!last ? <span className="delivery-line" /> : null}
      </div>
      <div className="delivery-node-card">
        <div className="delivery-node-top">
          <strong>{hub}</strong>
          <span>{status}</span>
        </div>
        <p>{city}</p>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function ScanPhone() {
  return (
    <div className="scan-stack">
      <div className="phone-frame">
        <div className="scan-corners corner-tl" />
        <div className="scan-corners corner-tr" />
        <div className="scan-corners corner-bl" />
        <div className="scan-corners corner-br" />
        <div className="product-box">
          <img src={heroArt} alt="" aria-hidden="true" />
          <div className="product-title">
            <strong>Paracip-650</strong>
            <span>Paracetamol Tablets IP 650 mg</span>
          </div>
        </div>
      </div>
      <div className="result-card">
        <div className="result-title">
          <span className="badge genuine">
            <Icon name="shield" />
            Genuine
          </span>
          <strong>96%</strong>
        </div>
        <p>Confidence score after packaging, batch, and print checks.</p>
      </div>
      <div className="result-card compact">
        <div className="result-title">
          <span className="badge neutral">
            <Icon name="spark" />
            AI explanation
          </span>
        </div>
        <p>
          Display OCR, security seal match, and batch metadata matching with the
          final verdict.
        </p>
      </div>
    </div>
  );
}

function ScannerWorkbench({ apiStatus }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [medicineName, setMedicineName] = useState("Paracip-650");
  const [batchNumber, setBatchNumber] = useState("P2B20324");
  const [trackingId, setTrackingId] = useState("MG-DEL-001");
  const [previewUrl, setPreviewUrl] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [analysisState, setAnalysisState] = useState("idle");
  const [analysis, setAnalysis] = useState(null);
  const [scanError, setScanError] = useState("");

  useEffect(() => {
    return () => {
      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function startCamera() {
    setScanError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setScanError("This browser does not support direct camera capture.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
      setCameraReady(true);
    } catch {
      setScanError("Camera access is blocked. Please allow camera permissions.");
    }
  }

  function stopCamera() {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    streamRef.current = null;
    setCameraActive(false);
    setCameraReady(false);
  }

  function captureFrame() {
    if (!videoRef.current || !canvasRef.current) {
      setScanError("Camera is not ready yet.");
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPreviewUrl(imageDataUrl);
    void runScan(imageDataUrl);
  }

  async function runScan(imageDataUrl) {
    setScanError("");
    setAnalysisState("running");

    try {
      const response = await fetch(`${apiBaseUrl}/scans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          medicineName,
          batchNumber,
          trackingId,
          imageDataUrl
        })
      });

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(json?.error?.message ?? "Scan request failed");
      }

      setAnalysis({
        verdict: json?.verdict ?? "Pending model integration",
        confidence: json?.confidence ?? null,
        explanation:
          json?.message ??
          "Backend endpoint is reachable, but the real classifier response is not wired yet.",
        chain: json?.chainStatus ?? "not yet confirmed"
      });
      setAnalysisState("complete");
      stopCamera();
    } catch (error) {
      setAnalysis({
        verdict: "Pipeline connected",
        confidence: null,
        explanation:
          "The UI is ready for the real classifier, but the backend still needs the trained model and data pipeline wired in.",
        chain: "awaiting deployment"
      });
      setAnalysisState("complete");
      setScanError(error instanceof Error ? error.message : "Unable to reach scan service");
    }
  }

  const statusLabel = useMemo(() => {
    if (analysisState === "running") return "Scanning package...";
    if (analysisState === "complete") return "Scan summary ready";
    return apiStatus.connected ? "Ready to scan" : "Offline-first mode";
  }, [analysisState, apiStatus.connected]);

  return (
    <section className="section workbench" id="scan">
      <div className="section-copy">
        <p className="section-kicker">Scan Medicine</p>
        <h2>Capture the pack, verify the batch, and trace the route.</h2>
        <p className="section-lede">
          This panel is built to support a real flow: camera input, batch lookup,
          packaging analysis, delivery events, and chain proof in one place.
        </p>

        <div className="scan-hints">
          <div className="hint-card">
            <Icon name="camera" />
            <span>Align the pack inside the frame.</span>
          </div>
          <div className="hint-card">
            <Icon name="spark" />
            <span>Use sharp, glare-free images for OCR and defect checks.</span>
          </div>
          <div className="hint-card">
            <Icon name="clock" />
            <span>Offline capture is supported, with sync on reconnect.</span>
          </div>
        </div>

        <div className="offline-banner">
          <Icon name="shield" />
          <div>
            <strong>Works offline first</strong>
            <p>Results sync to the backend when connectivity returns.</p>
          </div>
        </div>
      </div>

      <div className="workbench-card">
        <div className="workbench-side">
          <button className="side-button active" type="button" onClick={startCamera}>
            <Icon name="scan" />
            Scan
          </button>
          <button className="side-button" type="button" onClick={captureFrame}>
            <Icon name="camera" />
            Capture
          </button>
          <button className="side-button" type="button" onClick={stopCamera}>
            <Icon name="clock" />
            Stop
          </button>
          <button className="side-button" type="button" onClick={() => setAnalysis(null)}>
            <Icon name="spark" />
            Clear
          </button>
          <button className="side-button" type="button" onClick={startCamera}>
            <Icon name="shield" />
            Retry
          </button>
        </div>

        <div className="workbench-stage">
          <div className="scan-preview">
            <div className="scan-overlay">
              {cameraActive ? (
                <video ref={videoRef} className="camera-feed" playsInline muted autoPlay />
              ) : previewUrl ? (
                <img src={previewUrl} alt="Captured medicine preview" />
              ) : (
                <div className="preview-placeholder">
                  <div className="box-shadow" />
                  <p>Open the device camera to capture a medicine package.</p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden-canvas" />
            </div>
          </div>

          <div className="scan-form">
            <div className="scan-status-row">
              <span className="status-pill">
                <span className="dot online" />
                {statusLabel}
              </span>
              <span className="status-pill subtle">{apiStatus.connected ? "API online" : "API offline"}</span>
            </div>

            <label className="field">
              Medicine name
              <input
                value={medicineName}
                onChange={(event) => setMedicineName(event.target.value)}
                placeholder="Paracip-650"
              />
            </label>

            <label className="field">
              Batch number
              <input
                value={batchNumber}
                onChange={(event) => setBatchNumber(event.target.value)}
                placeholder="P2B20324"
              />
            </label>

            <label className="field">
              Delivery ID
              <input
                value={trackingId}
                onChange={(event) => setTrackingId(event.target.value)}
                placeholder="MG-DEL-001"
              />
            </label>

            <label className="upload-zone">
              <span>{cameraReady ? "Camera ready for capture" : "Use your device camera for scanning"}</span>
              <small>We capture the package directly from the camera stream.</small>
            </label>

            <div className="scan-actions">
              <button className="primary-button" type="button" onClick={startCamera}>
                <Icon name="camera" />
                Open Camera
              </button>
              <button className="secondary-button" type="button" onClick={captureFrame}>
                <Icon name="scan" />
                Capture Scan
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setAnalysis(null);
                  setAnalysisState("idle");
                  setScanError("");
                  setPreviewUrl("");
                }}
              >
                Reset
              </button>
            </div>

            {scanError ? <p className="scan-error">{scanError}</p> : null}

            {analysis ? (
              <div className="analysis-card">
                <div className="analysis-header">
                  <div>
                    <span className={joinClasses("verdict-pill", analysis.verdict?.toLowerCase().includes("genuine") ? "genuine" : "watch")}>
                      {analysis.verdict}
                    </span>
                    <p>{analysis.explanation}</p>
                  </div>
                  <strong>{analysis.confidence ? `${analysis.confidence}%` : "n/a"}</strong>
                </div>

                <div className="analysis-grid">
                  <div>
                    <small>Batch verification</small>
                    <strong>{batchNumber}</strong>
                  </div>
                  <div>
                    <small>Track ID</small>
                    <strong>{trackingId}</strong>
                  </div>
                  <div>
                    <small>Blockchain</small>
                    <strong>{analysis.chain}</strong>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Hero({ apiStatus }) {
  return (
    <section className="hero section" id="home">
      <div className="hero-copy">
        <p className="hero-badge">
          <Icon name="shield" />
          AI + Blockchain + Offline
        </p>
        <span className={joinClasses("hero-inline-status", apiStatus.connected && "online")}>
          {apiStatus.label}
        </span>
        <h1>Trust Every Medicine. Protect Every Life.</h1>
        <p className="hero-lede">
          MedGuard verifies medicine authenticity, batch provenance, and custody
          path in a single product flow, designed for low-connectivity settings
          and real-world regulatory use.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="#scan">
            Scan Medicine Now
            <Icon name="camera" />
          </a>
          <a className="secondary-button" href="#how-it-works">
            Watch Demo
            <Icon name="play" />
          </a>
        </div>

        <div className="trust-points">
          {trustPoints.map((point) => (
            <div key={point.label} className="trust-point">
              <Icon name="shield" />
              <div>
                <strong>{point.label}</strong>
                <span>{point.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hero-stats">
          <Stat value={apiStatus.connected ? "Online" : "Offline"} label="Backend state" />
          <Stat value="15 min" label="JWT access tokens" />
          <Stat value="7 days" label="Refresh cookie" />
          <Stat value="8 MB" label="Safe frame limit" />
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-product">
          <div className="hero-product-glow" />
          <div className="hero-product-box">
            <img src={heroArt} alt="" aria-hidden="true" />
            <div className="hero-product-label">
              <strong>Paracip-650</strong>
              <span>Medicine pack reference</span>
            </div>
          </div>
          <div className="hero-phone">
            <div className="phone-notch" />
            <div className="hero-phone-screen">
              <div className="hero-phone-title">
                <Icon name="camera" />
                <span>Scan Result</span>
              </div>
              <ScanPhone />
            </div>
          </div>
          <div className="hero-pill-strip">
            <span>Made for pharmacist workflows</span>
            <span>Delivery path aware</span>
            <span>Chain backed</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section className="metrics-grid section" id="about">
      <article className="metric-card">
        <div className="section-heading">
          <p className="section-kicker">Why MedGuard?</p>
          <h2>Serious medicine verification, built for field conditions.</h2>
        </div>
        <div className="feature-grid">
          {whyCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </article>

      <article className="metric-card impact-card" id="regulators">
        <div className="impact-header">
          <div>
            <p className="section-kicker">Live Impact</p>
            <h2>Operational visibility that regulators can audit.</h2>
          </div>
          <a href="#regulators" className="text-link">
            View Dashboard
            <Icon name="arrow" />
          </a>
        </div>

        <div className="impact-stats">
          <Stat value="128,547" label="Total scans" />
          <Stat value="18,324" label="Genuine medicines" />
          <Stat value="2,481" label="Suspect medicines" />
          <Stat value="342" label="Regions covered" />
        </div>

        <div className="mission-card">
          <span className="mission-icon">
            <Icon name="shield" />
          </span>
          <div>
            <strong>Our Mission</strong>
            <p>To eliminate fake medicines and keep every patient on a verified supply path.</p>
          </div>
        </div>
      </article>

      <article className="metric-card trusted-card">
        <p className="section-kicker">Trusted by</p>
        <div className="logo-grid" id="resources">
          {trustedBy.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </article>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section how-grid" id="how-it-works">
      <div className="section-heading centered">
        <p className="section-kicker">Our Process</p>
        <h2>How MedGuard Works</h2>
        <p className="section-lede">
          MedGuard combines on-device AI, offline-first storage, and blockchain
          registration to deliver a verification workflow that holds up in the field.
        </p>
      </div>

      <div className="steps-grid">
        {processSteps.map((step) => (
          <StepCard key={step.number} {...step} />
        ))}
      </div>
    </section>
  );
}

function DeliveryPath() {
  const [trackingId, setTrackingId] = useState("MG-DEL-001");
  const [timeline, setTimeline] = useState([]);
  const [trackingState, setTrackingState] = useState("idle");
  const [trackingMessage, setTrackingMessage] = useState("Look up a tracking ID to see the custody timeline.");

  async function loadTimeline() {
    setTrackingState("loading");
    setTrackingMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/tracking/${trackingId}`, {
        credentials: "include"
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(json?.error?.message || "Tracking lookup failed");
      }

      setTimeline(
        (json.items ?? []).map((item) => ({
          hub: item.status,
          city: item.location || "Unknown location",
          status: new Date(item.createdAt).toLocaleDateString(),
          detail: item.note || `Tracking ID: ${trackingId}`
        }))
      );
      setTrackingState("done");
      setTrackingMessage(`Found ${json.items?.length ?? 0} custody events.`);
    } catch (error) {
      setTimeline([]);
      setTrackingState("error");
      setTrackingMessage(error instanceof Error ? error.message : "Tracking lookup failed");
    }
  }

  useEffect(() => {
    void loadTimeline();
  }, []);

  return (
    <section className="section delivery-section" id="manufacturers">
      <div className="section-heading">
        <p className="section-kicker">Track Delivery Path</p>
        <h2>From manufacturer to patient, every handoff stays visible.</h2>
        <p className="section-lede">
          Think of the supply chain like Amazon-style tracking, but designed for
          medicines: custody events, batch checkpoints, and verified receipt.
        </p>
      </div>

      <div className="delivery-layout">
        <article className="delivery-map-card">
          <div className="delivery-map-header">
            <span className="status-pill">
              <span className="dot online" />
              Route active
            </span>
            <span className="status-pill subtle">Batch P2B20324</span>
          </div>
          <div className="delivery-map">
            <div className="route-line" />
            <div className="route-point point-a" />
            <div className="route-point point-b" />
            <div className="route-point point-c" />
            <div className="route-point point-d" />
            <div className="route-card card-a">
              <Icon name="truck" />
              <strong>Pickup</strong>
              <span>Manufacturer exit scan</span>
            </div>
            <div className="route-card card-b">
              <Icon name="map" />
              <strong>Transit</strong>
              <span>Distributor handoff</span>
            </div>
            <div className="route-card card-c">
              <Icon name="shield" />
              <strong>Check-in</strong>
              <span>Pharmacy verification</span>
            </div>
            <div className="route-card card-d">
              <Icon name="clock" />
              <strong>Delivery</strong>
              <span>Final receipt logged</span>
            </div>
          </div>
        </article>

        <article className="delivery-timeline-card">
          <div className="delivery-timeline-head">
            <div>
              <p className="section-kicker">Shipment trace</p>
              <h3>Chain of custody timeline</h3>
            </div>
            <span className="status-pill subtle">Synced</span>
          </div>
          <div className="tracking-search">
            <label className="field">
              Tracking ID
              <input value={trackingId} onChange={(event) => setTrackingId(event.target.value)} />
            </label>
            <button className="primary-button small" type="button" onClick={loadTimeline}>
              <Icon name="route" />
              Track Now
            </button>
          </div>
          <p className="tracking-message">
            {trackingState === "loading" ? "Loading live events..." : trackingMessage}
          </p>
          <div className="delivery-timeline">
            {(timeline.length ? timeline : deliveryStops).map((stop, index, array) => (
              <DeliveryNode
                key={`${stop.hub}-${stop.status}-${index}`}
                {...stop}
                last={index === array.length - 1}
              />
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function AccessSection() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    displayName: "Nisha Verma",
    email: "nisha@medguard.org",
    password: "MedGuard123!"
  });
  const [authState, setAuthState] = useState("idle");
  const [authNote, setAuthNote] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadMe() {
      try {
        const response = await fetch(`${apiBaseUrl}/auth/me`, { credentials: "include" });
        const json = await response.json().catch(() => ({}));
        if (!cancelled && response.ok) {
          setCurrentUser(json.user);
        }
      } catch {
        if (!cancelled) setCurrentUser(null);
      }
    }
    loadMe();
    return () => {
      cancelled = true;
    };
  }, []);

  async function submitAuth() {
    setAuthState("loading");
    setAuthNote("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/${mode}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          displayName: form.displayName,
          role: "manufacturer"
        })
      });

      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(json?.error?.message || "Authentication failed");
      }

      setCurrentUser(json.user);
      setAuthState("success");
      setAuthNote(`${mode === "login" ? "Login" : "Registration"} completed.`);
    } catch (error) {
      setAuthState("error");
      setAuthNote(error instanceof Error ? error.message : "Authentication failed");
    }
  }

  async function logout() {
    await fetch(`${apiBaseUrl}/auth/logout`, { method: "POST", credentials: "include" });
    setCurrentUser(null);
  }

  return (
    <section className="section access-section" id="access">
      <div className="section-heading">
        <p className="section-kicker">Access</p>
        <h2>Separate login and operational control flows are ready for the backend.</h2>
        <p className="section-lede">
          The UI keeps access, scanning, dashboard, and regulatory review clearly
          separated so the product remains maintainable as the backend hardens.
        </p>
      </div>

      <div className="access-grid">
        <article className="access-card">
          <h3>{mode === "login" ? "Login" : "Register"}</h3>
          <p>Built for role-based sign-in across pharmacist, manufacturer, and regulator accounts.</p>
          <div className="segmented-control">
            <button className={joinClasses("segment", mode === "login" && "active")} type="button" onClick={() => setMode("login")}>
              Login
            </button>
            <button className={joinClasses("segment", mode === "register" && "active")} type="button" onClick={() => setMode("register")}>
              Register
            </button>
          </div>

          <div className="auth-form" id="login-form">
            {mode === "register" ? (
              <label className="field">
                Display name
                <input
                  value={form.displayName}
                  onChange={(event) => setForm({ ...form, displayName: event.target.value })}
                />
              </label>
            ) : null}

            <label className="field">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>

            <label className="field">
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </label>

            <button className="primary-button" type="button" onClick={submitAuth}>
              <Icon name="login" />
              {mode === "login" ? "Login" : "Create account"}
            </button>
            {authNote ? <p className={joinClasses("auth-note", authState)}>{authNote}</p> : null}
          </div>
        </article>

        <article className="access-card">
          <h3>Session</h3>
          {currentUser ? (
            <>
              <p>
                Signed in as <strong>{currentUser.email}</strong> with role <strong>{currentUser.role}</strong>.
              </p>
              <button className="ghost-button" type="button" onClick={logout}>
                <Icon name="logout" />
                Logout
              </button>
            </>
          ) : (
            <>
              <p>The current session is not authenticated yet. Log in to unlock user and admin actions.</p>
              <a href="#access" className="ghost-button">
                <Icon name="login" />
                Start session
              </a>
            </>
          )}
          <div className="access-metrics">
            <Stat value="JWT" label="Access token" />
            <Stat value="Cookie" label="Refresh token" />
          </div>
        </article>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <BrandMark />
        <p>
          MedGuard is built for verified medicine workflows, offline capture,
          chain-backed auditability, and supply path visibility.
        </p>
      </div>
      <div>
        <strong>Product</strong>
        <a href="#how-it-works">How It Works</a>
        <a href="#scan">Scan Medicine</a>
        <a href="#manufacturers">Delivery Path</a>
      </div>
      <div>
        <strong>Compliance</strong>
        <a href="#regulators">Regulators</a>
        <a href="#resources">Resources</a>
        <a href="#about">About Us</a>
      </div>
    </footer>
  );
}

function sectionFromPage(page) {
  if (page === "verify") return "scan";
  if (page === "dashboard") return "regulators";
  if (page === "auth") return "access";
  return "home";
}

export default function App({ page = "home" }) {
  const initialSection = sectionFromPage(page);
  const [apiStatus, setApiStatus] = useState({
    connected: false,
    label: "Checking backend..."
  });
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    const targetNode = document.getElementById(initialSection);
    if (targetNode) {
      targetNode.scrollIntoView({ behavior: "auto", block: "start" });
    }
    const updateSection = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveSection(hash);
      }
    };

    updateSection();
    window.addEventListener("hashchange", updateSection);
    return () => window.removeEventListener("hashchange", updateSection);
  }, [initialSection]);

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        const response = await fetch(`${apiBaseUrl}/healthz`, {
          headers: { Accept: "application/json" }
        });
        if (cancelled) return;

        setApiStatus({
          connected: response.ok,
          label: response.ok ? "Backend connected" : "Backend degraded"
        });
      } catch {
        if (!cancelled) {
          setApiStatus({
            connected: false,
            label: "Backend offline"
          });
        }
      }
    }

    checkHealth();
    const intervalId = window.setInterval(checkHealth, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="medguard-app">
      <div className="background-grid" />
      <div className="background-glow glow-a" />
      <div className="background-glow glow-b" />

      <div className="page-shell">
        <Header navItems={navItems} activeSection={activeSection} />
        <main>
          <Hero apiStatus={apiStatus} />
          <Metrics />
          <HowItWorks />
          <ScannerWorkbench apiStatus={apiStatus} />
          <DeliveryPath />
          <AccessSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
