
// Visual helper functions - NO LOGIC CHANGES

// Add subtle animation to components when added
function enhanceComponentDisplay() {
    const container = document.getElementById('components-container');
    if (container) {
        // Observe new component additions
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('component-tag')) {
                        node.style.opacity = '0';
                        node.style.transform = 'translateY(10px)';
                        
                        setTimeout(() => {
                            node.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            node.style.opacity = '1';
                            node.style.transform = 'translateY(0)';
                        }, 10);
                    }
                });
            });
        });
        
        observer.observe(container, { childList: true, subtree: true });
    }
}

// Update components count display
function updateComponentsCount() {
    const container = document.getElementById('components-container');
    const countElement = document.getElementById('components-count');
    
    if (container && countElement) {
        const components = container.querySelectorAll('.component-tag');
        countElement.textContent = `${components.length} detected`;
    }
}

// Initialize visual enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Call existing initialization first (preserve existing logic)
    // Then add visual enhancements
    
    setTimeout(() => {
        enhanceComponentDisplay();
        
        // Update components count periodically
        setInterval(updateComponentsCount, 1000);
        
        // Add paper texture effect to cards
        document.querySelectorAll('.paper-card').forEach(card => {
            card.style.backgroundImage = `
                linear-gradient(rgba(251, 249, 244, 0.7), rgba(251, 249, 244, 0.7)),
                url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d8d5cc' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")
            `;
        });
    }, 100);
});

// Preserve all existing functionality - NO CHANGES to existing logic
let lastResult = null;
let lastComponents = [];
// let lastConditions = {};

// Global variables
let viewer = null;
let isViewerInitialized = false;
let isRotating = true;
let chemicalInput, generateBtn, loadingIndicator;
let componentsContainer, resultsGrid;
let viewerContainer, viewerPlaceholder, viewerElement, viewerControls;
let rotateToggle, resetViewBtn, downloadPngBtn;
let originalXYZ = null;


// API endpoint
const API_ENDPOINT = 'http://127.0.0.1:8000/analyze';


// document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    chemicalInput = document.getElementById('chemical-input');
    generateBtn = document.getElementById('generate-btn');

    if (!chemicalInput || !generateBtn) {
        console.error("❌ Critical elements missing");
        return;
    }

    loadingIndicator = document.getElementById('loading');
    componentsContainer = document.getElementById('components-container');
    resultsGrid = document.getElementById('results-grid');
    viewerContainer = document.getElementById('viewer-container');
    viewerPlaceholder = document.getElementById('viewer-placeholder');
    viewerElement = document.getElementById('viewer');
    viewerControls = document.getElementById('viewer-controls');
    rotateToggle = document.getElementById('rotate-toggle');
    resetViewBtn = document.getElementById('reset-view');
    downloadPngBtn = document.getElementById('download-png');

    // ✅ Attach ONLY what exists
    generateBtn.addEventListener('click', generateCompound);

    if (rotateToggle) rotateToggle.addEventListener('click', toggleRotation);
    if (resetViewBtn) resetViewBtn.addEventListener('click', resetView);
    if (downloadPngBtn) downloadPngBtn.addEventListener('click', downloadPNG);
    if (viewerControls) viewerControls.style.display = 'none';

    console.log(" jay shree Krishna ");

    const saveBtn = document.getElementById("save-csv-btn");
if (saveBtn) saveBtn.addEventListener("click", saveToCSV);

}



// Generate compound from user input
async function generateCompound() {
    const text = chemicalInput.value.trim();

    if (!text) {
        alert('Please enter a chemical description or formula');
        return;
    }

    // ✅ READ CONDITIONS FROM UI
    const constraints = {
        acidic: document.getElementById('condition-acidic')?.checked || false,
        basic: document.getElementById('condition-basic')?.checked || false,
        heat: document.getElementById('condition-heat')?.checked || false,
        oxidizing: document.getElementById('condition-oxidizing')?.checked || false,
        reducing: document.getElementById('condition-reducing')?.checked || false
    };

    generateBtn.disabled = true;
    loadingIndicator.style.display = 'flex';

    try {
        // ✅ get selected components from Select mode
const selectedComponents =
    window.inputModeSelector?.getSelectedComponents() || [];

// ✅ build payload
const payload = {
    text,
    constraints,
    components: selectedComponents.length ? selectedComponents : null
};

// ✅ send to backend
const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
});
        // const response = await fetch(API_ENDPOINT, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ text, constraints })
        // });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        lastComponents = data.components;
        lastResult = data.results[0];

        updateComponents(data.components);
        updateResults(data.results);

        if (data.results?.[0]?.structure_3d) {
            render3DStructure(data.results[0].structure_3d);
        }

    } catch (error) {
        console.error(error);
        alert("Failed to analyze compound");
    } finally {
        generateBtn.disabled = false;
        loadingIndicator.style.display = 'none';
    }
}


