# 💪 Workout Tracker

A modern Progressive Web App (PWA) for tracking push and pull workouts. Built with React, TypeScript, and Tailwind CSS, this app works offline and provides a seamless workout tracking experience.

## ✨ Features

- **🏋️ Push/Pull Split Tracking** - Organize your workouts into push and pull days
- **📊 Exercise Library** - Comprehensive library of exercises with predefined sets, reps, and RPE targets
- **⏱️ Rest Timer** - Built-in rest timer between sets
- **📈 Progress Tracking** - View your workout history and track progress over time
- **💾 Offline Support** - Works completely offline using IndexedDB
- **📱 PWA** - Install on any device for a native app experience
- **🎯 RPE Tracking** - Rate of Perceived Exertion tracking for each set
- **🔄 Real-time Updates** - Instant feedback as you log your workouts

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vishnu2222222/Workout-Tracker-.git
cd Workout-Tracker-
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Built With

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Dexie.js** - IndexedDB wrapper for local storage
- **React Router** - Navigation
- **Vite PWA Plugin** - Progressive Web App capabilities

## 📱 Usage

### Starting a Workout

1. From the home screen, select either "Push" or "Pull" workout
2. Choose exercises from the library or use your recent exercises
3. Log your sets with weight, reps, and RPE

### Tracking Sets

- Enter weight and reps for each set
- Rate your effort using the RPE (Rate of Perceived Exertion) scale
- Use the rest timer between sets
- The app automatically saves your progress

### Viewing History

- Navigate to the History screen to see all past workouts
- Click on any workout to view detailed set information
- Track your progress over time

## 🏗️ Project Structure

```
src/
├── components/        # Reusable UI components
├── context/          # React Context providers
├── data/             # Database and exercise library
├── hooks/            # Custom React hooks
├── screens/          # Main app screens
└── types/            # TypeScript type definitions
```

## 📦 Building for Production

```bash
npm run build
```

The build files will be in the `dist/` directory, ready for deployment.

## 🌐 Deployment

This app can be deployed to any static hosting service:

- **GitHub Pages**: Enable in repository settings
- **Vercel**: Connect your GitHub repo
- **Netlify**: Drag and drop the `dist` folder

## 🔮 Future Enhancements

- Exercise notes and form tips
- Custom exercise creation
- Progress charts and analytics
- Workout templates
- Export workout data
- Social sharing features

## 📄 License

This project is open source and available for personal use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

**Vishnu**
- GitHub: [@vishnu2222222](https://github.com/vishnu2222222)

---

Made with ❤️ and lots of reps
