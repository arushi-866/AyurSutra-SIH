# AyurSutra - Panchakarma Patient Management & Therapy Scheduling Software

A comprehensive web application for managing Panchakarma treatments, patient scheduling, and therapy tracking with modern UI/UX and automated features.

##  Features

### Core Functionality
- **Automated Therapy Scheduling**: Intelligent scheduling system with conflict detection and auto-rescheduling
- **Real-Time Therapy Tracking**: Live progress monitoring with visual indicators and milestones
- **Comprehensive Notification System**: Multi-channel notifications (in-app, email, SMS) with customizable settings
- **Patient Feedback & Analytics**: Advanced feedback system with sentiment analysis and effectiveness tracking
- **Practitioner Management**: Complete practitioner profiles with performance metrics
- **Patient Management**: Detailed patient profiles with treatment history

### Innovative Features
- **Visualization Tools**: Interactive charts and progress bars for tracking improvements
- **Integrated Feedback Loop**: Real-time feedback collection and analysis
- **Automated Alerts**: Smart notifications for pre/post-procedure care
- **Progress Milestones**: Achievement tracking and patient motivation
- **Therapy Effectiveness Analytics**: Data-driven insights into treatment outcomes

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive design
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **CORS** enabled for cross-origin requests
- **RESTful API** design

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <https://github.com/arushi-866/AyurSutra-SIH>
   cd ayursutra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm run start-server
   ```
   The backend will run on `http://localhost:3001`

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

##  Project Structure

```
ayursutra/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main dashboard with analytics
│   │   ├── Schedule.tsx           # Therapy scheduling interface
│   │   ├── Notifications.tsx      # Notification management
│   │   ├── Feedback.tsx           # Patient feedback & analytics
│   │   └── Layout.tsx             # Main layout component
│   ├── services/
│   │   └── api.ts                 # API service layer
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── App.tsx                    # Main application component
│   └── main.tsx                   # Application entry point
├── server.js                      # Backend server
├── package.json                   # Dependencies and scripts
└── README.md                      # Project documentation
```

## Key Components

### Dashboard
- Real-time therapy tracking with live indicators
- Comprehensive statistics and KPIs
- Interactive charts for progress visualization
- Patient progress milestones
- Quick action buttons

### Scheduling System
- **Manual Booking**: Traditional appointment booking
- **Auto-Schedule**: Automated scheduling with frequency options
- **Conflict Detection**: Smart scheduling to avoid conflicts
- **Progress Tracking**: Real-time session progress monitoring
- **Filtering & Search**: Advanced filtering and search capabilities

### Notification System
- **Multi-Channel Support**: In-app, email, and SMS notifications
- **Priority Levels**: Urgent, high, medium, and low priority
- **Customizable Settings**: User-configurable notification preferences
- **Smart Filtering**: Advanced filtering by type, priority, and content
- **Real-Time Updates**: Live notification status updates

### Feedback & Analytics
- **Comprehensive Feedback**: Detailed patient feedback collection
- **Sentiment Analysis**: Automated sentiment analysis of feedback
- **Rating Distribution**: Visual representation of ratings
- **Effectiveness Tracking**: Therapy effectiveness metrics
- **Analytics Dashboard**: Advanced analytics and insights

##  API Endpoints

### Core Endpoints
- `GET /api/therapies` - Get all therapies
- `GET /api/practitioners` - Get all practitioners
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/notifications` - Get all notifications
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Submit feedback

### Enhanced Endpoints
- `GET /api/therapies/:id` - Get therapy details
- `GET /api/practitioners/:id` - Get practitioner details
- `GET /api/feedback/analytics` - Get feedback analytics
- `GET /api/patients/:name/history` - Get patient history
- `GET /api/practitioners/:id/performance` - Get practitioner performance
- `GET /api/therapies/:id/effectiveness` - Get therapy effectiveness

##  UI/UX Features

### Design System
- **Modern Interface**: Clean, professional design with Ayurvedic color scheme
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Dark/Light Mode**: Theme switching capability (planned)

### User Experience
- **Intuitive Navigation**: Easy-to-use interface with clear navigation
- **Real-Time Updates**: Live data updates without page refresh
- **Interactive Elements**: Hover effects, animations, and transitions
- **Loading States**: Proper loading indicators and error handling

##  Data Visualization

### Charts & Graphs
- **Progress Tracking**: Visual progress bars and completion indicators
- **Analytics Dashboard**: Comprehensive charts for data analysis
- **Rating Distribution**: Visual representation of patient ratings
- **Therapy Effectiveness**: Charts showing treatment outcomes
- **Trend Analysis**: Time-based analysis of key metrics

## Security Features

- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Client and server-side input validation
- **Error Handling**: Comprehensive error handling and logging
- **Data Sanitization**: Protection against XSS and injection attacks

## Future Enhancements

### Planned Features
- **User Authentication**: Login system with role-based access
- **Payment Integration**: Online payment processing
- **Mobile App**: React Native mobile application
- **AI-Powered Insights**: Machine learning for treatment recommendations
- **Telemedicine**: Video consultation capabilities
- **Multi-Language Support**: Internationalization support

### Technical Improvements
- **Database Integration**: PostgreSQL or MongoDB integration
- **Caching**: Redis for improved performance
- **Testing**: Comprehensive test suite
- **CI/CD**: Automated deployment pipeline
- **Monitoring**: Application performance monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



##  Acknowledgments

- Ayurvedic practitioners for domain expertise
- Open source community for excellent libraries
- Design inspiration from modern healthcare applications

---

**AyurSutra** - Bridging traditional Ayurvedic wisdom with modern technology for better patient care and treatment outcomes.
