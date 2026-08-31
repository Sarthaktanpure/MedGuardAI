🛡️ MedGuardAI

Offline-First Medicine Verification & Supply-Chain Intelligence Platform

MedGuardAI is an offline-first platform designed to help verify medicines, analyze suspicious products, track pharmaceutical batches, and provide a tamper-evident record of medicine provenance.

The platform combines AI/ML, QR-based verification, supply-chain tracking, APIs, and blockchain-backed provenance into a unified architecture designed for real-world medicine verification scenarios — including environments where reliable internet connectivity may not always be available.

«⚠️ Project Status: MedGuardAI is currently under active development. The repository contains the application architecture, frontend, backend APIs, verification workflows, and planned ML/blockchain integrations. A production-trained counterfeit-detection model is not yet included.»

---

✨ Vision

Counterfeit and improperly distributed medicines can create serious risks throughout the pharmaceutical supply chain.

MedGuardAI aims to provide a technology-driven verification layer that can help users answer:

«“Is this medicine genuine, where did it come from, and can its supply-chain history be trusted?”»

The long-term goal is to combine:

- 🤖 AI-powered medicine analysis
- 📷 Camera and QR-based scanning
- 🔐 Secure authentication
- 📦 Batch-level verification
- 🚚 Supply-chain tracking
- ⛓️ Blockchain-backed provenance
- 📊 Analytics and monitoring
- 📡 Offline-first verification capabilities

into one accessible platform.

---

🚀 Core Workflow

MedGuardAI is designed around a simple five-stage verification workflow:

┌──────────┐
│   SCAN   │
│ QR / Data│
└────┬─────┘
     │
     ▼
┌──────────────┐
│ AI ANALYSIS  │
│ ML Inference │
└────┬─────────┘
     │
     ▼
┌──────────────┐
│    RESULT    │
│ Genuine /    │
│ Suspect      │
└────┬─────────┘
     │
     ▼
┌──────────────────┐
│ DELIVERY TRACKING│
│ Supply Chain     │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ BLOCKCHAIN PROOF │
│ Provenance /     │
│ Audit Trail      │
└──────────────────┘

The intended experience is:

Scan → Analyze → Verify → Track → Prove

---

🎯 Key Features

📷 Medicine Scanning

The frontend provides the foundation for scanning and processing medicine information through a camera-based workflow.

Potential verification inputs include:

- Medicine information
- Batch numbers
- QR codes
- Packaging information
- Product identifiers

---

🤖 AI-Assisted Verification

The architecture is designed to support machine-learning-based medicine verification.

The planned ML pipeline includes:

Medicine Image / Data
        │
        ▼
Preprocessing
        │
        ▼
ML Model
        │
        ▼
Inference
        │
        ▼
Confidence Score
        │
        ▼
Verification Result

The frontend is designed to display information such as:

- Verification status
- Confidence score
- AI analysis
- Explanation
- Suspicion indicators

Current ML Status

The repository currently does not contain a production-trained counterfeit-detection model.

The planned ML development path includes:

1. Dataset preparation
2. Synthetic/bootstrap data generation
3. Model training using PyTorch
4. Evaluation
5. ONNX model export
6. Browser/server inference
7. Continuous improvement using validated data

«Important: No production accuracy, precision, recall, or F1 score is claimed until those metrics are obtained from a properly evaluated model.»

---

📦 Batch Verification

MedGuardAI is designed around pharmaceutical batch-level verification.

A batch can be associated with information such as:

Medicine
   │
   ├── Batch Number
   ├── Manufacturer
   ├── Manufacturing Information
   ├── Expiry Information
   ├── Verification Status
   └── Supply-Chain History

This provides the foundation for connecting an individual medicine package to its broader supply-chain identity.

---

🚚 Supply-Chain Tracking

The platform includes a dedicated tracking layer intended to provide visibility into medicine movement through the supply chain.

Conceptually:

Manufacturer
     │
     ▼
Distributor
     │
     ▼
Warehouse
     │
     ▼
Pharmacy / Hospital
     │
     ▼
Consumer

