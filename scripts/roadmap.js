// Global variables
let currentRoadmap = null;
let completedTopics = new Set();
let allRoadmaps = [];
const STORAGE_KEY_PREFIX = 'roadmap_progress_';

// Get roadmap ID from URL
function getRoadmapId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load specific roadmap
async function loadRoadmap() {
    const roadmapId = getRoadmapId();
    
    if (!roadmapId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const response = await fetch('data/roadmaps.json');
        const data = await response.json();
        allRoadmaps = data.roadmaps;
        currentRoadmap = data.roadmaps.find(r => r.id === roadmapId);
        
        if (!currentRoadmap) {
            window.location.href = 'index.html';
            return;
        }
        
        loadProgress();
        displayRoadmapInfo();
        loadRelatedRoadmaps();
        renderRoadmap();
    } catch (error) {
        console.error('Error loading roadmap:', error);
    }
}

// Display roadmap info
function displayRoadmapInfo() {
    document.getElementById('roadmap-title').textContent = currentRoadmap.title;
    document.getElementById('roadmap-description').textContent = currentRoadmap.description;
    updateProgress();
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + currentRoadmap.id);
    if (saved) {
        completedTopics = new Set(JSON.parse(saved));
    }
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem(
        STORAGE_KEY_PREFIX + currentRoadmap.id,
        JSON.stringify([...completedTopics])
    );
    updateProgress();
}

// Update progress display
function updateProgress() {
    const totalTopics = countTotalTopics(currentRoadmap.content);
    const completedCount = completedTopics.size;
    const percentage = Math.round((completedCount / totalTopics) * 100);
    
    document.getElementById('progress-badge').textContent = `${percentage}% Done`;
    document.getElementById('progress-text').textContent = `${completedCount} of ${totalTopics} Done`;
}

// Count total topics
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

// Render roadmap visualization with serpentine horizontal layout
function renderRoadmap() {
    const svg = document.getElementById('roadmap-svg');
    const padding = 20;
    const nodeSpacing = 280;
    const rowHeight = 140;
    const nodesPerRow = 3;
    
    // Get all topics from the roadmap
    const allTopics = [];
    currentRoadmap.content.forEach(section => {
        if (section.type === 'category' && section.children) {
            section.children.forEach(child => {
                allTopics.push({
                    ...child,
                    category: section.title
                });
            });
        }
    });
    
    // Calculate SVG dimensions
    const totalRows = Math.ceil((allTopics.length + 2) / nodesPerRow);
    const svgWidth = nodesPerRow * nodeSpacing + padding * 2;
    const svgHeight = totalRows * rowHeight + padding * 2;
    
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    
    // Create START node
    const startX = padding + nodeSpacing / 2;
    const startY = padding + rowHeight / 2;
    
    let currentIndex = 0;
    let previousX = startX;
    let previousY = startY;
    
    // First, draw all paths (so they appear behind nodes)
    const pathPositions = [{x: startX, y: startY}];
    
    allTopics.forEach((topic, index) => {
        const position = index + 1;
        const row = Math.floor(position / nodesPerRow);
        const col = position % nodesPerRow;
        const isReversed = row % 2 === 1;
        const actualCol = isReversed ? (nodesPerRow - 1 - col) : col;
        
        const x = padding + actualCol * nodeSpacing + nodeSpacing / 2;
        const y = padding + row * rowHeight + rowHeight / 2;
        
        pathPositions.push({x, y, id: topic.id});
    });
    
    // Add finish position
    const finishPosition = allTopics.length + 1;
    const finishRow = Math.floor(finishPosition / nodesPerRow);
    const finishCol = finishPosition % nodesPerRow;
    const isFinishReversed = finishRow % 2 === 1;
    const finishActualCol = isFinishReversed ? (nodesPerRow - 1 - finishCol) : finishCol;
    const finishX = padding + finishActualCol * nodeSpacing + nodeSpacing / 2;
    const finishY = padding + finishRow * rowHeight + rowHeight / 2;
    pathPositions.push({x: finishX, y: finishY});
    
    // Draw all paths first
    for (let i = 0; i < pathPositions.length - 1; i++) {
        createSerpentinePath(svg, pathPositions[i].x, pathPositions[i].y, 
                            pathPositions[i + 1].x, pathPositions[i + 1].y, 
                            pathPositions[i + 1].id);
    }
    
    // Now draw all nodes (they'll appear on top)
    createRoundNode(svg, 'START', startX, startY, 'start', null, 32);
    
    allTopics.forEach((topic, index) => {
        const position = index + 1;
        const row = Math.floor(position / nodesPerRow);
        const col = position % nodesPerRow;
        const isReversed = row % 2 === 1;
        const actualCol = isReversed ? (nodesPerRow - 1 - col) : col;
        
        const x = padding + actualCol * nodeSpacing + nodeSpacing / 2;
        const y = padding + row * rowHeight + rowHeight / 2;
        
        createRoundNode(svg, topic.title, x, y, 'topic', topic.id, 28, topic.category);
    });
    
    createRoundNode(svg, 'FINISH', finishX, finishY, 'finish', null, 32);
}

