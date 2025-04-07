# P&ID HAZOP Analyzer

An AI-powered web application for analyzing Piping and Instrumentation Diagrams (P&ID) and generating Hazard and Operability Study (HAZOP) reports.

## Features

- Upload P&ID diagrams in various image formats
- Automatic component detection using computer vision
- Safety issue identification and analysis
- PDF report generation
- History tracking of analyses
- Modern, responsive user interface

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Python 3.8+ (for ML model)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pid-hazop-analyzer.git
cd pid-hazop-analyzer
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/pid-hazop
PORT=5000
```

## Running the Application

1. Start MongoDB:
```bash
mongod
```

2. Start the server:
```bash
cd server
npm run dev
```

3. Start the client:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Development

### Project Structure

```
pid-hazop-analyzer/
├── client/                 # Frontend (Svelte)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── App.svelte     # Main application
│   └── public/            # Static assets
├── server/                # Backend (Node.js/Express)
│   ├── src/
│   │   ├── routes/        # API routes
│   │   └── models/        # Database models
│   └── models/            # ML models
└── README.md
```

### API Endpoints

- `POST /api/upload` - Upload P&ID image
- `POST /api/analysis/analyze/:fileId` - Analyze P&ID
- `GET /api/analysis/report/:analysisId` - Generate HAZOP report
- `GET /api/reports` - Get all reports
- `GET /api/reports/:reportId` - Get specific report
- `GET /api/reports/:reportId/download` - Download report
- `DELETE /api/reports/:reportId` - Delete report

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- YOLOv5 for object detection
- Svelte for the frontend framework
- Express.js for the backend
- MongoDB for data storage
- TailwindCSS for styling 