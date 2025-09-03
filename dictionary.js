// Default dictionary for Meetei Mayek conversions
const defaultDictionary = {
    "ꯑꯣꯁꯤ": "ꯑꯁꯤ",
    "ꯒ꯭ ꯇ": "ꯒ꯭ꯇ",
    "ꯋ꯭ ꯔ": "ꯋ꯭ꯔ",
    "ꯁꯣꯪ": "ꯁꯣꯡ",
    "ꯇ": "ꯇ",
    "ꯕ": "ꯕ",
    "ꯄ": "ꯄ",
    "ꯅ": "ꯅ",
    "ꯆ": "ꯆ",
    "ꯈ": "ꯈ",
    "ꯍ": "ꯍ",
    "ꯏ": "ꯏ",
    "ꯎ": "ꯎ",
    "ꯂ": "ꯂ",
    "ꯃ": "ꯃ",
    "ꯐ": "ꯐ",
    "ꯔ": "ꯔ",
    "ꯂꯤ": "ꯂꯤ",
    "ꯃꯤ": "ꯃꯤ",
    "ꯒꯤ": "ꯒꯤ",
    "ꯕꯤ": "ꯕꯤ",
    "ꯄꯤ": "ꯄꯤ",
    "ꯅꯤ": "ꯅꯤ",
    "ꯆꯤ": "ꯆꯤ",
    "ꯈꯤ": "ꯈꯤ",
    "ꯍꯤ": "ꯍꯤ",
    "ꯏꯤ": "ꯏꯤ",
    "ꯎꯤ": "ꯎꯤ",
    "ꯐꯤ": "ꯐꯤ",
    "ꯔꯤ": "ꯔꯤ",
    "ꯑꯣ": "ꯑꯣ",
    "ꯒꯣ": "ꯒꯣ",
    "ꯋꯣ": "ꯋꯣ",
    "ꯁꯣ": "ꯁꯣ",
    "ꯇꯣ": "ꯇꯣ",
    "ꯕꯣ": "ꯕꯣ",
    "ꯄꯣ": "ꯄꯣ",
    "ꯅꯣ": "ꯅꯣ",
    "ꯆꯣ": "ꯆꯣ",
    "ꯈꯣ": "ꯈꯣ",
    "ꯍꯣ": "ꯍꯣ",
    "ꯏꯣ": "ꯏꯣ",
    "ꯎꯣ": "ꯎꯣ",
    "ꯂꯣ": "ꯂꯣ",
    "ꯃꯣ": "ꯃꯣ",
    "ꯐꯣ": "ꯐꯣ",
    "ꯔꯣ": "ꯔꯣ"
};

// Initialize the current dictionary with the default
let currentDictionary = {...defaultDictionary};

// Function to merge custom dictionary with the default
function mergeDictionaries(customDict) {
    try {
        // Validate the custom dictionary
        if (typeof customDict !== 'object' || customDict === null) {
            throw new Error('Invalid dictionary format');
        }
        
        // Merge dictionaries (custom values override defaults)
        currentDictionary = {...defaultDictionary, ...customDict};
        return true;
    } catch (error) {
        console.error('Error merging dictionaries:', error);
        return false;
    }
}

// Function to reset to the default dictionary
function resetDictionary() {
    currentDictionary = {...defaultDictionary};
}

// Function to get the current dictionary
function getCurrentDictionary() {
    return currentDictionary;
}