// Update components section
function updateComponents(components) {
    componentsContainer.innerHTML = '';
    
    if (!components || components.length === 0) {
        componentsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>No components detected</p>
            </div>
        `;
        return;
    }
    
    components.forEach(component => {
        const componentElement = document.createElement('div');
        componentElement.className = 'component-tag';
        componentElement.innerHTML = `
            <i class="fas fa-shapes"></i>
            <span>${component}</span>
        `;
        componentsContainer.appendChild(componentElement);
    });
}

function formatReactionConditions(conditions) {
    if (!conditions) return "None";

    const map = {
        acidic: "Acidic",
        basic: "Basic",
        heat: "Heat",
        oxidizing: "Oxidizing",
        reducing: "Reducing"
    };

    const active = Object.keys(map)
        .filter(key => conditions[key])
        .map(key => map[key]);

    return active.length ? active.join(", ") : "None";
}


// Update results section
function updateResults(results) {
    resultsGrid.innerHTML = '';
    
    if (!results || results.length === 0) {
        resultsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>No analysis results available</p>
            </div>
        `;
        return;
    }
    
    results.forEach((result, index) => {
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        
        // Determine CSS classes for properties
        const toxicityClass = `toxicity-${result.toxicity.toLowerCase()}`;
        const solubilityClass = `solubility-${result.solubility.toLowerCase()}`;
        const stabilityClass = `stability-${result.stability.toLowerCase()}`;
        

resultCard.innerHTML = `
    <h3 class="result-title">
        <i class="fas fa-vial"></i>
        <strong> ${result.compound_class} </strong>
    </h3>

    <div class="result-properties-compact">
        <div class="property-line">
            <span class="property-label">Reaction Conditions:</span>
            <span class="property-value">${formatReactionConditions(result.conditions)}</span>
        </div>

        <div class="property-line">
            <span class="property-label">Toxicity:</span>
            <span class="property-value">${result.toxicity}</span>
        </div>

        <div class="property-line">
            <span class="property-label">Solubility:</span>
            <span class="property-value">${result.solubility}</span>
        </div>

        <div class="property-line">
            <span class="property-label">Stability:</span>
            <span class="property-value">${result.stability}</span>
        </div>

        <div class="property-line">
            <span class="property-label">Confidence:</span>
            <span class="property-value">${(result.confidence * 100).toFixed(1)}%</span>
        </div>
    </div>
`;

        
        resultsGrid.appendChild(resultCard);
    });
}

// Render 3D molecular structure
function render3DStructure(structure) {
    viewerPlaceholder.style.opacity = '0';
    viewerPlaceholder.style.pointerEvents = 'none';

    viewerContainer.classList.add('visible');
    viewerControls.style.display = 'flex';

    if (!isViewerInitialized) {
        viewer = $3Dmol.createViewer(viewerElement, {
            backgroundColor: 'black'
        });
        isViewerInitialized = true;
    } else {
        viewer.clear();
    }

    // Build XYZ
    let xyz = `${structure.length}\n\n`;
    structure.forEach(atom => {
        xyz += `${atom.element} ${atom.x} ${atom.y} ${atom.z}\n`;
    });
  originalXYZ = xyz; 
    // ✅ ADD MODEL (XYZ auto-bonds internally)
    viewer.addModel(xyz, "xyz");

    // ✅ BALL + STICK (this is what you want)
    // viewer.setStyle({}, {
    //     stick: { radius: 0.25 },
    //     sphere: { scale: 0.4 }
    // });
    viewer.setStyle({}, {
    stick: {
        radius: 0.25,
        colorscheme: {
            'C': '#3a3a3a',   // Carbon - dark gray
            'O': '#e53e3e',   // Oxygen - red
            'H': '#6b9ac4',   // Hydrogen - blue
            'N': '#805ad5'    // Nitrogen - purple
        }
    },
    sphere: {
        scale: 0.4,
        colorscheme: {
            'C': '#3a3a3a',
            'O': '#e53e3e',
            'H': '#6b9ac4',
            'N': '#805ad5'
        }
    }
});


     viewer.zoomTo();
    viewer.render();
    viewer.spin(isRotating); 
    // viewer.spin(true);

}



