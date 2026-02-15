# TechRoadmap - Technology Learning Roadmap Website

A technology roadmap website inspired by roadmap.sh, built with vanilla JavaScript, HTML, and CSS. This project helps users visualize and track their learning progress across various technologies.

## Features

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
