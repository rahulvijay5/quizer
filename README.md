# Quizer - SAP Quiz Platform

![Quizer Home](./quizer_home.png)

A community-driven quiz platform for SAP learning, built with Next.js and TypeScript. All data is stored locally, making it perfect for personal learning and offline use.

## Features

- **Multiple Quiz Modes**
  - Take topic-specific quizzes
  - Complete test from all topics
  - Track your progress and history
  - Timed quizzes with auto-submit

- **Question Management**
  - Create and modify questions
  - Mark questions for review
  - Add resource links or references
  - Support for both single and multiple correct answers

- **Study Tools**
  - Read mode for reviewing questions
  - Doubts section for unclear topics
  - Resource links for further reading
  - Progress tracking

- **Local-First Approach**
  - All data stored on your device
  - No account required
  - Works offline
  - Import/Export questions

## Keyboard Shortcuts

- `←/→` - Navigate between questions
- `1-6` - Select options
- `D` - Toggle doubt flag
- `T` - Switch between correct/proposed answers
- `C` - Toggle single/multi select (in modify mode)
- `Enter` - Save changes
- `Cmd/Ctrl + Enter` - Submit quiz
- `Cmd/Ctrl + K` - Open search

## Question Format

Questions are stored in JSON files with the following structure:
```json
{
  "questions": [
    {
      "Question": "Your question text",
      "opt1": "Option 1",
      "opt2": "Option 2",
      "opt3": "Option 3",
      "opt4": "Option 4",
      "correctAns": ["opt1", "opt2"],  // Can have single or multiple correct answers
      "proposedAns": ["opt1"],         // Your proposed answer(s)
      "resource": "URL or text reference", // Can be a URL or descriptive text
      "isDoubt": false
    }
  ]
}
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/rahulvijay5/quizer.git
   ```

2. Install dependencies:
   ```bash
   cd quizer
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

Quick ways to contribute:
1. Add new questions
2. Improve existing questions
3. Fix bugs
4. Add features
5. Improve documentation

## License

MIT License - feel free to use and modify for your own learning!