// Create serpentine path between nodes
function createSerpentinePath(svg, x1, y1, x2, y2, targetId) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('roadmap-path');
    
    // Determine if we're going right, left, or down
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    let pathData;
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal movement - straight line
        pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else if (dy > 0) {
        // Moving down (end of row) - create smooth rounded corner
        const radius = 50;
        if (dx > 0) {
            // Turn right and down
            const cornerX = x2;
            const cornerY1 = y1;
            const cornerY2 = y2;
            pathData = `M ${x1} ${y1} L ${cornerX - radius} ${cornerY1} Q ${cornerX} ${cornerY1}, ${cornerX} ${cornerY1 + radius} L ${cornerX} ${cornerY2}`;
        } else if (dx < 0) {
            // Turn left and down
            const cornerX = x2;
            const cornerY1 = y1;
            const cornerY2 = y2;
            pathData = `M ${x1} ${y1} L ${cornerX + radius} ${cornerY1} Q ${cornerX} ${cornerY1}, ${cornerX} ${cornerY1 + radius} L ${cornerX} ${cornerY2}`;
        } else {
            pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
        }
    } else {
        pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
    }
    
    path.setAttribute('d', pathData);
    
    if (targetId && completedTopics.has(targetId)) {
        path.classList.add('completed');
    }
    
    svg.appendChild(path);
}

// Create a round node with icon support
function createRoundNode(svg, title, x, y, type, id, radius = 50, category = null) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('roadmap-node', `${type}-node`);
    
    if (id && completedTopics.has(id)) {
        group.classList.add('completed');
    }
    
    // Main circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', radius);
    circle.classList.add('node-circle');
    group.appendChild(circle);
    
    // Add checkmark for completed nodes
    if (id && completedTopics.has(id)) {
        const checkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        checkPath.setAttribute('d', `M ${x-8} ${y} L ${x-2} ${y+6} L ${x+8} ${y-7}`);
        checkPath.setAttribute('stroke', '#ffffff');
        checkPath.setAttribute('stroke-width', '2');
        checkPath.setAttribute('stroke-linecap', 'round');
        checkPath.setAttribute('stroke-linejoin', 'round');
        checkPath.setAttribute('fill', 'none');
        group.appendChild(checkPath);
    }
    
    // Category label above the circle (for topics only)
    if (category && type === 'topic') {
        const categoryText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        categoryText.setAttribute('x', x);
        categoryText.setAttribute('y', y - radius - 5);
        categoryText.setAttribute('text-anchor', 'middle');
        categoryText.classList.add('category-label');
        categoryText.textContent = category.toUpperCase();
        group.appendChild(categoryText);
    }
    
    // Text label below the circle
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + radius + 14);
    text.setAttribute('text-anchor', 'middle');
    text.classList.add('node-label');
    
    // Smart text wrapping for better readability
    const maxChars = type === 'start' || type === 'finish' ? 10 : 20;
    if (title.length > maxChars) {
        const words = title.split(' ');
        let line1 = '';
        let line2 = '';
        let currentLine = 1;
        
        words.forEach((word) => {
            const testLine = currentLine === 1 ? line1 + (line1 ? ' ' : '') + word : line2 + (line2 ? ' ' : '') + word;
            
            if (currentLine === 1 && testLine.length <= maxChars) {
                line1 = testLine;
            } else if (currentLine === 1) {
                // Move to line 2
                currentLine = 2;
                line2 = word;
            } else {
                line2 += ' ' + word;
            }
        });
        
        const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan1.setAttribute('x', x);
        tspan1.setAttribute('dy', 0);
        tspan1.textContent = line1;
        text.appendChild(tspan1);
        
        if (line2) {
            const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan2.setAttribute('x', x);
            tspan2.setAttribute('dy', '1.2em');
            tspan2.textContent = line2;
            text.appendChild(tspan2);
        }
    } else {
        text.textContent = title;
    }
    
    group.appendChild(text);
    
    // Add click event for topics
    if (type === 'topic' && id) {
        group.style.cursor = 'pointer';
        group.addEventListener('click', () => showNodeDetails(id, title));
    }
    
    svg.appendChild(group);
}

// Show node details in modal
function showNodeDetails(id, title) {
    // Create modal if it doesn't exist
    let modal = document.querySelector('.node-modal');
    let overlay = document.querySelector('.modal-overlay');
    
    if (!modal) {
        overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        modal = document.createElement('div');
        modal.className = 'node-modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h3 id="modal-title"></h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-content">
                <p id="modal-description"></p>
                <button class="toggle-complete" id="toggle-btn">Mark as Complete</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
    }
    
    // Remove previous click listeners by replacing the button
    const oldBtn = document.getElementById('toggle-btn');
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    
    // Add new click listener with the current id
    newBtn.addEventListener('click', () => toggleComplete(id));
    
    // Also handle overlay click
    overlay.onclick = closeModal;
    
    // Update modal content
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').textContent = `Learn about ${title} and master this topic.`;
    
    const isCompleted = completedTopics.has(id);
    
    newBtn.textContent = isCompleted ? 'Mark as Incomplete' : 'Mark as Complete';
    newBtn.classList.toggle('completed', isCompleted);
    
    // Show modal
    overlay.classList.add('active');
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.node-modal');
    const overlay = document.querySelector('.modal-overlay');
    
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// Toggle complete status
function toggleComplete(id) {
    if (completedTopics.has(id)) {
        completedTopics.delete(id);
    } else {
        completedTopics.add(id);
    }
    
    saveProgress();
    closeModal();
    
    // Re-render roadmap
    document.getElementById('roadmap-svg').innerHTML = '';
    renderRoadmap();
}

// Load related roadmaps in sidebar
function loadRelatedRoadmaps() {
    const relatedContainer = document.getElementById('related-roadmaps');
    if (!relatedContainer) return;
    
    // Get roadmaps related to current one (exclude current)
    const relatedRoadmaps = allRoadmaps
        .filter(r => r.id !== currentRoadmap.id)
        .slice(0, 4); // Show up to 4 related roadmaps
    
    relatedContainer.innerHTML = relatedRoadmaps.map(roadmap => `
        <a href="roadmap.html?id=${roadmap.id}" class="related-item">
            <span class="check-icon">✓</span>
            <span class="title">${roadmap.title}</span>
        </a>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadRoadmap);