function toggleRotation() {
    isRotating = !isRotating;

    if (viewer) {
        viewer.spin(isRotating); // ✅ start / stop rotation
    }

    rotateToggle.innerHTML = isRotating
        ? '<i class="fas fa-sync-alt"></i> <span>Auto-Rotate: ON</span>'
        : '<i class="fas fa-ban"></i> <span>Auto-Rotate: OFF</span>';
}


// Reset view to default
function resetView() {
    if (viewer) {
        viewer.zoomTo();
        viewer.render();
    }
}




// Download PNG of the current view
function downloadPNG() {
    if (viewer) {
        const png = viewer.pngURI();
        const link = document.createElement('a');
        link.download = 'molecule-structure.png';
        link.href = png;
        link.click();
    }
}



// Initialize the application when the page loads
initApp();

async function saveToCSV() {
    if (!lastResult) {
        alert("No result to save");
        return;
    }

    const payload = {
        components: lastComponents.join("+"),
        compound_class: lastResult.compound_class,
        toxicity: lastResult.toxicity,
        solubility: lastResult.solubility,
        stability: lastResult.stability,
        confidence: lastResult.confidence,
        novelty_flag: "Novel",
        feedback_text: "Added from UI",
        verified: "No"
    };

    const res = await fetch("http://127.0.0.1:8000/add-row", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert("✅ Row added to CSV");
    } else {
        alert("❌ Failed to add row");
    }
}