Tracking data can ultimately be connected to batch identities and verification records.

---

⛓️ Blockchain Provenance

Blockchain is planned as a trust layer for medicine provenance.

Instead of relying solely on a centralized database, important supply-chain events can be represented through tamper-evident records.

Medicine Batch
      │
      ▼
Supply Chain Events
      │
      ▼
Verification Records
      │
      ▼
Blockchain / Smart Contract
      │
      ▼
Tamper-Evident Provenance

The repository contains a dedicated "contracts/" workspace for blockchain/smart-contract development.

---

📡 Offline-First Architecture

A major design goal of MedGuardAI is offline-first operation.

This is particularly important for environments where:

- Internet connectivity is unreliable
- Rural connectivity is limited
- Verification must happen quickly
- Network latency is high
- Devices temporarily lose connectivity

The architecture is intended to allow verification functionality to operate locally where possible, while synchronizing information when connectivity becomes available.

                 ┌─────────────────┐
                 │   User Device   │
                 └────────┬────────┘
                          │
                    Online / Offline
                          │
             ┌────────────┴────────────┐
             │                         │
          Offline                    Online
             │                         │
             ▼                         ▼
      Local Verification       Backend Services
             │                         │
             └────────────┬────────────┘
                          │
                          ▼
                     Synchronization

---

🏗️ System Architecture

MedGuardAI follows a modular full-stack architecture.

                         ┌─────────────────────┐
                         │       USER          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ React + Vite       │
                         │ Frontend           │
                         └──────────┬──────────┘
                                    │
                              REST API
                                    │
                                    ▼
                    ┌────────────────────────────┐
                    │ Node.js + Express Backend  │
                    └─────────────┬──────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
       ┌────────────┐      ┌────────────┐      ┌────────────┐
       │ MongoDB    │      │ ML / AI    │      │ Blockchain │
       │ Database   │      │ Services   │      │ Contracts  │
       └────────────┘      └────────────┘      └────────────┘
                                  │                   │
                                  ▼                   ▼
                           Medicine Analysis     Provenance

---

🧩 Project Structure

MedGuardAI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.*
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validation/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   └── package.json
│
├── contracts/
│   └── Blockchain / Smart Contract Workspace
│
├── shared/
│   └── Shared Resources
│
├── docs/
│   ├── ARCHITECTURE.md
│   └── MODEL_CARD.md
│
├── package.json
├── package-lock.json
└── vercel.json

---
LIVE URL : https://medguard-codevault.vercel.app/

💻 Technology Stack

Frontend

Technology| Purpose
⚛️ React 19| User interface
⚡ Vite| Development/build tooling
🎨 Tailwind CSS| UI styling
🧭 React Router| Application routing
🗃️ Zustand| Client-side state management
🔄 React Query| Server-state/data management
🎞️ Framer Motion| UI animations
📊 Recharts| Data visualization
✅ Zod| Data validation
📝 React Hook Form| Form management
📱 QR Code libraries| QR-based workflows
🧠 ONNX Runtime Web| Planned/local ML inference support

---

Backend

Technology| Purpose
🟢 Node.js| Runtime
🚂 Express 5| REST API framework
🔷 TypeScript| Backend development
🍃 MongoDB| Database
🦫 Mongoose| MongoDB ODM
🔐 JWT| Authentication
🔑 bcrypt| Password hashing
🛡️ Helmet| Security headers
🌐 CORS| Cross-origin access
✔️ Zod| Validation
📝 Pino| Logging
🧪 Vitest| Testing
🔬 Supertest| API testing

---

🔌 API Architecture

The backend API is organized under:

/api/v1

Current API areas include:

/api/v1/health
/api/v1/docs
/api/v1/auth
/api/v1/scans
/api/v1/batches
/api/v1/tracking
/api/v1/analytics
/api/v1/models
/api/v1/admin

API Responsibilities

Endpoint Group| Responsibility
"/health"| Server health/status
"/docs"| API documentation
"/auth"| Authentication
"/scans"| Medicine scanning/verification
"/batches"| Medicine batch information
"/tracking"| Supply-chain tracking
"/analytics"| Analytics and insights
"/models"| ML/model-related operations
"/admin"| Administrative operations

