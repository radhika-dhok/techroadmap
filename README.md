# TechRoadmap - Interactive Technology Learning Pathways

<div align="center">
https://radhika-dhok.github.io/techroadmap/

**Your personalized guide to mastering modern technologies**

A beautiful, interactive roadmap visualization platform that helps developers navigate their learning journey through structured, step-by-step technology paths.

[View Demo](#how-to-use) • [Features](#features) • [Getting Started](#how-to-use) • [Roadmaps](#technologies-included)

</div>

---

## 📖 Introduction

**TechRoadmap** is a lightweight, fully client-side web application designed to help developers, students, and technology enthusiasts visualize and track their learning progress across various technology domains. Inspired by popular learning path platforms, TechRoadmap provides an elegant serpentine visualization that makes complex learning journeys feel manageable and achievable.

### Why TechRoadmap?

In today's rapidly evolving tech landscape, learning new technologies can feel overwhelming. With countless frameworks, tools, and concepts to master, it's easy to lose track of where you are and where you're headed. TechRoadmap solves this by:

- **📍 Providing Clear Direction**: Each roadmap offers a carefully curated, sequential learning path from fundamentals to advanced concepts
- **✅ Tracking Your Progress**: Visual indicators and completion tracking help you see how far you've come
- **🎯 Breaking Down Complexity**: Large topics are divided into manageable, bite-sized learning modules
- **🎨 Beautiful Visualization**: An intuitive serpentine design makes navigation natural and engaging
- **💾 Persistent Storage**: Your progress is automatically saved locally, so you never lose track
- **🚀 Zero Setup Required**: No installations, no accounts, no backend - just open and start learning

### Built With Modern Web Technologies

TechRoadmap is crafted using pure vanilla JavaScript, HTML5, and CSS3, demonstrating that powerful, interactive applications don't always require heavy frameworks. The project emphasizes:

- **Clean, maintainable code** that's easy to understand and extend
- **Responsive design** that works seamlessly on desktop, tablet, and mobile devices
- **Progressive enhancement** with smooth animations and intuitive interactions
- **Local-first architecture** ensuring privacy and offline capability
- **JSON-driven content** making it simple to add or modify roadmaps

Whether you're a beginner starting your coding journey or an experienced developer exploring new domains, TechRoadmap provides the structure and visual guidance you need to learn systematically and effectively.

---

## ✨ Features

- **Homepage**: Browse available technology roadmaps
- **Interactive Roadmaps**: Visual representation of learning paths with clickable nodes
- **Progress Tracking**: Mark topics as complete and track your learning progress
- **Local Storage**: Your progress is saved automatically in the browser
- **Responsive Design**: Works on desktop and mobile devices
- **JSON-Based Content**: Easy to add or modify roadmaps by editing JSON files

## Technologies Included

1. **Frontend Developer** - Complete frontend development path
2. **Python Developer** - Python programming from basics to advanced
3. **JavaScript Developer** - Master JavaScript programming
4. **Backend Developer** - Server-side development and databases
5. **React Developer** - React.js and modern web applications
6. **DevOps Engineer** - DevOps practices and cloud infrastructure

## Project Structure

```
roadmap-project/
├── index.html              # Homepage
├── roadmap.html           # Roadmap visualization page
├── styles/
│   ├── main.css           # Main styles
│   └── roadmap.css        # Roadmap-specific styles
├── scripts/
│   ├── main.js            # Homepage logic
│   └── roadmap.js         # Roadmap visualization logic
├── data/
│   └── roadmaps.json      # Roadmap data
└── README.md
```

## How to Use

1. **Open the Project**:
   - Simply open `index.html` in a web browser
   - No server or build process required!

2. **Browse Roadmaps**:
   - View all available technology roadmaps on the homepage
   - Click on any roadmap card to view its detailed learning path

3. **Track Progress**:
   - Click on any topic node in the roadmap
   - Mark topics as complete/incomplete
   - Your progress is automatically saved

4. **Add New Roadmaps**:
   - Edit `data/roadmaps.json`
   - Follow the existing structure to add new technologies

## JSON Structure

Each roadmap in `roadmaps.json` follows this structure:

```json
{
  "id": "unique-id",
  "title": "Technology Name",
  "description": "Brief description",
  "difficulty": "beginner|intermediate|advanced",
  "content": [
    {
      "type": "category",
      "title": "Category Name",
      "children": [
        {
          "id": "unique-topic-id",
          "type": "topic",
          "title": "Topic Name"
        }
      ]
    }
  ]
}
```

## Features Explanation

- **Visual Roadmap**: SVG-based visualization showing learning paths
- **Color Coding**: 
  - Yellow nodes: Topics to learn
  - Green nodes: Completed topics
  - Orange nodes: Category headers
- **Progress Indicator**: Shows percentage and count of completed topics
- **Persistent Storage**: Uses localStorage to save progress
- **Responsive Layout**: Adapts to different screen sizes

## Customization

### Adding a New Roadmap:
1. Open `data/roadmaps.json`
2. Add a new object to the `roadmaps` array
3. Follow the structure of existing roadmaps
4. Refresh the page to see your new roadmap

### Styling:
- Modify `styles/main.css` for global styles
- Modify `styles/roadmap.css` for roadmap-specific styles
- CSS variables are defined in `:root` for easy theming

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

This project is open source and available for educational purposes.

## Credits

Inspired by [roadmap.sh](https://roadmap.sh) - A community-driven roadmap platform for developers.
