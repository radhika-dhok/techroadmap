// Load roadmaps from JSON file
async function loadRoadmaps() {
    try {
        const response = await fetch('data/roadmaps.json');
        const data = await response.json();
        displayRoadmaps(data.roadmaps);
    } catch (error) {
        console.error('Error loading roadmaps:', error);
    }
}

// Display roadmap cards on homepage
function displayRoadmaps(roadmaps) {
    const grid = document.getElementById('roadmap-grid');
    
    roadmaps.forEach(roadmap => {
        const card = document.createElement('a');
        card.href = `roadmap.html?id=${roadmap.id}`;
        card.className = 'roadmap-card';
        
        const totalTopics = countTotalTopics(roadmap.content);
        
        card.innerHTML = `
            <h3>${roadmap.title}</h3>
            <p>${roadmap.description}</p>
            <div class="roadmap-meta">
                <span class="difficulty ${roadmap.difficulty}">${roadmap.difficulty}</span>
                <span>${totalTopics} topics</span>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Count total topics in a roadmap
function countTotalTopics(content) {
    let count = 0;
    
    function countNodes(nodes) {
        nodes.forEach(node => {
            if (node.type === 'topic') count++;
            if (node.children) {
                countNodes(node.children);
            }
        });
    }
    
    countNodes(content);
    return count;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadRoadmaps);