---

🔐 Security

The backend architecture includes several security mechanisms:

- JWT-based authentication
- Password hashing with bcrypt
- HTTP security headers through Helmet
- CORS configuration
- Request validation
- Structured logging
- Authentication middleware
- Role-oriented administrative APIs

Security should continue to evolve as the project moves toward production.

---

📊 Application Flow

A typical verification request is designed to follow this flow:

1. User opens MedGuardAI
              │
              ▼
2. User scans medicine / QR code
              │
              ▼
3. Application extracts medicine information
              │
              ▼
4. Verification request is processed
              │
              ├──────────────► Batch Database
              │
              ├──────────────► AI/ML Layer
              │
              └──────────────► Provenance Layer
              │
              ▼
5. Verification result generated
              │
              ▼
6. User receives:
      ├── Verification status
      ├── Confidence information
      ├── AI explanation
      └── Supply-chain information
              │
              ▼
7. Provenance / audit information
   can be associated with the batch

---

🖥️ Frontend Experience

The frontend is designed around several major user-facing areas.

Authentication

Provides the foundation for:

- User registration
- Login
- Session management
- Protected application areas

Dashboard

Designed to provide:

- Verification activity
- Statistics
- Analytics
- System information

Verification

The primary medicine verification interface.

SCAN
  ↓
ANALYZE
  ↓
VERIFY
  ↓
VIEW RESULT

Tracking

Allows users to inspect medicine/batch movement through the supply chain.

Administrative / Manufacturer Workflows

The architecture also provides foundations for manufacturer, regulator, and administrative functionality.

---

⚙️ Getting Started

Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB
- Git

For future ML development:

- Python
- PyTorch
- ONNX tooling

---

1. Clone the Repository

git clone https://github.com/Sarthaktanpure/MedGuardAI.git

cd MedGuardAI

---

2. Install Dependencies

Install root dependencies:

npm install

Then install frontend dependencies:

cd frontend
npm install

And backend dependencies:

cd ../backend
npm install

---

🔧 Environment Configuration

Create the required environment files according to your local development configuration.

Typical backend configuration includes values for:

PORT=
MONGODB_URI=
JWT_SECRET=
CORS_ORIGIN=

«Do not commit secrets, database credentials, private keys, or production environment variables to GitHub.»

---

▶️ Running the Project

Start Backend

cd backend
npm run dev

The backend provides the REST API and application services.

---

Start Frontend

In another terminal:

cd frontend
npm run dev

Vite will provide the development server URL in the terminal.

---

🧪 Testing

The backend is configured with testing tools including Vitest and Supertest.

Run the backend tests with the project's configured test command:

cd backend
npm test

---

📦 Production Build

Build the frontend:

cd frontend
npm run build

The backend can be built using its configured TypeScript build process.

The production architecture supports serving the compiled frontend through the backend application.

---

☁️ Deployment

The repository includes deployment configuration through "vercel.json".

The architecture supports a deployment model where:

Vercel
   │
   ├── Frontend
   │
   └── API Routing
          │
          ▼
       Backend
          │
          ▼
       MongoDB

The backend can be deployed independently while the frontend is delivered through a web deployment platform.

---

📚 Documentation

Additional technical documentation is available in:

docs/
├── ARCHITECTURE.md
└── MODEL_CARD.md

"ARCHITECTURE.md"

Contains the broader system architecture and planned technology integration.

"MODEL_CARD.md"

Documents the ML direction, intended model usage, evaluation expectations, and current limitations.

---

🧠 ML Development Roadmap

The planned machine-learning pipeline is:

Data Collection
      │
      ▼
Dataset Cleaning
      │
      ▼
Data Annotation
      │
      ▼
Training Dataset
      │
      ▼
PyTorch Model
      │
      ▼
Evaluation
      │
      ▼
ONNX Export
      │
      ▼
Inference Service
      │
      ▼
MedGuardAI

Future evaluation should include measurable metrics such as:

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC where appropriate
- False-positive rate
- False-negative rate