// ADDED: Select mode support
(function() {
    'use strict';
    
    // Available chemical components (extendable)
    const CHEMICAL_COMPONENTS = [
        { id: 'alcohol', name: 'Alcohol', icon: 'fa-wine-bottle' },
        { id: 'amine', name: 'Amine', icon: 'fa-atom' },
        { id: 'carboxylic_acid', name: 'Carboxylic Acid', icon: 'fa-tint' },
        { id: 'acid', name: 'Acid', icon: 'fa-flask' },
        { id: 'base', name: 'Base', icon: 'fa-vial' },
        { id: 'aldehyde', name: 'Aldehyde', icon: 'fa-circle' },
        { id: 'ketone', name: 'Ketone', icon: 'fa-circle' },
        { id: 'aromatic_ring', name: 'Aromatic Ring', icon: 'fa-ring' },
        { id: 'nitro', name: 'Nitro', icon: 'fa-bolt' },
        { id: 'halide', name: 'Halide', icon: 'fa-plus' },
        { id: 'ester', name: 'Ester', icon: 'fa-water' },
        { id: 'amide', name: 'Amide', icon: 'fa-atom' },
        { id: 'salt', name: 'Salt', icon: 'fa-flask' }
    ];
    
    // State
    let selectedComponents = new Set();
    let currentMode = 'write';
    
    // DOM Elements
    const modeButtons = document.querySelectorAll('.mode-btn');
    const componentSelectorPanel = document.getElementById('component-selector-panel');
    const textareaContainer = document.querySelector('.textarea-container');
    const componentButtonsGrid = document.getElementById('component-buttons-grid');
    const componentSearch = document.getElementById('component-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const selectAllBtn = document.getElementById('select-all-btn');
    const selectedCount = document.getElementById('selected-count');
    const selectedPreviewText = document.getElementById('selected-preview-text');
    const chemicalInput = document.getElementById('chemical-input');
    
    // Initialize component buttons
    function initializeComponentButtons() {
        componentButtonsGrid.innerHTML = '';
        
        CHEMICAL_COMPONENTS.forEach(component => {
            const button = document.createElement('button');
            button.className = 'component-button';
            button.dataset.componentId = component.id;
            button.innerHTML = `
                <i class="fas ${component.icon} component-icon"></i>
                <span>${component.name}</span>
            `;
            
            button.addEventListener('click', () => {
                toggleComponent(component.id);
            });
            
            componentButtonsGrid.appendChild(button);
        });
        
        updateComponentSelectionDisplay();
    }
    
    // Toggle component selection
    function toggleComponent(componentId) {
        if (selectedComponents.has(componentId)) {
            selectedComponents.delete(componentId);
        } else {
            selectedComponents.add(componentId);
        }
        
        updateComponentSelectionDisplay();
        updateChemicalInput();
    }
    
    // Update visual selection state
    function updateComponentSelectionDisplay() {
        // Update buttons
        document.querySelectorAll('.component-button').forEach(button => {
            const componentId = button.dataset.componentId;
            if (selectedComponents.has(componentId)) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
        
        // Update counter
        selectedCount.textContent = selectedComponents.size;
        
        // Update preview text
        if (selectedComponents.size === 0) {
            selectedPreviewText.textContent = 'None';
            selectedPreviewText.style.fontStyle = 'italic';
        } else {
            const selectedNames = Array.from(selectedComponents)
                .map(id => CHEMICAL_COMPONENTS.find(c => c.id === id)?.name)
                .filter(Boolean);
            selectedPreviewText.textContent = selectedNames.join(' + ');
            selectedPreviewText.style.fontStyle = 'normal';
        }
        
        // // Update "Select All" button text
        // if (selectedComponents.size === CHEMICAL_COMPONENTS.length) {
        //     selectAllBtn.innerHTML = '<i class="fas fa-times"></i> Clear All';
        // } else {
        //     selectAllBtn.innerHTML = '<i class="fas fa-check-double"></i> All Components';
        // }
         // Update "Select All" button text - count only VISIBLE components
    const visibleButtons = Array.from(document.querySelectorAll('.component-button'))
        .filter(button => button.style.display !== 'none');
    const visibleSelectedCount = visibleButtons.filter(button => 
        selectedComponents.has(button.dataset.componentId)
    ).length;
    
    if (visibleSelectedCount === visibleButtons.length && visibleButtons.length > 0) {
        selectAllBtn.innerHTML = '<i class="fas fa-times"></i> Clear All';
    } else {
        selectAllBtn.innerHTML = '<i class="fas fa-check-double"></i> All Components';
    }
    }
    
    // Update chemical input with selected components
    function updateChemicalInput() {
        if (selectedComponents.size === 0) {
            chemicalInput.value = '';
            return;
        }
        
        const selectedNames = Array.from(selectedComponents)
            .map(id => CHEMICAL_COMPONENTS.find(c => c.id === id)?.name)
            .filter(Boolean);
        
        chemicalInput.value = selectedNames.join(' + ');
    }
    
    // Filter components based on search
    function filterComponents(searchTerm) {
        const searchLower = searchTerm.toLowerCase().trim();
        
        document.querySelectorAll('.component-button').forEach(button => {
            const componentName = button.querySelector('span').textContent.toLowerCase();
            const isVisible = componentName.includes(searchLower);
            button.style.display = isVisible ? 'flex' : 'none';
        });
    }
    
   
    function toggleSelectAll() {
    const visibleButtons = Array.from(document.querySelectorAll('.component-button'))
        .filter(button => button.style.display !== 'none');
    
    const allVisibleSelected = visibleButtons.every(button => 
        selectedComponents.has(button.dataset.componentId)
    );
    
    if (allVisibleSelected) {
        // Deselect all visible
        visibleButtons.forEach(button => {
            selectedComponents.delete(button.dataset.componentId);
        });
    } else {
        // Select all visible
        visibleButtons.forEach(button => {
            selectedComponents.add(button.dataset.componentId);
        });
    }
    
    updateComponentSelectionDisplay();
    updateChemicalInput();
}
    
    // Switch between write and select modes
    function switchMode(mode) {
        currentMode = mode;
        
        // Update mode buttons
        modeButtons.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show/hide elements based on mode
        if (mode === 'write') {
            textareaContainer.classList.remove('hidden');
            componentSelectorPanel.style.display = 'none';
            // Clear any selection when switching to write mode
            selectedComponents.clear();
            updateComponentSelectionDisplay();
        } else {
            textareaContainer.classList.add('hidden');
            componentSelectorPanel.style.display = 'block';
            // Update input with current selection
            updateChemicalInput();
        }
    }
    
    // Initialize the feature
    function initializeInputModeSelector() {
        // Create component buttons
        initializeComponentButtons();
        
        // Mode switching
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mode = button.dataset.mode;
                if (mode !== currentMode) {
                    switchMode(mode);
                }
            });
        });
        
        // Search functionality
        componentSearch.addEventListener('input', (e) => {
            filterComponents(e.target.value);
        });
        
        // Clear search
        clearSearchBtn.addEventListener('click', () => {
            componentSearch.value = '';
            filterComponents('');
            componentSearch.focus();
        });
        
        // Select all button
        selectAllBtn.addEventListener('click', toggleSelectAll);
        
        // Initialize in write mode
        switchMode('write');
    }
    
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeInputModeSelector);
    } else {
        initializeInputModeSelector();
    }
    
    // Expose functions for debugging (optional)
    window.inputModeSelector = {
        getSelectedComponents: () => Array.from(selectedComponents),
        setMode: switchMode,
        toggleComponent: toggleComponent
    };
})();