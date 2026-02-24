# School Management App

A comprehensive school management application built with React Native and Supabase, designed to facilitate communication and management between administrators, teachers, students, and parents.

## Features

- 🔐 Role-based authentication (Admin, Teacher, Student, Parent)
- 📊 Role-specific dashboards
- 📝 Attendance tracking
- 📚 Assignment management
- 📅 Dynamic timetable
- 📈 Grade tracking
- 💬 Real-time chat
- 💰 Fee management (Admin only)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Supabase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd school
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project and get your project URL and anon key.

4. Create a `.env` file in the root directory and add your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Update the Supabase configuration in `src/lib/supabase.ts` with your credentials.

6. Start the development server:
```bash
npm start
```

## Database Schema

The application uses the following tables in Supabase:

- `profiles`: User profiles and role information
- `attendance`: Student attendance records
- `assignments`: Homework and assignments
- `timetable`: Class schedules
- `grades`: Student grades and performance
- `chat_messages`: Real-time chat messages
- `fees`: Student fee records

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth, etc.)
├── lib/           # Utility functions and configurations
├── navigation/    # Navigation setup
├── screens/       # Screen components
│   ├── auth/      # Authentication screens
│   └── ...        # Other screens
└── types/         # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@schoolapp.com or open an issue in the repository. 