No performance numbers should be considered valid until they are obtained through documented evaluation on an appropriate dataset.

---

🗺️ Roadmap

Phase 1 — Foundation

- [x] Monorepo structure
- [x] React frontend
- [x] Express backend
- [x] MongoDB architecture
- [x] Authentication foundation
- [x] Batch API structure
- [x] Scanning workflow foundation
- [x] Tracking API foundation
- [x] Analytics API foundation
- [x] Blockchain workspace
- [x] Technical documentation

Phase 2 — AI Verification

- [ ] Build curated medicine dataset
- [ ] Develop counterfeit-detection model
- [ ] Train and evaluate model
- [ ] Export model to ONNX
- [ ] Integrate inference pipeline
- [ ] Implement confidence scoring
- [ ] Improve AI explanations

Phase 3 — Supply-Chain Intelligence

- [ ] Manufacturer onboarding
- [ ] Distributor workflows
- [ ] Warehouse tracking
- [ ] Pharmacy verification
- [ ] End-to-end batch lifecycle
- [ ] Advanced analytics

Phase 4 — Blockchain

- [ ] Smart-contract implementation
- [ ] Batch provenance recording
- [ ] Tamper-evident event history
- [ ] Blockchain verification interface

Phase 5 — Offline-First

- [ ] Local verification cache
- [ ] Offline QR verification
- [ ] Background synchronization
- [ ] Conflict resolution
- [ ] Low-connectivity optimization

Phase 6 — Production Readiness

- [ ] Security hardening
- [ ] Performance optimization
- [ ] Monitoring
- [ ] Automated CI/CD
- [ ] Production ML evaluation
- [ ] Large-scale testing
- [ ] Regulatory/compliance review

---

🔮 Future Possibilities

MedGuardAI can potentially evolve into a broader pharmaceutical trust platform with:

- 📱 Mobile applications
- 🔍 Advanced computer vision
- 🧠 Multimodal AI verification
- 🌐 Large-scale medicine registries
- ⛓️ Decentralized provenance
- 📡 Edge/offline inference
- 🚨 Counterfeit alerts
- 📊 Government/regulator dashboards
- 🏭 Manufacturer portals
- 🏥 Hospital integrations
- 💊 Pharmacy integrations
- 🔗 Pharmaceutical supply-chain APIs

---

⚠️ Important Disclaimer

MedGuardAI is a software research/development project and should not currently be treated as a certified medical or pharmaceutical authentication system.

AI-generated verification results must not be considered a substitute for:

- Regulatory verification
- Pharmacist or healthcare-professional advice
- Manufacturer verification
- Laboratory testing
- Official pharmaceutical databases

A production deployment would require extensive validation, security testing, dataset validation, regulatory review, and domain-expert involvement.

---

🤝 Contributing

Contributions are welcome.

A typical contribution workflow:

# Fork the repository

# Clone your fork
git clone <your-fork-url>

# Create a branch
git checkout -b feature/your-feature

# Make your changes

# Commit
git commit -m "feat: add your feature"

# Push
git push origin feature/your-feature

Then open a Pull Request.

Contribution Areas

You can contribute to:

- Frontend UI/UX
- Backend APIs
- Database architecture
- AI/ML
- Computer vision
- Blockchain
- Offline-first systems
- Security
- Testing
- Documentation

---

📜 License

See the repository's license configuration for the current licensing terms.

---

👨‍💻 Author

Sarthak Tanpure

MedGuardAI — Medicine Verification & Supply-Chain Intelligence

GitHub:
https://github.com/Sarthaktanpure

Project Repository:
https://github.com/Sarthaktanpure/MedGuardAI

---

⭐ Support the Project

If you find MedGuardAI interesting or useful:

⭐ Star the repository

🍴 Fork the project

🐛 Report issues

💡 Suggest improvements

🤝 Contribute

---

<div align="center">🛡️ MedGuardAI

Building a more trustworthy pharmaceutical supply chain with AI, verification, and transparent provenance.

"Scan • Analyze • Verify • Track • Prove"

</div>
